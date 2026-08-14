import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { isAdminSession } from '@/lib/admin';
import { logAdminAction } from '@/lib/admin-audit';
import {
  disableTotp,
  enableTotp,
  getUserTotpState,
  setupTotp,
} from '@/lib/admin-mfa';
import { otpauthUrl } from '@/lib/totp';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { assertMatchingOrigin } from '@/lib/csrf';

function forbidden() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

const ActionSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('setup') }),
  z.object({
    action: z.literal('enable'),
    code: z.string().regex(/^\d{6}$/),
  }),
  z.object({
    action: z.literal('disable'),
    code: z.string().min(8).max(12),
  }),
]);

export async function GET() {
  const session = await getSession();
  if (!session || !isAdminSession(session)) return forbidden();

  const state = await getUserTotpState(session.userId);
  return NextResponse.json(state);
}

export async function POST(req: NextRequest) {
  // CSRF 纵深防御：写接口必须来自本站 Origin
  const originError = assertMatchingOrigin(req);
  if (originError) return originError;

  const ip = getClientIp(req);
  const { limited } = await rateLimit(`admin-mfa:ip:${ip}`, 10, 60_000, {
    failClosed: true,
  });
  if (limited) {
    return NextResponse.json({ error: '请求过于频繁' }, { status: 429 });
  }

  const session = await getSession();
  if (!session || !isAdminSession(session)) return forbidden();

  const parsed = ActionSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: '参数无效' }, { status: 400 });
  }

  if (parsed.data.action === 'setup') {
    const state = await getUserTotpState(session.userId);
    if (state.enabled) {
      return NextResponse.json({ error: 'MFA 已启用，请先关闭' }, { status: 409 });
    }
    const secret = await setupTotp(session.userId);
    return NextResponse.json({
      secret,
      otpauthUrl: otpauthUrl(secret, session.email),
    });
  }

  if (parsed.data.action === 'enable') {
    const result = await enableTotp(session.userId, parsed.data.code);
    if (!result) {
      return NextResponse.json({ error: '验证码不正确或 MFA 状态已变化' }, { status: 400 });
    }
    await logAdminAction(session, {
      action: 'mfa.enable',
      targetType: 'user',
      targetId: session.userId,
      ip,
    });
    // 恢复码明文仅此一次返回
    return NextResponse.json({ recoveryCodes: result.recoveryCodes });
  }

  const ok = await disableTotp(session.userId, parsed.data.code);
  if (!ok) {
    return NextResponse.json({ error: '验证码或恢复码不正确' }, { status: 400 });
  }
  await logAdminAction(session, {
    action: 'mfa.disable',
    targetType: 'user',
    targetId: session.userId,
    ip,
  });
  return NextResponse.json({ success: true });
}
