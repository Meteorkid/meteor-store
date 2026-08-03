import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

vi.mock('@/lib/auth', () => ({
  getSession: async () => ({ email: 'admin@example.com', emailVerified: true }),
}));

vi.mock('@/lib/admin', () => ({
  isAdminSession: () => true,
}));

vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '127.0.0.1',
  rateLimit: async () => ({ limited: false }),
}));

const createCode = vi.fn();
vi.mock('@/lib/invite', () => ({
  createInviteCode: (...args: unknown[]) => createCode(...args),
  listInviteCodes: vi.fn(),
  revokeInviteCode: vi.fn(),
}));

describe('管理员创建邀请码', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createCode.mockResolvedValue({ id: 'invite-id', code: 'INV-AAAA-BBBB-CCCC' });
  });

  it('使用稳定 planId 解析套餐并保存展示名称', async () => {
    const { POST } = await import('../route');
    const request = new Request('https://www.imagentx.top/api/admin/invite-codes', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        productId: 'omnicrawl',
        planId: 'starter',
        maxUses: 2,
      }),
    }) as unknown as NextRequest;

    const response = await POST(request);

    expect(response.status).toBe(201);
    expect(createCode).toHaveBeenCalledWith(expect.objectContaining({
      productId: 'omnicrawl',
      planId: 'starter',
      planName: 'Starter',
      maxUses: 2,
      createdBy: 'admin@example.com',
    }));
  });
});
