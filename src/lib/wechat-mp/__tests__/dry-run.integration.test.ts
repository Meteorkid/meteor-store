import { describe, expect, it } from 'vitest';
import { createWechatDraft } from '../draft';

/**
 * 不 mock 任何模块的真实 dry-run：验证「选来源 → 渲染 → 预览」整条链路，
 * 同时确认预览路径不读凭据、不联网、不调用素材上传。
 */
describe('公众号草稿 dry-run 端到端', () => {
  it('把 Markdown 渲染成带行内样式的预览，并还原图片地址', async () => {
    const result = await createWechatDraft({
      source: {
        kind: 'markdown',
        markdown: '# 测试文章\n\n正文包含一张图：\n\n![配图](https://cdn.example.com/a.png)\n\n```js\nconst a = 1;\n```',
      },
      dryRun: true,
      publish: false,
    });

    expect(result.mode).toBe('preview');
    expect(result.accountMode).toBe('draft-only');
    expect(result.title).toBe('测试文章');
    expect(result.imageSources).toEqual(['https://cdn.example.com/a.png']);
    expect(result.html).toContain('https://cdn.example.com/a.png');
    expect(result.html).toContain('white-space:pre-wrap');
    expect(result.html).toContain('<section style=');
    expect(result.html).not.toContain('WECHAT_MP_IMAGE_');
    expect(result.digest).toContain('正文包含一张图');
    expect(result.nextStep).toContain('预览');
  });

  it('自动发表请求在触碰任何网络调用之前就被拒绝', async () => {
    await expect(createWechatDraft({
      source: { kind: 'markdown', markdown: '# 标题\n\n正文' },
      dryRun: false,
      publish: true,
    })).rejects.toMatchObject({ code: 'publish_unsupported' });
  });
});
