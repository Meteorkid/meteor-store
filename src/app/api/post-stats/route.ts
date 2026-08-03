import { NextRequest, NextResponse } from 'next/server';
import { and, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { comments, likes, pageViews, postFavorites } from '@/lib/db/schema';
import { getSession } from '@/lib/auth';

/**
 * 文章统计聚合接口：一次请求拉取 views / likes / comments / favorites 计数
 * 与当前用户的 liked / favorited 状态。
 *
 * PostStats 组件原本要打 4 个独立请求,这里合并为 1 个,减少连接成本和 RTT。
 * 不限流:GET 接口、所有数据本来就对公众可见、计数查询走索引开销很小。
 *
 * 字段说明:
 *  - viewCount: page_views 行数
 *  - likeCount / liked: likes 表行数 + 当前用户是否命中
 *  - commentCount: comments 表 status='approved' 行数(只统计公开可见)
 *  - favoriteCount / favorited: post_favorites 行数 + 当前用户是否命中
 */
export async function GET(req: NextRequest) {
  const targetId = req.nextUrl.searchParams.get('targetId');
  if (!targetId) {
    return NextResponse.json({ error: '缺少 targetId' }, { status: 400 });
  }

  const session = await getSession();
  const userId = session?.userId ?? null;

  // 4 个独立查询并行执行,不互相依赖
  // 视图: count(*)
  // 点赞: count(*) + 当前用户命中
  // 评论: count(*) WHERE status='approved'
  // 收藏: count(*) + 当前用户命中
  const [viewRow, likeRow, likeStatusRow, commentRow, favoriteRow, favoriteStatusRow] =
    await Promise.all([
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(pageViews)
        .where(eq(pageViews.targetId, targetId)),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(likes)
        .where(eq(likes.targetId, targetId)),
      userId
        ? db
            .select({ count: sql<number>`count(*)::int` })
            .from(likes)
            .where(and(eq(likes.targetId, targetId), eq(likes.userId, userId)))
        : Promise.resolve([{ count: 0 }]),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(comments)
        .where(and(eq(comments.targetId, targetId), eq(comments.status, 'approved'))),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(postFavorites)
        .where(eq(postFavorites.targetId, targetId)),
      userId
        ? db
            .select({ count: sql<number>`count(*)::int` })
            .from(postFavorites)
            .where(and(eq(postFavorites.targetId, targetId), eq(postFavorites.userId, userId)))
        : Promise.resolve([{ count: 0 }]),
    ]);

  return NextResponse.json({
    viewCount: viewRow[0]?.count ?? 0,
    likeCount: likeRow[0]?.count ?? 0,
    liked: (likeStatusRow[0]?.count ?? 0) > 0,
    commentCount: commentRow[0]?.count ?? 0,
    favoriteCount: favoriteRow[0]?.count ?? 0,
    favorited: (favoriteStatusRow[0]?.count ?? 0) > 0,
  });
}
