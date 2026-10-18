import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

const expectedUpdatedAt = '2026-08-10T09:00:00.000Z';
const auditActions: unknown[] = [];
vi.mock('@/lib/admin-audit', () => ({
  logAdminAction: async (...args: unknown[]) => { auditActions.push(args); },
}));

let currentSession: { userId: string; email: string; name?: string; emailVerified?: true } | null = null;
vi.mock('@/lib/auth', () => ({ getSession: async () => currentSession }));

let limited = false;
vi.mock('@/lib/rate-limit', () => ({
  rateLimit: async () => ({ limited, remaining: 0, resetAt: 0 }),
  getClientIp: () => '1.2.3.4',
}));

/** reviewPost 返回状态与所见版本条件更新是否命中 */
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
let revalidateError: Error | null = null;
vi.mock('next/cache', () => ({
  revalidatePath: (path: string) => {
    if (revalidateError) throw revalidateError;
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
    currentSession = { userId: 'U-admin', email: 'boss@example.com', emailVerified: true };
    reviewResult = true;
    reviewCalls.length = 0;
    auditActions.length = 0;
    revalidated.length = 0;
    revalidateError = null;
    limited = false;
  });

  describe('权限', () => {
    it('未登录 → 401，不触碰文章', async () => {
      currentSession = null;
      const res = await POST(request({ postId: 'p1', expectedUpdatedAt, approve: true }));

      expect(res.status).toBe(401);
      expect(reviewCalls).toHaveLength(0);
    });

    it('登录了但不是管理员 → 403，不触碰文章', async () => {
      currentSession = { userId: 'U-normal', email: 'someone@example.com', emailVerified: true };
      const res = await POST(request({ postId: 'p1', expectedUpdatedAt, approve: true }));

      expect(res.status).toBe(403);
      expect(reviewCalls).toHaveLength(0);
    });

    it('未配置 ADMIN_EMAILS 时，连站主也进不来（而不是人人可进）', async () => {
      delete process.env.ADMIN_EMAILS;
      const res = await POST(request({ postId: 'p1', expectedUpdatedAt, approve: true }));

      expect(res.status).toBe(403);
      expect(reviewCalls).toHaveLength(0);
    });
  });

  describe('校验', () => {
    it('缺少管理员看到的稿件版本 → 400，不触碰文章', async () => {
      const res = await POST(request({ postId: 'p1', approve: true }));

      expect(res.status).toBe(400);
      expect(reviewCalls).toHaveLength(0);
      expect(auditActions).toHaveLength(0);
      expect(revalidated).toHaveLength(0);
    });

    it.each([
      null, 123, {}, '', 'not-a-date',
      '2026-08-10T09:00:00Z',
      '2026-08-10T09:00:00.000001Z',
      '2026-08-10T17:00:00.000+08:00',
      '2026-02-30T09:00:00.000Z',
    ])('拒绝非 UTC 毫秒版本 %j', async (version) => {
      const res = await POST(request({ postId: 'p1', expectedUpdatedAt: version, approve: true }));

      expect(res.status).toBe(400);
      expect(reviewCalls).toHaveLength(0);
      expect(auditActions).toHaveLength(0);
      expect(revalidated).toHaveLength(0);
    });

    it('限流命中 → 429', async () => {
      limited = true;
      const res = await POST(request({ postId: 'p1', expectedUpdatedAt, approve: true }));
      expect(res.status).toBe(429);
      expect(reviewCalls).toHaveLength(0);
    });

    it('驳回必须写理由，否则 400', async () => {
      const res = await POST(request({ postId: 'p1', expectedUpdatedAt, approve: false }));

      expect(res.status).toBe(400);
      expect(reviewCalls).toHaveLength(0);
    });

    it('驳回带理由时通过', async () => {
      const res = await POST(request({ postId: 'p1', expectedUpdatedAt, approve: false, note: '与分区不符' }));

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
    it('旧版本或已处理稿件 → 409，不留成功审计或触发公开缓存刷新', async () => {
      reviewResult = false;
      const res = await POST(request({ postId: 'p1', expectedUpdatedAt, approve: true }));

      expect(res.status).toBe(409);
      expect((await res.json()).error).toContain('重新加载');
      expect(reviewCalls[0]).toMatchObject({ expectedUpdatedAt });
      expect(auditActions).toHaveLength(0);
      expect(revalidated).toHaveLength(0);
    });

    it('通过后按需失效相关静态页，新文章立刻可见', async () => {
      await POST(request({ postId: 'p1', expectedUpdatedAt, approve: true }));

      // 列表、分区页、标签目录，以及同样含投稿的 RSS 与 sitemap
      // 路径都带 locale 前缀，两个语言版本都要失效
      expect(revalidated).toContain('/zh/blog');
      expect(revalidated).toContain('/en/blog');
      expect(revalidated).toContain('/zh/blog/tags');
      expect(revalidated).toContain('/en/blog/tags');
      expect(revalidated).toContain('/zh/blog/section/debate');
      expect(revalidated).toContain('/en/blog/section/debate');
      expect(revalidated).toContain('/zh/blog/feed.xml');
      expect(revalidated).toContain('/en/blog/feed.xml');
      expect(revalidated).toContain('/zh/blog/section/debate/feed.xml');
      expect(revalidated).toContain('/en/blog/section/debate/feed.xml');
      expect(revalidated).toContain('/sitemap.xml');
    });

    it('审核已成功后即使缓存刷新失败仍返回 200', async () => {
      revalidateError = new Error('cache unavailable');
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      try {
        const res = await POST(request({ postId: 'p1', expectedUpdatedAt, approve: true }));

        expect(res.status).toBe(200);
        expect(reviewCalls).toHaveLength(1);
        expect(errorSpy).toHaveBeenCalledWith(
          'published post cache revalidation failed:',
          expect.any(Error),
        );
      } finally {
        errorSpy.mockRestore();
      }
    });

    it('标签页整条动态路由一起失效，避免漏掉大小写不同的规范地址', async () => {
      await POST(request({ postId: 'p1', expectedUpdatedAt, approve: true }));

      // 投稿写的是「法律」，但索引里的规范写法未必是同一种大小写，
      // 逐个 encodeURIComponent(tag) 失效会漏掉规范的那条
      expect(revalidated).toContain('/zh/blog/tag/[tag]');
      expect(revalidated).toContain('/en/blog/tag/[tag]');
    });

    it('驳回不触发缓存失效——没有任何公开内容发生变化', async () => {
      await POST(request({ postId: 'p1', expectedUpdatedAt, approve: false, note: '不合适' }));
      expect(revalidated).toHaveLength(0);
    });

    it('审核人被记录下来，留痕可追溯', async () => {
      await POST(request({ postId: 'p1', expectedUpdatedAt, approve: true }));
      expect(reviewCalls[0]).toMatchObject({ reviewerId: 'U-admin', postId: 'p1', expectedUpdatedAt });
      expect(auditActions).toHaveLength(1);
    });
  });
});
