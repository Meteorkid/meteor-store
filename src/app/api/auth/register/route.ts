import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { verifyCaptcha } from '@/lib/captcha';
import { isAdminEmail } from '@/lib/admin';
import {
  createEmailVerificationResendTicket,
  createEmailVerificationToken,
} from '@/lib/email-verification';
import { isEmailDeliveryConfigured, sendEmailVerification } from '@/lib/email';
import { assertMatchingOrigin } from '@/lib/csrf';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  // CSRF 纵深防御：写接口必须来自本站 Origin
  const forbidden = assertMatchingOrigin(req);
  if (forbidden) return forbidden;

  // 每次注册要跑一次 bcrypt cost 12（约 250ms CPU），不限流既能批量灌垃圾账号，
  // 也能靠并发注册把 serverless 的执行时间账单打上去。failClosed 同 login。
  const ip = getClientIp(req);
  const { limited } = await rateLimit(`register:ip:${ip}`, 5, 3_600_000, { failClosed: true });
  if (limited) {
    return NextResponse.json({ error: '注册过于频繁，请稍后再试' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  const name = typeof body?.name === 'string' ? body.name.trim() : undefined;
  const locale = body?.locale === 'en' ? 'en' : 'zh';

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: '请输入有效的邮箱地址' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: '密码至少 8 位' }, { status: 400 });
  }

  const captchaToken = typeof body?.captchaToken === 'string' ? body.captchaToken : '';

  if (!captchaToken) {
    return NextResponse.json({ error: '请完成人机验证' }, { status: 400 });
  }

  const captchaValid = await verifyCaptcha(captchaToken);
  if (!captchaValid) {
    return NextResponse.json({ error: '人机验证失败，请重试' }, { status: 400 });
  }

  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing.length > 0) {
    return NextResponse.json({ error: '该邮箱已注册' }, { status: 409 });
  }

  if (isAdminEmail(email)) {
    return NextResponse.json(
      { error: '该邮箱不能通过公开入口注册，请联系管理员' },
      { status: 403 },
    );
  }

  if (!isEmailDeliveryConfigured()) {
    return NextResponse.json({ error: '邮箱验证服务暂不可用' }, { status: 503 });
  }

  const id = `U${Date.now()}${Math.random().toString(36).slice(2, 6)}`;
  const identity = { userId: id, email };
  const [verificationToken, resendTicket] = await Promise.all([
    createEmailVerificationToken(identity),
    createEmailVerificationResendTicket({ ...identity, locale }),
  ]);
  const passwordHash = await hash(password, 12);

  await db.insert(users).values({
    id,
    email,
    passwordHash,
    name: name || null,
    emailVerified: false,
    createdAt: new Date().toISOString(),
  });

  let emailSent = true;
  try {
    await sendEmailVerification({ email, token: verificationToken, locale });
  } catch {
    emailSent = false;
    console.error('Verification email send failed after registration', { userId: id });
  }

  return NextResponse.json(
    {
      success: true,
      verificationRequired: true,
      emailSent,
      resendTicket,
    },
    { status: 201 },
  );
}
