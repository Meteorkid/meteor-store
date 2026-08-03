import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const state = vi.hoisted(() => ({
  session: null as null | { userId: string; email: string; emailVerified: true },
  queryResults: [] as Array<Array<{ count: number }>>,
  selectCalls: 0,
}));

vi.mock('@/lib/auth', () => ({
  getSession: async () => state.session,
}));

vi.mock('@/lib/db', () => ({
  db: {
    select: () => {
      const rows = state.queryResults[state.selectCalls] ?? [];
      state.selectCalls += 1;
      return {
        from: () => ({
          where: async () => rows,
        }),
      };
    },
  },
}));

import { GET } from '../route';

function request(targetId?: string): NextRequest {
  const url = new URL('http://localhost/api/post-stats');
  if (targetId) url.searchParams.set('targetId', targetId);
  return new NextRequest(url);
}

describe('GET /api/post-stats', () => {
  beforeEach(() => {
    state.session = null;
    state.queryResults = [];
    state.selectCalls = 0;
  });

  it('缺少 targetId 时返回 400 且不查询数据库', async () => {
    const response = await GET(request());

    expect(response.status).toBe(400);
    expect(state.selectCalls).toBe(0);
  });

  it('匿名访问返回四项计数，用户状态固定为 false', async () => {
    state.queryResults = [
      [{ count: 9 }],
      [{ count: 4 }],
      [{ count: 3 }],
      [{ count: 2 }],
    ];

    const response = await GET(request('post-1'));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      viewCount: 9,
      likeCount: 4,
      liked: false,
      commentCount: 3,
      favoriteCount: 2,
      favorited: false,
    });
    expect(state.selectCalls).toBe(4);
  });

  it('登录用户同时返回点赞和收藏状态', async () => {
    state.session = { userId: 'U1', email: 'user@example.com', emailVerified: true };
    state.queryResults = [
      [{ count: 12 }],
      [{ count: 5 }],
      [{ count: 1 }],
      [{ count: 4 }],
      [{ count: 3 }],
      [{ count: 1 }],
    ];

    const response = await GET(request('post-2'));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      viewCount: 12,
      likeCount: 5,
      liked: true,
      commentCount: 4,
      favoriteCount: 3,
      favorited: true,
    });
    expect(state.selectCalls).toBe(6);
  });
});
