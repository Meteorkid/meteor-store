import { and, eq, isNotNull } from 'drizzle-orm';
import { db } from '@/lib/db';
import { ieltsProgress, ieltsPairs } from '@/lib/db/schema';
import { IeltsPairContentSchema, IeltsPairSlugSchema, IeltsTaskSchema, type IeltsPairContent, type IeltsPairStatus, type IeltsPairSource, type IeltsTask } from './types';

/**
 * 雅思对照的学习状态与后台写入。
 *
 * 学习状态只记「这个人对这组对照做了什么」，不记录答题内容：
 * 已学 = studiedAt，收藏 = bookmarkedAt，各自可空，一个复合主键防重复。
 */

export interface IeltsProgressEntry {
  slug: string;
  studiedAt: string | null;
  bookmarkedAt: string | null;
}

export type IeltsProgressKind = 'studied' | 'bookmarked';

function nowIso(): string {
  return new Date().toISOString();
}

export async function listIeltsProgress(userId: string): Promise<IeltsProgressEntry[]> {
  const rows = await db.select().from(ieltsProgress).where(eq(ieltsProgress.userId, userId));
  return rows.map(row => ({ slug: row.pairSlug, studiedAt: row.studiedAt, bookmarkedAt: row.bookmarkedAt }));
}

export async function listIeltsBookmarks(userId: string): Promise<IeltsProgressEntry[]> {
  const rows = await db.select().from(ieltsProgress)
    .where(and(eq(ieltsProgress.userId, userId), isNotNull(ieltsProgress.bookmarkedAt)));
  return rows.map(row => ({ slug: row.pairSlug, studiedAt: row.studiedAt, bookmarkedAt: row.bookmarkedAt }));
}

export async function getIeltsProgressEntry(userId: string, slug: string): Promise<IeltsProgressEntry | null> {
  const rows = await db.select().from(ieltsProgress)
    .where(and(eq(ieltsProgress.userId, userId), eq(ieltsProgress.pairSlug, slug))).limit(1);
  const row = rows[0];
  return row ? { slug: row.pairSlug, studiedAt: row.studiedAt, bookmarkedAt: row.bookmarkedAt } : null;
}

/**
 * 切换「已学 / 收藏」。
 *
 * 与文章收藏同一套写法：先读再写，复合主键兜住并发；两人同时点最坏是
 * 其中一次拿到唯一约束错误，调用方按未变化处理即可。这里读回真实状态返回，
 * 所以客户端不会出现「点了没反应」的假象。
 */
export async function toggleIeltsProgress(userId: string, slug: string, kind: IeltsProgressKind): Promise<IeltsProgressEntry> {
  IeltsPairSlugSchema.parse(slug);
  const current = await getIeltsProgressEntry(userId, slug);
  const column = kind === 'studied' ? 'studiedAt' : 'bookmarkedAt';
  const nextValue = current?.[column] ? null : nowIso();

  if (!current) {
    await db.insert(ieltsProgress).values({
      userId,
      pairSlug: slug,
      studiedAt: kind === 'studied' ? nextValue : null,
      bookmarkedAt: kind === 'bookmarked' ? nextValue : null,
      updatedAt: nowIso(),
    });
  } else {
    await db.update(ieltsProgress)
      .set({ [column]: nextValue, updatedAt: nowIso() })
      .where(and(eq(ieltsProgress.userId, userId), eq(ieltsProgress.pairSlug, slug)));
  }

  return (await getIeltsProgressEntry(userId, slug)) ?? { slug, studiedAt: null, bookmarkedAt: null };
}

export interface IeltsPairWriteInput {
  slug: string;
  task: IeltsTask;
  category: string;
  topic: string;
  status: IeltsPairStatus;
  sortOrder: number;
  content: IeltsPairContent | null;
  source: IeltsPairSource;
}

/** 后台写入：按 slug upsert。content 传 null 表示只覆盖状态/排序。 */
export async function upsertIeltsPairRow(input: IeltsPairWriteInput): Promise<void> {
  const slug = IeltsPairSlugSchema.parse(input.slug);
  const task = IeltsTaskSchema.parse(input.task);
  const content = input.content ? IeltsPairContentSchema.parse(input.content) : null;
  const timestamp = nowIso();

  await db.insert(ieltsPairs).values({
    id: crypto.randomUUID(),
    slug,
    task,
    category: input.category,
    topic: input.topic,
    status: input.status,
    sortOrder: input.sortOrder,
    content,
    source: input.source,
    publishedAt: input.status === 'published' ? timestamp : null,
    createdAt: timestamp,
    updatedAt: timestamp,
  }).onConflictDoUpdate({
    target: ieltsPairs.slug,
    set: {
      task,
      category: input.category,
      topic: input.topic,
      status: input.status,
      sortOrder: input.sortOrder,
      content,
      source: input.source,
      publishedAt: input.status === 'published' ? timestamp : null,
      updatedAt: timestamp,
    },
  });
}

export async function setIeltsPairStatus(slug: string, status: IeltsPairStatus): Promise<void> {
  IeltsPairSlugSchema.parse(slug);
  const timestamp = nowIso();
  await db.update(ieltsPairs)
    .set({ status, publishedAt: status === 'published' ? timestamp : null, updatedAt: timestamp })
    .where(eq(ieltsPairs.slug, slug));
}

export async function deleteIeltsPairRow(slug: string): Promise<void> {
  IeltsPairSlugSchema.parse(slug);
  await db.delete(ieltsPairs).where(eq(ieltsPairs.slug, slug));
}
