import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { heartbeat } from '@/lib/online-presence';

const HeartbeatSchema = z.object({
  visitorId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { limited } = await rateLimit(`online-heartbeat:${ip}`, 30, 60_000, {
    fallback: 'memory',
  });
  if (limited) {
    return NextResponse.json({ error: '操作太频繁了，稍后再试' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = HeartbeatSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  // Redis 挂了 heartbeat 内部已静默降级，这里照样返回成功
  await heartbeat(parsed.data.visitorId);
  return NextResponse.json({ ok: true });
}
