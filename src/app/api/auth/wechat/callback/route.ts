import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { createSession } from '@/lib/auth';
import { getSiteUrl } from '@/lib/constants';
import { consumeWechatState, createWechatBindToken } from '@/lib/wechat-bind';
import { exchangeWechatCode, fetchWechatUserInfo } from '@/lib/wechat-oauth';

function redirectTo(path: string) {
  return NextResponse.redirect(new URL(path, getSiteUrl()));
}

/**
 * 微信授权回调：
 * - state 无效 / code 缺失 → 回登录页
 * - openid 已绑定且邮箱已验证 → 直接签发 session（同时补记 unionid）
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
      emailVerified: users.emailVerified,
      tokenVersion: users.tokenVersion,
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
    await createSession({
      userId: existing.id,
      email: existing.email,
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
