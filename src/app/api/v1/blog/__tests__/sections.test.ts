import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  authScope: '',
  authCalls: 0,
  limited: false,
}));

vi.mock('@/lib/blog-api-auth', () => ({
  authenticateBlogApiRequest: async (_request: Request, scope: string) => {
    state.authCalls += 1;
    state.authScope = scope;
    return {
      ok: true,
      actor: {
        userId: 'U1',
        email: 'author@example.com',
        name: '作者',
        scopes: ['blog:read'],
        tokenId: 'T1',
        isAdmin: false,
      },
    };
  },
}));

vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '1.2.3.4',
  rateLimit: async () => ({
    limited: state.limited,
    remaining: 10,
    resetAt: Date.now() + 60_000,
  }),
}));

import { GET } from '../sections/route';

describe('GET /api/v1/blog/sections', () => {
  beforeEach(() => {
    state.authScope = '';
    state.authCalls = 0;
    state.limited = false;
  });

  it('要求 blog:read，并返回双语分区和字段约束', async () => {
    const response = await GET(new Request('https://imagentx.top/api/v1/blog/sections'));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(state.authScope).toBe('blog:read');
    expect(body.sections[0]).toEqual(expect.objectContaining({
      id: expect.any(String),
      slug: expect.any(String),
      label: { zh: expect.any(String), en: expect.any(String) },
    }));
    expect(body.constraints).toMatchObject({
      title: { min: 4, max: 80 },
      content: { min: 200, max: 50_000 },
      tags: { maxItems: 8, maxLength: 24 },
    });
    expect(response.headers.get('cache-control')).toBe('no-store');
  });

  it('在查询 Bearer 哈希前先按 IP 限流', async () => {
    state.limited = true;

    const response = await GET(new Request('https://imagentx.top/api/v1/blog/sections'));

    expect(response.status).toBe(429);
    expect(state.authCalls).toBe(0);
    expect(response.headers.get('retry-after')).toBeTruthy();
  });
});
