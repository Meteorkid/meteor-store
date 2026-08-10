import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createHash } from 'crypto';
import sharp from 'sharp';

const state = vi.hoisted(() => ({
  configured: true,
}));
const send = vi.hoisted(() => vi.fn());
const prepareReservation = vi.hoisted(() => vi.fn());
const confirmReservation = vi.hoisted(() => vi.fn());
const releaseReservation = vi.hoisted(() => vi.fn());
const discardAllocation = vi.hoisted(() => vi.fn());

vi.mock('../blog-image-quota', () => ({
  BLOG_IMAGE_RESERVATION_STALE_MS: 15 * 60_000,
  discardBlogImageAllocation: (...args: unknown[]) => discardAllocation(...args),
  confirmBlogImageReservation: (...args: unknown[]) => confirmReservation(...args),
  getBlogImageLimitBytes: (isAdmin: boolean) => isAdmin ? 1024 * 1024 * 1024 : 200 * 1024 * 1024,
  prepareBlogImageReservation: (...args: unknown[]) => prepareReservation(...args),
  releaseBlogImageReservation: (...args: unknown[]) => releaseReservation(...args),
}));

vi.mock('../r2-client', () => ({
  readR2Config: () => state.configured ? {
    accountId: 'account',
    accessKeyId: 'key',
    secretAccessKey: 'secret',
    bucket: 'bucket',
    publicBase: 'https://cdn.example.com',
  } : null,
  getClient: () => ({ send }),
}));

vi.mock('@aws-sdk/client-s3', () => ({
  PutObjectCommand: class PutObjectCommand {
    constructor(public input: Record<string, unknown>) {}
  },
  HeadObjectCommand: class HeadObjectCommand {
    constructor(public input: Record<string, unknown>) {}
  },
  ListObjectsV2Command: class ListObjectsV2Command {
    constructor(public input: Record<string, unknown>) {}
  },
  DeleteObjectsCommand: class DeleteObjectsCommand {
    constructor(public input: Record<string, unknown>) {}
  },
  DeleteObjectCommand: class DeleteObjectCommand {
    constructor(public input: Record<string, unknown>) {}
  },
}));

describe('博客图片账户清理', () => {
  beforeEach(() => {
    send.mockReset();
    state.configured = true;
  });

  it('删除用户编码前缀下列出的全部对象', async () => {
    send
      .mockResolvedValueOnce({ Contents: [{ Key: 'blog/U%2F1/a.webp' }] })
      .mockResolvedValueOnce({});
    const { deleteUserBlogImages } = await import('../blog-image-storage');

    await deleteUserBlogImages('U/1');

    expect(send).toHaveBeenCalledTimes(2);
    expect(send.mock.calls[0][0].input).toMatchObject({
      Bucket: 'bucket',
      Prefix: 'blog/U%2F1/',
    });
    expect(send.mock.calls[1][0].input).toMatchObject({
      Bucket: 'bucket',
      Delete: { Objects: [{ Key: 'blog/U%2F1/a.webp' }] },
    });
  });

  it('R2 未配置时直接跳过', async () => {
    state.configured = false;
    const { deleteUserBlogImages } = await import('../blog-image-storage');

    await deleteUserBlogImages('U1');

    expect(send).not.toHaveBeenCalled();
  });

  it('批量删除部分失败时只记录失败数量，交给孤儿对账处理', async () => {
    send
      .mockResolvedValueOnce({ Contents: [{ Key: 'blog/U1/a.webp' }] })
      .mockResolvedValueOnce({ Errors: [{ Key: 'blog/U1/a.webp', Code: 'InternalError' }] });
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { deleteUserBlogImages } = await import('../blog-image-storage');

    await deleteUserBlogImages('U1');

    expect(log).toHaveBeenCalledWith(
      'deleteUserBlogImages partial failure:',
      { failedObjects: 1 },
    );
    log.mockRestore();
  });
});

describe('博客图片配额上传', () => {
  beforeEach(() => {
    send.mockReset();
    prepareReservation.mockReset();
    confirmReservation.mockReset();
    releaseReservation.mockReset();
    discardAllocation.mockReset();
    state.configured = true;
    confirmReservation.mockResolvedValue({
      usedBytes: 3,
      limitBytes: 200 * 1024 * 1024,
      remainingBytes: 200 * 1024 * 1024 - 3,
    });
    releaseReservation.mockResolvedValue({
      usedBytes: 0,
      limitBytes: 200 * 1024 * 1024,
      remainingBytes: 200 * 1024 * 1024,
    });
  });

  it('新对象使用完整 SHA-256 key，并在 R2 成功后返回计费结果', async () => {
    const bytes = new Uint8Array([1, 2, 3]);
    const hash = createHash('sha256').update(bytes).digest('hex');
    const key = `blog/U1/${hash}.webp`;
    prepareReservation.mockResolvedValue({
      kind: 'reserved',
      reservation: {
        id: 'BI1', key, sizeBytes: 3, updatedAt: '2026-08-10T00:00:00.000Z',
      },
      quota: {
        usedBytes: 3,
        limitBytes: 200 * 1024 * 1024,
        remainingBytes: 200 * 1024 * 1024 - 3,
      },
    });
    send.mockResolvedValueOnce({});
    const { uploadBlogImage } = await import('../blog-image-storage');

    await expect(uploadBlogImage('U1', bytes, 'image/webp', { isAdmin: false }))
      .resolves.toEqual({
        url: `https://cdn.example.com/${key}`,
        key,
        quota: {
          usedBytes: 3,
          limitBytes: 200 * 1024 * 1024,
          remainingBytes: 200 * 1024 * 1024 - 3,
        },
      });
    expect(prepareReservation).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'U1',
      objectKey: key,
      legacyObjectKey: `blog/U1/${hash.slice(0, 16)}.webp`,
      sizeBytes: 3,
      limitBytes: 200 * 1024 * 1024,
    }));
    expect(send).toHaveBeenCalledOnce();
    expect(send.mock.calls[0][0].input).toMatchObject({ Key: key, Body: bytes });
    expect(confirmReservation).toHaveBeenCalledWith(expect.objectContaining({
      reservationId: 'BI1', userId: 'U1', limitBytes: 200 * 1024 * 1024,
    }));
  });

  it('超时 allocating 可条件释放后重试，且不会写入 R2', async () => {
    const bytes = new Uint8Array([4, 5, 6]);
    const hash = createHash('sha256').update(bytes).digest('hex');
    const key = `blog/U1/${hash}.png`;
    const quota = {
      usedBytes: 1024,
      limitBytes: 200 * 1024 * 1024,
      remainingBytes: 200 * 1024 * 1024 - 1024,
    };
    prepareReservation
      .mockResolvedValueOnce({
        kind: 'in_progress', retryAfter: 2,
        reservation: {
          id: 'BI-stale', key, sizeBytes: 3, status: 'allocating',
          updatedAt: '2000-01-01T00:00:00.000Z',
        },
      })
      .mockResolvedValueOnce({ kind: 'ready', key, quota });
    discardAllocation.mockResolvedValueOnce(true);
    const { uploadBlogImage } = await import('../blog-image-storage');

    await expect(uploadBlogImage('U1', bytes, 'image/png', { isAdmin: false }))
      .resolves.toEqual({ url: `https://cdn.example.com/${key}`, key, quota });
    expect(discardAllocation).toHaveBeenCalledWith({
      reservationId: 'BI-stale',
      userId: 'U1',
      expectedUpdatedAt: '2000-01-01T00:00:00.000Z',
    });
    expect(prepareReservation).toHaveBeenCalledTimes(2);
    expect(send).not.toHaveBeenCalled();
  });

  it('超时 reserved 且 R2 对象存在时修复为 ready 并复用', async () => {
    const bytes = new Uint8Array([7, 8, 9]);
    const hash = createHash('sha256').update(bytes).digest('hex');
    const key = `blog/U1/${hash}.jpg`;
    const quota = {
      usedBytes: 3,
      limitBytes: 200 * 1024 * 1024,
      remainingBytes: 200 * 1024 * 1024 - 3,
    };
    prepareReservation.mockResolvedValueOnce({
      kind: 'in_progress', retryAfter: 2,
      reservation: {
        id: 'BI-reserved', key, sizeBytes: 3, status: 'reserved',
        updatedAt: '2000-01-01T00:00:00.000Z',
      },
    });
    send.mockResolvedValueOnce({ ContentLength: 3 });
    confirmReservation.mockResolvedValueOnce(quota);
    const { uploadBlogImage } = await import('../blog-image-storage');

    await expect(uploadBlogImage('U1', bytes, 'image/jpeg', { isAdmin: false }))
      .resolves.toEqual({ url: `https://cdn.example.com/${key}`, key, quota });
    expect(send).toHaveBeenCalledOnce();
    expect(send.mock.calls[0][0].constructor.name).toBe('HeadObjectCommand');
    expect(send.mock.calls[0][0].input).toMatchObject({ Bucket: 'bucket', Key: key });
    expect(confirmReservation).toHaveBeenCalledWith(expect.objectContaining({
      reservationId: 'BI-reserved', userId: 'U1',
    }));
  });

  it('超时 reserved 但 R2 不存在时原子释放并重新上传', async () => {
    const bytes = new Uint8Array([10, 11, 12]);
    const hash = createHash('sha256').update(bytes).digest('hex');
    const key = `blog/U1/${hash}.webp`;
    const quota = {
      usedBytes: 3,
      limitBytes: 200 * 1024 * 1024,
      remainingBytes: 200 * 1024 * 1024 - 3,
    };
    prepareReservation
      .mockResolvedValueOnce({
        kind: 'in_progress', retryAfter: 2,
        reservation: {
          id: 'BI-old', key, sizeBytes: 3, status: 'reserved',
          updatedAt: '2000-01-01T00:00:00.000Z',
        },
      })
      .mockResolvedValueOnce({
        kind: 'reserved',
        reservation: {
          id: 'BI-new', key, sizeBytes: 3, updatedAt: '2026-08-10T00:00:00.000Z',
        },
        quota,
      });
    send
      .mockRejectedValueOnce({ name: 'NotFound', $metadata: { httpStatusCode: 404 } })
      .mockResolvedValueOnce({});
    confirmReservation.mockResolvedValueOnce(quota);
    const { uploadBlogImage } = await import('../blog-image-storage');

    await expect(uploadBlogImage('U1', bytes, 'image/webp', { isAdmin: false }))
      .resolves.toEqual({ url: `https://cdn.example.com/${key}`, key, quota });
    expect(releaseReservation).toHaveBeenCalledWith({
      reservationId: 'BI-old', userId: 'U1', limitBytes: 200 * 1024 * 1024,
    });
    expect(send).toHaveBeenCalledTimes(2);
    expect(send.mock.calls[0][0].constructor.name).toBe('HeadObjectCommand');
    expect(send.mock.calls[1][0].constructor.name).toBe('PutObjectCommand');
  });

  it('额度不足时返回稳定错误详情且不写 R2', async () => {
    prepareReservation.mockResolvedValueOnce({
      kind: 'quota_exceeded',
      quota: {
        usedBytes: 208_000_000,
        limitBytes: 200 * 1024 * 1024,
        remainingBytes: 1_715_200,
      },
      requestedBytes: 5_000_000,
    });
    const { BlogImageUploadError, uploadBlogImage } = await import('../blog-image-storage');

    const error = await uploadBlogImage(
      'U1', new Uint8Array([1]), 'image/png', { isAdmin: false },
    ).catch((reason: unknown) => reason);

    expect(error).toBeInstanceOf(BlogImageUploadError);
    expect(error).toMatchObject({
      code: 'storage_quota_exceeded',
      details: {
        usedBytes: 208_000_000,
        limitBytes: 200 * 1024 * 1024,
        requestedBytes: 5_000_000,
      },
    });
    expect(send).not.toHaveBeenCalled();
  });

  it('未超时的同图 reservation 返回可重试冲突，不执行修复', async () => {
    prepareReservation.mockResolvedValueOnce({
      kind: 'in_progress', retryAfter: 2,
      reservation: {
        id: 'BI-active', key: 'blog/U1/active.webp', sizeBytes: 3,
        status: 'allocating', updatedAt: new Date().toISOString(),
      },
    });
    const { uploadBlogImage } = await import('../blog-image-storage');

    await expect(uploadBlogImage(
      'U1', new Uint8Array([1, 2, 3]), 'image/webp', { isAdmin: false },
    )).rejects.toMatchObject({
      code: 'image_upload_in_progress',
      details: { retryAfter: 2 },
    });
    expect(discardAllocation).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it('管理员额度只由服务端 options 决定并传给账本', async () => {
    const limitBytes = 1024 * 1024 * 1024;
    prepareReservation.mockResolvedValueOnce({
      kind: 'ready',
      key: 'blog/U1/admin.webp',
      quota: { usedBytes: 3, limitBytes, remainingBytes: limitBytes - 3 },
    });
    const { uploadBlogImage } = await import('../blog-image-storage');

    await uploadBlogImage('U1', new Uint8Array([1, 2, 3]), 'image/webp', { isAdmin: true });

    expect(prepareReservation).toHaveBeenCalledWith(expect.objectContaining({ limitBytes }));
  });

  it('PUT 异常后即使 HEAD 暂时为 404 也保留额度，等待 stale 修复', async () => {
    const bytes = new Uint8Array([20, 21, 22]);
    const hash = createHash('sha256').update(bytes).digest('hex');
    const key = `blog/U1/${hash}.webp`;
    prepareReservation.mockResolvedValueOnce({
      kind: 'reserved',
      reservation: {
        id: 'BI-failed', key, sizeBytes: 3, updatedAt: '2026-08-10T00:00:00.000Z',
      },
      quota: {
        usedBytes: 3,
        limitBytes: 200 * 1024 * 1024,
        remainingBytes: 200 * 1024 * 1024 - 3,
      },
    });
    send
      .mockRejectedValueOnce(new Error('R2 secret endpoint'))
      .mockRejectedValueOnce({ name: 'NotFound', $metadata: { httpStatusCode: 404 } });
    const { BlogImageUploadError, uploadBlogImage } = await import('../blog-image-storage');

    const error = await uploadBlogImage('U1', bytes, 'image/webp', { isAdmin: false })
      .catch((reason: unknown) => reason);

    expect(error).toBeInstanceOf(BlogImageUploadError);
    expect(error).toMatchObject({ code: 'storage_unavailable', details: undefined });
    expect(releaseReservation).not.toHaveBeenCalled();
    expect(confirmReservation).not.toHaveBeenCalled();
  });

  it('PUT 返回异常但 HEAD 确认同尺寸对象已落盘时完成 ready，而不是释放额度', async () => {
    const bytes = new Uint8Array([23, 24, 25]);
    const hash = createHash('sha256').update(bytes).digest('hex');
    const key = `blog/U1/${hash}.webp`;
    const quota = {
      usedBytes: 3,
      limitBytes: 200 * 1024 * 1024,
      remainingBytes: 200 * 1024 * 1024 - 3,
    };
    prepareReservation.mockResolvedValueOnce({
      kind: 'reserved',
      reservation: {
        id: 'BI-ambiguous', key, sizeBytes: 3, updatedAt: '2026-08-10T00:00:00.000Z',
      },
      quota,
    });
    send
      .mockRejectedValueOnce(new Error('socket closed after upload'))
      .mockResolvedValueOnce({ ContentLength: 3 });
    confirmReservation.mockResolvedValueOnce(quota);
    const { uploadBlogImage } = await import('../blog-image-storage');

    await expect(uploadBlogImage('U1', bytes, 'image/webp', { isAdmin: false }))
      .resolves.toEqual({ url: `https://cdn.example.com/${key}`, key, quota });
    expect(send.mock.calls.map(([command]) => command.constructor.name)).toEqual([
      'PutObjectCommand',
      'HeadObjectCommand',
    ]);
    expect(confirmReservation).toHaveBeenCalledWith(expect.objectContaining({
      reservationId: 'BI-ambiguous', userId: 'U1',
    }));
    expect(releaseReservation).not.toHaveBeenCalled();
  });

  it('PUT 结果不确定且 HEAD 也失败时保留 reserved，绝不释放额度', async () => {
    const bytes = new Uint8Array([26, 27, 28]);
    const hash = createHash('sha256').update(bytes).digest('hex');
    const key = `blog/U1/${hash}.png`;
    prepareReservation.mockResolvedValueOnce({
      kind: 'reserved',
      reservation: {
        id: 'BI-uncertain', key, sizeBytes: 3, updatedAt: '2026-08-10T00:00:00.000Z',
      },
      quota: {
        usedBytes: 3,
        limitBytes: 200 * 1024 * 1024,
        remainingBytes: 200 * 1024 * 1024 - 3,
      },
    });
    send
      .mockRejectedValueOnce(new Error('PUT timeout'))
      .mockRejectedValueOnce(new Error('HEAD timeout'));
    const { uploadBlogImage } = await import('../blog-image-storage');

    await expect(uploadBlogImage('U1', bytes, 'image/png', { isAdmin: false }))
      .rejects.toMatchObject({ code: 'storage_unavailable' });
    expect(send.mock.calls.map(([command]) => command.constructor.name)).toEqual([
      'PutObjectCommand',
      'HeadObjectCommand',
    ]);
    expect(releaseReservation).not.toHaveBeenCalled();
    expect(confirmReservation).not.toHaveBeenCalled();
  });

  it('HEAD 对象尺寸与 reservation 不同则保留 reserved 交给对账', async () => {
    const bytes = new Uint8Array([33, 34, 35]);
    const hash = createHash('sha256').update(bytes).digest('hex');
    const key = `blog/U1/${hash}.jpg`;
    prepareReservation.mockResolvedValueOnce({
      kind: 'in_progress', retryAfter: 2,
      reservation: {
        id: 'BI-size-mismatch', key, sizeBytes: 3, status: 'reserved',
        updatedAt: '2000-01-01T00:00:00.000Z',
      },
    });
    send.mockResolvedValueOnce({ ContentLength: 999 });
    const { uploadBlogImage } = await import('../blog-image-storage');

    await expect(uploadBlogImage('U1', bytes, 'image/jpeg', { isAdmin: false }))
      .rejects.toMatchObject({ code: 'storage_unavailable' });
    expect(confirmReservation).not.toHaveBeenCalled();
    expect(releaseReservation).not.toHaveBeenCalled();
  });

  it('R2 已成功但 ready 确认失败时保留 reserved 供对账，不错误扣回额度', async () => {
    const bytes = new Uint8Array([30, 31, 32]);
    const hash = createHash('sha256').update(bytes).digest('hex');
    const key = `blog/U1/${hash}.gif`;
    prepareReservation.mockResolvedValueOnce({
      kind: 'reserved',
      reservation: {
        id: 'BI-confirm', key, sizeBytes: 3, updatedAt: '2026-08-10T00:00:00.000Z',
      },
      quota: {
        usedBytes: 3,
        limitBytes: 200 * 1024 * 1024,
        remainingBytes: 200 * 1024 * 1024 - 3,
      },
    });
    send.mockResolvedValueOnce({});
    confirmReservation.mockRejectedValueOnce(new Error('DB unavailable'));
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { uploadBlogImage } = await import('../blog-image-storage');

    await expect(uploadBlogImage('U1', bytes, 'image/gif', { isAdmin: false }))
      .rejects.toMatchObject({ code: 'storage_unavailable' });
    expect(releaseReservation).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith(
      'blog image upload confirmation failed:', expect.any(Error),
    );
    log.mockRestore();
  });

  it('ready 确认丢失时不删除同 key 对象，避免旧 lease 破坏新 reservation', async () => {
    const bytes = new Uint8Array([36, 37, 38]);
    const hash = createHash('sha256').update(bytes).digest('hex');
    const key = `blog/U1/${hash}.gif`;
    prepareReservation.mockResolvedValueOnce({
      kind: 'reserved',
      reservation: {
        id: 'BI-deleted-account', key, sizeBytes: 3,
        updatedAt: '2026-08-10T00:00:00.000Z',
      },
      quota: {
        usedBytes: 3,
        limitBytes: 200 * 1024 * 1024,
        remainingBytes: 200 * 1024 * 1024 - 3,
      },
    });
    send.mockResolvedValueOnce({});
    confirmReservation.mockResolvedValueOnce(null);
    const { uploadBlogImage } = await import('../blog-image-storage');

    await expect(uploadBlogImage('U1', bytes, 'image/gif', { isAdmin: false }))
      .rejects.toMatchObject({ code: 'storage_unavailable' });
    expect(send.mock.calls.map(([command]) => command.constructor.name))
      .toEqual(['PutObjectCommand']);
  });
});

describe('博客图片字节校验', () => {
  it('按实际解码格式校验 MIME，拒绝伪造和空内容', async () => {
    const { validateBlogImageBytes } = await import('../blog-image-storage');
    const png = new Uint8Array(await sharp({
      create: {
        width: 2,
        height: 2,
        channels: 4,
        background: '#000000',
      },
    }).png().toBuffer());

    await expect(validateBlogImageBytes(png, 'image/png')).resolves.toBe(true);
    await expect(validateBlogImageBytes(png, 'image/jpeg')).resolves.toBe(false);
    await expect(validateBlogImageBytes(new Uint8Array(), 'image/png')).resolves.toBe(false);
    await expect(validateBlogImageBytes(new TextEncoder().encode('<script>'), 'image/png'))
      .resolves.toBe(false);
  });
});
