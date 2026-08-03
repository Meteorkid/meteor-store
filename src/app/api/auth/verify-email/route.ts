import { NextRequest, NextResponse } from 'next/server';
import { verifyEmailAddress } from '@/lib/email-verification';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { limited } = await rateLimit(`verify-email:ip:${ip}`, 10, 15 * 60_000, {
    failClosed: true,
  });
  if (limited) {
    return NextResponse.json({ error: '请求过于频繁，请稍后再试' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const token = typeof body?.token === 'string' ? body.token : '';
  if (!token || !(await verifyEmailAddress(token))) {
    return NextResponse.json({ error: '验证链接无效或已过期' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
