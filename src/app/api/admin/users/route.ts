import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isAdminEmail, isAdminSession } from '@/lib/admin';
import { logAdminAction } from '@/lib/admin-audit';
import {
  getAdminRoster,
  getAdminUserDetail,
  getUserEmailById,
  listAdminUsers,
  resetUserMfa,
  revokeUserSessions,
  setUserEmailVerified,
  type AdminUserFilter,
} from '@/lib/admin-users';
import { getSession } from '@/lib/auth';
import { assertMatchingOrigin } from '@/lib/csrf';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

const FILTERS = ['all', 'pass', 'pass-expired', 'admin', 'unverified', 'mfa', 'wechat'] as const;

const ActionSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('revoke-sessions'), userId: z.string().min(1).max(100) }),
  z.object({ action: z.literal('reset-mfa'), userId: z.string().min(1).max(100) }),
  z.object({
    action: z.literal('set-email-verified'),
    userId: z.string().min(1).max(100),
    verified: z.boolean(),
  }),
]);

/**
 * 这个接口返回全站账号的邮箱、消费额和授权码明文，一条都不该被缓存。
 * 线上是 nginx 反代，反代层对 /api/* 做统一缓存策略是常见操作——
 * 不显式声明就等着某天被缓存下来。
 */
function privateJson(body: unknown, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

/**
 * 非管理员一律 404：403 等于告诉对方「这里有个后台」。
 * 这条也要 no-store——反代把它缓存下来的话，真正的管理员随后拿到的也是这个 404。
 */
function forbidden() {
  return privateJson({ error: 'Not found' }, { status: 404 });
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || !isAdminSession(session)) return forbidden();

  const params = req.nextUrl.searchParams;

  if (params.get('roster') === '1') {
    return privateJson({ roster: await getAdminRoster() });
  }

  const userId = params.get('userId');
  if (userId) {
    const detail = await getAdminUserDetail(userId);
    if (!detail) return privateJson({ error: '账号不存在' }, { status: 404 });
    return privateJson({ detail });
  }

  const filterParam = params.get('filter');
  const filter = (FILTERS as readonly string[]).includes(filterParam ?? '')
    ? (filterParam as AdminUserFilter)
    : 'all';

  const page = await listAdminUsers({
    query: params.get('q') ?? undefined,
    filter,
    page: Number(params.get('page')) || 1,
    pageSize: Number(params.get('pageSize')) || undefined,
  });
  return privateJson(page);
}

export async function PATCH(req: NextRequest) {
  // CSRF 纵深防御：解除他人两步验证的敏感度不低于 /api/admin/mfa，那边有这道，这里也要有
  const originError = assertMatchingOrigin(req);
  if (originError) return originError;

  const ip = getClientIp(req);
  const { limited } = await rateLimit(`admin-users:ip:${ip}`, 30, 60_000, { fallback: 'memory' });
  if (limited) {
    return NextResponse.json({ error: '请求过于频繁' }, { status: 429 });
  }

  const session = await getSession();
  if (!session || !isAdminSession(session)) return forbidden();

  const parsed = ActionSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: '参数无效' }, { status: 400 });
  }
  const { action, userId } = parsed.data;

  const targetEmail = await getUserEmailById(userId);
  if (!targetEmail) {
    return NextResponse.json({ error: '账号不存在' }, { status: 404 });
  }
  const targetIsSelf = userId === session.userId;

  if (action === 'revoke-sessions') {
    /*
     * 不允许对自己执行。自己要下线走正常登出即可，而从这里点下去的后果是：
     * session 当场失效 → 页面刷新拿到 forbidden() 的 404 → 弹一句「Not found」，
     * 管理员完全不知道是自己把自己踢了。
     */
    if (targetIsSelf) {
      return NextResponse.json(
        { error: '不能在这里下线自己，请直接退出登录' },
        { status: 400 },
      );
    }
    const tokenVersion = await revokeUserSessions(userId);
    if (tokenVersion === null) {
      return NextResponse.json({ error: '账号不存在' }, { status: 404 });
    }
    await logAdminAction(session, {
      action: 'user.revoke-sessions',
      targetType: 'user',
      targetId: userId,
      detail: { email: targetEmail, tokenVersion },
      ip,
    });
    return NextResponse.json({ success: true, tokenVersion });
  }

  if (action === 'reset-mfa') {
    /*
     * 不允许在这里解除自己的两步验证。
     * /admin/mfa 的关闭流程要求出示一个有效 TOTP 码或恢复码；这条接口只认管理员身份，
     * 放开等于给「拿到一个活着的管理员会话」的人开一条免验证关闭 MFA 的近路。
     * 帮别人解锁是运维需要，解自己的没有这个需要。
     */
    if (targetIsSelf) {
      return NextResponse.json(
        { error: '不能在这里解除自己的两步验证，请到「登录保护」页用验证码关闭' },
        { status: 400 },
      );
    }
    const reset = await resetUserMfa(userId);
    if (!reset) {
      return NextResponse.json({ error: '该账号没有开启两步验证' }, { status: 409 });
    }
    await logAdminAction(session, {
      action: 'user.reset-mfa',
      targetType: 'user',
      targetId: userId,
      // 这个动作同时递增了 token_version，留痕里要写明，否则事后看不出会话为何全断
      detail: { email: targetEmail, sessionsRevoked: true },
      ip,
    });
    return NextResponse.json({ success: true });
  }

  const { verified } = parsed.data;
  /*
   * 取消验证会直接剥夺后台权限（isAdminSession 要求 emailVerified），
   * 对管理员执行等于把人锁在门外，而恢复只能改库。
   */
  if (!verified && isAdminEmail(targetEmail)) {
    return NextResponse.json(
      { error: '不能取消管理员账号的邮箱验证，那会让对方进不了后台' },
      { status: 400 },
    );
  }
  const changed = await setUserEmailVerified(userId, verified);
  if (!changed) {
    return NextResponse.json({ error: '状态未变化' }, { status: 409 });
  }
  await logAdminAction(session, {
    action: 'user.set-email-verified',
    targetType: 'user',
    targetId: userId,
    detail: { email: targetEmail, verified },
    ip,
  });
  return NextResponse.json({ success: true });
}
