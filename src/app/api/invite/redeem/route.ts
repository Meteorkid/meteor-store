import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { redeemInviteCode } from '@/lib/invite';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { limited } = await rateLimit(`redeem:ip:${ip}`, 10, 60_000, { fallback: 'memory' });
  if (limited) {
    return NextResponse.json({ error: '请求过于频繁，请稍后再试' }, { status: 429 });
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const code = typeof body?.code === 'string' ? body.code.trim() : '';

  if (!code) {
    return NextResponse.json({ error: '请输入邀请码' }, { status: 400 });
  }

  const result = await redeemInviteCode(code, session.userId, session.email);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    licenseKey: result.licenseKey,
    productId: result.productId,
    planName: result.planName,
  });
}
