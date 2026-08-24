import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const state = vi.hoisted(() => ({
  access: 'pro' as 'pro' | 'free' | 'none',
  listCalls: 0,
}));

vi.mock('@/lib/tollow-access', () => ({
  requireTollowPro: async () => state.access === 'pro'
    ? {
        ok: true,
        session: { userId: 'U1', email: 'user@example.com', emailVerified: true },
        access: { level: 'pro', source: 'order' },
      }
    : {
        ok: false,
        response: Response.json(
          state.access === 'free'
            ? { error: '需要 Tollow Pro', code: 'TOLLOW_PRO_REQUIRED' }
            : { error: '请先登录' },
          { status: state.access === 'free' ? 403 : 401 },
        ),
      },
}));

vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '203.0.113.8',
  rateLimit: async () => ({ limited: false }),
}));

vi.mock('@/lib/tollow', () => ({
  listAllTollowPracticeSessions: async () => {
    state.listCalls += 1;
    return [{
      id: 'S1',
      bookId: 'book-one',
      bookTitle: '第一本书',
      startedAt: '2026-08-24T00:00:00.000Z',
      endedAt: '2026-08-24T00:01:00.000Z',
      durationMs: 60_000,
      wordsTyped: 100,
      wpm: 80,
      accuracy: 98,
      errorCount: 1,
    }];
  },
}));

import { GET as getAnalytics } from '../analytics/route';
import { GET as getCsv } from '../export/sessions.csv/route';

describe('Tollow Pro 统计与导出 API', () => {
  beforeEach(() => {
    state.access = 'pro';
    state.listCalls = 0;
  });

  it('Free 在业务查询前被 403 拒绝', async () => {
    state.access = 'free';

    const analytics = await getAnalytics(new NextRequest('http://localhost/api/tollow/analytics'));
    const csv = await getCsv(new NextRequest('http://localhost/api/tollow/export/sessions.csv'));

    expect(analytics.status).toBe(403);
    expect(csv.status).toBe(403);
    expect(state.listCalls).toBe(0);
  });

  it('Pro 获得真实统计且非法时区返回 400', async () => {
    const response = await getAnalytics(new NextRequest(
      'http://localhost/api/tollow/analytics?range=7d&timeZone=Asia%2FShanghai',
    ));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      range: '7d',
      timeZone: 'Asia/Shanghai',
      summary: { totalWordsTyped: 100, averageWpm: 80 },
    });
    expect((await getAnalytics(new NextRequest(
      'http://localhost/api/tollow/analytics?timeZone=Invalid%2FZone',
    ))).status).toBe(400);
  });

  it('Pro CSV 使用私有无缓存下载响应', async () => {
    const response = await getCsv(new NextRequest('http://localhost/api/tollow/export/sessions.csv'));

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/csv');
    expect(response.headers.get('cache-control')).toBe('private, no-store');
    expect(response.headers.get('content-disposition')).toContain('tollow-practice-sessions-');
    expect([...new Uint8Array(await response.arrayBuffer()).slice(0, 3)]).toEqual([0xef, 0xbb, 0xbf]);
  });
});
