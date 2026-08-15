import { db } from './db';
import { announcements } from './db/schema';
import { eq, desc, and, isNotNull, sql } from 'drizzle-orm';
import type { Announcement } from './announcement-text';

export type { Announcement };

export type AnnouncementDraft = {
  titleZh?: string | null;
  titleEn?: string | null;
  bodyZh?: string | null;
  bodyEn?: string | null;
  published?: boolean;
};

/**
 * 公开列表返回的最大条数。公告只增不删，不设上限的话每个访客首屏都要拉全部历史
 * （正文上限 2000 字），铃铛也放不下。需要更早的公告时再做「查看全部」页。
 */
const PUBLIC_LIMIT = 20;

/** 公开列表：只取已发布，按发布时间倒序 */
export async function listPublishedAnnouncements(): Promise<Announcement[]> {
  return db
    .select()
    .from(announcements)
    .where(and(eq(announcements.published, true), isNotNull(announcements.publishedAt)))
    .orderBy(desc(announcements.publishedAt))
    .limit(PUBLIC_LIMIT);
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
 * 更新公告。整个更新是单条 UPDATE，不做「先查后写」——Neon HTTP 没有事务，
 * 两个管理员同时保存时读到的快照会互相覆盖，最坏情况是 published=true 而
 * published_at 为 null，公开列表因 isNotNull 过滤直接查不到（"发布了但看不见"）。
 *
 * 字段语义：`undefined` = 调用方没传，保持原值；`null` = 显式清空。
 * 用 `??` 合并会把 null 当成"没传"再回填旧值，于是清空标题/正文永远不生效。
 *
 * publishedAt 只在首次发布时写入，之后由 COALESCE 保持不变——
 * 下架再上架仍沿用原发布时间，避免公告时间随操作漂移。
 */
export async function updateAnnouncement(
  id: string,
  input: AnnouncementDraft,
): Promise<Announcement | null> {
  const now = new Date().toISOString();

  const [row] = await db
    .update(announcements)
    .set({
      ...(input.titleZh !== undefined && { titleZh: input.titleZh }),
      ...(input.titleEn !== undefined && { titleEn: input.titleEn }),
      ...(input.bodyZh !== undefined && { bodyZh: input.bodyZh }),
      ...(input.bodyEn !== undefined && { bodyEn: input.bodyEn }),
      ...(input.published !== undefined && {
        published: input.published,
        ...(input.published && {
          publishedAt: sql`coalesce(${announcements.publishedAt}, ${now})`,
        }),
      }),
      updatedAt: now,
    })
    .where(eq(announcements.id, id))
    .returning();
  return row ?? null;
}

/** 删除并返回被删除的公告，供审计日志留下标题快照。 */
export async function deleteAnnouncement(id: string): Promise<Announcement | null> {
  const [row] = await db.delete(announcements).where(eq(announcements.id, id)).returning();
  return row ?? null;
}
