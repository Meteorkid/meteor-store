import { db } from './db';
import { announcements } from './db/schema';
import { eq, desc, and, isNotNull } from 'drizzle-orm';

export interface Announcement {
  id: string;
  titleZh: string | null;
  titleEn: string | null;
  bodyZh: string | null;
  bodyEn: string | null;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type AnnouncementDraft = {
  titleZh?: string | null;
  titleEn?: string | null;
  bodyZh?: string | null;
  bodyEn?: string | null;
  published?: boolean;
};

/** 公开列表：只取已发布，按发布时间倒序 */
export async function listPublishedAnnouncements(): Promise<Announcement[]> {
  return db
    .select()
    .from(announcements)
    .where(and(eq(announcements.published, true), isNotNull(announcements.publishedAt)))
    .orderBy(desc(announcements.publishedAt));
}

/** 管理列表：含草稿，按创建时间倒序 */
export async function listAllAnnouncements(): Promise<Announcement[]> {
  return db.select().from(announcements).orderBy(desc(announcements.createdAt));
}

export async function createAnnouncement(input: AnnouncementDraft): Promise<Announcement> {
  const now = new Date().toISOString();
  const [row] = await db
    .insert(announcements)
    .values({
      id: crypto.randomUUID(),
      titleZh: input.titleZh ?? null,
      titleEn: input.titleEn ?? null,
      bodyZh: input.bodyZh ?? null,
      bodyEn: input.bodyEn ?? null,
      published: input.published ?? false,
      publishedAt: input.published ? now : null,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  return row;
}

/**
 * 更新公告。publishedAt 只在首次发布时写入，之后保持不变——
 * 下架再上架仍沿用原发布时间，避免公告时间随操作漂移。
 */
export async function updateAnnouncement(
  id: string,
  input: AnnouncementDraft,
): Promise<Announcement | null> {
  const now = new Date().toISOString();
  const [existing] = await db
    .select()
    .from(announcements)
    .where(eq(announcements.id, id))
    .limit(1);
  if (!existing) return null;

  const published = input.published ?? existing.published;
  const publishedAt = existing.publishedAt ?? (published ? now : null);

  const [row] = await db
    .update(announcements)
    .set({
      titleZh: input.titleZh ?? existing.titleZh,
      titleEn: input.titleEn ?? existing.titleEn,
      bodyZh: input.bodyZh ?? existing.bodyZh,
      bodyEn: input.bodyEn ?? existing.bodyEn,
      published,
      publishedAt,
      updatedAt: now,
    })
    .where(eq(announcements.id, id))
    .returning();
  return row ?? null;
}

export async function deleteAnnouncement(id: string): Promise<boolean> {
  const [row] = await db
    .delete(announcements)
    .where(eq(announcements.id, id))
    .returning({ id: announcements.id });
  return Boolean(row);
}

/** 按当前语言取标题/正文，缺失时回退到另一语言。 */
export function pickAnnouncementText(
  valueZh: string | null | undefined,
  valueEn: string | null | undefined,
  locale: string,
): string {
  if (locale === 'en') return valueEn || valueZh || '';
  return valueZh || valueEn || '';
}
