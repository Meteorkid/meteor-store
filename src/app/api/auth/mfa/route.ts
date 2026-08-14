import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { createSession } from '@/lib/auth';
import { readMfaChallengeTicket, verifyUserTotpOrRecoveryCode } from '@/lib/admin-mfa';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { assertMatchingOrigin } from '@/lib/csrf';

/**
 * MFA 登录挑战验证。
 *
 * 登录接口验密通过后签发 5 分钟挑战 ticket（不设 cookie、不落 session），
 * 这里验证 TOTP 动态码或恢复码后才签发正式 session。
 *
 * 安全取舍：
 * - ticket 校验通过后**重新读库**核对 tokenVersion / emailVerified / totpEnabled——
 *   挑战窗口内改密或关闭 MFA 必须立即生效，不能凭 ticket 里的快照放行
 * - 恢复码验证成功即消耗（一次性）
 * - 限流 failClosed：这是登录链路的一部分，与 login 接口同一标准
 */
export async function POST(req: NextRequest) {
  const forbidden = assertMatchingOrigin(req);
  if (forbidden) return forbidden;

  const ip = getClientIp(req);
  const { limited } = await rateLimit(`mfa-verify:ip:${ip}`, 10, 60_000, {
    failClosed: true,
  });
  if (limited) {
    return NextResponse.json({ error: '验证尝试过于频繁，请稍后再试' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const ticket = typeof body?.mfaTicket === 'string' ? body.mfaTicket : '';
  const code = typeof body?.code === 'string' ? body.code.trim() : '';
  const locale = body?.locale === 'en' ? 'en' : 'zh';

  if (!ticket || !code) {
    return NextResponse.json({ error: '参数无效' }, { status: 400 });
  }

  const challenge = await readMfaChallengeTicket(ticket);
  if (!challenge) {
    return NextResponse.json(
      { error: locale === 'en' ? 'Verification expired, please log in again' : '验证已过期，请重新登录', code: 'MFA_TICKET_INVALID' },
      { status: 401 },
    );
  }

  // 快照可能过时：以数据库当前状态为准
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      tokenVersion: users.tokenVersion,
      emailVerified: users.emailVerified,
      totpEnabled: users.totpEnabled,
    })
    .from(users)
    .where(eq(users.id, challenge.userId))
    .limit(1);

  if (
    !user ||
    user.email !== challenge.email ||
    user.tokenVersion !== challenge.tokenVersion ||
    !user.emailVerified
  ) {
    return NextResponse.json(
      { error: locale === 'en' ? 'Verification expired, please log in again' : '验证已过期，请重新登录', code: 'MFA_TICKET_INVALID' },
      { status: 401 },
    );
  }

  if (!user.totpEnabled) {
    // 挑战窗口内 MFA 被关闭：直接放行签发 session（密码已验证过）
    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name ?? undefined,
      tokenVersion: user.tokenVersion,
      emailVerified: true,
    });
    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
    });
  }

  const ok = await verifyUserTotpOrRecoveryCode(user.id, code);
  if (!ok) {
    return NextResponse.json(
      { error: locale === 'en' ? 'Incorrect verification code' : '验证码不正确' },
      { status: 401 },
    );
  }

  await createSession({
    userId: user.id,
    email: user.email,
    name: user.name ?? undefined,
    tokenVersion: user.tokenVersion,
    emailVerified: true,
  });

  return NextResponse.json({
    success: true,
    user: { id: user.id, email: user.email, name: user.name },
  });
}
