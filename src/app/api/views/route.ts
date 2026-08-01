import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { recordView, getViewCount } from '@/lib/views-likes';

const ViewSchema = z.object({
  targetId: z.string().min(1).max(200),
});

export async function GET(req: NextRequest) {
  const targetId = req.nextUrl.searchParams.get('targetId');
  if (!targetId) {
    return NextResponse.json({ error: '缺少 targetId' }, { status: 400 });
  }

  const count = await getViewCount(targetId);
  return NextResponse.json({ count });
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { limited } = await rateLimit(`view:${ip}`, 30, 60_000, {
    fallback: 'memory',
  });
  if (limited) {
    return NextResponse.json({ error: '操作太频繁了，稍后再试' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = ViewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  await recordView(parsed.data.targetId, ip);
  return NextResponse.json({ success: true });
}