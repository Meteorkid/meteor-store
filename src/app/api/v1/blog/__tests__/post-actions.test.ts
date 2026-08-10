import { beforeEach, describe, expect, it, vi } from 'vitest';

const fullPost = {
  id: 'P1',
  authorId: 'U1',
  authorName: '作者',
  authorBio: '保持好奇',
  authorAvatarUrl: null,
  title: '文章标题',
  excerpt: '这是一段满足长度要求的文章摘要',
  content: '正文'.repeat(100),
  sectionId: 'tech',
  sections: ['tech'],
  status: 'draft',
  reviewNote: '旧审核意见',
  tags: ['TypeScript'],
  publishedAt: null,
  createdAt: '2026-08-10T08:00:00.000Z',
  updatedAt: '2026-08-10T08:00:00.000Z',
  eventDate: null,
};

const state = vi.hoisted(() => ({
  authScope: '',
  isAdmin: false,
  postStatus: 'draft',
  submitInput: null as null | Record<string, unknown>,
  submitResult: {
    ok: true,
    status: 'pending',
    updatedAt: '2026-08-10T09:00:00.000Z',
  } as Record<string, unknown>,
  withdrawResult: {
    ok: true,
    updatedAt: '2026-08-10T10:00:00.000Z',
  } as Record<string, unknown>,
  withdrawInput: null as null | Record<string, unknown>,
  alerts: [] as unknown[],
  revalidateCount: 0,
  revalidateError: false,
  postReads: 0,
  events: [] as string[],
}));

vi.mock('@/lib/blog-api-auth', () => ({
  authenticateBlogApiRequest: async (_request: Request, scope: string) => {
    state.authScope = scope;
    return {
      ok: true,
      actor: {
        userId: 'U1', email: 'author@example.com', name: '作者',
        scopes: ['blog:submit'], tokenId: 'T1', isAdmin: state.isAdmin,
      },
    };
  },
}));

vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '1.2.3.4',
  rateLimit: async () => ({ limited: false, remaining: 10, resetAt: Date.now() + 60_000 }),
}));

vi.mock('@/lib/posts', () => ({
  submitPostVersioned: async (input: Record<string, unknown>) => {
    state.events.push('submit');
    state.submitInput = input;
    return state.submitResult;
  },
  withdrawPost: async (input: Record<string, unknown>) => {
    state.events.push('withdraw');
    state.withdrawInput = input;
    return state.withdrawResult;
  },
  getPostByAuthor: async () => {
    state.events.push('read');
    state.postReads += 1;
    if (state.postReads > 1) throw new Error('成功写入后不应再次读取');
    return { ...fullPost, status: state.postStatus };
  },
}));

vi.mock('@/lib/email', () => ({
  sendAdminAlert: (...args: unknown[]) => {
    state.alerts.push(args);
  },
}));

vi.mock('@/lib/revalidate', () => ({
  revalidatePublishedPaths: () => {
    state.events.push('revalidate');
    state.revalidateCount += 1;
    if (state.revalidateError) throw new Error('cache unavailable');
  },
}));

import { POST as submit } from '../posts/[id]/submit/route';
import { POST as withdraw } from '../posts/[id]/withdraw/route';

const context = { params: Promise.resolve({ id: 'P1' }) };

function request(path: string, body?: unknown): Request {
  return new Request(`https://imagentx.top/api/v1/blog/posts/P1/${path}`, {
    method: 'POST',
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

describe('POST /api/v1/blog/posts/[id]/submit', () => {
  beforeEach(() => {
    state.authScope = '';
    state.isAdmin = false;
    state.postStatus = 'draft';
    state.submitInput = null;
    state.submitResult = {
      ok: true,
      status: 'pending',
      updatedAt: '2026-08-10T09:00:00.000Z',
    };
    state.withdrawResult = {
      ok: true,
      updatedAt: '2026-08-10T10:00:00.000Z',
    };
    state.withdrawInput = null;
    state.alerts = [];
    state.revalidateCount = 0;
    state.revalidateError = false;
    state.postReads = 0;
    state.events = [];
  });

  it('普通用户显式提交进入 pending，并且只发送一次管理员提醒', async () => {
    const response = await submit(request('submit', {
      expectedUpdatedAt: '2026-08-10T08:00:00.000Z',
    }), context);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(state.authScope).toBe('blog:submit');
    expect(state.submitInput).toEqual({
      postId: 'P1',
      authorId: 'U1',
      expectedUpdatedAt: '2026-08-10T08:00:00.000Z',
      publish: false,
    });
    expect(state.submitInput).not.toHaveProperty('asAdmin');
    expect(state.alerts).toHaveLength(1);
    expect(state.revalidateCount).toBe(0);
    expect(state.postReads).toBe(1);
    expect(body.post).toEqual({
      id: 'P1',
      status: 'pending',
      updatedAt: '2026-08-10T09:00:00.000Z',
      previewUrls: { zh: '/zh/blog/p/P1', en: '/en/blog/p/P1' },
    });
    expect(body.post).not.toHaveProperty('content');
  });

  it('管理员只直发自己的文章并刷新公开缓存，不获得 asAdmin', async () => {
    state.isAdmin = true;
    state.submitResult = {
      ok: true,
      status: 'published',
      updatedAt: '2026-08-10T09:00:00.000Z',
    };

    const response = await submit(request('submit', {
      expectedUpdatedAt: '2026-08-10T08:00:00.000Z',
    }), context);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(state.submitInput).toMatchObject({ authorId: 'U1', publish: true });
    expect(state.submitInput).not.toHaveProperty('asAdmin');
    expect(state.alerts).toHaveLength(0);
    expect(state.revalidateCount).toBe(1);
    expect(state.postReads).toBe(1);
    expect(state.events).toEqual(['read', 'submit', 'revalidate']);
    expect(body.post).toEqual({
      id: 'P1',
      status: 'published',
      updatedAt: '2026-08-10T09:00:00.000Z',
      previewUrls: { zh: '/zh/blog/p/P1', en: '/en/blog/p/P1' },
    });
  });

  it('管理员直发成功后即使缓存刷新失败仍返回 200', async () => {
    state.isAdmin = true;
    state.revalidateError = true;
    state.submitResult = {
      ok: true,
      status: 'published',
      updatedAt: '2026-08-10T09:00:00.000Z',
    };
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    try {
      const response = await submit(request('submit', {
        expectedUpdatedAt: '2026-08-10T08:00:00.000Z',
      }), context);

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual({
        post: {
          id: 'P1',
          status: 'published',
          updatedAt: '2026-08-10T09:00:00.000Z',
          previewUrls: { zh: '/zh/blog/p/P1', en: '/en/blog/p/P1' },
        },
      });
      expect(state.revalidateCount).toBe(1);
      expect(errorSpy).toHaveBeenCalledWith(
        'published post cache revalidation failed:',
        expect.any(Error),
      );
    } finally {
      errorSpy.mockRestore();
    }
  });

  it('拒绝请求体里的 adminPublish/asAdmin', async () => {
    const response = await submit(request('submit', {
      expectedUpdatedAt: '2026-08-10T08:00:00.000Z',
      adminPublish: true,
    }), context);

    expect(response.status).toBe(400);
    expect(state.submitInput).toBeNull();
  });
});

describe('POST /api/v1/blog/posts/[id]/withdraw', () => {
  beforeEach(() => {
    state.authScope = '';
    state.postStatus = 'pending';
    state.withdrawInput = null;
    state.withdrawResult = {
      ok: true,
      updatedAt: '2026-08-10T10:00:00.000Z',
    };
    state.postReads = 0;
    state.events = [];
  });

  it('原子撤回本人的 pending 文章并返回最小 draft 结果', async () => {
    const response = await withdraw(request('withdraw'), context);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(state.authScope).toBe('blog:submit');
    expect(state.withdrawInput).toEqual({ postId: 'P1', authorId: 'U1' });
    expect(state.postReads).toBe(0);
    expect(state.events).toEqual(['withdraw']);
    expect(body.post).toEqual({
      id: 'P1',
      status: 'draft',
      updatedAt: '2026-08-10T10:00:00.000Z',
      previewUrls: { zh: '/zh/blog/p/P1', en: '/en/blog/p/P1' },
    });
    expect(body.post).not.toHaveProperty('content');
  });

  it.each([
    ['notFound', 404, 'post_not_found'],
    ['notAuthor', 404, 'post_not_found'],
    ['notPending', 409, 'invalid_state'],
  ])('撤回失败 %s 使用稳定且不泄露所有权的错误', async (reason, status, code) => {
    state.withdrawResult = { ok: false, reason };

    const response = await withdraw(request('withdraw'), context);

    expect(response.status).toBe(status);
    await expect(response.json()).resolves.toMatchObject({ error: { code } });
  });
});
