import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import {
  toggleFavorite,
  getFavoriteCount,
  getFavoriteStatus,
  getFavoriteCounts,
  getUserFavoriteStatuses,
} from '@/lib/favorites';

const FavoriteSchema = z.object({
  targetId: z.string().min(1).max(200),
});

/**
 * 查收藏状态。
 * ?targetId=xxx：单篇，返回 { count, favorited }
 * ?targetIds=a,b,c：批量，返回 { counts: { [targetId]: number }, favorited: string[] }
 */
export async function GET(req: NextRequest) {
  const single = req.nextUrl.searchParams.get('targetId');
  const multi = req.nextUrl.searchParams.get('targetIds');

  const session = await getSession();

  if (single) {
    const [count, favorited] = await Promise.all([
      getFavoriteCount(single),
      getFavoriteStatus(single, session?.userId ?? null),
    ]);
    return NextResponse.json({ count, favorited });
  }

  if (multi) {
    const ids = multi.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 100);
    const [countsMap, favoritedSet] = await Promise.all([
      getFavoriteCounts(ids),
      getUserFavoriteStatuses(session?.userId ?? null, ids),
    ]);
    const counts: Record<string, number> = {};
    for (const id of ids) counts[id] = countsMap.get(id) ?? 0;
    return NextResponse.json({
      counts,
      favorited: Array.from(favoritedSet),
    });
  }

  return NextResponse.json({ error: '缺少 targetId 或 targetIds' }, { status: 400 });
}

/** 切换收藏状态（收藏/取消收藏）。 */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  const ip = getClientIp(req);
  const { limited } = await rateLimit(`favorite:${session.userId}:${ip}`, 30, 60_000, {
    fallback: 'memory',
  });
  if (limited) {
    return NextResponse.json({ error: '操作太频繁，稍后再试' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = FavoriteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { favorited, count } = await toggleFavorite(parsed.data.targetId, session.userId);
  return NextResponse.json({ favorited, count });
}
