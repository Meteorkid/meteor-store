import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  addDraft: vi.fn(),
  resolveDraftSource: vi.fn(),
  inlineImages: vi.fn(),
  resolveCoverMediaId: vi.fn(),
  restorePreviewImages: vi.fn((html: string) => html),
}));

vi.mock('../client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../client')>();
  return { ...actual, addDraft: mocks.addDraft };
});
vi.mock('../config', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../config')>();
  return { ...actual, isWechatMpConfigured: () => true };
});
vi.mock('../sources', () => ({ resolveDraftSource: mocks.resolveDraftSource }));
vi.mock('../images', () => ({
  inlineImages: mocks.inlineImages,
  resolveCoverMediaId: mocks.resolveCoverMediaId,
  restorePreviewImages: mocks.restorePreviewImages,
}));

import { createWechatDraft } from '../draft';

const source = { kind: 'markdown' as const, markdown: '# 测试\n\n正文内容' };
const resolved = {
  title: '测试标题',
  author: '作者',
  digest: '摘要',
  markdown: '正文内容',
  sourceUrl: 'https://example.com/blog/p/abc',
};

describe('createWechatDraft', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.resolveDraftSource.mockResolvedValue(resolved);
    mocks.inlineImages.mockResolvedValue({ html: '<p>正文</p>', uploaded: 0, warnings: [] });
    mocks.resolveCoverMediaId.mockResolvedValue({ mediaId: 'COVER_MEDIA_ID', source: '/og-image.png', reused: true });
    mocks.addDraft.mockResolvedValue('DRAFT_MEDIA_ID');
  });

  it('拒绝自动发表：个人主体账号没有 freepublish 权限', async () => {
    await expect(createWechatDraft({ source, dryRun: false, publish: true })).rejects.toMatchObject({
      code: 'publish_unsupported',
    });
    expect(mocks.addDraft).not.toHaveBeenCalled();
  });

  it('dry-run 只做转换，不上传图片也不写草稿', async () => {
    const result = await createWechatDraft({ source, dryRun: true, publish: false });
    expect(result.mode).toBe('preview');
    expect(result.title).toBe('测试标题');
    expect(result.imageSources).toEqual([]);
    expect(mocks.inlineImages).not.toHaveBeenCalled();
    expect(mocks.resolveCoverMediaId).not.toHaveBeenCalled();
    expect(mocks.addDraft).not.toHaveBeenCalled();
  });

  it('正式提交时转存图片、上传封面并建草稿', async () => {
    const result = await createWechatDraft({ source, dryRun: false, publish: false });
    expect(result.mode).toBe('created');
    expect(result.mediaId).toBe('DRAFT_MEDIA_ID');
    expect(result.accountMode).toBe('draft-only');
    expect(mocks.addDraft).toHaveBeenCalledWith(expect.objectContaining({
      title: '测试标题',
      thumb_media_id: 'COVER_MEDIA_ID',
      content_source_url: resolved.sourceUrl,
    }));
  });

  it('管理员覆盖字段优先于内容源', async () => {
    await createWechatDraft({
      source,
      dryRun: true,
      publish: false,
      overrides: { title: '改过的标题', digest: '改过的摘要' },
    });
    expect(mocks.resolveDraftSource).toHaveBeenCalledWith(source);
    const result = await createWechatDraft({
      source, dryRun: false, publish: false,
      overrides: { title: '改过的标题', digest: '改过的摘要' },
    });
    expect(result.title).toBe('改过的标题');
    expect(result.digest).toBe('改过的摘要');
  });
});
