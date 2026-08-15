import { NextRequest, NextResponse } from 'next/server';
import { compare, hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { createSession } from '@/lib/auth';
import { readWechatBindToken } from '@/lib/wechat-bind';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { assertMatchingOrigin } from '@/lib/csrf';
import {
  createEmailVerificationResendTicket,
  createEmailVerificationToken,
} from '@/lib/email-verification';
import { isEmailDeliveryConfigured, sendEmailVerification } from '@/lib/email';
import { isAdminEmail } from '@/lib/admin';
import { verifyUserTotpOrRecoveryCode } from '@/lib/admin-mfa';

/** 邮箱不存在时消耗等量时间的假哈希，避免用响应快慢枚举账号（与 login 一致）。 */
let dummyHash: Promise<string> | null = null;
function getDummyHash(): Promise<string> {
  dummyHash ??= hash(`${Date.now()}-${Math.random()}`, 12);
  return dummyHash;
}

function isUniqueViolation(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return message.includes('unique') || message.includes('duplicate') || message.includes('23505');
}

/**
 * 微信绑定：mode=login 绑定已有账号（邮箱+密码，MFA 开启时需动态码）；
 * mode=register 用微信资料 + 邮箱注册新账号（随机密码占位，走现有邮箱验证，
 * 验证完成后重新扫码即登录——沿用「验证成功不自动登录」的既定安全边界）。
 */
export async function POST(req: NextRequest) {
  const forbidden = assertMatchingOrigin(req);
  if (forbidden) return forbidden;

  const ip = getClientIp(req);
  const { limited } = await rateLimit(`wechat-bind:ip:${ip}`, 10, 900_000, { failClosed: true });
  if (limited) {
    return NextResponse.json({ error: '操作过于频繁，请稍后再试' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const token = typeof body?.token === 'string' ? body.token : '';
  const mode = body?.mode === 'register' ? 'register' : 'login';
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  const name = typeof body?.name === 'string' ? body.name.trim().slice(0, 30) : undefined;
  const mfaCode = typeof body?.mfaCode === 'string' ? body.mfaCode.trim() : '';
  const locale = body?.locale === 'en' ? 'en' : 'zh';

  const identity = token ? await readWechatBindToken(token) : null;
  if (!identity) {
    return NextResponse.json({ error: '绑定凭证无效或已过期，请重新扫码' }, { status: 400 });
  }

  const [bound] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.wechatOpenid, identity.openid))
    .limit(1);
  if (bound) {
    return NextResponse.json({ error: '该微信已绑定账号，请直接扫码登录' }, { status: 409 });
  }

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: '请输入有效的邮箱地址' }, { status: 400 });
  }

  if (mode === 'login') {
    if (!password) {
      return NextResponse.json({ error: '请输入密码' }, { status: 400 });
    }

    const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = rows[0];
    const passwordMatches = await compare(password, user?.passwordHash ?? (await getDummyHash()));

    if (!user || !passwordMatches) {
      return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 });
    }
    if (!user.emailVerified) {
      return NextResponse.json({ error: '请先验证邮箱', code: 'EMAIL_UNVERIFIED' }, { status: 403 });
    }
    // MFA 开启时绑定新登录方式必须走完整验证：动态码通过后才会绑定并签会话
    if (user.totpEnabled) {
      if (!mfaCode) {
        return NextResponse.json(
          { error: '请输入两步验证码', code: 'MFA_REQUIRED' },
          { status: 403 },
        );
      }
      const ok = await verifyUserTotpOrRecoveryCode(user.id, mfaCode);
      if (!ok) {
        return NextResponse.json({ error: '验证码不正确' }, { status: 401 });
      }
    }

    try {
      await db
        .update(users)
        .set({ wechatOpenid: identity.openid, wechatUnionid: identity.unionid ?? null })
        .where(eq(users.id, user.id));
    } catch (err) {
      if (isUniqueViolation(err)) {
        return NextResponse.json({ error: '该微信已绑定其他账号' }, { status: 409 });
      }
      throw err;
    }

    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name ?? undefined,
      tokenVersion: user.tokenVersion,
      emailVerified: true,
    });

    return NextResponse.json({ success: true, mode: 'login' });
  }

  // mode=register：新账号，微信资料回填昵称，密码用随机哈希占位
  if (isAdminEmail(email)) {
    return NextResponse.json({ error: '该邮箱不能通过公开入口注册，请联系管理员' }, { status: 403 });
  }
  if (!isEmailDeliveryConfigured()) {
    return NextResponse.json({ error: '邮箱验证服务暂不可用' }, { status: 503 });
  }

  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing) {
    return NextResponse.json({ error: '该邮箱已注册，请改用「绑定已有账号」' }, { status: 409 });
  }

  const id = `U${Date.now()}${Math.random().toString(36).slice(2, 6)}`;
  const [verificationToken, resendTicket, placeholderHash] = await Promise.all([
    createEmailVerificationToken({ userId: id, email }),
    createEmailVerificationResendTicket({ userId: id, email, locale }),
    hash(`${Date.now()}-${Math.random()}`, 12),
  ]);

  try {
    await db.insert(users).values({
      id,
      email,
      passwordHash: placeholderHash,
      name: name || identity.nickname || null,
      wechatOpenid: identity.openid,
      wechatUnionid: identity.unionid ?? null,
      emailVerified: false,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    if (isUniqueViolation(err)) {
      return NextResponse.json({ error: '该邮箱或微信已注册，请重新扫码后改用「绑定已有账号」' }, { status: 409 });
    }
    throw err;
  }

  let emailSent = true;
  try {
    await sendEmailVerification({ email, token: verificationToken, locale });
  } catch {
    emailSent = false;
    console.error('Wechat bind registration: verification email send failed', { userId: id });
  }

  return NextResponse.json(
    { success: true, mode: 'register', verificationRequired: true, emailSent, resendTicket },
    { status: 201 },
  );
}
