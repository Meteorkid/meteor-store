import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  listDaily: vi.fn(),
  getPost: vi.fn(),
  getSiteUrl: vi.fn(),
}));

vi.mock('@/lib/daily/service', () => ({ listDailyEditions: mocks.listDaily }));
vi.mock('@/lib/posts', () => ({ getPostById: mocks.getPost }));
vi.mock('@/lib/constants', () => ({ getSiteUrl: mocks.getSiteUrl }));

import { composeXiaohongshuNote, markdownToPlainText, XiaohongshuSourceError } from '../compose';

const publishedDaily = [
  { date: '2026-11-26', channel: 'ai', status: 'published', title: '今天值得看的 AI 工具', summary: '三条更新，先看第一条。' },
  { date: '2026-11-26', channel: 'open-source', status: 'published', title: '一个新的开源项目', summary: '适合做小工具。' },
];

const post = {
  id: 'post-1',
  title: '这是一个非常长的文章标题用于测试小红书标题截断',
  excerpt: '一句话摘要',
  content: '## 小标题\n\n正文 **加粗**，[链接](https://example.com)，以及 `代码`。\n\n```ts\nconst x = 1;\n```\n\n结尾。',
  tags: ['独立开发'],
  status: 'published',
};

describe('小红书文案生成', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getSiteUrl.mockReturnValue('https://imagentx.top');
  });

  it('从日刊生成：标题在 20 字内，正文带栏目，标签去重', async () => {
    mocks.listDaily.mockResolvedValue(publishedDaily);
    const draft = await composeXiaohongshuNote({ kind: 'daily', date: '2026-11-26' });
    expect(draft.title).toBe('每日一新｜2026-11-26');
    expect(draft.title.length).toBeLessThanOrEqual(20);
    expect(draft.body).toContain('今天整理了 2 个栏目');
    expect(draft.body).toContain('今天值得看的 AI 工具');
    expect(draft.tags).toContain('每日一新');
    expect(draft.sourceRef).toBe('2026-11-26');
    expect(draft.sourceUrl).toBe('https://imagentx.top/daily?view=all');
    expect(draft.images).toEqual([]);
  });

  it('日刊没有已发布内容时给出来源错误', async () => {
    mocks.listDaily.mockResolvedValue([{ date: '2026-11-26', channel: 'ai', status: 'draft', title: '草稿', summary: '' }]);
    await expect(composeXiaohongshuNote({ kind: 'daily', date: '2026-11-26' }))
      .rejects.toMatchObject({ code: 'daily_empty' });
  });

  it('从已发布文章生成：标题截断、Markdown 去格式、链接保留来源字段', async () => {
    mocks.getPost.mockResolvedValue(post);
    const draft = await composeXiaohongshuNote({ kind: 'post', postId: 'post-1' });
    expect(draft.title.length).toBeLessThanOrEqual(20);
    expect(draft.title.endsWith('…')).toBe(true);
    expect(draft.body).not.toContain('```');
    expect(draft.body).not.toContain('[链接]');
    expect(draft.body).toContain('链接');
    expect(draft.sourceRef).toBe('post-1');
    expect(draft.sourceUrl).toBe('https://imagentx.top/blog/p/post-1');
    expect(draft.tags).toContain('独立开发');
  });

  it('未发布文章不能生成', async () => {
    mocks.getPost.mockResolvedValue({ ...post, status: 'pending' });
    await expect(composeXiaohongshuNote({ kind: 'post', postId: 'post-1' }))
      .rejects.toBeInstanceOf(XiaohongshuSourceError);
  });

  it('Markdown 去格式不留下标题与图片语法', () => {
    expect(markdownToPlainText('# 标题\n\n![图](x.png)\n\n**正文**')).toBe('标题\n\n正文');
  });
});
