import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from './db';
import { reports, comments, posts, users } from './db/schema';

/**
 * UGC 举报服务层。
 *
 * 举报对象：评论（comments.id）或读者投稿（posts.id）。
 * 站主自己的文件文章不通过这里举报——它来自仓库,有问题直接 GitHub PR。
 *
 * 限频由 API 层做（每用户每分钟 5 次,防止恶意刷举报队列）。
 * 这里只负责数据正确性。
 */

export type ReportTargetType = 'comment' | 'post';
export type ReportReason = 'spam' | 'abuse' | 'nsfw' | 'illegal' | 'other';
export type ReportStatus = 'pending' | 'resolved' | 'dismissed';

export interface ReportInput {
  targetType: ReportTargetType;
  targetId: string;
  reporterId: string;
  reason: ReportReason;
  detail?: string;
}

export interface AdminReportRow {
  id: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  detail: string | null;
  status: ReportStatus;
  reporterName: string | null;
  reporterEmail: string | null;
  createdAt: string;
  resolvedAt: string | null;
  /** 被举报内容的预览（评论正文 / 投稿标题） */
  targetPreview: string | null;
  /** 被举报内容当前状态（评论: approved/pending/rejected;投稿: published/pending/...） */
  targetStatus: string | null;
}

/**
 * 创建举报。
 *
 * 验证目标存在性：
 *  - 评论必须存在（任意状态都允许举报——pending 的评论管理员可能还没看到问题）
 *  - 投稿必须存在,且只允许举报 published 状态的（pending 的投稿管理员本来就正在审,无需举报）
 *
 * 不做"同一用户对同一目标只能举报一次"约束：用户可能因新增违规内容再次举报。
 * 队列由管理员侧按 (targetType, targetId) 聚合查看,重复举报不挤压队列。
 */
export async function createReport(input: ReportInput): Promise<{ id: string }> {
  // 校验目标存在
  if (input.targetType === 'comment') {
    const [row] = await db
      .select({ id: comments.id })
      .from(comments)
      .where(eq(comments.id, input.targetId))
      .limit(1);
    if (!row) {
      throw new ReportError('被举报的评论不存在');
    }
  } else {
    const [row] = await db
      .select({ id: posts.id, status: posts.status })
      .from(posts)
      .where(eq(posts.id, input.targetId))
      .limit(1);
    if (!row) {
      throw new ReportError('被举报的文章不存在');
    }
    if (row.status !== 'published') {
      throw new ReportError('只能举报已发布的文章');
    }
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db.insert(reports).values({
    id,
    targetType: input.targetType,
    targetId: input.targetId,
    reporterId: input.reporterId,
    reason: input.reason,
    detail: input.detail ?? null,
    status: 'pending',
    createdAt: now,
  });

  return { id };
}

/**
 * 管理员侧查询：举报列表,按时间倒序。
 * 可按 status / targetType / targetId 过滤。targetId 必须配合 targetType 使用。
 * 返回包含被举报内容的预览与状态（供管理员判断是否已处理过）。
 *
 * 当传入 targetType + targetId 时,会过滤到具体目标的全部举报——
 * 用于 admin/posts / admin/comments 列表点「查看举报」跳转的场景。
 */
export async function listReports(
  status?: ReportStatus,
  targetType?: ReportTargetType,
  targetId?: string,
): Promise<AdminReportRow[]> {
  const conditions = [];
  if (status) conditions.push(eq(reports.status, status));
  if (targetType) conditions.push(eq(reports.targetType, targetType));
  if (targetId && targetType) conditions.push(eq(reports.targetId, targetId));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const rows = await db
    .select({
      id: reports.id,
      targetType: reports.targetType,
      targetId: reports.targetId,
      reason: reports.reason,
      detail: reports.detail,
      status: reports.status,
      reporterName: users.name,
      reporterEmail: users.email,
      createdAt: reports.createdAt,
      resolvedAt: reports.resolvedAt,
    })
    .from(reports)
    .leftJoin(users, eq(reports.reporterId, users.id))
    .where(where)
    .orderBy(desc(reports.createdAt));

  if (rows.length === 0) return [];

  // 批量取被举报内容的预览。两种 targetType 分别查一次,用 inArray 批量拉。
  const commentIds = rows
    .filter((r) => r.targetType === 'comment')
    .map((r) => r.targetId);
  const postIds = rows
    .filter((r) => r.targetType === 'post')
    .map((r) => r.targetId);

  const commentMap = new Map<string, { content: string; status: string }>();
  const postMap = new Map<string, { title: string; status: string }>();

  if (commentIds.length > 0) {
    const list = await db
      .select({ id: comments.id, content: comments.content, status: comments.status })
      .from(comments)
      .where(sql`${comments.id} = ANY(${commentIds})`);
    for (const c of list) commentMap.set(c.id, { content: c.content, status: c.status });
  }

  if (postIds.length > 0) {
    const list = await db
      .select({ id: posts.id, title: posts.title, status: posts.status })
      .from(posts)
      .where(sql`${posts.id} = ANY(${postIds})`);
    for (const p of list) postMap.set(p.id, { title: p.title, status: p.status });
  }

  return rows.map((r) => {
    const common = {
      id: r.id,
      targetType: r.targetType as ReportTargetType,
      targetId: r.targetId,
      reason: r.reason as ReportReason,
      detail: r.detail,
      status: r.status as ReportStatus,
      reporterName: r.reporterName,
      reporterEmail: r.reporterEmail,
      createdAt: r.createdAt,
      resolvedAt: r.resolvedAt,
    };
    if (r.targetType === 'comment') {
      const c = commentMap.get(r.targetId);
      return {
        ...common,
        targetPreview: c?.content ?? null,
        targetStatus: c?.status ?? null,
      };
    }
    const p = postMap.get(r.targetId);
    return {
      ...common,
      targetPreview: p?.title ?? null,
      targetStatus: p?.status ?? null,
    };
  });
}

/**
 * 管理员处理举报。条件更新防并发：只有 pending 的能被处理。
 *
 * 注意：这里只改举报记录自身状态,**不会自动删除/驳回被举报内容**——
 * 删除评论走 /api/admin/comments,驳回投稿走 /api/admin/posts。
 * 让管理员显式做这两个动作,避免"举报即删"被人当武器。
 */
export async function resolveReport(params: {
  reportId: string;
  action: 'resolve' | 'dismiss';
  resolverId: string;
}): Promise<void> {
  const { reportId, action, resolverId } = params;
  const now = new Date().toISOString();
  const nextStatus: ReportStatus = action === 'resolve' ? 'resolved' : 'dismissed';

  // 条件更新:只对 pending 状态的举报生效
  const updatedRows = await db
    .update(reports)
    .set({ status: nextStatus, resolverId, resolvedAt: now })
    .where(and(eq(reports.id, reportId), eq(reports.status, 'pending')))
    .returning({ id: reports.id });

  if (updatedRows.length > 0) return;

  // 条件更新未命中时再查询,区分记录不存在与已被其他管理员处理
  const [row] = await db
    .select({ status: reports.status })
    .from(reports)
    .where(eq(reports.id, reportId))
    .limit(1);

  if (!row) {
    throw new ReportError('举报记录不存在');
  }
  throw new ReportError('该举报已被处理过,无需重复操作');
}

export class ReportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReportError';
  }
}

/**
 * 批量查询一组目标的 pending 举报数。
 * 用于 admin/posts / admin/comments 列表显示「该内容有 N 条待处理举报」。
 *
 * 只统计 pending——已 resolved/dismissed 的不再提示管理员。
 * 返回 Map<targetId, count>,未命中的 targetId 不在 Map 中(调用方按 0 处理)。
 *
 * targetType 决定查询条件: 评论与投稿分两次 inArray 查询,调用方按需各调一次。
 */
export async function countPendingReports(
  targetType: ReportTargetType,
  targetIds: string[],
): Promise<Map<string, number>> {
  const result = new Map<string, number>();
  if (targetIds.length === 0) return result;

  const rows = await db
    .select({
      targetId: reports.targetId,
      count: sql<number>`count(*)::int`,
    })
    .from(reports)
    .where(
      and(
        eq(reports.targetType, targetType),
        eq(reports.status, 'pending'),
        sql`${reports.targetId} = ANY(${targetIds})`,
      ),
    )
    .groupBy(reports.targetId);

  for (const r of rows) {
    result.set(r.targetId, r.count);
  }
  return result;
}
