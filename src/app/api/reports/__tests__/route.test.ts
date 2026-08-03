import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

const state = vi.hoisted(() => ({
  session: null as null | { userId: string; email: string; emailVerified: true },
  limited: false,
  createCalls: [] as Array<Record<string, unknown>>,
  createError: null as Error | null,
}));

vi.mock('@/lib/auth', () => ({
  getSession: async () => state.session,
}));

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: async () => ({ limited: state.limited }),
  getClientIp: () => '203.0.113.8',
}));

vi.mock('@/lib/reports', () => {
  class ReportError extends Error {}
  return {
    ReportError,
    createReport: async (input: Record<string, unknown>) => {
      state.createCalls.push(input);
      if (state.createError) throw state.createError;
      return { id: 'R-new' };
    },
  };
});

import { ReportError } from '@/lib/reports';
import { POST } from '../route';

function request(body: unknown): NextRequest {
  return new Request('http://localhost/api/reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

const validBody = {
  targetType: 'comment',
  targetId: 'C1',
  reason: 'spam',
  detail: '  重复广告  ',
};

describe('POST /api/reports', () => {
  beforeEach(() => {
    state.session = { userId: 'U1', email: 'user@example.com', emailVerified: true };
    state.limited = false;
    state.createCalls.length = 0;
    state.createError = null;
  });

  it('未登录时返回 401 且不创建举报', async () => {
    state.session = null;

    const response = await POST(request(validBody));

    expect(response.status).toBe(401);
    expect(state.createCalls).toHaveLength(0);
  });

  it('限流命中时返回 429 且不创建举报', async () => {
    state.limited = true;

    const response = await POST(request(validBody));

    expect(response.status).toBe(429);
    expect(state.createCalls).toHaveLength(0);
  });

  it('合法请求使用当前用户身份创建举报', async () => {
    const response = await POST(request(validBody));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ id: 'R-new' });
    expect(state.createCalls).toEqual([{
      targetType: 'comment',
      targetId: 'C1',
      reporterId: 'U1',
      reason: 'spam',
      detail: '重复广告',
    }]);
  });

  it('目标不存在等业务错误返回 400', async () => {
    state.createError = new ReportError('被举报的评论不存在');

    const response = await POST(request(validBody));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: '被举报的评论不存在' });
  });
});
