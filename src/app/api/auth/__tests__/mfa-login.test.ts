import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
const mocks = vi.hoisted(() => ({
  user: { id: 'U1', email: 'admin@example.test', name: 'Admin', tokenVersion: 0, emailVerified: true, totpEnabled: true },
  createSession: vi.fn(), verify: vi.fn(),
}));
vi.mock('@/lib/db', () => ({ db: { select: () => ({ from: () => ({ where: () => ({ limit: async () => [mocks.user] }) }) }) } }));
vi.mock('@/lib/auth', () => ({ createSession: mocks.createSession }));
vi.mock('@/lib/admin-mfa', () => ({
  MFA_CHALLENGE_COOKIE: 'mfa-challenge',
  readMfaChallengeTicket: async () => ({ userId: 'U1', email: 'admin@example.test', tokenVersion: 0 }),
  limitMfaVerification: async () => ({ limited: false }), verifyUserTotpOrRecoveryCode: mocks.verify,
}));
vi.mock('@/lib/trusted-device', () => ({ TRUSTED_DEVICE_COOKIE: 'trusted', createTrustedDeviceToken: vi.fn(), trustedDeviceCookieOptions: () => ({}) }));
vi.mock('@/lib/rate-limit', () => ({ rateLimit: async () => ({ limited: false }), getClientIp: () => '203.0.113.1' }));
import { POST } from '../mfa/route';
function request() { return new NextRequest('http://localhost:3000/api/auth/mfa', { method: 'POST', headers: { Origin: 'http://localhost:3000', 'Content-Type': 'application/json' }, body: JSON.stringify({ mfaTicket: 'fixture', code: '123456' }) }); }
beforeEach(() => { vi.clearAllMocks(); vi.stubEnv('ADMIN_EMAILS', 'admin@example.test'); mocks.user.totpEnabled = true; mocks.verify.mockResolvedValue(true); });
afterEach(() => vi.unstubAllEnvs());
describe('MFA登录后的管理员显示状态', () => {
  it.each([true, false])('成功分支返回当前管理员标记（totpEnabled=%s）', async enabled => {
    mocks.user.totpEnabled = enabled;
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect((await response.json()).user).toMatchObject({ id: 'U1', emailVerified: true, isAdmin: true });
    expect(mocks.createSession.mock.calls[0][0]).not.toHaveProperty('isAdmin');
  });
  it('普通用户登录成功也不会得到管理员标记', async () => {
    vi.stubEnv('ADMIN_EMAILS', 'other@example.test');
    expect((await (await POST(request())).json()).user.isAdmin).toBe(false);
  });
  it('第二因子失败时不返回用户或签发会话', async () => {
    mocks.verify.mockResolvedValue(false);
    const response = await POST(request());
    expect(response.status).toBe(401);
    expect(await response.json()).not.toHaveProperty('user');
    expect(mocks.createSession).not.toHaveBeenCalled();
  });
});
