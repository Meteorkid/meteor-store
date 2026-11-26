import { and, desc, eq, sql } from 'drizzle-orm';

import { db } from '@/lib/db';
import { xiaohongshuNotes } from '@/lib/db/schema';
import type {
  XiaohongshuNote,
  XiaohongshuNoteInput,
  XiaohongshuStatus,
} from './types';

type NoteRow = typeof xiaohongshuNotes.$inferSelect;

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function toNote(row: NoteRow): XiaohongshuNote {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    tags: asStringArray(row.tags),
    images: asStringArray(row.images),
    sourceKind: row.sourceKind,
    sourceRef: row.sourceRef,
    sourceUrl: row.sourceUrl,
    status: row.status,
    publishedAt: row.publishedAt,
    publishedUrl: row.publishedUrl,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

/** 管理端列表；默认只取最近 60 条，返回完整笔记供客户端继续编辑。 */
export async function listXiaohongshuNotes(limit = 60): Promise<XiaohongshuNote[]> {
  const rows = await db
    .select()
    .from(xiaohongshuNotes)
    .orderBy(desc(xiaohongshuNotes.updatedAt))
    .limit(Math.min(Math.max(limit, 1), 100));
  return rows.map(toNote);
}

export async function getXiaohongshuNote(id: string): Promise<XiaohongshuNote | null> {
  const [row] = await db
    .select()
    .from(xiaohongshuNotes)
    .where(eq(xiaohongshuNotes.id, id))
    .limit(1);
  return row ? toNote(row) : null;
}

export async function createXiaohongshuNote(input: XiaohongshuNoteInput): Promise<XiaohongshuNote> {
  const now = new Date().toISOString();
  const [row] = await db.insert(xiaohongshuNotes).values({
    id: crypto.randomUUID(),
    title: input.title,
    body: input.body,
    tags: input.tags,
    images: input.images,
    sourceKind: input.sourceKind,
    sourceRef: input.sourceRef,
    sourceUrl: input.sourceUrl,
    status: input.status,
    publishedAt: input.status === 'published' ? now : null,
    publishedUrl: input.status === 'published' ? input.publishedUrl?.trim() || null : null,
    createdAt: now,
    updatedAt: now,
  }).returning();
  return toNote(row);
}

/**
 * 条件更新：expectedUpdatedAt 对不上就返回 null，由 API 转成 409。
 * 不先查再写，避免两个管理员同时编辑同一篇时静默覆盖。
 */
export async function updateXiaohongshuNote(
  id: string,
  expectedUpdatedAt: string,
  input: XiaohongshuNoteInput,
): Promise<XiaohongshuNote | null> {
  const now = new Date().toISOString();
  const [row] = await db.update(xiaohongshuNotes).set({
    title: input.title,
    body: input.body,
    tags: input.tags,
    images: input.images,
    sourceKind: input.sourceKind,
    sourceRef: input.sourceRef,
    sourceUrl: input.sourceUrl,
    status: input.status,
    publishedAt: input.status === 'published'
      ? sql`coalesce(${xiaohongshuNotes.publishedAt}, ${now})`
      : null,
    publishedUrl: input.status === 'published' ? input.publishedUrl?.trim() || null : null,
    updatedAt: now,
  }).where(and(
    eq(xiaohongshuNotes.id, id),
    eq(xiaohongshuNotes.updatedAt, expectedUpdatedAt),
  )).returning();
  return row ? toNote(row) : null;
}

export async function deleteXiaohongshuNote(
  id: string,
  expectedUpdatedAt: string,
): Promise<boolean> {
  const rows = await db.delete(xiaohongshuNotes).where(and(
    eq(xiaohongshuNotes.id, id),
    eq(xiaohongshuNotes.updatedAt, expectedUpdatedAt),
  )).returning({ id: xiaohongshuNotes.id });
  return rows.length === 1;
}

export function isXiaohongshuStatus(value: string): value is XiaohongshuStatus {
  return value === 'draft' || value === 'ready' || value === 'published';
}
