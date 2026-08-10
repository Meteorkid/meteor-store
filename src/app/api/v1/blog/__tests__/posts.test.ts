import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  authScope: '',
  createInput: null as null | Record<string, unknown>,
  postReads: 0,
}));

vi.mock('@/lib/blog-api-auth', () => ({
  authenticateBlogApiRequest: async (_request: Request, scope: string) => {
    state.authScope = scope;
    return {
      ok: true,
      actor: {
        userId: 'U1',
        email: 'author@example.com',
        name: '作者',
        scopes: ['blog:read', 'blog:write'],
        tokenId: 'T1',
        isAdmin: false,
      },
    };
  },
}));

vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '1.2.3.4',
  rateLimit: async () => ({ limited: false, remaining: 10, resetAt: Date.now() + 60_000 }),
}));

const summary = {
  id: 'P1',
  authorId: 'U1',
  title: '文章标题',
  excerpt: '这是一段满足长度要求的文章摘要',
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

const fullPost = {
  ...summary,
  authorName: '作者',
  authorBio: null,
  authorAvatarUrl: null,
  content: '正文'.repeat(100),
};

vi.mock('@/lib/posts', () => ({
  getPostSummariesByAuthor: async () => [summary],
  createPost: async (input: Record<string, unknown>) => {
    state.createInput = input;
    return { id: 'P1', updatedAt: '2026-08-10T08:00:00.000Z' };
  },
  getPostByAuthor: async () => {
    state.postReads += 1;
    return fullPost;
  },
}));

import { GET, POST } from '../posts/route';

function request(method: 'GET' | 'POST', body?: unknown): Request {
  return new Request('https://imagentx.top/api/v1/blog/posts', {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

const validPost = {
  title: '一篇合法的文章',
  excerpt: '这是一段满足最小长度要求的文章摘要',
  content: '正文'.repeat(100),
  sectionId: 'tech',
  sections: ['tech'],
  tags: ['TypeScript'],
  eventDate: null,
};

describe('/api/v1/blog/posts', () => {
  beforeEach(() => {
    state.authScope = '';
    state.createInput = null;
    state.postReads = 0;
  });

  it('列表要求 blog:read，返回最近文章摘要但不返回正文', async () => {
    const response = await GET(request('GET'));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(state.authScope).toBe('blog:read');
    expect(body.posts).toHaveLength(1);
    expect(body.posts[0]).not.toHaveProperty('content');
    expect(body.posts[0].previewUrls).toEqual({
      zh: '/zh/blog/p/P1',
      en: '/en/blog/p/P1',
    });
  });

  it('创建要求 blog:write，并且无论客户端意图都只创建 draft', async () => {
    const response = await POST(request('POST', validPost));
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(state.authScope).toBe('blog:write');
    expect(state.createInput).toMatchObject({
      authorId: 'U1',
      title: validPost.title,
      status: 'draft',
    });
    expect(state.postReads).toBe(0);
    expect(body.post).toEqual({
      id: 'P1',
      status: 'draft',
      updatedAt: '2026-08-10T08:00:00.000Z',
      previewUrls: { zh: '/zh/blog/p/P1', en: '/en/blog/p/P1' },
    });
    expect(body.post).not.toHaveProperty('content');
  });

  it('严格拒绝客户端提供状态、作者或管理员字段', async () => {
    for (const field of ['status', 'authorId', 'submit', 'asAdmin', 'adminPublish']) {
      state.createInput = null;
      const response = await POST(request('POST', { ...validPost, [field]: true }));

      expect(response.status, field).toBe(400);
      expect(state.createInput, field).toBeNull();
      await expect(response.json()).resolves.toMatchObject({
        error: { code: 'invalid_request' },
      });
    }
  });
});
