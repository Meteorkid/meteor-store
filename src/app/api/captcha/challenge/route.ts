import { NextRequest, NextResponse } from 'next/server';
import { createCaptchaChallenge } from '@/lib/captcha';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { limited } = await rateLimit(`captcha:ip:${ip}`, 20, 60_000, { fallback: 'memory' });
  if (limited) {
    return NextResponse.json({ error: '请求过于频繁' }, { status: 429 });
  }

  const challenge = await createCaptchaChallenge();
  return NextResponse.json(challenge);
}
