import { describe, expect, it } from 'vitest';
import { blogApiAuthError, blogApiError, blogApiSuccess } from '../blog-api-response';

describe('博客 API 响应合约', () => {
  it('私有成功响应统一禁用缓存并按 Authorization 分流', async () => {
    const response = blogApiSuccess({ post: { id: 'P1' } }, { status: 201 });

    expect(response.status).toBe(201);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(response.headers.get('vary')).toBe('Authorization');
    await expect(response.json()).resolves.toEqual({ post: { id: 'P1' } });
  });

  it('鉴权失败使用稳定错误结构和标准 Bearer 头', async () => {
    const invalid = blogApiAuthError('invalid_token');
    const insufficient = blogApiAuthError('insufficient_scope');

    expect(invalid.status).toBe(401);
    expect(invalid.headers.get('www-authenticate')).toBe('Bearer');
    await expect(invalid.json()).resolves.toEqual({
      error: {
        code: 'invalid_token',
        message: '访问令牌无效或已过期',
        details: {},
      },
    });
    expect(insufficient.status).toBe(403);
    await expect(insufficient.json()).resolves.toMatchObject({
      error: { code: 'insufficient_scope' },
    });
  });

  it('限流错误可以携带详情和 Retry-After', async () => {
    const response = blogApiError(429, 'rate_limited', '请求过于频繁', {
      details: { resetAt: '2026-08-10T00:01:00.000Z' },
      retryAfter: 60,
    });

    expect(response.headers.get('retry-after')).toBe('60');
    await expect(response.json()).resolves.toEqual({
      error: {
        code: 'rate_limited',
        message: '请求过于频繁',
        details: { resetAt: '2026-08-10T00:01:00.000Z' },
      },
    });
  });

  it('图片配额与上传繁忙使用独立稳定错误码', async () => {
    const quota = blogApiError(413, 'storage_quota_exceeded', '账户图片存储空间已用完', {
      details: { usedBytes: 100, limitBytes: 100, requestedBytes: 1 },
    });
    const inProgress = blogApiError(409, 'image_upload_in_progress', '相同图片正在上传', {
      retryAfter: 2,
    });
    const busy = blogApiError(429, 'upload_busy', '图片上传服务繁忙', {
      retryAfter: 1,
    });

    await expect(quota.json()).resolves.toMatchObject({
      error: { code: 'storage_quota_exceeded' },
    });
    await expect(inProgress.json()).resolves.toMatchObject({
      error: { code: 'image_upload_in_progress' },
    });
    expect(inProgress.headers.get('retry-after')).toBe('2');
    await expect(busy.json()).resolves.toMatchObject({
      error: { code: 'upload_busy' },
    });
    expect(busy.headers.get('retry-after')).toBe('1');
  });
});
