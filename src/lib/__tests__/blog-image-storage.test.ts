import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  configured: true,
}));
const send = vi.hoisted(() => vi.fn());

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
  ListObjectsV2Command: class ListObjectsV2Command {
    constructor(public input: Record<string, unknown>) {}
  },
  DeleteObjectsCommand: class DeleteObjectsCommand {
    constructor(public input: Record<string, unknown>) {}
  },
}));

describe('博客图片账户清理', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
});
