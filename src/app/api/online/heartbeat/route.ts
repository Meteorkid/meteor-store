import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { heartbeat } from '@/lib/online-presence';

const HeartbeatSchema = z.object({
  visitorId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  // 在线心跳只用于展示人数，不值得为它写 Redis；单实例进程内限流即可。
  const { limited } = await rateLimit(`online-heartbeat:${ip}`, 30, 60_000, {
    store: 'memory',
  });
  if (limited) {
    return NextResponse.json({ error: '操作太频繁了，稍后再试' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = HeartbeatSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  // 在线人数是进程内 Map，不依赖 Redis，这里直接记录即可
  await heartbeat(parsed.data.visitorId);
  return NextResponse.json({ ok: true });
}
