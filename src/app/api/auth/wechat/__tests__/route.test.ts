import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
vi.mock('@/lib/constants', () => ({ getSiteUrl: () => 'https://www.imagentx.top' }));
vi.mock('@/lib/wechat-oauth', () => ({ isWechatOAuthConfigured: () => true, buildWechatAuthorizeUrl: (state: string, redirectUri: string) => `https://open.weixin.qq.com/connect/qrconnect?state=${state}&redirect_uri=${encodeURIComponent(redirectUri)}` }));
import { GET } from '../route';
import { WECHAT_STATE_COOKIE, consumeWechatState } from '@/lib/wechat-bind';
beforeEach(() => { process.env.JWT_SECRET = 'wechat-entry-test-secret'; vi.stubEnv('NODE_ENV', 'production'); });
afterEach(() => { vi.unstubAllEnvs(); });

it('入口签发高熵短期安全 cookie，state 与规范回调使用同一浏览器事务', async () => {
  const res = await GET(new NextRequest('https://www.imagentx.top/api/auth/wechat?locale=en&next=/apps/ex-memory'));
  const cookie = res.cookies.get(WECHAT_STATE_COOKIE)!;
  expect(cookie.value).toMatch(/^[A-Za-z0-9_-]{43}$/);
  expect(cookie).toMatchObject({ httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 600 });
  const redirect = new URL(res.headers.get('location')!);
  expect(redirect.searchParams.get('redirect_uri')).toBe('https://www.imagentx.top/api/auth/wechat/callback');
  expect(await consumeWechatState(redirect.searchParams.get('state')!, cookie.value)).toEqual({ locale: 'en', next: '/apps/ex-memory' });
  const again = await GET(new NextRequest('https://www.imagentx.top/api/auth/wechat'));
  expect(again.cookies.get(WECHAT_STATE_COOKIE)?.value).not.toBe(cookie.value);
});
it('别名 host 先回规范 origin，再种 host-only cookie，忽略攻击者 Host', async () => {
  const res = await GET(new NextRequest('https://imagentx.top/api/auth/wechat?locale=en', { headers: { 'x-forwarded-host': 'evil.example' } }));
  expect(res.headers.get('location')).toBe('https://www.imagentx.top/api/auth/wechat?locale=en');
  expect(res.cookies.get(WECHAT_STATE_COOKIE)).toBeUndefined();
});
