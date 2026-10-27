import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ session: vi.fn(), redeem: vi.fn() }));
vi.mock('@/lib/auth', () => ({ getSession: mocks.session }));
vi.mock('@/lib/invite', () => ({ redeemInviteCode: mocks.redeem }));
vi.mock('@/lib/rate-limit', () => ({ getClientIp: () => '127.0.0.1', rateLimit: async () => ({ limited: false }) }));
import { POST } from '../route';
const request = (owner = 'buyer') => new NextRequest('https://www.imagentx.top/api/invite/redeem', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Software-License-User': owner }, body: JSON.stringify({ code: 'INV-TEST' }) });
beforeEach(() => {
  vi.clearAllMocks();
  mocks.session.mockResolvedValue({ userId: 'buyer', email: 'buyer@example.com', emailVerified: true });
  mocks.redeem.mockResolvedValue({ success: true, licenseKey: 'MC-SOURCE', productId: 'meteor-pass', planName: 'monthly', softwareLicenses: [{ productId: 'xnook', code: 'MS-NOOK' }] });
});
describe('兑换激活码的邮箱与会话归属', () => {
  it('未验证邮箱不能兑换或聚合同邮箱历史授权', async () => {
    mocks.session.mockResolvedValue({ userId: 'buyer', email: 'buyer@example.com', emailVerified: false });
    expect((await POST(request())).status).toBe(403);
    expect(mocks.redeem).not.toHaveBeenCalled();
  });
  it('提交前换号不能替新账号兑换', async () => {
    expect((await POST(request('previous-account'))).status).toBe(409);
    expect(mocks.redeem).not.toHaveBeenCalled();
  });
  it('已验证账号收到归属标识和逐软件码，响应禁止缓存', async () => {
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(await response.json()).toMatchObject({ userId: 'buyer', softwareLicenses: [{ productId: 'xnook', code: 'MS-NOOK' }] });
  });
});
