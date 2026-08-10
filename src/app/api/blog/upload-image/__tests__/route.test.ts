import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const state = vi.hoisted(() => ({
  session: {
    userId: 'U1',
    email: 'author@example.com',
    emailVerified: true as const,
  } as null | { userId: string; email: string; emailVerified: true },
  isAdmin: false,
  storageConfigured: true,
  validImage: true,
  uploadError: null as null | {
    code: 'storage_quota_exceeded' | 'image_upload_in_progress' | 'storage_unavailable';
    details?: Record<string, number>;
  },
  uploadUnknownError: false,
  uploaded: null as null | Record<string, unknown>,
  uploadLimited: false,
  uploadLimitResetAt: 0,
  slotAvailable: true,
  slotReleased: 0,
}));

const BlogImageUploadErrorMock = vi.hoisted(() => class BlogImageUploadError extends Error {
  constructor(
    public code: string,
    public details?: Record<string, number>,
  ) {
    super(code);
  }
});

vi.mock('@/lib/auth', () => ({
  getSession: async () => state.session,
}));

vi.mock('@/lib/admin', () => ({
  isAdminSession: () => state.isAdmin,
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

import { POST } from '../route';

function imageRequest(): NextRequest {
  const form = new FormData();
  form.set('file', new File([new Uint8Array([1, 2, 3])], 'cover.webp', {
    type: 'image/webp',
  }));
  return new NextRequest('https://imagentx.top/api/blog/upload-image', {
    method: 'POST',
    body: form,
  });
}

describe('POST /api/blog/upload-image', () => {
  beforeEach(() => {
    state.session = { userId: 'U1', email: 'author@example.com', emailVerified: true };
    state.isAdmin = false;
    state.storageConfigured = true;
    state.validImage = true;
    state.uploadError = null;
    state.uploadUnknownError = false;
    state.uploaded = null;
    state.uploadLimited = false;
    state.uploadLimitResetAt = 0;
    state.slotAvailable = true;
    state.slotReleased = 0;
  });

  it('返回图片 URL 和剩余配额，并把服务端管理员身份传给存储层', async () => {
    state.isAdmin = true;

    const response = await POST(imageRequest());

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      url: 'https://cdn.example.com/blog/U1/hash.webp',
      quota: { usedBytes: 3, limitBytes: 209_715_200, remainingBytes: 209_715_197 },
    });
    expect(state.uploaded).toEqual({
      userId: 'U1',
      size: 3,
      mime: 'image/webp',
      options: { isAdmin: true },
    });
    expect(state.slotReleased).toBe(1);
  });

  it('配额超限和相同图片上传中返回可恢复错误并释放槽位', async () => {
    state.uploadError = {
      code: 'storage_quota_exceeded',
      details: { usedBytes: 100, limitBytes: 100, requestedBytes: 1 },
    };
    const quota = await POST(imageRequest());
    expect(quota.status).toBe(413);
    await expect(quota.json()).resolves.toMatchObject({
      code: 'storage_quota_exceeded',
      details: { usedBytes: 100, limitBytes: 100, requestedBytes: 1 },
    });

    state.uploadError = {
      code: 'image_upload_in_progress',
      details: { retryAfter: 2 },
    };
    const duplicate = await POST(imageRequest());
    expect(duplicate.status).toBe(409);
    expect(duplicate.headers.get('retry-after')).toBe('2');
    await expect(duplicate.json()).resolves.toMatchObject({
      code: 'image_upload_in_progress',
    });
    expect(state.slotReleased).toBe(2);
  });

  it('multipart 总体过大和单文件超过 5MB 都返回 413', async () => {
    const oversizedMultipart = new NextRequest('https://imagentx.top/api/blog/upload-image', {
      method: 'POST',
      headers: {
        'content-type': 'multipart/form-data; boundary=test',
        'content-length': '5256001',
      },
      body: 'not-read',
    });
    const multipartResponse = await POST(oversizedMultipart);

    const form = new FormData();
    form.set('file', new File([new Uint8Array(5_000_001)], 'large.png', {
      type: 'image/png',
    }));
    const fileResponse = await POST(new NextRequest(
      'https://imagentx.top/api/blog/upload-image',
      { method: 'POST', body: form },
    ));

    expect(multipartResponse.status).toBe(413);
    expect(fileResponse.status).toBe(413);
    await expect(multipartResponse.json()).resolves.toMatchObject({
      error: '图片大小不能超过 5MB',
    });
    await expect(fileResponse.json()).resolves.toMatchObject({
      error: '图片大小不能超过 5MB',
    });
    expect(state.uploaded).toBeNull();
    expect(state.slotReleased).toBe(2);
  });

  it('存储错误统一返回带稳定错误码的 503，不伪装成配额错误', async () => {
    state.storageConfigured = false;
    const notConfigured = await POST(imageRequest());
    expect(notConfigured.status).toBe(503);
    await expect(notConfigured.json()).resolves.toMatchObject({
      code: 'storage_unavailable',
    });

    state.storageConfigured = true;
    state.uploadUnknownError = true;
    const unavailable = await POST(imageRequest());
    expect(unavailable.status).toBe(503);
    await expect(unavailable.json()).resolves.toMatchObject({
      code: 'storage_unavailable',
    });
    expect(state.slotReleased).toBe(1);
  });

  it('并发槽位满时在读取 multipart 前返回 upload_busy', async () => {
    state.slotAvailable = false;
    const request = new NextRequest('https://imagentx.top/api/blog/upload-image', {
      method: 'POST',
      headers: { 'content-type': 'multipart/form-data; boundary=test' },
      // 若路由错误地先解析 body，会返回 400；429 证明槽位检查发生在解析前。
      body: 'not-valid-multipart',
    });

    const response = await POST(request);

    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('1');
    await expect(response.json()).resolves.toMatchObject({ code: 'upload_busy' });
    expect(state.slotReleased).toBe(0);
  });

  it('共享用户限流命中时返回 Retry-After，且不占并发槽位', async () => {
    state.uploadLimited = true;
    state.uploadLimitResetAt = Date.now() + 5_000;

    const response = await POST(imageRequest());

    expect(response.status).toBe(429);
    expect(Number(response.headers.get('retry-after'))).toBeGreaterThan(0);
    await expect(response.json()).resolves.toMatchObject({ code: 'rate_limited' });
    expect(state.slotReleased).toBe(0);
    expect(state.uploaded).toBeNull();
  });
});
