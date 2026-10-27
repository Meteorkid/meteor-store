import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mocks = vi.hoisted(() => ({ session: vi.fn(), admin: vi.fn(), rateLimit: vi.fn(), create: vi.fn(), list: vi.fn(), revoke: vi.fn(), audit: vi.fn() }));
vi.mock('@/lib/auth', () => ({ getSession: mocks.session }));
vi.mock('@/lib/admin', () => ({ isAdminSession: mocks.admin }));
vi.mock('@/lib/rate-limit', () => ({ getClientIp: () => '127.0.0.1', rateLimit: mocks.rateLimit }));
vi.mock('@/lib/invite', () => ({ createInviteCode: mocks.create, listInviteCodes: mocks.list, revokeInviteCode: mocks.revoke }));
vi.mock('@/lib/admin-audit', () => ({ logAdminAction: mocks.audit }));
import { GET, PATCH, POST } from '../route';

const legacy = { id: 'legacy-invite', code: 'INV-AAAA-BBBB-CCCC', maxUses: 3, usedCount: 1, status: 'active', expiresAt: '2099-01-01T00:00:00.000Z' };
const request = (method: string, body: unknown, headers: Record<string, string> = {}) => new NextRequest('https://www.imagentx.top/api/admin/invite-codes', {
  method, headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body),
});

beforeEach(() => {
  vi.clearAllMocks();
  mocks.session.mockResolvedValue({ userId: 'admin', email: 'admin@example.com', emailVerified: true });
  mocks.admin.mockReturnValue(true);
  mocks.rateLimit.mockResolvedValue({ limited: false });
  mocks.list.mockResolvedValue([legacy]);
  mocks.revoke.mockResolvedValue(true);
  mocks.create.mockResolvedValue({ id: 'unused-new-invite', code: 'INV-NEW' });
});

describe('历史邀请码后台兼容', () => {
  it('旧创建接口返回410并引导账号管理，不创建/撤销/变更任何旧码', async () => {
    const response = await POST(request('POST', { productId: 'xnook', planId: 'pro', maxUses: 1 }));
    expect(response.status).toBe(410);
    expect(await response.json()).toMatchObject({ code: 'legacy_invite_creation_retired', next: '/admin/users' });
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.revoke).not.toHaveBeenCalled();
    expect(mocks.audit).not.toHaveBeenCalled();
  });

  it('退役接口仍保护管理员身份', async () => {
    mocks.admin.mockReturnValue(false);
    expect((await POST(request('POST', {}))).status).toBe(404);
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it('退役接口仍拒绝跨站来源', async () => {
    expect((await POST(request('POST', {}, { origin: 'https://evil.example.com' }))).status).toBe(403);
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it('退役接口仍执行限流', async () => {
    mocks.rateLimit.mockResolvedValue({ limited: true });
    expect((await POST(request('POST', {}))).status).toBe(429);
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it('历史查询保持原次数、状态和期限', async () => {
    expect(await (await GET()).json()).toEqual({ codes: [legacy] });
    expect(mocks.revoke).not.toHaveBeenCalled();
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it('仍可由管理员显式撤销某个旧码', async () => {
    expect((await PATCH(request('PATCH', { id: legacy.id, action: 'revoke' }))).status).toBe(200);
    expect(mocks.revoke).toHaveBeenCalledWith(legacy.id);
    expect(mocks.audit).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ action: 'invite.revoke', targetId: legacy.id }));
    expect(mocks.create).not.toHaveBeenCalled();
  });
});
