import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(), isAdminSession: vi.fn(), disableTotp: vi.fn(), logAdminAction: vi.fn(),
  limitMfaVerification: vi.fn(), enableTotp: vi.fn(), rateLimit: vi.fn(),
}));
vi.mock('@/lib/auth', () => ({ getSession: mocks.getSession }));
vi.mock('@/lib/admin', () => ({ isAdminSession: mocks.isAdminSession }));
vi.mock('@/lib/admin-audit', () => ({ logAdminAction: mocks.logAdminAction }));
vi.mock('@/lib/admin-mfa', () => ({ disableTotp: mocks.disableTotp, enableTotp: mocks.enableTotp, limitMfaVerification: mocks.limitMfaVerification, getUserTotpState: vi.fn(), setupTotp: vi.fn() }));
vi.mock('@/lib/rate-limit', () => ({ rateLimit: mocks.rateLimit, getClientIp: (req: Request) => req.headers.get('x-test-ip') ?? '203.0.113.1' }));
import { POST } from '../route';

function request(code: string, origin = 'http://localhost:3000') {
  return new NextRequest('http://localhost:3000/api/admin/mfa', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'disable', code }) });
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getSession.mockResolvedValue({ userId: 'U1', email: 'admin@example.com', emailVerified: true });
  mocks.isAdminSession.mockReturnValue(true);
  mocks.disableTotp.mockResolvedValue(true);
  mocks.rateLimit.mockResolvedValue({ limited: false });
  mocks.limitMfaVerification.mockResolvedValue({ limited: false });
  mocks.enableTotp.mockResolvedValue({ recoveryCodes: ['ABCD-EF23'] });
});

describe('管理员关闭 MFA 的凭证格式与原有鉴权', () => {
  it.each(['123456', 'ABCD-EF23', 'abcdef23', ' abcd ef23 '])('合法 TOTP 或恢复码 %s 可到达验证服务', async (code) => {
    const res = await POST(request(code));
    expect(res.status).toBe(200);
    expect(mocks.disableTotp).toHaveBeenCalledOnce();
    expect(mocks.limitMfaVerification).toHaveBeenCalledExactlyOnceWith('U1');
    expect(mocks.logAdminAction).toHaveBeenCalledOnce();
  });
  it.each(['12345', '1234567', 'abcdef', 'AB01-EF23', 'ABCD-!!!!', 'a'.repeat(100)])('拒绝无效格式 %s', async (code) => {
    const res = await POST(request(code));
    expect(res.status).toBe(400);
    expect(mocks.disableTotp).not.toHaveBeenCalled();
  });
  it('格式正确但验证失败不关闭、不写审计成功事件', async () => {
    mocks.disableTotp.mockResolvedValue(false);
    expect((await POST(request('123456'))).status).toBe(400);
    expect(mocks.logAdminAction).not.toHaveBeenCalled();
  });
  it('账号 MFA 预算耗尽后换 IP 仍返回 429，不能调用 disable', async () => {
    mocks.limitMfaVerification.mockResolvedValue({ limited: true });
    for (const ip of ['203.0.113.2', '203.0.113.3']) {
      const req = request('123456');
      req.headers.set('x-test-ip', ip);
      expect((await POST(req)).status).toBe(429);
    }
    expect(mocks.limitMfaVerification).toHaveBeenCalledTimes(2);
    expect(mocks.limitMfaVerification).toHaveBeenCalledWith('U1');
    expect(mocks.disableTotp).not.toHaveBeenCalled();
    expect(mocks.logAdminAction).not.toHaveBeenCalled();
    expect(mocks.rateLimit).toHaveBeenCalledWith('admin-mfa:ip:203.0.113.2', 10, 60_000, { failClosed: true, fallback: 'memory' });
  });
  it('合法 enable 不消耗第二因子登录/关闭预算', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/mfa', {
      method: 'POST', headers: { Origin: 'http://localhost:3000', 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'enable', code: '123456' }),
    });
    expect((await POST(req)).status).toBe(200);
    expect(mocks.enableTotp).toHaveBeenCalledExactlyOnceWith('U1', '123456');
    expect(mocks.limitMfaVerification).not.toHaveBeenCalled();
    expect(mocks.disableTotp).not.toHaveBeenCalled();
  });
  it('仍检查 Origin 与管理员身份', async () => {
    expect((await POST(request('123456', 'https://evil.example'))).status).toBe(403);
    mocks.isAdminSession.mockReturnValue(false);
    expect((await POST(request('123456'))).status).toBe(404);
    expect(mocks.disableTotp).not.toHaveBeenCalled();
  });
});
