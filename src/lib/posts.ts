import crypto from 'crypto';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { db } from './db';
import { posts, postTags, postSections, users } from './db/schema';
import { normalizeTag } from '@/data/blog-tags';
import type { BlogSectionId } from '@/data/blog-sections';

/**
 * 用户投稿的读写。
 *
 * 站主的文章走 content/blog/*.md，这里只管数据库那一路。
 * 两条来源在展示层合并，见 getPublishedUserPosts 的调用方。
 */

export type PostStatus = 'draft' | 'pending' | 'published' | 'rejected';

export interface UserPost {
  id: string;
  authorId: string;
  authorName: string | null;
  authorBio: string | null;
  authorAvatarUrl: string | null;
  title: string;
  excerpt: string;
  content: string;
  sectionId: BlogSectionId;
  /** 全部所属分区（含主分区）。跨区文章会出现在多个分区页。 */
  sections: BlogSectionId[];
  status: PostStatus;
  reviewNote: string | null;
  tags: string[];
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  eventDate: string | null;
  locale: string;
}

export type UserPostSummary = Pick<
  UserPost,
  | 'id'
  | 'authorId'
  | 'title'
  | 'excerpt'
  | 'sectionId'
  | 'sections'
  | 'status'
  | 'reviewNote'
  | 'tags'
  | 'publishedAt'
  | 'createdAt'
  | 'updatedAt'
  | 'eventDate'
  | 'locale' 
>;

/** 短 id，直接作为 URL：/blog/p/{id}。与文件文章的 slug 空间隔开，不会撞。 */
export function newPostId(): string {
  return crypto.randomBytes(8).toString('base64url');
}

/** 标签去重、去空、限量——用户输入不可信 */
export function normalizeTags(raw: string[], limit = 8): { tag: string; label: string }[] {
  const seen = new Map<string, string>();
  for (const item of raw) {
    const label = item.trim();
    if (!label) continue;
    const key = normalizeTag(label);
    if (!key || seen.has(key)) continue;
    seen.set(key, label);
    if (seen.size >= limit) break;
  }
  return Array.from(seen.entries()).map(([tag, label]) => ({ tag, label }));
}

interface PostRow {
  id: string;
  authorId: string;
  title: string;
  excerpt: string;
  content: string;
  sectionId: string;
  status: string;
  reviewNote: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  eventDate: string | null;
  locale: string;
  authorName: string | null;
  authorBio: string | null;
  authorAvatarUrl: string | null;
}

type PostWithRelations<T extends { id: string; sectionId: string }> = Omit<T, 'sectionId'> & {
  sectionId: BlogSectionId;
  sections: BlogSectionId[];
  tags: string[];
};

async function attachRelations<T extends { id: string; sectionId: string }>(
  rows: T[],
): Promise<PostWithRelations<T>[]> {
  if (rows.length === 0) return [];

  const [links, sectionLinks] = await Promise.all([
    db.select().from(postTags).where(inArray(postTags.postId, rows.map((r) => r.id))),
    db.select().from(postSections).where(inArray(postSections.postId, rows.map((r) => r.id))),
  ]);

  const byPost = new Map<string, string[]>();
  for (const link of links) {
    const list = byPost.get(link.postId) ?? [];
    list.push(link.label);
    byPost.set(link.postId, list);
  }

  // sections 以主分区排头，其余按插入顺序
  const sectionsByPost = new Map<string, string[]>();
  for (const link of sectionLinks) {
    const list = sectionsByPost.get(link.postId) ?? [];
    list.push(link.sectionId);
    sectionsByPost.set(link.postId, list);
  }

  return rows.map((r) => {
    // SQL 未声明顺序，不能把关联表返回的第一项当主分区。
    // 主分区始终来自 posts.section_id，其余关系按查询结果去重追加。
    const linkedSections = sectionsByPost.get(r.id) ?? [];
    const sections = Array.from(new Set([
      r.sectionId,
      ...linkedSections.filter((sectionId) => sectionId !== r.sectionId),
    ]));
    return {
      ...r,
      sectionId: r.sectionId as BlogSectionId,
      sections: sections as BlogSectionId[],
      tags: byPost.get(r.id) ?? [],
    } as PostWithRelations<T>;
  });
}

async function attachTags(rows: PostRow[]): Promise<UserPost[]> {
  const related = await attachRelations(rows);
  return related.map((row) => ({ ...row, status: row.status as PostStatus }));
}

const postColumns = {
  id: posts.id,
  authorId: posts.authorId,
  title: posts.title,
  excerpt: posts.excerpt,
  content: posts.content,
  sectionId: posts.sectionId,
  status: posts.status,
  reviewNote: posts.reviewNote,
  publishedAt: posts.publishedAt,
  createdAt: posts.createdAt,
  updatedAt: posts.updatedAt,
  eventDate: posts.eventDate,
  locale: posts.locale,
  authorName: users.name,
  authorBio: users.bio,
  authorAvatarUrl: users.avatarUrl,
};

const postSummaryColumns = {
  id: posts.id,
  authorId: posts.authorId,
  title: posts.title,
  excerpt: posts.excerpt,
  sectionId: posts.sectionId,
  status: posts.status,
  reviewNote: posts.reviewNote,
  publishedAt: posts.publishedAt,
  createdAt: posts.createdAt,
  updatedAt: posts.updatedAt,
  eventDate: posts.eventDate,
  locale: posts.locale,
};

/** 分区去重、去空，主分区排头。用户输入不可信。 */
function normalizeSections(primary: string, extras: string[] = []): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of [primary, ...extras]) {
    const v = id.trim();
    if (!v || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

/** 创建投稿。status 由调用方决定：存草稿、提交审核、或直接发布（管理员）。 */
export async function createPost(input: {
  authorId: string;
  title: string;
  excerpt: string;
  content: string;
  sectionId: string;
  /** 全部所属分区（含主分区）。缺省时只有主分区。 */
  sections?: string[];
  tags: string[];
  status: Extract<PostStatus, 'draft' | 'pending' | 'published'>;
  /** 内容描述事件的时间，YYYY-MM-DD，可选 */
  eventDate?: string | null;
  /** 投稿语言版本，默认 zh */
  locale?: string;
}): Promise<{ id: string; updatedAt: string }> {
  const id = newPostId();
  const now = new Date().toISOString();
  const tags = normalizeTags(input.tags);
  const sections = normalizeSections(input.sectionId, input.sections);
  const publishedAt = input.status === 'published' ? now : null;
  // 没填事件时间时默认与发布日期相同（仅发布时回填，草稿/待审保持空）
  const eventDate = input.eventDate?.trim()
    ? input.eventDate.trim()
    : publishedAt
      ? publishedAt.slice(0, 10)
      : null;

  const locale = input.locale?.trim() || 'zh';

  const ctes = [sql`
    inserted_post AS (
      INSERT INTO "posts" (
        "id", "author_id", "title", "excerpt", "content", "section_id", "status",
        "review_note", "reviewer_id", "reviewed_at", "event_date", "published_at",
        "locale", "created_at", "updated_at"
      )
      VALUES (
        ${id}, ${input.authorId}, ${input.title}, ${input.excerpt}, ${input.content},
        ${input.sectionId}, ${input.status}, NULL, NULL, NULL, ${eventDate},
        ${publishedAt}, ${locale}, ${now}, ${now}
      )
      RETURNING "id", "updated_at"
    )
  `, sql`
    inserted_sections AS (
      INSERT INTO "post_sections" ("post_id", "section_id")
      SELECT inserted_post."id", incoming."section_id"
      FROM inserted_post
      CROSS JOIN (
        VALUES ${sql.join(sections.map((sectionId) => sql`(${sectionId})`), sql`, `)}
      ) AS incoming("section_id")
      RETURNING "post_id"
    )
  `];

  if (tags.length > 0) {
    ctes.push(sql`
      inserted_tags AS (
        INSERT INTO "post_tags" ("post_id", "tag", "label")
        SELECT inserted_post."id", incoming."tag", incoming."label"
        FROM inserted_post
        CROSS JOIN (
          VALUES ${sql.join(tags.map((tag) => sql`(${tag.tag}, ${tag.label})`), sql`, `)}
        ) AS incoming("tag", "label")
        RETURNING "post_id"
      )
    `);
  }

  const result = await db.execute<{ id: string; updated_at: string }>(sql`
    WITH ${sql.join(ctes, sql`, `)}
    SELECT "id", "updated_at" FROM inserted_post
  `);
  const created = result.rows[0];
  if (!created) throw new Error('Post insert returned no row');

  return { id: created.id, updatedAt: created.updated_at };
}

export async function getPostById(id: string): Promise<UserPost | null> {
  const rows = await db
    .select(postColumns)
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.id, id))
    .limit(1);

  const [post] = await attachTags(rows);
  return post ?? null;
}

/** v1 私有读取：所有权直接进入 SQL 条件，跨用户与不存在统一返回 null。 */
export async function getPostByAuthor(id: string, authorId: string): Promise<UserPost | null> {
  const rows = await db
    .select(postColumns)
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(and(eq(posts.id, id), eq(posts.authorId, authorId)))
    .limit(1);

  const [post] = await attachTags(rows);
  return post ?? null;
}

export async function getPostsByAuthor(authorId: string): Promise<UserPost[]> {
  const rows = await db
    .select(postColumns)
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.authorId, authorId))
    .orderBy(desc(posts.updatedAt));

  return attachTags(rows);
}

/** v1 列表：数据库侧限制最近 100 篇，并且不选择可能很长的 Markdown 正文。 */
export async function getPostSummariesByAuthor(authorId: string): Promise<UserPostSummary[]> {
  const rows = await db
    .select(postSummaryColumns)
    .from(posts)
    .where(eq(posts.authorId, authorId))
    .orderBy(desc(posts.updatedAt))
    .limit(100);

  const related = await attachRelations(rows);
  return related.map((row) => ({ ...row, status: row.status as PostStatus }));
}

/** 审核队列：待审的排前面，先提交的先处理 */
export async function getPendingPosts(): Promise<UserPost[]> {
  const rows = await db
    .select(postColumns)
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.status, 'pending'))
    .orderBy(posts.createdAt);

  return attachTags(rows);
}

/** 已发布的用户文章，供博客列表与 RSS 合并 */
export async function getPublishedUserPosts(locale?: string): Promise<UserPost[]> {
  const conditions = [eq(posts.status, 'published')];
  if (locale) conditions.push(eq(posts.locale, locale));
  
  const rows = await db
    .select(postColumns)
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(and(...conditions))
    .orderBy(desc(posts.publishedAt));

  return attachTags(rows);
}

/**
 * 按 id 批量取已发布的投稿。「我的收藏」页用——只拉收藏命中的那几篇，
 * 避免 getPublishedUserPosts 那样把全表（含 content）都捞进内存再筛。
 * 传入的 id 里可能混入文件文章的 slug，它们不会命中任何投稿，天然被忽略。
 */
export async function getPublishedUserPostsByIds(ids: string[]): Promise<UserPost[]> {
  if (ids.length === 0) return [];
  const rows = await db
    .select(postColumns)
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(and(eq(posts.status, 'published'), inArray(posts.id, ids)));

  return attachTags(rows);
}

/**
 * 审核。只有 pending 的文章能被审——用条件更新而不是先查后写，
 * 避免两个管理员同时点造成重复处理。
 */
export async function reviewPost(input: {
  postId: string;
  reviewerId: string;
  approve: boolean;
  note?: string;
}): Promise<boolean> {
  const now = new Date().toISOString();

  const result = await db
    .update(posts)
    .set({
      status: input.approve ? 'published' : 'rejected',
      reviewNote: input.note?.trim() || null,
      reviewerId: input.reviewerId,
      reviewedAt: now,
      publishedAt: input.approve ? now : null,
      // 审核通过即发布：没填事件时间默认与发布日期相同（驳回时不动）
      eventDate: input.approve
        ? sql<string>`coalesce("event_date", ${now.slice(0, 10)})`
        : undefined,
      updatedAt: now,
    })
    .where(and(eq(posts.id, input.postId), eq(posts.status, 'pending')));

  return ((result as { rowCount?: number }).rowCount ?? 0) > 0;
}

/** 已发布文章的标签热度，与文件文章的标签在展示层相加 */
export async function getPublishedTagCounts(): Promise<{ tag: string; label: string; count: number }[]> {
  return db
    .select({
      tag: postTags.tag,
      label: sql<string>`min(${postTags.label})`,
      count: sql<number>`count(*)::int`,
    })
    .from(postTags)
    .innerJoin(posts, eq(posts.id, postTags.postId))
    .where(eq(posts.status, 'published'))
    .groupBy(postTags.tag);
}

// ── 编辑、撤回、删除 ──────────────────────────────────────────

export type UpdatePostResult =
  | {
      ok: true;
      status: PostStatus;
      wasPublished: boolean;
      oldSectionId: string;
      newSectionId: string;
    }
  | {
      ok: false;
      reason: 'notFound' | 'notAuthor' | 'pendingCannotEdit' | 'concurrentUpdate';
    };

/**
 * 编辑投稿。
 *
 * 状态规则：
 * - draft / rejected：可改字段。submit=true → pending，否则归一化为 draft
 *   （rejected 编辑后回到 draft，让作者重新决定何时提交）
 * - published：可改字段，**强制变 pending 重新审核**（submit 字段忽略）。
 *   保守策略：投稿者不能绕过审核改已上线内容。
 * - pending：不允许编辑，调用方应先 withdrawPost。避免审核中内容被偷改，
 *   导致管理员看到的和审的不一致。
 *
 * authorId、预读 status 与 updatedAt 都进入最终 UPDATE 条件：提交、审核或另一
 * 次保存先完成时，本次旧写入不会覆盖新状态/版本。标签或分区变化时，主表与
 * 关系表通过单条 data-modifying CTE 原子更新。
 */
export async function updatePost(input: {
  postId: string;
  authorId: string;
  title?: string;
  excerpt?: string;
  content?: string;
  sectionId?: string;
  /** 全部所属分区（含主分区）。传入时整组覆盖。 */
  sections?: string[];
  tags?: string[];
  /** 内容描述事件的时间，YYYY-MM-DD，可选；空串清空 */
  eventDate?: string | null;
  /** 投稿语言版本 */
  locale?: string;
  submit?: boolean;
  /** 管理员直发：仅与 asAdmin 同时为 true 时生效。 */
  adminPublish?: boolean;
  /** 管理员越权编辑：true 时最终写入不校验 authorId。
   *  API 层必须先验证 isAdminSession 再传此参数。 */
  asAdmin?: boolean;
}): Promise<UpdatePostResult> {
  const [row] = await db
    .select({
      authorId: posts.authorId,
      status: posts.status,
      sectionId: posts.sectionId,
      updatedAt: posts.updatedAt,
    })
    .from(posts)
    .where(eq(posts.id, input.postId))
    .limit(1);

  if (!row) return { ok: false, reason: 'notFound' };
  if (!input.asAdmin && row.authorId !== input.authorId) {
    return { ok: false, reason: 'notAuthor' };
  }
  // 管理员可以编辑 pending（审核中需要修正），普通作者不行
  if (row.status === 'pending' && !input.asAdmin) return { ok: false, reason: 'pendingCannotEdit' };

  const wasPublished = row.status === 'published';
  const now = nextUpdatedAt(row.updatedAt);

  // 管理员直发：已发布保持发布，提交直接发布
  // 普通用户：已发布 → pending 重审，提交 → pending
  let newStatus: PostStatus;
  if (input.asAdmin && input.adminPublish) {
    newStatus = wasPublished ? 'published' : input.submit ? 'published' : 'draft';
  } else {
    newStatus = wasPublished ? 'pending' : input.submit ? 'pending' : 'draft';
  }

  const newSectionId = input.sectionId ?? row.sectionId;
  const updates: Record<string, string | null> = { updatedAt: now, status: newStatus };

  if (input.title !== undefined) updates.title = input.title;
  if (input.excerpt !== undefined) updates.excerpt = input.excerpt;
  if (input.content !== undefined) updates.content = input.content;
  if (input.sectionId !== undefined) updates.sectionId = input.sectionId;
  if (input.eventDate !== undefined) updates.eventDate = input.eventDate?.trim() ? input.eventDate.trim() : null;
  if (input.locale !== undefined) updates.locale = input.locale?.trim() || 'zh';

  // 进入 pending 清掉旧审核留痕
  if (newStatus === 'pending') {
    updates.reviewNote = null;
    updates.reviewerId = null;
    updates.reviewedAt = null;
  }

  // published 下架清掉发布时间
  if (wasPublished && newStatus !== 'published') {
    updates.publishedAt = null;
  }

  // 管理员直发时设置发布时间；没填事件时间默认与发布时间相同
  if (newStatus === 'published' && !wasPublished) {
    updates.publishedAt = now;
    if (input.eventDate === undefined || !input.eventDate?.trim()) {
      updates.eventDate = now.slice(0, 10);
    }
  }

  // 管理员越权编辑不校验 authorId；两条路径都锁定预读状态与版本，防止旧保存
  // 覆盖已经提交、审核或由另一客户端更新的内容。
  const whereClause = input.asAdmin
    ? and(
        eq(posts.id, input.postId),
        eq(posts.status, row.status),
        eq(posts.updatedAt, row.updatedAt),
      )
    : and(
        eq(posts.id, input.postId),
        eq(posts.authorId, input.authorId),
        eq(posts.status, row.status),
        eq(posts.updatedAt, row.updatedAt),
      );

  const normalizedTags = input.tags === undefined ? undefined : normalizeTags(input.tags);
  const normalizedSections = input.sections === undefined
    ? undefined
    : normalizeSections(input.sectionId ?? row.sectionId, input.sections);

  let updated = false;
  if (normalizedTags !== undefined || normalizedSections !== undefined) {
    const assignments = [
      sql`"updated_at" = ${now}`,
      sql`"status" = ${newStatus}`,
    ];
    if (input.title !== undefined) assignments.push(sql`"title" = ${input.title}`);
    if (input.excerpt !== undefined) assignments.push(sql`"excerpt" = ${input.excerpt}`);
    if (input.content !== undefined) assignments.push(sql`"content" = ${input.content}`);
    if (input.sectionId !== undefined) assignments.push(sql`"section_id" = ${input.sectionId}`);
    if (input.eventDate !== undefined) {
      assignments.push(sql`"event_date" = ${input.eventDate?.trim() ? input.eventDate.trim() : null}`);
    }
    if (input.locale !== undefined) {
      assignments.push(sql`"locale" = ${input.locale?.trim() || 'zh'}`);
    }
    if (newStatus === 'pending') {
      assignments.push(
        sql`"review_note" = null`,
        sql`"reviewer_id" = null`,
        sql`"reviewed_at" = null`,
      );
    }
    if (wasPublished && newStatus !== 'published') {
      assignments.push(sql`"published_at" = null`);
    }
    if (newStatus === 'published' && !wasPublished) {
      assignments.push(sql`"published_at" = ${now}`);
      if (input.eventDate === undefined || !input.eventDate?.trim()) {
        assignments.push(sql`"event_date" = ${now.slice(0, 10)}`);
      }
    }

    const ownerCondition = input.asAdmin
      ? sql.empty()
      : sql`AND "author_id" = ${input.authorId}`;
    const ctes = [sql`
      updated_post AS (
        UPDATE "posts"
        SET ${sql.join(assignments, sql`, `)}
        WHERE "id" = ${input.postId}
          ${ownerCondition}
          AND "status" = ${row.status}
          AND "updated_at" = ${row.updatedAt}
        RETURNING "id"
      )
    `];

    if (normalizedTags !== undefined) {
      const removeOtherTags = normalizedTags.length > 0
        ? sql`AND "tag" NOT IN (${sql.join(normalizedTags.map((tag) => sql`${tag.tag}`), sql`, `)})`
        : sql.empty();
      ctes.push(sql`
        deleted_tags AS (
          DELETE FROM "post_tags"
          WHERE "post_id" IN (SELECT "id" FROM updated_post)
            ${removeOtherTags}
          RETURNING "post_id"
        )
      `);

      if (normalizedTags.length > 0) {
        ctes.push(sql`
          upserted_tags AS (
            INSERT INTO "post_tags" ("post_id", "tag", "label")
            SELECT updated_post."id", incoming."tag", incoming."label"
            FROM updated_post
            CROSS JOIN (
              VALUES ${sql.join(normalizedTags.map((tag) => sql`(${tag.tag}, ${tag.label})`), sql`, `)}
            ) AS incoming("tag", "label")
            ON CONFLICT ("post_id", "tag")
            DO UPDATE SET "label" = EXCLUDED."label"
            RETURNING "post_id"
          )
        `);
      }
    }

    if (normalizedSections !== undefined) {
      const removeOtherSections = normalizedSections.length > 0
        ? sql`AND "section_id" NOT IN (${sql.join(normalizedSections.map((sectionId) => sql`${sectionId}`), sql`, `)})`
        : sql.empty();
      ctes.push(sql`
        deleted_sections AS (
          DELETE FROM "post_sections"
          WHERE "post_id" IN (SELECT "id" FROM updated_post)
            ${removeOtherSections}
          RETURNING "post_id"
        )
      `);

      if (normalizedSections.length > 0) {
        ctes.push(sql`
          inserted_sections AS (
            INSERT INTO "post_sections" ("post_id", "section_id")
            SELECT updated_post."id", incoming."section_id"
            FROM updated_post
            CROSS JOIN (
              VALUES ${sql.join(normalizedSections.map((sectionId) => sql`(${sectionId})`), sql`, `)}
            ) AS incoming("section_id")
            ON CONFLICT ("post_id", "section_id") DO NOTHING
            RETURNING "post_id"
          )
        `);
      }
    }

    const result = await db.execute(sql<{ id: string }>`
      WITH ${sql.join(ctes, sql`, `)}
      SELECT "id" FROM updated_post
    `);
    updated = result.rows.length > 0;
  } else {
    const result = await db.update(posts).set(updates).where(whereClause);
    updated = ((result as { rowCount?: number }).rowCount ?? 0) > 0;
  }

  if (!updated) {
    const [current] = await db
      .select({ authorId: posts.authorId })
      .from(posts)
      .where(eq(posts.id, input.postId))
      .limit(1);

    if (!current) return { ok: false, reason: 'notFound' };
    if (!input.asAdmin && current.authorId !== input.authorId) {
      return { ok: false, reason: 'notAuthor' };
    }
    return { ok: false, reason: 'concurrentUpdate' };
  }

  return { ok: true, status: newStatus, wasPublished, oldSectionId: row.sectionId, newSectionId };
}

export type WithdrawPostResult =
  | { ok: true; updatedAt: string }
  | { ok: false; reason: 'notFound' | 'notAuthor' | 'notPending' };

/**
 * 撤回：pending → draft。条件更新 where(id AND authorId AND status='pending')，
 * 原子操作防越权、防状态漂移。未命中时分三种原因返回。
 */
export async function withdrawPost(input: {
  postId: string;
  authorId: string;
}): Promise<WithdrawPostResult> {
  const now = new Date().toISOString();
  const result = await db
    .update(posts)
    .set({ status: 'draft', updatedAt: now, reviewNote: null, reviewerId: null, reviewedAt: null })
    .where(
      and(eq(posts.id, input.postId), eq(posts.authorId, input.authorId), eq(posts.status, 'pending')),
    );

  if (((result as { rowCount?: number }).rowCount ?? 0) > 0) {
    return { ok: true, updatedAt: now };
  }

  const [row] = await db
    .select({ authorId: posts.authorId, status: posts.status })
    .from(posts)
    .where(eq(posts.id, input.postId))
    .limit(1);
  if (!row) return { ok: false, reason: 'notFound' };
  if (row.authorId !== input.authorId) return { ok: false, reason: 'notAuthor' };
  return { ok: false, reason: 'notPending' };
}

export type DeletePostResult =
  | { ok: true; wasPublished: boolean }
  | { ok: false; reason: 'notFound' | 'notAuthor' };

/**
 * 删除投稿。任何状态都可删。先查状态用于返回 wasPublished（调用方据此决定
 * 是否 revalidate）和区分 notFound/notAuthor。删除顺序：先删 posts 行
 * （带 authorId 条件保证原子），再清 postTags 关联——标签表无外键，
 * 即使标签清理失败也只是留下孤儿标签，JOIN 时被自然过滤，不影响功能。
 */
export async function deletePost(input: {
  postId: string;
  authorId: string;
}): Promise<DeletePostResult> {
  const [row] = await db
    .select({ authorId: posts.authorId, status: posts.status })
    .from(posts)
    .where(eq(posts.id, input.postId))
    .limit(1);

  if (!row) return { ok: false, reason: 'notFound' };
  if (row.authorId !== input.authorId) return { ok: false, reason: 'notAuthor' };

  await db.delete(posts).where(and(eq(posts.id, input.postId), eq(posts.authorId, input.authorId)));
  await db.delete(postTags).where(eq(postTags.postId, input.postId));
  await db.delete(postSections).where(eq(postSections.postId, input.postId));

  return { ok: true, wasPublished: row.status === 'published' };
}

export type VersionedPostMutationResult =
  | { ok: true; status: PostStatus; updatedAt: string }
  | { ok: false; reason: 'notFound' | 'invalidState' | 'versionConflict' };

/** updatedAt 同时充当 API 乐观锁版本；即使服务器时钟回拨也必须严格递增。 */
function nextUpdatedAt(expectedUpdatedAt: string): string {
  const now = Date.now();
  const expected = Date.parse(expectedUpdatedAt);
  return new Date(Number.isFinite(expected) ? Math.max(now, expected + 1) : now).toISOString();
}

async function classifyVersionedMutationFailure(input: {
  postId: string;
  authorId: string;
  expectedUpdatedAt: string;
}): Promise<Extract<VersionedPostMutationResult, { ok: false }>> {
  const [row] = await db
    .select({ status: posts.status, updatedAt: posts.updatedAt })
    .from(posts)
    .where(and(eq(posts.id, input.postId), eq(posts.authorId, input.authorId)))
    .limit(1);

  if (!row) return { ok: false, reason: 'notFound' };
  if (row.status !== 'draft' && row.status !== 'rejected') {
    return { ok: false, reason: 'invalidState' };
  }
  return { ok: false, reason: 'versionConflict' };
}

/**
 * v1 显式提交。管理员能力只决定目标状态，不改变文章所有权条件。
 * 条件更新确保同一个 expectedUpdatedAt 最多只有一个请求成功。
 */
export async function submitPostVersioned(input: {
  postId: string;
  authorId: string;
  expectedUpdatedAt: string;
  publish: boolean;
}): Promise<VersionedPostMutationResult> {
  const updatedAt = nextUpdatedAt(input.expectedUpdatedAt);
  const status: Extract<PostStatus, 'pending' | 'published'> = input.publish ? 'published' : 'pending';

  const result = await db
    .update(posts)
    .set({
      status,
      reviewNote: null,
      reviewerId: null,
      reviewedAt: null,
      publishedAt: input.publish ? updatedAt : null,
      updatedAt,
    })
    .where(and(
      eq(posts.id, input.postId),
      eq(posts.authorId, input.authorId),
      inArray(posts.status, ['draft', 'rejected']),
      eq(posts.updatedAt, input.expectedUpdatedAt),
    ));

  if (((result as { rowCount?: number }).rowCount ?? 0) === 0) {
    return classifyVersionedMutationFailure(input);
  }

  return { ok: true, status, updatedAt };
}

/** v1 草稿更新：只接受本人 draft/rejected，并用 updatedAt 做乐观锁。 */
export async function updatePostDraftVersioned(input: {
  postId: string;
  authorId: string;
  expectedUpdatedAt: string;
  title?: string;
  excerpt?: string;
  content?: string;
  sectionId?: string;
  sections?: string[];
  tags?: string[];
  eventDate?: string | null;
  locale?: string;
}): Promise<VersionedPostMutationResult> {
  let rebuiltSections: string[] | undefined;
  if (input.sectionId !== undefined || input.sections !== undefined) {
    const [currentPost] = await db
      .select({ sectionId: posts.sectionId })
      .from(posts)
      .where(and(eq(posts.id, input.postId), eq(posts.authorId, input.authorId)))
      .limit(1);

    const currentSections = input.sections === undefined && currentPost
      ? await db
          .select({ sectionId: postSections.sectionId })
          .from(postSections)
          .where(eq(postSections.postId, input.postId))
          .limit(8)
      : [];

    const primarySection = input.sectionId ?? currentPost?.sectionId ?? input.sections?.[0] ?? '';
    const requestedSections = input.sections ?? currentSections.map((section) => section.sectionId);
    rebuiltSections = normalizeSections(primarySection, requestedSections);
  }

  const updatedAt = nextUpdatedAt(input.expectedUpdatedAt);
  const updates: Record<string, string | null> = {
    status: 'draft',
    reviewNote: null,
    reviewerId: null,
    reviewedAt: null,
    updatedAt,
  };

  if (input.title !== undefined) updates.title = input.title;
  if (input.excerpt !== undefined) updates.excerpt = input.excerpt;
  if (input.content !== undefined) updates.content = input.content;
  if (input.sectionId !== undefined) updates.sectionId = input.sectionId;
  if (input.eventDate !== undefined) {
    updates.eventDate = input.eventDate?.trim() ? input.eventDate.trim() : null;
  }
  if (input.locale !== undefined) {
    updates.locale = input.locale?.trim() || 'zh';
  }

  const tags = input.tags === undefined ? undefined : normalizeTags(input.tags);

  // 关系集合与 posts.updated_at 必须共享同一条数据库语句。否则旧 PATCH
  // 可能在乐观锁成功后被 submit 抢先，再继续改写审核中的标签或分区。
  if (tags !== undefined || rebuiltSections !== undefined) {
    const assignments = [
      sql`"status" = 'draft'`,
      sql`"review_note" = null`,
      sql`"reviewer_id" = null`,
      sql`"reviewed_at" = null`,
      sql`"updated_at" = ${updatedAt}`,
    ];
    if (input.title !== undefined) assignments.push(sql`"title" = ${input.title}`);
    if (input.excerpt !== undefined) assignments.push(sql`"excerpt" = ${input.excerpt}`);
    if (input.content !== undefined) assignments.push(sql`"content" = ${input.content}`);
    if (input.sectionId !== undefined) assignments.push(sql`"section_id" = ${input.sectionId}`);
    if (input.eventDate !== undefined) {
      assignments.push(sql`"event_date" = ${input.eventDate?.trim() ? input.eventDate.trim() : null}`);
    }
    if (input.locale !== undefined) {
      assignments.push(sql`"locale" = ${input.locale?.trim() || 'zh'}`);
    }

    const ctes = [sql`
      updated_post AS (
        UPDATE "posts"
        SET ${sql.join(assignments, sql`, `)}
        WHERE "id" = ${input.postId}
          AND "author_id" = ${input.authorId}
          AND "status" IN ('draft', 'rejected')
          AND "updated_at" = ${input.expectedUpdatedAt}
        RETURNING "id"
      )
    `];

    if (tags !== undefined) {
      const removeOtherTags = tags.length > 0
        ? sql`AND "tag" NOT IN (${sql.join(tags.map((tag) => sql`${tag.tag}`), sql`, `)})`
        : sql.empty();
      ctes.push(sql`
        deleted_tags AS (
          DELETE FROM "post_tags"
          WHERE "post_id" IN (SELECT "id" FROM updated_post)
            ${removeOtherTags}
          RETURNING "post_id"
        )
      `);

      if (tags.length > 0) {
        ctes.push(sql`
          upserted_tags AS (
            INSERT INTO "post_tags" ("post_id", "tag", "label")
            SELECT updated_post."id", incoming."tag", incoming."label"
            FROM updated_post
            CROSS JOIN (
              VALUES ${sql.join(tags.map((tag) => sql`(${tag.tag}, ${tag.label})`), sql`, `)}
            ) AS incoming("tag", "label")
            ON CONFLICT ("post_id", "tag")
            DO UPDATE SET "label" = EXCLUDED."label"
            RETURNING "post_id"
          )
        `);
      }
    }

    if (rebuiltSections !== undefined) {
      const removeOtherSections = rebuiltSections.length > 0
        ? sql`AND "section_id" NOT IN (${sql.join(rebuiltSections.map((sectionId) => sql`${sectionId}`), sql`, `)})`
        : sql.empty();
      ctes.push(sql`
        deleted_sections AS (
          DELETE FROM "post_sections"
          WHERE "post_id" IN (SELECT "id" FROM updated_post)
            ${removeOtherSections}
          RETURNING "post_id"
        )
      `);

      if (rebuiltSections.length > 0) {
        ctes.push(sql`
          inserted_sections AS (
            INSERT INTO "post_sections" ("post_id", "section_id")
            SELECT updated_post."id", incoming."section_id"
            FROM updated_post
            CROSS JOIN (
              VALUES ${sql.join(rebuiltSections.map((sectionId) => sql`(${sectionId})`), sql`, `)}
            ) AS incoming("section_id")
            ON CONFLICT ("post_id", "section_id") DO NOTHING
            RETURNING "post_id"
          )
        `);
      }
    }

    const result = await db.execute(sql<{ id: string }>`
      WITH ${sql.join(ctes, sql`, `)}
      SELECT "id" FROM updated_post
    `);

    if (result.rows.length === 0) {
      return classifyVersionedMutationFailure(input);
    }

    return { ok: true, status: 'draft', updatedAt };
  }

  const result = await db
    .update(posts)
    .set(updates)
    .where(and(
      eq(posts.id, input.postId),
      eq(posts.authorId, input.authorId),
      inArray(posts.status, ['draft', 'rejected']),
      eq(posts.updatedAt, input.expectedUpdatedAt),
    ));

  if (((result as { rowCount?: number }).rowCount ?? 0) === 0) {
    return classifyVersionedMutationFailure(input);
  }

  return { ok: true, status: 'draft', updatedAt };
}
