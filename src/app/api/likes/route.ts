import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { toggleLike, getLikeCount, getLikeStatus } from '@/lib/views-likes';

const LikeSchema = z.object({
  targetId: z.string().min(1).max(200),
});

export async function GET(req: NextRequest) {
  const targetId = req.nextUrl.searchParams.get('targetId');
  if (!targetId) {
    return NextResponse.json({ error: '缺少 targetId' }, { status: 400 });
  }

  const session = await getSession();
  const count = await getLikeCount(targetId);
  let liked = false;

  if (session) {
    liked = await getLikeStatus(targetId, session.userId);
  }

  return NextResponse.json({ count, liked });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  const ip = getClientIp(req);
  const { limited } = await rateLimit(`like:${session.userId}:${ip}`, 30, 60_000, {
    fallback: 'memory',
  });
  if (limited) {
    return NextResponse.json({ error: '操作太频繁了，稍后再试' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = LikeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { liked, count } = await toggleLike(parsed.data.targetId, session.userId);

  return NextResponse.json({ liked, count });
}