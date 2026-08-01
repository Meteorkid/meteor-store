import { createHash, randomUUID } from 'node:crypto';
import { eq, and, sql } from 'drizzle-orm';
import { db } from './db';
import { pageViews, likes } from './db/schema';

/**
 * 记录一次页面浏览。同一 (targetId, ipHash) 只计一次，重复访问静默忽略。
 */
export async function recordView(targetId: string, ip: string): Promise<void> {
  const ipHash = createHash('sha256').update(ip).digest('hex');
  const now = new Date().toISOString();

  try {
    await db.insert(pageViews).values({
      id: randomUUID(),
      targetId,
      ipHash,
      createdAt: now,
    });
  } catch {
    // 唯一约束冲突说明已存在记录，忽略即可
  }
}

/**
 * 获取指定目标的浏览量。
 */
export async function getViewCount(targetId: string): Promise<number> {
  const [result] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(pageViews)
    .where(eq(pageViews.targetId, targetId));

  return result?.count ?? 0;
}

/**
 * 切换点赞状态。如果已点赞则取消，未点赞则点赞。
 * 返回操作后的点赞状态和点赞总数。
 */
export async function toggleLike(
  targetId: string,
  userId: string,
): Promise<{ liked: boolean; count: number }> {
  const [existing] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(likes)
    .where(and(eq(likes.targetId, targetId), eq(likes.userId, userId)));

  const alreadyLiked = (existing?.count ?? 0) > 0;

  if (alreadyLiked) {
    await db
      .delete(likes)
      .where(and(eq(likes.targetId, targetId), eq(likes.userId, userId)));
  } else {
    await db.insert(likes).values({
      targetId,
      userId,
      createdAt: new Date().toISOString(),
    });
  }

  const [result] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(likes)
    .where(eq(likes.targetId, targetId));

  return {
    liked: !alreadyLiked,
    count: result?.count ?? 0,
  };
}

/**
 * 获取指定目标的点赞总数。
 */
export async function getLikeCount(targetId: string): Promise<number> {
  const [result] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(likes)
    .where(eq(likes.targetId, targetId));

  return result?.count ?? 0;
}

/**
 * 查询用户是否已点赞指定目标。
 */
export async function getLikeStatus(
  targetId: string,
  userId: string,
): Promise<boolean> {
  const [result] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(likes)
    .where(and(eq(likes.targetId, targetId), eq(likes.userId, userId)));

  return (result?.count ?? 0) > 0;
}