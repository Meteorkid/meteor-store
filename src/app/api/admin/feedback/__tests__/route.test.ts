import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

vi.mock('@/lib/auth', () => ({
  getSession: async () => ({ userId: 'ADMIN', email: 'admin@example.com', emailVerified: true }),
}));

vi.mock('@/lib/admin', () => ({
  isAdminSession: () => true,
}));

vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '203.0.113.1',
  rateLimit: async () => ({ limited: false }),
}));

const listFeedback = vi.fn();
const resolveFeedback = vi.fn();
vi.mock('@/lib/admin-feedback', () => ({
  listFeedback: (...args: unknown[]) => listFeedback(...args),
  resolveFeedback: (...args: unknown[]) => resolveFeedback(...args),
}));

describe('反馈管理接口', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    listFeedback.mockResolvedValue([]);
    resolveFeedback.mockResolvedValue(true);
  });

  it('返回反馈列表', async () => {
    const { GET } = await import('../route');

    const response = await GET();

    expect(response.status).toBe(200);
    expect(listFeedback).toHaveBeenCalledOnce();
  });

  it('条件更新待处理反馈并记录管理员', async () => {
    const { PATCH } = await import('../route');
    const request = new Request('https://www.imagentx.top/api/admin/feedback', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: 'FB1', status: 'resolved' }),
    }) as unknown as NextRequest;

    const response = await PATCH(request);

    expect(response.status).toBe(200);
    expect(resolveFeedback).toHaveBeenCalledWith('FB1', 'resolved', 'ADMIN');
  });
});
