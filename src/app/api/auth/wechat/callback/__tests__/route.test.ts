import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const createSession = vi.fn();
vi.mock('@/lib/auth', () => ({ createSession: (...a: unknown[]) => createSession(...a) }));
vi.mock('@/lib/constants', () => ({ getSiteUrl: () => 'https://www.imagentx.top' }));
vi.mock('@/lib/wechat-oauth', () => ({ exchangeWechatCode: vi.fn(), fetchWechatUserInfo: vi.fn().mockResolvedValue({ nickname: '流星' }) }));
const dbSelect = vi.fn();
const dbUpdate = vi.fn();
vi.mock('@/lib/db', () => ({ db: { select: (...a: unknown[]) => dbSelect(...a), update: (...a: unknown[]) => dbUpdate(...a) } }));

import { GET } from '../route';
import { TRUSTED_DEVICE_COOKIE, createTrustedDeviceToken } from '@/lib/trusted-device';
import { MFA_CHALLENGE_COOKIE } from '@/lib/admin-mfa';
import { WECHAT_STATE_COOKIE, WECHAT_BIND_COOKIE, createWechatState, readWechatBindToken } from '@/lib/wechat-bind';
import { exchangeWechatCode } from '@/lib/wechat-oauth';

function mockUser(row: Record<string, unknown> | null) {
  dbSelect.mockReturnValue({ from: vi.fn().mockReturnThis(), where: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue(row ? [row] : []) }) });
  dbUpdate.mockReturnValue({ set: vi.fn().mockReturnThis(), where: vi.fn().mockResolvedValue(undefined) });
}
const BASE = { id: 'U1', email: 'admin@example.com', name: '站主', emailVerified: true, tokenVersion: 2, wechatUnionid: 'UNIONID1' };
const transaction = 'A'.repeat(43);

async function request(next = '/', cookie?: string) {
  const state = await createWechatState('zh', next, transaction);
  const req = new NextRequest(`https://www.imagentx.top/api/auth/wechat/callback?code=C&state=${state}`);
  req.cookies.set(WECHAT_STATE_COOKIE, transaction);
  if (cookie) req.cookies.set(...(cookie.split('=') as [string, string]));
  return req;
}

beforeEach(() => {
  process.env.JWT_SECRET = 'jwt-secret-for-tests-0123456789ab';
  vi.clearAllMocks();
  vi.mocked(exchangeWechatCode).mockResolvedValue({ data: { openid: 'OPENID1', unionid: 'UNIONID1', accessToken: 'AT' }, error: null });
  mockUser({ ...BASE, totpEnabled: false });
});
afterEach(() => { vi.unstubAllEnvs(); });

describe('微信扫码回调的事务与 MFA 门控', () => {
  it.each(['missing', 'mismatch'])('转发签名 state 时 %s 事务 cookie，在 code 兑换前拒绝', async (kind) => {
    const req = await request();
    if (kind === 'missing') req.cookies.delete(WECHAT_STATE_COOKIE);
    else req.cookies.set(WECHAT_STATE_COOKIE, 'B'.repeat(43));
    const res = await GET(req);
    expect(res.headers.get('location')).toContain('wechat=invalid');
    expect(exchangeWechatCode).not.toHaveBeenCalled();
    expect(dbSelect).not.toHaveBeenCalled();
    expect(createSession).not.toHaveBeenCalled();
  });
  it('code 缺失不消费当前事务，兑换暂时失败保留重试机会', async () => {
    const req = await request();
    req.nextUrl.searchParams.delete('code');
    const invalid = await GET(req);
    expect(invalid.headers.get('location')).toContain('wechat=invalid');
    expect(exchangeWechatCode).not.toHaveBeenCalled();
    vi.mocked(exchangeWechatCode).mockResolvedValue({ data: null, error: 'unavailable' });
    const failed = await GET(await request());
    expect(failed.headers.get('location')).toContain('wechat=error');
    expect(failed.cookies.get(WECHAT_STATE_COOKIE)).toBeUndefined();
  });
  it('开了两步验证且非受信任设备：只发挑战 cookie，清理已消费 OAuth cookie', async () => {
    mockUser({ ...BASE, totpEnabled: true });
    const res = await GET(await request('/apps/ex-memory'));
    expect(createSession).not.toHaveBeenCalled();
    expect(res.headers.get('location')).toContain('/zh/login?mfa=1&next=');
    expect(res.cookies.get(MFA_CHALLENGE_COOKIE)?.value).toBeTruthy();
    expect(res.headers.get('location')).not.toContain('mfaTicket');
    expect(res.cookies.get(WECHAT_STATE_COOKIE)?.value).toBe('');
  });
  it('受信任设备免挑战；旧 tokenVersion 设备仍需挑战', async () => {
    mockUser({ ...BASE, totpEnabled: true });
    const trusted = await createTrustedDeviceToken('U1', 2);
    const res = await GET(await request('/', `${TRUSTED_DEVICE_COOKIE}=${trusted}`));
    expect(createSession).toHaveBeenCalledOnce();
    expect(res.headers.get('location')).toContain('/zh/account?wechat=linked');
    createSession.mockClear();
    const stale = await createTrustedDeviceToken('U1', 1);
    expect((await GET(await request('/', `${TRUSTED_DEVICE_COOKIE}=${stale}`))).headers.get('location')).toContain('mfa=1');
    expect(createSession).not.toHaveBeenCalled();
  });
  it('未开 MFA 的已验证用户正常登录并保留白名单回跳', async () => {
    const res = await GET(await request('/apps/ex-memory'));
    expect(createSession).toHaveBeenCalledOnce();
    expect(res.headers.get('location')).toBe('https://www.imagentx.top/zh/apps/ex-memory');
    expect(res.cookies.get(WECHAT_STATE_COOKIE)?.value).toBe('');
  });
  it('未验证邮箱仍拒绝正式会话', async () => {
    mockUser({ ...BASE, emailVerified: false });
    const res = await GET(await request());
    expect(res.headers.get('location')).toContain('wechat=unverified');
    expect(createSession).not.toHaveBeenCalled();
  });
  it('新 openid 下发独立的绑定事务 cookie，URL 只能在该浏览器消费', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    mockUser(null);
    const res = await GET(await request());
    const token = new URL(res.headers.get('location')!).searchParams.get('token')!;
    const bindCookie = res.cookies.get(WECHAT_BIND_COOKIE)!;
    expect(bindCookie.value).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(bindCookie.value).not.toBe(transaction);
    expect(bindCookie).toMatchObject({ httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 900 });
    expect(await readWechatBindToken(token, bindCookie.value)).toMatchObject({ openid: 'OPENID1' });
    expect(await readWechatBindToken(token, transaction)).toBeNull();
    expect(await readWechatBindToken(token)).toBeNull();
    expect(res.cookies.get(WECHAT_STATE_COOKIE)?.value).toBe('');
  });
});
