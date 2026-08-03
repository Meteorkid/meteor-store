import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { isEmailDeliveryConfigured, sendPasswordReset } from '@/lib/email';
import { createPasswordResetToken } from '@/lib/password-reset';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

const RequestSchema = z.object({
  email: z.string().trim().email().max(254),
  locale: z.enum(['zh', 'en']).default('zh'),
});

const successResponse = () => NextResponse.json({ success: true });

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const byIp = await rateLimit(`password-reset-request:ip:${ip}`, 20, 60 * 60_000, {
    failClosed: true,
  });
  if (byIp.limited) {
    return NextResponse.json({ error: '请求过于频繁，请稍后再试' }, { status: 429 });
  }

  const parsed = RequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: '邮箱格式无效' }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const byEmail = await rateLimit(
    `password-reset-request:email:${email}`,
    3,
    15 * 60_000,
    { failClosed: true },
  );
  if (byEmail.limited) {
    return NextResponse.json({ error: '请求过于频繁，请稍后再试' }, { status: 429 });
  }

  if (!isEmailDeliveryConfigured()) return successResponse();

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      emailVerified: users.emailVerified,
      tokenVersion: users.tokenVersion,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user?.emailVerified) return successResponse();

  const token = await createPasswordResetToken({
    userId: user.id,
    email: user.email,
    tokenVersion: user.tokenVersion,
  });
  try {
    await sendPasswordReset({
      email: user.email,
      token,
      locale: parsed.data.locale,
    });
  } catch (error) {
    console.error('Password reset email failed', { userId: user.id, error });
  }

  return successResponse();
}
