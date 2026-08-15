import { NextRequest, NextResponse } from 'next/server';
import { getSiteUrl } from '@/lib/constants';
import { buildWechatAuthorizeUrl, isWechatOAuthConfigured } from '@/lib/wechat-oauth';
import { createWechatState } from '@/lib/wechat-bind';

/**
 * 微信扫码登录入口：签发防 CSRF state 后 302 到微信授权页。
 * 未配置开放平台应用时直接回登录页并带上错误标记，避免用户看到一个裸 503。
 */
export async function GET(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get('locale') === 'en' ? 'en' : 'zh';

  if (!isWechatOAuthConfigured()) {
    return NextResponse.redirect(new URL(`/${locale}/login?wechat=unavailable`, getSiteUrl()));
  }

  const state = await createWechatState(locale);
  const redirectUri = `${getSiteUrl()}/api/auth/wechat/callback`;
  return NextResponse.redirect(buildWechatAuthorizeUrl(state, redirectUri));
}
