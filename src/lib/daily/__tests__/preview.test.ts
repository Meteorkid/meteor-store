import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { DailyContent, DailyEdition, DailyLinkItem } from '../types';
import { englishLessons } from '../english-lessons';
import { DAILY_PREVIEW_MAX_BYTES, DailyPreviewResponseSchema } from '../panel-types';
import { DAILY_EDITION_CHANNEL_IDS } from '../channels';

const mocks = vi.hoisted(() => ({ editions: vi.fn(), previous: vi.fn() }));
vi.mock('../service', () => ({ getDailyEditions: mocks.editions, getLatestPublishedDailyDates: mocks.previous }));
import { getDailyPreview } from '../preview';

const date = '2026-10-23';
const updatedAt = `${date}T01:00:00.000Z`;
function edition(overrides: Partial<DailyEdition> = {}): DailyEdition {
  return { id: `${date}:english`, date, channel: 'english', status: 'published', title: '学习表达', summary: '不重复传输摘要',
    content: englishLessons[0].content, sourceKey: 'internal', publishedAt: updatedAt, updatedAt, ...overrides };
}
beforeEach(() => { vi.clearAllMocks(); mocks.previous.mockResolvedValue({ events: '2026-10-22' }); });

describe('公告日刊预览', () => {
  it('提供真实词汇而不携带长文、题目或内部字段，缺稿保留独立状态', async () => {
    mocks.editions.mockResolvedValue([edition(), edition({ channel: 'ai', status: 'draft', title: '保密草稿', content: null })]);
    const result = await getDailyPreview(date);
    expect(mocks.editions).toHaveBeenCalledWith(date);
    expect(result.editions).toHaveLength(7);
    expect(result.editions[0]).toMatchObject({ channel: 'english', status: 'published', content: { kind: 'english', vocabulary: englishLessons[0].content.vocabulary } });
    expect(result.editions.find(row => row.channel === 'ai')).toMatchObject({ status: 'unpublished', title: '', content: null, totalCount: 0 });
    expect(result.editions.find(row => row.channel === 'events')).toMatchObject({ status: 'unpublished', previousDate: '2026-10-22' });
    const body = JSON.stringify(result);
    for (const forbidden of ['保密草稿', 'sourceKey', 'passage', 'questions']) expect(body).not.toContain(forbidden);
  });

  it('历史日期聚合失败仍展示今日词汇，只省略历史入口', async () => {
    mocks.editions.mockResolvedValue([edition()]);
    mocks.previous.mockRejectedValue(new Error('history unavailable'));
    const result = await getDailyPreview(date);
    expect(result.editions[0]).toMatchObject({ status: 'published', content: { kind: 'english', vocabulary: englishLessons[0].content.vocabulary } });
    expect(result.editions.every(row => row.previousDate === undefined)).toBe(true);
  });

  it('核心公开内容读取失败仍向接口上抛，不伪造空稿', async () => {
    mocks.editions.mockRejectedValue(new Error('content unavailable'));
    await expect(getDailyPreview(date)).rejects.toThrow('content unavailable');
  });

  it('空稿、来源失败和下架不透出文本，格式损坏的公开正文也不透出', async () => {
    mocks.editions.mockResolvedValue([
      edition({ channel: 'ai', status: 'empty', title: '空稿私密信息' }),
      edition({ channel: 'papers', status: 'failed', title: '失败私密信息', error: 'upstream secret' }),
      edition({ channel: 'events', status: 'draft', title: '已下架私密信息' }),
      edition({ channel: 'english', title: '错栏目私密信息', content: { kind: 'ai', items: [] } as unknown as DailyContent }),
    ]);
    const result = await getDailyPreview(date);
    expect(result.editions.find(row => row.channel === 'ai')?.status).toBe('empty');
    expect(result.editions.find(row => row.channel === 'papers')?.status).toBe('failed');
    expect(result.editions.find(row => row.channel === 'events')?.status).toBe('unpublished');
    expect(result.editions.find(row => row.channel === 'english')?.status).toBe('failed');
    expect(JSON.stringify(result)).not.toContain('私密信息');
    expect(JSON.stringify(result)).not.toContain('secret');
  });

  it('每栏最多五条且开源一条，裁剪大字段并约束最坏UTF8响应体积', async () => {
    const item: DailyLinkItem = {
      id: '项'.repeat(300), title: '题'.repeat(300), summary: '摘'.repeat(6000), originalAbstract: '原'.repeat(12000),
      url: `https://example.com/${'x'.repeat(1900)}`, sourceName: '源'.repeat(100), sourceType: 'official',
      sourcePublishedAt: updatedAt, authors: Array.from({ length: 100 }, () => '人'.repeat(200)),
      organization: '组'.repeat(200), location: '地'.repeat(300), eligibility: '条'.repeat(2000),
      verifiedAt: updatedAt, startAt: updatedAt, timeZone: 'Asia/Shanghai', phase: 'upcoming',
      roleType: 'internship', remoteStatus: 'hybrid', difficulty: 'advanced', preprint: true,
    };
    const counts = { papers: 3, ai: 5, events: 10, 'open-source': 1, competitions: 3, internships: 3 };
    const rows = DAILY_EDITION_CHANNEL_IDS.map(channel => edition({ channel, title: '刊'.repeat(300), content: channel === 'english'
      ? { ...englishLessons[0].content, vocabulary: Array.from({ length: 10 }, () => ({ term: '词'.repeat(100), meaning: '义'.repeat(500), example: '例'.repeat(1000), translation: '译'.repeat(1000) })) }
      : { kind: channel, items: Array.from({ length: counts[channel] }, (_, index) => ({ ...item, id: `${index}${item.id.slice(1)}` })) } }));
    mocks.editions.mockResolvedValue(rows);
    const result = await getDailyPreview(date);
    expect(DailyPreviewResponseSchema.safeParse(result).success).toBe(true);
    expect(Buffer.byteLength(JSON.stringify(result), 'utf8')).toBeLessThanOrEqual(DAILY_PREVIEW_MAX_BYTES);
    for (const row of result.editions) {
      expect(row.status).toBe('published');
      const shown = row.content?.kind === 'english' ? row.content.vocabulary.length : row.content?.items.length;
      expect(shown).toBe(Math.min(row.totalCount, row.channel === 'open-source' ? 1 : 5));
    }
    expect(JSON.stringify(result)).not.toMatch(/originalAbstract|authors|eligibility|passage|questions|sourceKey/);
    const ai = result.editions.find(row => row.channel === 'ai')!;
    if (ai.content?.kind !== 'ai') throw new Error('missing AI preview');
    expect(ai.content.items[0].summary).toHaveLength(240);
    expect(ai.content.items[0].title).toHaveLength(160);
  });

  it('超UTF8上限或带凭据的URL仅省略外链，保留真实条目', async () => {
    const common = { id: 'item', title: '标题', summary: '摘要', sourceName: '来源', sourceType: 'official' as const };
    mocks.editions.mockResolvedValue([edition({ channel: 'ai', content: { kind: 'ai', items: [
      { ...common, url: `https://example.com/${'汉'.repeat(1000)}` },
      { ...common, id: 'credentials', url: 'https://user:password@example.com/path' },
      { ...common, id: 'safe', url: 'https://example.com/safe' },
    ] } })]);
    const row = (await getDailyPreview(date)).editions.find(value => value.channel === 'ai')!;
    if (row.content?.kind !== 'ai') throw new Error('missing AI preview');
    expect(row.totalCount).toBe(3);
    expect(row.content.items[0].url).toBeUndefined();
    expect(row.content.items[1].url).toBeUndefined();
    expect(row.content.items[2].url).toBe('https://example.com/safe');
  });
});
