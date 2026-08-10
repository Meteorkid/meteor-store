import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  session: null as null | { userId: string },
  limited: false,
  rowCount: 1,
  dbThrows: false,
  rateLimitOptions: null as null | Record<string, unknown>,
}));

vi.mock('@/lib/auth', () => ({
  getSession: async () => state.session,
}));

vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '203.0.113.1',
  rateLimit: async (...args: unknown[]) => {
    state.rateLimitOptions = args[3] as Record<string, unknown>;
    return { limited: state.limited };
  },
}));

vi.mock('@/lib/db', () => ({
  db: {
    update: () => ({
      set: () => ({
        where: async () => {
          if (state.dbThrows) throw new Error('database unavailable');
          return { rowCount: state.rowCount };
        },
      }),
    }),
  },
}));

function request(origin = 'http://localhost:3000'): Request {
  return new Request('http://localhost:3000/api/blog/tokens/T1', {
    method: 'DELETE',
    headers: { origin },
  });
}

const context = { params: Promise.resolve({ id: 'T1' }) };

describe('撤销博客 API 令牌', () => {
  beforeEach(() => {
    state.session = { userId: 'U1' };
    state.limited = false;
    state.rowCount = 1;
    state.dbThrows = false;
    state.rateLimitOptions = null;
  });

  it('只撤销当前用户令牌并固定返回成功合约', async () => {
    const { DELETE } = await import('../[id]/route');
    const response = await DELETE(request() as never, context);

    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store');
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(state.rateLimitOptions).toEqual({ failClosed: true, fallback: 'memory' });

    state.rowCount = 0;
    expect((await DELETE(request() as never, context)).status).toBe(404);
  });

  it('拒绝跨站、未登录与超限请求，数据库异常返回通用 500', async () => {
    const { DELETE } = await import('../[id]/route');

    expect((await DELETE(request('https://evil.example') as never, context)).status).toBe(403);

    state.session = null;
    expect((await DELETE(request() as never, context)).status).toBe(401);

    state.session = { userId: 'U1' };
    state.limited = true;
    expect((await DELETE(request() as never, context)).status).toBe(429);

    state.limited = false;
    state.dbThrows = true;
    const response = await DELETE(request() as never, context);
    expect(response.status).toBe(500);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(await response.text()).not.toContain('database unavailable');
  });
});
