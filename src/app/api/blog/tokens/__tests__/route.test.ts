import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  session: null as null | {
    userId: string;
    email: string;
    emailVerified: true;
    tokenVersion: number;
  },
  userRow: {
    passwordHash: 'stored-hash',
    tokenVersion: 2,
    emailVerified: true,
  } as null | { passwordHash: string; tokenVersion: number; emailVerified: boolean },
  tokenRows: [] as Record<string, unknown>[],
  executeRows: [{ outcome: 'created' }] as Record<string, unknown>[],
  executeCount: 0,
  updateCount: 0,
  passwordMatches: true,
  limited: false,
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
    return {
      limited: state.limited,
      remaining: state.limited ? 0 : 4,
      resetAt: Date.now() + 60_000,
    };
  },
}));

vi.mock('bcryptjs', () => ({
  compare: async () => state.passwordMatches,
}));

vi.mock('@/lib/db', () => ({
  db: {
    select: (selection: Record<string, unknown>) => ({
      from: () => ({
        where: () => {
          if ('passwordHash' in selection) {
            return {
              limit: async () => {
                if (state.dbThrows) throw new Error('database unavailable');
                return state.userRow ? [state.userRow] : [];
              },
            };
          }
          return { orderBy: async () => state.tokenRows };
        },
      }),
    }),
    execute: async () => {
      state.executeCount += 1;
      return { rows: state.executeRows };
    },
    update: () => ({
      set: () => ({
        where: async () => {
          state.updateCount += 1;
          return { rowCount: 1 };
        },
      }),
    }),
  },
}));

describe('博客 API 令牌管理', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-10T00:00:00.000Z'));
    state.session = {
      userId: 'U1',
      email: 'user@example.com',
      emailVerified: true,
      tokenVersion: 2,
    };
    state.userRow = {
      passwordHash: 'stored-hash',
      tokenVersion: 2,
      emailVerified: true,
    };
    state.tokenRows = [];
    state.executeRows = [{ outcome: 'created' }];
    state.executeCount = 0;
    state.updateCount = 0;
    state.passwordMatches = true;
    state.limited = false;
    state.dbThrows = false;
    state.rateLimitOptions = null;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function postRequest(body: unknown, origin = 'http://localhost:3000'): Request {
    return new Request('http://localhost:3000/api/blog/tokens', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin,
      },
      body: JSON.stringify(body),
    });
  }

  const validBody = {
    name: 'Codex',
    scopes: ['blog:read'],
    expiresInDays: 90,
    currentPassword: 'current-password',
  };

  it('GET 只向登录用户返回不缓存的令牌元数据列表', async () => {
    const { GET } = await import('../route');
    state.tokenRows = [{
      id: 'T1',
      name: 'Codex',
      tokenHash: '不能泄漏',
      tokenPrefix: 'msb_example',
      scopes: ['blog:read'],
      tokenVersion: 2,
      expiresAt: '2026-09-09T00:00:00.000Z',
      lastUsedAt: null,
      revokedAt: null,
      createdAt: '2026-08-10T00:00:00.000Z',
    }];

    const response = await GET();

    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store');
    const body = await response.json();
    expect(body).toEqual({
      tokens: [{
        id: 'T1',
        name: 'Codex',
        tokenPrefix: 'msb_example',
        scopes: ['blog:read'],
        status: 'active',
        expiresAt: '2026-09-09T00:00:00.000Z',
        lastUsedAt: null,
        revokedAt: null,
        createdAt: '2026-08-10T00:00:00.000Z',
      }],
    });
    expect(JSON.stringify(body)).not.toContain('不能泄漏');

    state.session = null;
    expect((await GET()).status).toBe(401);
  });

  it('POST 复核密码后只在 201 响应返回一次完整令牌', async () => {
    const { POST } = await import('../route');
    const response = await POST(postRequest({
      name: 'MacBook Codex',
      scopes: ['blog:read', 'blog:write'],
      expiresInDays: 90,
      currentPassword: 'current-password',
    }) as never);

    expect(response.status).toBe(201);
    expect(response.headers.get('cache-control')).toBe('no-store');
    const body = await response.json();
    expect(body).toEqual({
      token: expect.stringMatching(/^msb_[A-Za-z0-9_-]{43}$/),
      metadata: {
        id: expect.any(String),
        name: 'MacBook Codex',
        tokenPrefix: expect.stringMatching(/^msb_[A-Za-z0-9_-]{8}$/),
        scopes: ['blog:read', 'blog:write'],
        status: 'active',
        expiresAt: '2026-11-08T00:00:00.000Z',
        lastUsedAt: null,
        revokedAt: null,
        createdAt: '2026-08-10T00:00:00.000Z',
      },
    });
    expect(state.executeCount).toBe(1);
    expect(state.updateCount).toBe(1);
    expect(state.rateLimitOptions).toEqual({ failClosed: true, fallback: 'memory' });
  });

  it('POST 在密码复核后账户发生变化时返回稳定的 409', async () => {
    const { POST } = await import('../route');
    state.executeRows = [{ outcome: 'account_changed' }];

    const response = await POST(postRequest(validBody) as never);

    expect(response.status).toBe(409);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(await response.json()).toEqual({
      error: '账户状态已变化，请重新登录后再试',
    });
    expect(state.executeCount).toBe(1);
    expect(state.updateCount).toBe(1);
  });

  it('POST 查询用户失败时返回不缓存的通用 500', async () => {
    const { POST } = await import('../route');
    state.dbThrows = true;

    const response = await POST(postRequest({
      name: 'Codex',
      scopes: ['blog:read'],
      expiresInDays: 90,
      currentPassword: 'do-not-leak-this-password',
    }) as never);

    expect(response.status).toBe(500);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(await response.text()).not.toContain('database unavailable');
    expect(state.executeCount).toBe(0);
    expect(state.updateCount).toBe(0);
  });

  it('POST 拒绝跨站、未登录、密码错误与未验证账户', async () => {
    const { POST } = await import('../route');

    expect((await POST(postRequest(validBody, 'https://evil.example') as never)).status)
      .toBe(403);

    state.session = null;
    expect((await POST(postRequest(validBody) as never)).status).toBe(401);

    state.session = {
      userId: 'U1',
      email: 'user@example.com',
      emailVerified: true,
      tokenVersion: 2,
    };
    state.passwordMatches = false;
    expect((await POST(postRequest(validBody) as never)).status).toBe(401);

    state.passwordMatches = true;
    state.userRow = { passwordHash: 'stored-hash', tokenVersion: 2, emailVerified: false };
    expect((await POST(postRequest(validBody) as never)).status).toBe(401);
    expect(state.executeCount).toBe(0);
  });

  it('POST 限制频率、字段白名单和最多 10 枚可用令牌', async () => {
    const { POST } = await import('../route');

    state.limited = true;
    expect((await POST(postRequest(validBody) as never)).status).toBe(429);

    state.limited = false;
    expect((await POST(postRequest({
      ...validBody,
      scopes: ['admin:all'],
    }) as never)).status).toBe(400);
    expect((await POST(postRequest({
      ...validBody,
      authorId: 'U2',
    }) as never)).status).toBe(400);

    state.executeRows = [{ outcome: 'active_token_limit' }];
    expect((await POST(postRequest(validBody) as never)).status).toBe(409);
    expect(state.executeCount).toBe(1);
    expect(state.updateCount).toBe(1);
  });
});
