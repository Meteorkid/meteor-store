import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  authScope: '',
  authAdmin: false,
  post: null as null | Record<string, unknown>,
  storageConfigured: true,
  uploadError: null as null | {
    code: 'storage_quota_exceeded' | 'image_upload_in_progress' | 'storage_unavailable';
    details?: Record<string, number>;
  },
  uploadUnknownError: false,
  validImage: true,
  uploaded: null as null | Record<string, unknown>,
  slotAvailable: true,
  slotAcquired: 0,
  slotReleased: 0,
  uploadLimited: false,
  uploadLimitResetAt: 0,
}));

const BlogImageUploadErrorMock = vi.hoisted(() => class BlogImageUploadError extends Error {
  constructor(
    public code: string,
    public details?: Record<string, number>,
  ) {
    super(code);
  }
});

vi.mock('@/lib/blog-api-auth', () => ({
  authenticateBlogApiRequest: async (_request: Request, scope: string) => {
    state.authScope = scope;
    return {
      ok: true,
      actor: {
        userId: 'U1', email: 'author@example.com', name: '作者',
        scopes: ['blog:read', 'blog:image'], tokenId: 'T1', isAdmin: state.authAdmin,
      },
    };
  },
}));

vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '1.2.3.4',
  rateLimit: async () => ({ limited: false, remaining: 10, resetAt: Date.now() + 60_000 }),
}));

vi.mock('@/lib/posts', () => ({
  getPostByAuthor: async () => state.post,
}));

vi.mock('@/lib/r2-client', () => ({
  isR2Configured: () => state.storageConfigured,
}));

vi.mock('@/lib/blog-image-upload-guard', () => ({
  checkBlogImageUploadRateLimit: async () => ({
    limited: state.uploadLimited,
    scope: state.uploadLimited ? 'user' : null,
    resetAt: state.uploadLimitResetAt || Date.now() + 60_000,
  }),
  acquireBlogImageUploadSlot: () => {
    if (!state.slotAvailable) return null;
    state.slotAcquired += 1;
    let released = false;
    return () => {
      if (released) return;
      released = true;
      state.slotReleased += 1;
    };
  },
}));

vi.mock('@/lib/blog-image-storage', () => ({
  BlogImageUploadError: BlogImageUploadErrorMock,
  validateBlogImageBytes: async () => state.validImage,
  uploadBlogImage: async (
    userId: string,
    bytes: Uint8Array,
    mime: string,
    options: { isAdmin: boolean },
  ) => {
    state.uploaded = { userId, size: bytes.byteLength, mime, options };
    if (state.uploadUnknownError) throw new Error('R2 unavailable');
    if (state.uploadError) {
      throw new BlogImageUploadErrorMock(state.uploadError.code, state.uploadError.details);
    }
    return {
      url: 'https://cdn.example.com/blog/U1/hash.webp',
      key: 'blog/U1/hash.webp',
      quota: { usedBytes: 3, limitBytes: 209_715_200, remainingBytes: 209_715_197 },
    };
  },
}));

import { GET as preview } from '../posts/[id]/preview/route';
import { POST as uploadImage } from '../images/route';

const context = { params: Promise.resolve({ id: 'P1' }) };

describe('GET /api/v1/blog/posts/[id]/preview', () => {
  beforeEach(() => {
    state.authScope = '';
    state.post = {
      id: 'P1',
      authorId: 'U1',
      content: '## 标题\n\n正文<script>alert(1)</script>',
      updatedAt: '2026-08-10T08:00:00.000Z',
    };
  });

  it('复用正式 Markdown 管线返回安全 HTML、版本和浏览器地址', async () => {
    const response = await preview(
      new Request('https://imagentx.top/api/v1/blog/posts/P1/preview'),
      context,
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(state.authScope).toBe('blog:read');
    expect(body.html).toContain('<h2>标题</h2>');
    expect(body.html).not.toContain('<script>');
    expect(body.updatedAt).toBe('2026-08-10T08:00:00.000Z');
    expect(body.previewUrls).toEqual({ zh: '/zh/blog/p/P1', en: '/en/blog/p/P1' });
  });
});

describe('POST /api/v1/blog/images', () => {
  beforeEach(() => {
    state.authScope = '';
    state.authAdmin = false;
    state.storageConfigured = true;
    state.uploadError = null;
    state.uploadUnknownError = false;
    state.validImage = true;
    state.uploaded = null;
    state.slotAvailable = true;
    state.slotAcquired = 0;
    state.slotReleased = 0;
    state.uploadLimited = false;
    state.uploadLimitResetAt = 0;
  });

  it('要求 blog:image，并返回可直接写入 Markdown 的 R2 URL', async () => {
    const form = new FormData();
    form.set('file', new File([new Uint8Array([1, 2, 3])], 'cover.webp', { type: 'image/webp' }));

    const response = await uploadImage(new Request('https://imagentx.top/api/v1/blog/images', {
      method: 'POST',
      body: form,
    }));

    expect(response.status).toBe(201);
    expect(state.authScope).toBe('blog:image');
    expect(state.uploaded).toEqual({
      userId: 'U1',
      size: 3,
      mime: 'image/webp',
      options: { isAdmin: false },
    });
    await expect(response.json()).resolves.toEqual({
      url: 'https://cdn.example.com/blog/U1/hash.webp',
      quota: { usedBytes: 3, limitBytes: 209_715_200, remainingBytes: 209_715_197 },
    });
    expect(state.slotAcquired).toBe(1);
    expect(state.slotReleased).toBe(1);
  });

  it('不支持的 MIME 返回 415，超过 5MB 返回 413', async () => {
    const badType = new FormData();
    badType.set('file', new File(['text'], 'note.txt', { type: 'text/plain' }));
    const unsupported = await uploadImage(new Request('https://imagentx.top/api/v1/blog/images', {
      method: 'POST',
      body: badType,
    }));

    const tooLarge = new FormData();
    tooLarge.set('file', new File([new Uint8Array(5_000_001)], 'large.png', { type: 'image/png' }));
    const oversized = await uploadImage(new Request('https://imagentx.top/api/v1/blog/images', {
      method: 'POST',
      body: tooLarge,
    }));

    expect(unsupported.status).toBe(415);
    expect(oversized.status).toBe(413);
    await expect(unsupported.json()).resolves.toMatchObject({ error: { code: 'invalid_image' } });
    await expect(oversized.json()).resolves.toMatchObject({ error: { code: 'invalid_image' } });
    expect(state.uploaded).toBeNull();
    expect(state.slotReleased).toBe(2);
  });

  it('声明 MIME 与实际图片字节不符时拒绝写入 R2', async () => {
    state.validImage = false;
    const form = new FormData();
    form.set('file', new File(['not-an-image'], 'cover.png', { type: 'image/png' }));

    const response = await uploadImage(new Request('https://imagentx.top/api/v1/blog/images', {
      method: 'POST',
      body: form,
    }));

    expect(response.status).toBe(415);
    await expect(response.json()).resolves.toMatchObject({ error: { code: 'invalid_image' } });
    expect(state.uploaded).toBeNull();
    expect(state.slotReleased).toBe(1);
  });

  it('R2 未配置时返回 503，上传异常不泄漏底层错误', async () => {
    const form = new FormData();
    form.set('file', new File(['image'], 'cover.png', { type: 'image/png' }));
    state.storageConfigured = false;

    const unavailable = await uploadImage(new Request('https://imagentx.top/api/v1/blog/images', {
      method: 'POST',
      body: form,
    }));
    expect(unavailable.status).toBe(503);
    await expect(unavailable.json()).resolves.toMatchObject({
      error: { code: 'storage_unavailable' },
    });

    state.storageConfigured = true;
    state.uploadUnknownError = true;
    const failed = await uploadImage(new Request('https://imagentx.top/api/v1/blog/images', {
      method: 'POST',
      body: form,
    }));
    expect(failed.status).toBe(503);
    const failedBody = await failed.json();
    expect(failedBody).toMatchObject({
      error: { code: 'storage_unavailable' },
    });
    expect(JSON.stringify(failedBody)).not.toContain('R2 unavailable');
    expect(state.slotReleased).toBe(1);
  });

  it('配额、同图并发和进程繁忙返回可恢复的稳定错误', async () => {
    const form = new FormData();
    form.set('file', new File(['image'], 'cover.png', { type: 'image/png' }));

    state.uploadError = {
      code: 'storage_quota_exceeded',
      details: { usedBytes: 100, limitBytes: 100, requestedBytes: 1 },
    };
    const quota = await uploadImage(new Request('https://imagentx.top/api/v1/blog/images', {
      method: 'POST',
      body: form,
    }));
    expect(quota.status).toBe(413);
    await expect(quota.json()).resolves.toMatchObject({
      error: {
        code: 'storage_quota_exceeded',
        details: { usedBytes: 100, limitBytes: 100, requestedBytes: 1 },
      },
    });

    state.uploadError = {
      code: 'image_upload_in_progress',
      details: { retryAfter: 2 },
    };
    const duplicate = await uploadImage(new Request('https://imagentx.top/api/v1/blog/images', {
      method: 'POST',
      body: form,
    }));
    expect(duplicate.status).toBe(409);
    expect(duplicate.headers.get('retry-after')).toBe('2');
    await expect(duplicate.json()).resolves.toMatchObject({
      error: { code: 'image_upload_in_progress' },
    });

    state.slotAvailable = false;
    const unreadBody = new ReadableStream<Uint8Array>({
      pull() {
        throw new Error('multipart body must not be read without a slot');
      },
    });
    const busy = await uploadImage(new Request('https://imagentx.top/api/v1/blog/images', {
      method: 'POST',
      headers: { 'content-type': 'multipart/form-data; boundary=test' },
      body: unreadBody,
      // Node 的 Request 流式 body 需要显式声明 duplex。
      duplex: 'half',
    } as RequestInit & { duplex: 'half' }));
    expect(busy.status).toBe(429);
    expect(busy.headers.get('retry-after')).toBe('1');
    await expect(busy.json()).resolves.toMatchObject({ error: { code: 'upload_busy' } });
  });

  it('管理员身份只由服务端鉴权结果透传给配额服务', async () => {
    state.authAdmin = true;
    const form = new FormData();
    form.set('file', new File(['image'], 'cover.png', { type: 'image/png' }));

    const response = await uploadImage(new Request('https://imagentx.top/api/v1/blog/images', {
      method: 'POST',
      body: form,
    }));

    expect(response.status).toBe(201);
    expect(state.uploaded).toMatchObject({ options: { isAdmin: true } });
  });
});
