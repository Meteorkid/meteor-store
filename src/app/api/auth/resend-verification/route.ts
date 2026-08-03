import { NextRequest, NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import {
  createEmailVerificationToken,
  readEmailVerificationResendTicket,
} from '@/lib/email-verification';
import { sendEmailVerification } from '@/lib/email';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const byIp = await rateLimit(`verification-resend:ip:${ip}`, 20, 60 * 60_000, {
    failClosed: true,
  });
  if (byIp.limited) {
    return NextResponse.json({ error: '请求过于频繁，请稍后再试' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const ticket = typeof body?.resendTicket === 'string' ? body.resendTicket : '';
  const identity = ticket ? await readEmailVerificationResendTicket(ticket) : null;
  if (!identity) {
    return NextResponse.json({ error: '重发凭证无效或已过期' }, { status: 400 });
  }

  const byUser = await rateLimit(
    `verification-resend:user:${identity.userId}`,
    3,
    15 * 60_000,
    { failClosed: true },
  );
  if (byUser.limited) {
    return NextResponse.json({ error: '发送过于频繁，请稍后再试' }, { status: 429 });
  }

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      emailVerified: users.emailVerified,
    })
    .from(users)
    .where(and(eq(users.id, identity.userId), eq(users.email, identity.email)))
    .limit(1);

  if (!user || user.emailVerified) {
    return NextResponse.json({ success: true });
  }

  const token = await createEmailVerificationToken({ userId: user.id, email: user.email });
  try {
    await sendEmailVerification({ email: user.email, token, locale: identity.locale });
  } catch {
    console.error('Verification email resend failed', { userId: user.id });
    return NextResponse.json({ error: '验证邮件发送失败，请稍后重试' }, { status: 503 });
  }

  return NextResponse.json({ success: true });
}
