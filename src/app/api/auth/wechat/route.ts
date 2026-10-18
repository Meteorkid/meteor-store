import { NextRequest, NextResponse } from 'next/server';
import { getSiteUrl } from '@/lib/constants';
import { buildWechatAuthorizeUrl, isWechatOAuthConfigured } from '@/lib/wechat-oauth';
import {
  WECHAT_STATE_COOKIE, WECHAT_BIND_COOKIE, createWechatState, createWechatTransaction,
  wechatTransactionCookieOptions,
} from '@/lib/wechat-bind';
import { normalizeLoginReturn } from '@/lib/login-return';

/**
 * 微信扫码登录入口：签发防 CSRF state 后 302 到微信授权页。
 * 未配置开放平台应用时直接回登录页并带上错误标记，避免用户看到一个裸 503。
 */
export async function GET(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get('locale') === 'en' ? 'en' : 'zh';
  const next = normalizeLoginReturn(req.nextUrl.searchParams.get('next'));
  const nextParam = next === '/' ? '' : `&next=${encodeURIComponent(next)}`;

  if (!isWechatOAuthConfigured()) {
    return NextResponse.redirect(new URL(`/${locale}/login?wechat=unavailable${nextParam}`, getSiteUrl()));
  }

  // 先在规范 origin 落 cookie，避免 apex 发起、www 回调时丢失 host-only 事务。
  if (req.nextUrl.origin !== new URL(getSiteUrl()).origin) {
    return NextResponse.redirect(new URL(`${req.nextUrl.pathname}${req.nextUrl.search}`, getSiteUrl()));
  }
  const transaction = createWechatTransaction();
  const state = await createWechatState(locale, next, transaction);
  const redirectUri = `${getSiteUrl()}/api/auth/wechat/callback`;
  const res = NextResponse.redirect(buildWechatAuthorizeUrl(state, redirectUri));
  res.cookies.set(WECHAT_STATE_COOKIE, transaction, wechatTransactionCookieOptions('state'));
  res.cookies.set(WECHAT_BIND_COOKIE, '', { ...wechatTransactionCookieOptions('bind'), maxAge: 0 });
  return res;
}
