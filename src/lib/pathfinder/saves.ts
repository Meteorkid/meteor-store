import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { pathfinderFollows, pathfinderSaves } from '@/lib/db/schema';
import { listCatalogItems } from './catalog';
import type { PathfinderCatalogItem } from './catalog-types';

/**
 * Pathfinder 收藏与关注。
 *
 * 机会库的信息是「有时效的」：竞赛会截止、issue 会被别人认领、岗位会下架。
 * 只能浏览的目录逼着人每次从头翻一遍，收藏和关注是把一次浏览变成可以回来的线索。
 *
 * 与博客收藏（`src/lib/favorites.ts`）同构，但多两件事：
 * - 收藏项带 `remindDeadline`，决定要不要在截止前发提醒
 * - 关注按机构 / 主题两个维度，值统一归一化后入库
 */

export type PathfinderFollowKind = 'organization' | 'topic';

export interface PathfinderSaveRow {
  itemId: string;
  createdAt: string;
  remindDeadline: boolean;
}

/**
 * 关注值的归一化。
 *
 * 「OpenAI」「openai」「 OpenAI 」必须落到同一条关注上，否则用户会在
 * 不同页面重复关注同一个机构，取关时还只能取消其中一条。
 */
export function normalizeFollowValue(value: string): string {
  return value.trim().toLocaleLowerCase().replace(/\s+/g, ' ').slice(0, 120);
}

/** 切换收藏。返回操作后的状态与该条目的收藏总数。 */
export async function togglePathfinderSave(
  itemId: string,
  userId: string,
): Promise<{ saved: boolean; count: number }> {
  const [existing] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(pathfinderSaves)
    .where(and(eq(pathfinderSaves.itemId, itemId), eq(pathfinderSaves.userId, userId)));

  const alreadySaved = (existing?.count ?? 0) > 0;

  if (alreadySaved) {
    await db
      .delete(pathfinderSaves)
      .where(and(eq(pathfinderSaves.itemId, itemId), eq(pathfinderSaves.userId, userId)));
  } else {
    // Neon HTTP 不支持事务；复合主键兜底并发重复收藏，冲突时视作已收藏
    await db
      .insert(pathfinderSaves)
      .values({ itemId, userId, createdAt: new Date().toISOString(), remindDeadline: true })
      .onConflictDoNothing();
  }

  const [result] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(pathfinderSaves)
    .where(eq(pathfinderSaves.itemId, itemId));

  return { saved: !alreadySaved, count: result?.count ?? 0 };
}

/** 单条收藏的提醒开关。条目未收藏时返回 false，不会隐式创建收藏。 */
export async function setPathfinderSaveReminder(
  itemId: string,
  userId: string,
  remindDeadline: boolean,
): Promise<boolean> {
  const updated = await db
    .update(pathfinderSaves)
    .set({ remindDeadline })
    .where(and(eq(pathfinderSaves.itemId, itemId), eq(pathfinderSaves.userId, userId)))
    .returning({ itemId: pathfinderSaves.itemId });
  return updated.length > 0;
}

/** 当前用户的收藏记录（不含条目内容），按收藏时间倒序。 */
export async function listPathfinderSaves(userId: string): Promise<PathfinderSaveRow[]> {
  return db
    .select({
      itemId: pathfinderSaves.itemId,
      createdAt: pathfinderSaves.createdAt,
      remindDeadline: pathfinderSaves.remindDeadline,
    })
    .from(pathfinderSaves)
    .where(eq(pathfinderSaves.userId, userId))
    .orderBy(desc(pathfinderSaves.createdAt));
}

/**
 * 当前用户收藏的条目，按收藏时间倒序。
 *
 * 已下架 / 已删除的条目自然筛不到（收藏记录保留但不显示）——与博客收藏一致。
 */
export async function getSavedPathfinderItems(userId: string): Promise<Array<{
  item: PathfinderCatalogItem;
  savedAt: string;
  remindDeadline: boolean;
}>> {
  const saves = await listPathfinderSaves(userId);
  if (saves.length === 0) return [];

  const byId = new Map(saves.map((save) => [save.itemId, save]));
  const catalog = await listCatalogItems();
  return catalog
    .filter((item) => item.status === 'published' && byId.has(item.id))
    .map((item) => ({
      item,
      savedAt: byId.get(item.id)!.createdAt,
      remindDeadline: byId.get(item.id)!.remindDeadline,
    }))
    .sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

/**
 * 一批条目的收藏数。
 *
 * 列表页 N 条一次 `GROUP BY` 拿完，别改成每条打一次数据库——
 * 和博客列表的收藏数是同一条教训。
 */
export async function getPathfinderSaveCounts(
  itemIds: readonly string[],
): Promise<Record<string, number>> {
  if (itemIds.length === 0) return {};
  const rows = await db
    .select({ itemId: pathfinderSaves.itemId, count: sql<number>`count(*)::int` })
    .from(pathfinderSaves)
    .where(inArray(pathfinderSaves.itemId, [...itemIds]))
    .groupBy(pathfinderSaves.itemId);
  return Object.fromEntries(rows.map((row) => [row.itemId, row.count]));
}

/** 切换关注。value 会被归一化；返回操作后的状态。 */
export async function togglePathfinderFollow(
  userId: string,
  kind: PathfinderFollowKind,
  rawValue: string,
): Promise<{ following: boolean; value: string }> {
  const value = normalizeFollowValue(rawValue);
  if (!value) return { following: false, value };

  const [existing] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(pathfinderFollows)
    .where(and(
      eq(pathfinderFollows.userId, userId),
      eq(pathfinderFollows.kind, kind),
      eq(pathfinderFollows.value, value),
    ));

  if ((existing?.count ?? 0) > 0) {
    await db.delete(pathfinderFollows).where(and(
      eq(pathfinderFollows.userId, userId),
      eq(pathfinderFollows.kind, kind),
      eq(pathfinderFollows.value, value),
    ));
    return { following: false, value };
  }

  await db
    .insert(pathfinderFollows)
    .values({ userId, kind, value, createdAt: new Date().toISOString() })
    .onConflictDoNothing();
  return { following: true, value };
}

/** 当前用户的关注列表，按维度分组返回归一化值。 */
export async function listPathfinderFollows(
  userId: string,
): Promise<Record<PathfinderFollowKind, string[]>> {
  const rows = await db
    .select({ kind: pathfinderFollows.kind, value: pathfinderFollows.value })
    .from(pathfinderFollows)
    .where(eq(pathfinderFollows.userId, userId));

  const result: Record<PathfinderFollowKind, string[]> = { organization: [], topic: [] };
  for (const row of rows) {
    if (row.kind === 'organization' || row.kind === 'topic') result[row.kind].push(row.value);
  }
  return result;
}
