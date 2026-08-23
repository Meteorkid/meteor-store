import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

/**
 * 回归测试：微信扫码登录必须和密码登录受同一道 MFA 约束。
 *
 * 曾经这条路径直接 createSession，导致凡是绑过微信的账号都能绕开两步验证——
 * 而首次绑定路径（wechat/bind）是检查的，两边不一致最容易漏。
 */

const createSession = vi.fn();
vi.mock('@/lib/auth', () => ({ createSession: (...a: unknown[]) => createSession(...a) }));

vi.mock('@/lib/constants', () => ({ getSiteUrl: () => 'https://www.imagentx.top' }));

vi.mock('@/lib/wechat-oauth', () => ({
  exchangeWechatCode: vi.fn().mockResolvedValue({
    data: { openid: 'OPENID1', unionid: 'UNIONID1', accessToken: 'AT' },
    error: null,
  }),
  fetchWechatUserInfo: vi.fn().mockResolvedValue({ nickname: '流星' }),
}));

const consumeWechatState = vi.fn().mockResolvedValue({ locale: 'zh', next: '/' });
vi.mock('@/lib/wechat-bind', () => ({
  consumeWechatState: (...a: unknown[]) => consumeWechatState(...a),
  createWechatBindToken: vi.fn().mockResolvedValue('BINDTOKEN'),
}));

const dbSelect = vi.fn();
const dbUpdate = vi.fn();
vi.mock('@/lib/db', () => ({
  db: { select: (...a: unknown[]) => dbSelect(...a), update: (...a: unknown[]) => dbUpdate(...a) },
}));

import { GET } from '../route';
import { TRUSTED_DEVICE_COOKIE, createTrustedDeviceToken } from '@/lib/trusted-device';
import { MFA_CHALLENGE_COOKIE } from '@/lib/admin-mfa';

function mockUser(row: Record<string, unknown> | null) {
  dbSelect.mockReturnValue({
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue(row ? [row] : []) }),
  });
  dbUpdate.mockReturnValue({
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValue(undefined),
  });
}

const BASE = {
  id: 'U1',
  email: 'admin@example.com',
  name: '站主',
  emailVerified: true,
  tokenVersion: 2,
  wechatUnionid: 'UNIONID1',
};

function request(cookie?: string) {
  const req = new NextRequest('https://www.imagentx.top/api/auth/wechat/callback?code=C&state=S');
  if (cookie) req.cookies.set(...(cookie.split('=') as [string, string]));
  return req;
}

describe('微信扫码回调的 MFA 门控', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'jwt-secret-for-tests-0123456789ab';
    createSession.mockClear();
    consumeWechatState.mockResolvedValue({ locale: 'zh', next: '/' });
  });

  it('开了两步验证且非受信任设备：不签发 session，改走 MFA 挑战', async () => {
    mockUser({ ...BASE, totpEnabled: true });

    const res = await GET(request());

    expect(createSession).not.toHaveBeenCalled();
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/zh/login?mfa=1');
    // 挑战票走 httpOnly cookie，不进 URL
    expect(res.cookies.get(MFA_CHALLENGE_COOKIE)?.value).toBeTruthy();
    expect(res.headers.get('location')).not.toContain('mfaTicket');
  });

  it('开了两步验证但是受信任设备：免挑战直接登录', async () => {
    mockUser({ ...BASE, totpEnabled: true });
    const token = await createTrustedDeviceToken('U1', 2);

    const res = await GET(request(`${TRUSTED_DEVICE_COOKIE}=${token}`));

    expect(createSession).toHaveBeenCalledTimes(1);
    expect(res.headers.get('location')).toContain('/zh/account?wechat=linked');
  });

  it('受信任设备令牌的 tokenVersion 过期（改过密码）时仍要挑战', async () => {
    mockUser({ ...BASE, totpEnabled: true });
    const stale = await createTrustedDeviceToken('U1', 1); // 库里已是 2

    const res = await GET(request(`${TRUSTED_DEVICE_COOKIE}=${stale}`));

    expect(createSession).not.toHaveBeenCalled();
    expect(res.headers.get('location')).toContain('mfa=1');
  });

  it('没开两步验证的账号照常直接登录，不受影响', async () => {
    mockUser({ ...BASE, totpEnabled: false });

    const res = await GET(request());

    expect(createSession).toHaveBeenCalledTimes(1);
    expect(res.headers.get('location')).toContain('/zh/account?wechat=linked');
  });

  it('从 Ex-Memory 发起扫码登录时，登录成功回到体验页', async () => {
    consumeWechatState.mockResolvedValue({ locale: 'zh', next: '/apps/ex-memory' });
    mockUser({ ...BASE, totpEnabled: false });

    const res = await GET(request());

    expect(res.headers.get('location')).toBe('https://www.imagentx.top/zh/apps/ex-memory');
  });
});
