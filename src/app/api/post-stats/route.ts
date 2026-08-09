import { NextRequest, NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { recordView } from '@/lib/views-likes';

const StatsSchema = z.object({
  targetId: z.string().min(1).max(200),
});

interface StatsRow {
  view_count: number;
  like_count: number;
  comment_count: number;
  favorite_count: number;
  liked: number;
  favorited: number;
}

/**
 * 文章统计聚合接口：一次请求记录一次浏览并拉取 views / likes / comments / favorites
 * 计数与当前用户的 liked / favorited 状态。
 *
 * PostStats 组件原本要打 2 个请求（POST /api/views + GET /api/post-stats），合并为 1 个；
 * 内部 6 个独立 count(*) 也压成单条 SQL 子查询——Neon HTTP 下每个 count 都是一次网络往返，
 * 两处合并都直接减少 RTT 与数据库连接。
 *
 * 限流：POST 会写 page_views，按 IP 限流（区别于纯读接口）。
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { limited } = await rateLimit(`post-stats:${ip}`, 60, 60_000, { fallback: 'memory' });
  if (limited) {
    return NextResponse.json({ error: '操作太频繁了，稍后再试' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = StatsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const targetId = parsed.data.targetId;

  const session = await getSession();
  const userId = session?.userId ?? null;

  // 记录一次浏览（去重由 page_views 的 (target_id, ip_hash) 唯一约束兜底）
  await recordView(targetId, ip);

  // 单条 SQL 聚合：4 项计数 + 2 项用户状态（未登录时状态置 0）
  const likeStatus = userId
    ? sql`(SELECT count(*)::int FROM likes WHERE target_id = ${targetId} AND user_id = ${userId})`
    : sql`0`;
  const favoriteStatus = userId
    ? sql`(SELECT count(*)::int FROM post_favorites WHERE target_id = ${targetId} AND user_id = ${userId})`
    : sql`0`;

  const result = await db.execute(sql<StatsRow>`
    SELECT
      (SELECT count(*)::int FROM page_views WHERE target_id = ${targetId}) AS view_count,
      (SELECT count(*)::int FROM likes WHERE target_id = ${targetId}) AS like_count,
      (SELECT count(*)::int FROM comments WHERE target_id = ${targetId} AND status = 'approved') AS comment_count,
      (SELECT count(*)::int FROM post_favorites WHERE target_id = ${targetId}) AS favorite_count,
      ${likeStatus} AS liked,
      ${favoriteStatus} AS favorited
  `);

  const row = result.rows[0];
  return NextResponse.json({
    viewCount: row?.view_count ?? 0,
    likeCount: row?.like_count ?? 0,
    liked: Number(row?.liked ?? 0) > 0,
    commentCount: row?.comment_count ?? 0,
    favoriteCount: row?.favorite_count ?? 0,
    favorited: Number(row?.favorited ?? 0) > 0,
  });
}