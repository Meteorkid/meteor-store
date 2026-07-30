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

  const tags = normalizeTags(input.tags);
  if (tags.length > 0) {
    await db.insert(postTags).values(tags.map((t) => ({ postId: id, ...t })));
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
