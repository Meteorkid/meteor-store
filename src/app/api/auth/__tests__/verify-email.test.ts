import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

const state = vi.hoisted(() => ({
  verified: true,
  limited: false,
}));

vi.mock('@/lib/email-verification', () => ({
  verifyEmailAddress: async () => state.verified,
}));

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: async () => ({ limited: state.limited }),
  getClientIp: () => '203.0.113.1',
}));

import { POST } from '../verify-email/route';

function request(token = 'verification-token'): NextRequest {
  return new Request('http://localhost/api/auth/verify-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  }) as unknown as NextRequest;
}

describe('POST /api/auth/verify-email', () => {
  beforeEach(() => {
    state.verified = true;
    state.limited = false;
  });

  it('有效令牌标记成功但不签发会话', async () => {
    const response = await POST(request());

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
  });

  it('无效或过期令牌返回统一错误', async () => {
    state.verified = false;

    const response = await POST(request('invalid-token'));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: '验证链接无效或已过期' });
  });

  it('限流命中时拒绝验证', async () => {
    state.limited = true;

    const response = await POST(request());

    expect(response.status).toBe(429);
  });
});
