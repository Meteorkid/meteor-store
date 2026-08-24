import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { listPathfinderFollows, togglePathfinderFollow } from '@/lib/pathfinder/saves';

const FollowSchema = z.object({
  kind: z.enum(['organization', 'topic']),
  value: z.string().min(1).max(120),
});

/** 当前用户关注的机构与主题。未登录返回空列表而不是 401：入口按钮要能正常渲染。 */
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ organization: [], topic: [] });
  return NextResponse.json(await listPathfinderFollows(session.userId));
}

/** 切换关注。 */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: '请先登录' }, { status: 401 });

  const ip = getClientIp(req);
  const { limited } = await rateLimit(`pathfinder-follow:${session.userId}:${ip}`, 30, 60_000, {
    fallback: 'memory',
  });
  if (limited) return NextResponse.json({ error: '操作太频繁，稍后再试' }, { status: 429 });

  const parsed = FollowSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const result = await togglePathfinderFollow(
    session.userId,
    parsed.data.kind,
    parsed.data.value,
  );
  return NextResponse.json(result);
}
