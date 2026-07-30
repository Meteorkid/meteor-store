import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

let currentSession: { userId: string; email: string; name?: string } | null = null;
vi.mock('@/lib/auth', () => ({ getSession: async () => currentSession }));

let limited = false;
vi.mock('@/lib/rate-limit', () => ({
  rateLimit: async () => ({ limited, remaining: 0, resetAt: 0 }),
  getClientIp: () => '1.2.3.4',
}));

/** reviewPost 返回条件更新是否命中；false 表示这篇已被处理过 */
let reviewResult = true;
const reviewCalls: unknown[] = [];
const fetchedPost = {
  id: 'p1',
  sectionId: 'debate',
  tags: ['法律', 'Three.js'],
};
vi.mock('@/lib/posts', () => ({
  reviewPost: async (input: unknown) => {
    reviewCalls.push(input);
    return reviewResult;
  },
  getPostById: async () => fetchedPost,
}));

const revalidated: string[] = [];
vi.mock('next/cache', () => ({
  revalidatePath: (path: string) => {
    revalidated.push(path);
  },
}));

import { POST } from '../review/route';

function request(body: unknown): NextRequest {
  return new Request('http://localhost/api/posts/review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

describe('POST /api/posts/review', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ADMIN_EMAILS = 'boss@example.com';
    currentSession = { userId: 'U-admin', email: 'boss@example.com' };
    reviewResult = true;
    reviewCalls.length = 0;
    revalidated.length = 0;
    limited = false;
  });

  describe('权限', () => {
    it('未登录 → 401，不触碰文章', async () => {
      currentSession = null;
      const res = await POST(request({ postId: 'p1', approve: true }));

      expect(res.status).toBe(401);
      expect(reviewCalls).toHaveLength(0);
    });

    it('登录了但不是管理员 → 403，不触碰文章', async () => {
      currentSession = { userId: 'U-normal', email: 'someone@example.com' };
      const res = await POST(request({ postId: 'p1', approve: true }));

      expect(res.status).toBe(403);
      expect(reviewCalls).toHaveLength(0);
    });

    it('未配置 ADMIN_EMAILS 时，连站主也进不来（而不是人人可进）', async () => {
      delete process.env.ADMIN_EMAILS;
      const res = await POST(request({ postId: 'p1', approve: true }));

      expect(res.status).toBe(403);
      expect(reviewCalls).toHaveLength(0);
    });
  });

  describe('校验', () => {
    it('限流命中 → 429', async () => {
      limited = true;
      const res = await POST(request({ postId: 'p1', approve: true }));
      expect(res.status).toBe(429);
      expect(reviewCalls).toHaveLength(0);
    });

    it('驳回必须写理由，否则 400', async () => {
      const res = await POST(request({ postId: 'p1', approve: false }));

      expect(res.status).toBe(400);
      expect(reviewCalls).toHaveLength(0);
    });

    it('驳回带理由时通过', async () => {
      const res = await POST(request({ postId: 'p1', approve: false, note: '与分区不符' }));

      expect(res.status).toBe(200);
      expect(reviewCalls[0]).toMatchObject({ approve: false, note: '与分区不符' });
    });

    it('body 不合法 → 400 而不是崩溃', async () => {
      const bad = new Request('http://localhost/api/posts/review', {
        method: 'POST',
        body: 'not json',
      }) as unknown as NextRequest;

      expect((await POST(bad)).status).toBe(400);
    });
  });

  describe('状态机与缓存', () => {
    it('重复审核同一篇 → 409，靠条件更新拦住并发', async () => {
      reviewResult = false;
      const res = await POST(request({ postId: 'p1', approve: true }));

      expect(res.status).toBe(409);
      expect(revalidated).toHaveLength(0);
    });

    it('通过后按需失效相关静态页，新文章立刻可见', async () => {
      await POST(request({ postId: 'p1', approve: true }));

      expect(revalidated).toContain('/blog');
      expect(revalidated).toContain('/blog/tags');
      expect(revalidated).toContain('/blog/section/debate');
      expect(revalidated).toContain(`/blog/tag/${encodeURIComponent('法律')}`);
      expect(revalidated).toContain('/blog/tag/Three.js');
    });

    it('驳回不触发缓存失效——没有任何公开内容发生变化', async () => {
      await POST(request({ postId: 'p1', approve: false, note: '不合适' }));
      expect(revalidated).toHaveLength(0);
    });

    it('审核人被记录下来，留痕可追溯', async () => {
      await POST(request({ postId: 'p1', approve: true }));
      expect(reviewCalls[0]).toMatchObject({ reviewerId: 'U-admin', postId: 'p1' });
    });
  });
});
