import crypto from 'crypto';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { db } from './db';
import { posts, postTags, users } from './db/schema';
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
  title: string;
  excerpt: string;
  content: string;
  sectionId: BlogSectionId;
  status: PostStatus;
  reviewNote: string | null;
  tags: string[];
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

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
  authorName: string | null;
}

async function attachTags(rows: PostRow[]): Promise<UserPost[]> {
  if (rows.length === 0) return [];

  const links = await db
    .select()
    .from(postTags)
    .where(inArray(postTags.postId, rows.map((r) => r.id)));

  const byPost = new Map<string, string[]>();
  for (const link of links) {
    const list = byPost.get(link.postId) ?? [];
    list.push(link.label);
    byPost.set(link.postId, list);
  }

  return rows.map((r) => ({
    ...r,
    sectionId: r.sectionId as BlogSectionId,
    status: r.status as PostStatus,
    tags: byPost.get(r.id) ?? [],
  }));
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
  authorName: users.name,
};

/** 创建投稿。status 由调用方决定：存草稿还是直接提交审核。 */
export async function createPost(input: {
  authorId: string;
  title: string;
  excerpt: string;
  content: string;
  sectionId: string;
  tags: string[];
  status: Extract<PostStatus, 'draft' | 'pending'>;
}): Promise<string> {
  const id = newPostId();
  const now = new Date().toISOString();
  const tags = normalizeTags(input.tags);

  await db.insert(posts).values({
    id,
    authorId: input.authorId,
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    sectionId: input.sectionId,
    status: input.status,
    createdAt: now,
    updatedAt: now,
  });

  // Neon HTTP 驱动不支持事务。若 postTags 写入失败，需要回滚刚插入的 post，
  // 否则会留下一条没有标签、但作者仍可见的「半成品」文章。
  if (tags.length > 0) {
    try {
      await db.insert(postTags).values(tags.map((t) => ({ postId: id, ...t })));
    } catch (err) {
      console.error('insert postTags failed, rolling back post:', err);
      try {
        await db.delete(posts).where(eq(posts.id, id));
      } catch (rollbackErr) {
        // 回滚也失败：把 post 留作 draft 兜底，至少不会出现在 pending 队列里
        console.error('rollback post failed:', rollbackErr);
        await db
          .update(posts)
          .set({ status: 'draft', updatedAt: new Date().toISOString() })
          .where(eq(posts.id, id))
          .catch(() => undefined);
      }
      throw err;
    }
  }

  return id;
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

export async function getPostsByAuthor(authorId: string): Promise<UserPost[]> {
  const rows = await db
    .select(postColumns)
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.authorId, authorId))
    .orderBy(desc(posts.updatedAt));

  return attachTags(rows);
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
export async function getPublishedUserPosts(): Promise<UserPost[]> {
  const rows = await db
    .select(postColumns)
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.status, 'published'))
    .orderBy(desc(posts.publishedAt));

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
  | { ok: false; reason: 'notFound' | 'notAuthor' | 'pendingCannotEdit' };

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
 * authorId 校验放在 update 的 where 条件里，原子防越权。状态规则需先查一次
 * status 判断分支，存在轻微竞态（作者并发编辑自己的文章），最坏情况是状态
 * 归一化与预期不符，不会越权或损坏数据。
 *
 * Neon HTTP 不支持事务，标签更新用「全删重建」而非 diff——标签数量小（≤8），
 * diff 没必要。若标签写入失败，文章内容已更新，作者可再次保存重试。
 */
export async function updatePost(input: {
  postId: string;
  authorId: string;
  title?: string;
  excerpt?: string;
  content?: string;
  sectionId?: string;
  tags?: string[];
  submit?: boolean;
}): Promise<UpdatePostResult> {
  const [row] = await db
    .select({ status: posts.status, sectionId: posts.sectionId })
    .from(posts)
    .where(eq(posts.id, input.postId))
    .limit(1);

  if (!row) return { ok: false, reason: 'notFound' };
  if (row.status === 'pending') return { ok: false, reason: 'pendingCannotEdit' };

  const wasPublished = row.status === 'published';
  const newStatus: PostStatus = wasPublished ? 'pending' : input.submit ? 'pending' : 'draft';
  const newSectionId = input.sectionId ?? row.sectionId;

  const now = new Date().toISOString();
  const updates: Record<string, string | null> = { updatedAt: now, status: newStatus };

  if (input.title !== undefined) updates.title = input.title;
  if (input.excerpt !== undefined) updates.excerpt = input.excerpt;
  if (input.content !== undefined) updates.content = input.content;
  if (input.sectionId !== undefined) updates.sectionId = input.sectionId;

  // 进入 pending 清掉旧审核留痕；published 下架清掉发布时间
  if (newStatus === 'pending') {
    updates.reviewNote = null;
    updates.reviewerId = null;
    updates.reviewedAt = null;
  }
  if (wasPublished) {
    updates.publishedAt = null;
  }

  const result = await db
    .update(posts)
    .set(updates)
    .where(and(eq(posts.id, input.postId), eq(posts.authorId, input.authorId)));

  if (((result as { rowCount?: number }).rowCount ?? 0) === 0) {
    return { ok: false, reason: 'notAuthor' };
  }

  if (input.tags !== undefined) {
    await db.delete(postTags).where(eq(postTags.postId, input.postId));
    const newTags = normalizeTags(input.tags);
    if (newTags.length > 0) {
      await db.insert(postTags).values(newTags.map((t) => ({ postId: input.postId, ...t })));
    }
  }

  return { ok: true, status: newStatus, wasPublished, oldSectionId: row.sectionId, newSectionId };
}

export type WithdrawPostResult =
  | { ok: true }
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
    return { ok: true };
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

  return { ok: true, wasPublished: row.status === 'published' };
}
