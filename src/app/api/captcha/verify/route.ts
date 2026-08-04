import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createCaptchaProof, verifyCaptchaChallenge } from '@/lib/captcha';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

const VerifySchema = z.object({
  token: z.string().uuid(),
  x: z.number().finite().min(0).max(300),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { limited } = await rateLimit(`captcha:verify:${ip}`, 30, 60_000, {
    fallback: 'memory',
  });
  if (limited) {
    return NextResponse.json({ error: '请求过于频繁' }, { status: 429 });
  }

  const parsed = VerifySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: '人机验证失败' }, { status: 400 });
  }

  if (!(await verifyCaptchaChallenge(parsed.data.token, parsed.data.x))) {
    return NextResponse.json({ error: '人机验证失败' }, { status: 400 });
  }

  return NextResponse.json({ proof: await createCaptchaProof() });
}
