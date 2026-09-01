import { eq, and, sql, inArray } from 'drizzle-orm';
import { db } from './db';
import { postFavorites } from './db/schema';
import { getBlogPosts } from '@/data/blog';
import { getPublishedUserPostsByIds } from './posts';
import type { FeedPostSummary } from '@/data/blog-feed';
import type { Locale } from '@/i18n/routing';

/**
 * 文章收藏服务层。
 *
 * targetId 复用 views/likes 的约定：文件文章用 slug，数据库投稿用 post.id。
 * 复合主键 (targetId, userId) 天然防重复收藏。
 */

/** 切换收藏状态。返回操作后的状态和收藏总数。 */
export async function toggleFavorite(
  targetId: string,
  userId: string,
): Promise<{ favorited: boolean; count: number }> {
  const [existing] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(postFavorites)
    .where(and(eq(postFavorites.targetId, targetId), eq(postFavorites.userId, userId)));

  const alreadyFavorited = (existing?.count ?? 0) > 0;

  if (alreadyFavorited) {
    await db
      .delete(postFavorites)
      .where(and(eq(postFavorites.targetId, targetId), eq(postFavorites.userId, userId)));
  } else {
    await db.insert(postFavorites).values({
      targetId,
      userId,
      createdAt: new Date().toISOString(),
    });
  }

  const [result] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(postFavorites)
    .where(eq(postFavorites.targetId, targetId));

  return {
    favorited: !alreadyFavorited,
    count: result?.count ?? 0,
  };
}

/** 单篇文章的收藏数。 */
export async function getFavoriteCount(targetId: string): Promise<number> {
  const [result] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(postFavorites)
    .where(eq(postFavorites.targetId, targetId));
  return result?.count ?? 0;
}

/** 当前用户是否已收藏。未登录时返回 false。 */
export async function getFavoriteStatus(
  targetId: string,
  userId: string | null,
): Promise<boolean> {
  if (!userId) return false;
  const [result] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(postFavorites)
    .where(and(eq(postFavorites.targetId, targetId), eq(postFavorites.userId, userId)));
  return (result?.count ?? 0) > 0;
}

/**
 * 批量查收藏数。列表页 N 篇文章一次查询。
 * 返回 Map<targetId, count>，未命中的 targetId 不在 Map 里（调用方按 0 处理）。
 */
export async function getFavoriteCounts(targetIds: string[]): Promise<Map<string, number>> {
  if (targetIds.length === 0) return new Map();
  const rows = await db
    .select({ targetId: postFavorites.targetId, count: sql<number>`count(*)::int` })
    .from(postFavorites)
    .where(inArray(postFavorites.targetId, targetIds))
    .groupBy(postFavorites.targetId);
  return new Map(rows.map((r) => [r.targetId, r.count]));
}

/**
 * 批量查当前用户的收藏状态。列表页用。
 * 返回 Set<targetId>，已收藏的 targetId 在 Set 里。
 */
export async function getUserFavoriteStatuses(
  userId: string | null,
  targetIds: string[],
): Promise<Set<string>> {
  if (!userId || targetIds.length === 0) return new Set();
  const rows = await db
    .select({ targetId: postFavorites.targetId })
    .from(postFavorites)
    .where(and(eq(postFavorites.userId, userId), inArray(postFavorites.targetId, targetIds)));
  return new Set(rows.map((r) => r.targetId));
}

/**
 * 我的收藏列表。返回 FeedPostSummary[]，按收藏时间倒序。
 *
 * targetId 不区分 file/database：拿到所有 targetId 后，
 * 两边来源都按 targetId 筛一遍。文件文章的 slug 和投稿的 UUID 不会冲突。
 *
 * 已下架或删除的文章不会出现（筛不到就跳过），但收藏记录保留——
 * 用户重新发布或作者改 slug 后无法自动恢复，这是可接受的代价。
 */
export async function getUserFavoritePosts(
  userId: string,
  locale: Locale,
): Promise<FeedPostSummary[]> {
  // 1. 拿到用户所有收藏的 targetId，按收藏时间倒序
  const favorites = await db
    .select({ targetId: postFavorites.targetId, createdAt: postFavorites.createdAt })
    .from(postFavorites)
    .where(eq(postFavorites.userId, userId))
    .orderBy(sql`${postFavorites.createdAt} DESC`);

  if (favorites.length === 0) return [];

  const targetIdSet = new Set(favorites.map((f) => f.targetId));
  const orderMap = new Map(favorites.map((f, i) => [f.targetId, i]));

  const results: FeedPostSummary[] = [];

  // 2. 从文件文章筛
  for (const p of getBlogPosts(locale)) {
    if (targetIdSet.has(p.slug)) {
      results.push({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        date: p.date,
        section: p.section,
        sections: p.sections,
        readingTime: p.readingTime,
        tags: p.tags,
        draft: p.draft,
        href: `/blog/${p.slug}`,
        author: null,
        eventDate: p.eventDate,
      });
    }
  }

  // 3. 从数据库投稿筛（英文 locale 下不加载投稿——投稿都是中文）。
  //    只按收藏命中的 id 批量查，避免全表（含 content）拉进内存再筛。
  if (locale === 'zh') {
    try {
      const rows = await getPublishedUserPostsByIds([...targetIdSet]);
      for (const p of rows) {
        if (targetIdSet.has(p.id)) {
          results.push({
            slug: p.id,
            title: p.title,
            excerpt: p.excerpt,
            date: (p.publishedAt ?? p.createdAt).slice(0, 10),
            section: p.sectionId,
            sections: p.sections,
            readingTime: p.readingTime,
            tags: p.tags,
            draft: false,
            href: `/blog/p/${p.id}`,
            author: p.authorName,
            eventDate: p.eventDate ?? (p.publishedAt ?? p.createdAt).slice(0, 10),
          });
        }
      }
    } catch {
      // 数据库读失败只影响投稿部分，文件文章照常返回
    }
  }

  // 4. 按收藏时间排序
  return results.sort(
    (a, b) => (orderMap.get(a.slug) ?? 0) - (orderMap.get(b.slug) ?? 0),
  );
}
