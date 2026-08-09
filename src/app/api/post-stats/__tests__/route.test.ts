import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const state = vi.hoisted(() => ({
  session: null as null | { userId: string; email: string; emailVerified: true },
  statsRow: null as null | Record<string, number>,
  viewRecorded: { targetId: null as string | null, calls: 0 },
}));

vi.mock('@/lib/auth', () => ({
  getSession: async () => state.session,
}));

vi.mock('@/lib/db', () => ({
  db: {
    execute: async () => ({ rows: state.statsRow ? [state.statsRow] : [] }),
  },
}));

vi.mock('@/lib/views-likes', () => ({
  recordView: async (targetId: string) => {
    state.viewRecorded.targetId = targetId;
    state.viewRecorded.calls += 1;
  },
}));

import { POST } from '../route';

function request(targetId?: string): NextRequest {
  const url = new URL('http://localhost/api/post-stats');
  if (targetId) {
    return new NextRequest(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetId }),
    });
  }
  return new NextRequest(url, { method: 'POST' });
}

describe('POST /api/post-stats', () => {
  beforeEach(() => {
    state.session = null;
    state.statsRow = null;
    state.viewRecorded = { targetId: null, calls: 0 };
  });

  it('缺少 targetId 时返回 400 且不记录 view、不查库', async () => {
    const response = await POST(request());

    expect(response.status).toBe(400);
    expect(state.viewRecorded.calls).toBe(0);
  });

  it('匿名访问返回四项计数，用户状态固定为 false，并记录一次 view', async () => {
    state.statsRow = {
      view_count: 9,
      like_count: 4,
      comment_count: 3,
      favorite_count: 2,
      liked: 0,
      favorited: 0,
    };

    const response = await POST(request('post-1'));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      viewCount: 9,
      likeCount: 4,
      liked: false,
      commentCount: 3,
      favoriteCount: 2,
      favorited: false,
    });
    expect(state.viewRecorded.targetId).toBe('post-1');
    expect(state.viewRecorded.calls).toBe(1);
  });

  it('登录用户返回点赞和收藏状态', async () => {
    state.session = { userId: 'U1', email: 'user@example.com', emailVerified: true };
    state.statsRow = {
      view_count: 12,
      like_count: 5,
      comment_count: 4,
      favorite_count: 3,
      liked: 1,
      favorited: 1,
    };

    const response = await POST(request('post-2'));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      viewCount: 12,
      likeCount: 5,
      liked: true,
      commentCount: 4,
      favoriteCount: 3,
      favorited: true,
    });
  });
});