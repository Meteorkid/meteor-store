import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { createSession } from '@/lib/auth';
import { getSiteUrl } from '@/lib/constants';
import { consumeWechatState, createWechatBindToken } from '@/lib/wechat-bind';
import {
  MFA_CHALLENGE_COOKIE,
  createMfaChallengeTicket,
  mfaChallengeCookieOptions,
} from '@/lib/admin-mfa';
import { TRUSTED_DEVICE_COOKIE, isTrustedDeviceToken } from '@/lib/trusted-device';
import { exchangeWechatCode, fetchWechatUserInfo } from '@/lib/wechat-oauth';

function redirectTo(path: string) {
  return NextResponse.redirect(new URL(path, getSiteUrl()));
}

/**
 * 微信授权回调：
 * - state 无效 / code 缺失 → 回登录页
 * - openid 已绑定且邮箱已验证 → 签发 session（同时补记 unionid）；
 *   若该账号开了两步验证且当前不是受信任设备，先走 MFA 挑战再签发
 * - openid 已绑定但邮箱未验证 → 回登录页提示先验证邮箱（不自动签发 resend 凭证）
 * - openid 未绑定 → 签发短期绑定凭证，跳绑定页
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');

  const locale = state ? await consumeWechatState(state) : null;
  if (!code || !locale) {
    return redirectTo('/zh/login?wechat=invalid');
  }

  const { data, error } = await exchangeWechatCode(code);
  if (!data) {
    console.error('Wechat OAuth code exchange failed', { error });
    return redirectTo(`/${locale}/login?wechat=error`);
  }

  const [existing] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      emailVerified: users.emailVerified,
      tokenVersion: users.tokenVersion,
      totpEnabled: users.totpEnabled,
      wechatUnionid: users.wechatUnionid,
    })
    .from(users)
    .where(eq(users.wechatOpenid, data.openid))
    .limit(1);

  if (existing) {
    if (data.unionid && !existing.wechatUnionid) {
      await db
        .update(users)
        .set({ wechatUnionid: data.unionid })
        .where(eq(users.id, existing.id));
    }
    if (!existing.emailVerified) {
      return redirectTo(`/${locale}/login?wechat=unverified`);
    }

    // 扫码登录必须和密码登录受同一道 MFA 约束。少了这一步，凡是绑过微信的账号
    // 都可以绕开两步验证直接拿到 session——两步验证对它形同虚设。
    // 受信任设备（30 天内在本浏览器过过一次动态码）才免挑战。
    if (
      existing.totpEnabled &&
      !(await isTrustedDeviceToken(
        req.cookies.get(TRUSTED_DEVICE_COOKIE)?.value,
        existing.id,
        existing.tokenVersion,
      ))
    ) {
      const ticket = await createMfaChallengeTicket({
        userId: existing.id,
        email: existing.email,
        name: existing.name ?? undefined,
        tokenVersion: existing.tokenVersion,
      });
      const res = redirectTo(`/${locale}/login?mfa=1`);
      res.cookies.set(MFA_CHALLENGE_COOKIE, ticket, mfaChallengeCookieOptions());
      return res;
    }

    await createSession({
      userId: existing.id,
      email: existing.email,
      name: existing.name ?? undefined,
      emailVerified: true,
      tokenVersion: existing.tokenVersion,
    });
    return redirectTo(`/${locale}/account?wechat=linked`);
  }

  const info = await fetchWechatUserInfo(data.accessToken, data.openid);
  const bindToken = await createWechatBindToken({
    openid: data.openid,
    unionid: data.unionid,
    nickname: info?.nickname,
  });
  return redirectTo(`/${locale}/wechat-bind?token=${encodeURIComponent(bindToken)}`);
}
