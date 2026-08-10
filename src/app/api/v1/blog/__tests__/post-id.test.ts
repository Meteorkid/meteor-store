import { beforeEach, describe, expect, it, vi } from 'vitest';

const fullPost = {
  id: 'P1',
  authorId: 'U1',
  authorName: '作者',
  authorBio: null,
  authorAvatarUrl: null,
  title: '文章标题',
  excerpt: '这是一段满足长度要求的文章摘要',
  content: '正文'.repeat(100),
  sectionId: 'tech',
  sections: ['tech'],
  status: 'draft',
  reviewNote: null,
  tags: ['TypeScript'],
  publishedAt: null,
  createdAt: '2026-08-10T08:00:00.000Z',
  updatedAt: '2026-08-10T08:00:00.000Z',
  eventDate: null,
};

const state = vi.hoisted(() => ({
  authScope: '',
  post: null as null | Record<string, unknown>,
  postReads: 0,
  updateInput: null as null | Record<string, unknown>,
  updateResult: {
    ok: true,
    status: 'draft',
    updatedAt: '2026-08-10T09:00:00.000Z',
  } as Record<string, unknown>,
}));

vi.mock('@/lib/blog-api-auth', () => ({
  authenticateBlogApiRequest: async (_request: Request, scope: string) => {
    state.authScope = scope;
    return {
      ok: true,
      actor: {
        userId: 'U1', email: 'author@example.com', name: '作者',
        scopes: ['blog:read', 'blog:write'], tokenId: 'T1', isAdmin: false,
      },
    };
  },
}));

vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '1.2.3.4',
  rateLimit: async () => ({ limited: false, remaining: 10, resetAt: Date.now() + 60_000 }),
}));

vi.mock('@/lib/posts', () => ({
  getPostByAuthor: async () => {
    state.postReads += 1;
    if (state.postReads > 1) throw new Error('成功写入后不应再次读取');
    return state.post;
  },
  updatePostDraftVersioned: async (input: Record<string, unknown>) => {
    state.updateInput = input;
    return state.updateResult;
  },
}));

import { GET, PATCH } from '../posts/[id]/route';

const context = { params: Promise.resolve({ id: 'P1' }) };

describe('/api/v1/blog/posts/[id]', () => {
  beforeEach(() => {
    state.authScope = '';
    state.post = { ...fullPost };
    state.postReads = 0;
    state.updateInput = null;
    state.updateResult = {
      ok: true,
      status: 'draft',
      updatedAt: '2026-08-10T09:00:00.000Z',
    };
  });

  it('详情要求 blog:read，并只通过所属用户读取完整 Markdown', async () => {
    const request = new Request('https://imagentx.top/api/v1/blog/posts/P1');
    const response = await GET(request, context);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(state.authScope).toBe('blog:read');
    expect(body.post).toMatchObject({ id: 'P1', content: fullPost.content });
    expect(body.post.previewUrls).toEqual({ zh: '/zh/blog/p/P1', en: '/en/blog/p/P1' });
    expect(state.postReads).toBe(1);
  });

  it('跨用户或不存在统一返回 post_not_found', async () => {
    state.post = null;

    const response = await GET(
      new Request('https://imagentx.top/api/v1/blog/posts/P1'),
      context,
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toMatchObject({
      error: { code: 'post_not_found' },
    });
  });

  it('PATCH 要求 blog:write，并把 expectedUpdatedAt 交给版本化草稿服务', async () => {
    const response = await PATCH(new Request('https://imagentx.top/api/v1/blog/posts/P1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        expectedUpdatedAt: '2026-08-10T08:00:00.000Z',
        content: '更新正文'.repeat(60),
      }),
    }), context);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(state.authScope).toBe('blog:write');
    expect(state.updateInput).toMatchObject({
      postId: 'P1',
      authorId: 'U1',
      expectedUpdatedAt: '2026-08-10T08:00:00.000Z',
    });
    expect(state.updateInput).not.toHaveProperty('asAdmin');
    expect(body.post).toEqual({
      id: 'P1',
      status: 'draft',
      updatedAt: '2026-08-10T09:00:00.000Z',
      previewUrls: { zh: '/zh/blog/p/P1', en: '/en/blog/p/P1' },
    });
    expect(body.post).not.toHaveProperty('content');
    expect(state.postReads).toBe(0);
  });

  it('PATCH 修改关系字段后仍只返回最小写入结果', async () => {
    const response = await PATCH(new Request('https://imagentx.top/api/v1/blog/posts/P1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        expectedUpdatedAt: '2026-08-10T08:00:00.000Z',
        sectionId: 'literature',
        tags: ['AI', 'ai'],
      }),
    }), context);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(state.postReads).toBe(0);
    expect(body.post).toEqual({
      id: 'P1',
      status: 'draft',
      updatedAt: '2026-08-10T09:00:00.000Z',
      previewUrls: { zh: '/zh/blog/p/P1', en: '/en/blog/p/P1' },
    });
  });

  it.each([
    ['notFound', 404, 'post_not_found'],
    ['invalidState', 409, 'invalid_state'],
    ['versionConflict', 409, 'version_conflict'],
  ])('把服务结果 %s 映射为稳定错误', async (reason, status, code) => {
    state.updateResult = { ok: false, reason };

    const response = await PATCH(new Request('https://imagentx.top/api/v1/blog/posts/P1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        expectedUpdatedAt: '2026-08-10T08:00:00.000Z',
        title: '修改后的标题',
      }),
    }), context);

    expect(response.status).toBe(status);
    await expect(response.json()).resolves.toMatchObject({ error: { code } });
  });

  it('PATCH 严格拒绝 asAdmin 等未知字段', async () => {
    const response = await PATCH(new Request('https://imagentx.top/api/v1/blog/posts/P1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        expectedUpdatedAt: '2026-08-10T08:00:00.000Z',
        title: '修改后的标题',
        asAdmin: true,
      }),
    }), context);

    expect(response.status).toBe(400);
    expect(state.updateInput).toBeNull();
  });
});
