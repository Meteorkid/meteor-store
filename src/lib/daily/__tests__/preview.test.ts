import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { DailyContent, DailyEdition, DailyLinkItem } from '../types';
import { englishLessons } from '../english-lessons';
import { DAILY_PREVIEW_MAX_BYTES, DailyPreviewResponseSchema } from '../panel-types';
import { DAILY_EDITION_CHANNEL_IDS } from '../channels';

const mocks = vi.hoisted(() => ({ editions: vi.fn(), previous: vi.fn(), recent: vi.fn(), opportunities: vi.fn() }));
vi.mock('../service', () => ({ getDailyEditions: mocks.editions, getLatestPublishedDailyDates: mocks.previous, getPublishedDailyEditionsByDates: mocks.recent }));
vi.mock('../opportunities', () => ({ filterAvailableDailyOpportunities: mocks.opportunities }));
import { getDailyPreview } from '../preview';

const date = '2026-10-23';
const updatedAt = `${date}T01:00:00.000Z`;
function edition(overrides: Partial<DailyEdition> = {}): DailyEdition {
  return { id: `${date}:english`, date, channel: 'english', status: 'published', title: '学习表达', summary: '不重复传输摘要',
    content: englishLessons[0].content, sourceKey: 'internal', publishedAt: updatedAt, updatedAt, ...overrides };
}
beforeEach(() => {
  vi.clearAllMocks(); vi.useFakeTimers(); vi.setSystemTime(new Date('2026-10-23T02:00:00.000Z'));
  mocks.previous.mockResolvedValue({ events: '2026-10-22' }); mocks.recent.mockResolvedValue([]);
  mocks.opportunities.mockImplementation(async (rows: DailyEdition[]) => rows);
});
afterEach(() => vi.useRealTimers());

describe('公告日刊预览', () => {
  it('recent模式在今日缺稿时显示最近一期并标记真实日期，不改变旧模式合同', async () => {
    mocks.editions.mockResolvedValue([edition({ status: 'empty', content: null })]);
    mocks.previous.mockResolvedValue({ english: '2026-10-22' });
    mocks.recent.mockResolvedValue([edition({ id: '2026-10-22:english', date: '2026-10-22', updatedAt: '2026-10-22T00:40:00.000Z' })]);
    const legacy = await getDailyPreview(date);
    expect(Object.keys(legacy).sort()).toEqual(['date', 'editions', 'updatedAt']);
    expect(legacy).not.toHaveProperty('historyFailed');
    for (const row of legacy.editions) {
      expect(row).not.toHaveProperty('contentDate');
      expect(row).not.toHaveProperty('currentStatus');
    }
    expect(legacy.editions[0].status).toBe('empty');
    expect(mocks.recent).not.toHaveBeenCalled();
    const recent = await getDailyPreview(date, { recent: true });
    expect(recent.historyFailed).toBe(false);
    expect(recent.editions[0]).toMatchObject({ status: 'published', currentStatus: 'empty', contentDate: '2026-10-22', content: { kind: 'english' } });
    expect(recent.date).toBe(date);
    expect(recent.updatedAt).toBe('2026-10-22T00:40:00.000Z');
    expect(mocks.recent).toHaveBeenCalledWith({ english: '2026-10-22' });
  });

  it('今日已有正文不回退；显式历史日期即使recent也保持原期次', async () => {
    mocks.editions.mockResolvedValue([edition()]); mocks.previous.mockResolvedValue({ english: '2026-10-22' });
    const today = await getDailyPreview(date, { recent: true });
    expect(today.editions[0]).not.toHaveProperty('contentDate');
    expect(mocks.recent).not.toHaveBeenCalled();
    mocks.editions.mockResolvedValue([edition({ date: '2026-10-22', status: 'empty', content: null })]);
    mocks.previous.mockResolvedValue({ english: '2026-10-21' });
    const history = await getDailyPreview('2026-10-22', { recent: true });
    expect(history.editions[0]).toMatchObject({ status: 'empty', content: null });
    expect(history.editions[0]).not.toHaveProperty('currentStatus');
    expect(mocks.recent).not.toHaveBeenCalled();
    expect(mocks.opportunities).not.toHaveBeenCalled();
  });

  it('历史日期或正文读取失败标记historyFailed，保留今日有效正文', async () => {
    mocks.editions.mockResolvedValue([edition()]);
    mocks.previous.mockRejectedValueOnce(new Error('history unavailable'));
    const missingDates = await getDailyPreview(date, { recent: true });
    expect(missingDates.historyFailed).toBe(true);
    expect(missingDates.editions[0].status).toBe('published');
    mocks.previous.mockResolvedValue({ ai: '2026-10-22' });
    mocks.recent.mockRejectedValueOnce(new Error('old content unavailable'));
    const missingContent = await getDailyPreview(date, { recent: true });
    expect(missingContent.historyFailed).toBe(true);
    expect(missingContent.editions[0].status).toBe('published');
    expect(missingContent.updatedAt).toBe(updatedAt);
    mocks.editions.mockRejectedValueOnce(new Error('current content unavailable'));
    await expect(getDailyPreview(date, { recent: true })).rejects.toThrow('current content unavailable');
  });

  it('最近机会按当前状态过滤后全失效不复活，也不继续向更早期搜索', async () => {
    const previousDate = '2026-10-22';
    mocks.editions.mockResolvedValue([edition({ channel: 'internships', status: 'empty', content: null })]);
    mocks.previous.mockResolvedValue({ english: previousDate, competitions: previousDate, internships: previousDate });
    const oldEnglish = edition({ date: previousDate });
    const oldContest = edition({ channel: 'competitions', date: previousDate });
    const oldJob = edition({ channel: 'internships', date: previousDate });
    mocks.recent.mockResolvedValue([oldEnglish, oldContest, oldJob]);
    mocks.opportunities.mockResolvedValue([{ ...oldContest, status: 'empty', content: null }, { ...oldJob, status: 'failed', content: null }]);
    const result = await getDailyPreview(date, { recent: true });
    expect(mocks.opportunities).toHaveBeenCalledWith([oldContest, oldJob]);
    expect(result.editions[0]).toMatchObject({ status: 'published', contentDate: previousDate });
    expect(result.editions.find(row => row.channel === 'competitions')).toMatchObject({ status: 'unpublished', content: null });
    expect(result.editions.find(row => row.channel === 'internships')).toMatchObject({ status: 'empty', content: null });
    expect(mocks.recent).toHaveBeenCalledOnce();
  });

  it('机会核验请求失败仍保留英语最近一期，并显示历史读取故障', async () => {
    mocks.editions.mockResolvedValue([]);
    mocks.previous.mockResolvedValue({ english: '2026-10-22', internships: '2026-10-22' });
    mocks.recent.mockResolvedValue([edition({ date: '2026-10-22' }), edition({ channel: 'internships', date: '2026-10-22' })]);
    mocks.opportunities.mockRejectedValueOnce(new Error('source database unavailable'));
    const result = await getDailyPreview(date, { recent: true });
    expect(result.historyFailed).toBe(true);
    expect(result.editions[0]).toMatchObject({ status: 'published', contentDate: '2026-10-22' });
    expect(result.editions.find(row => row.channel === 'internships')?.content).toBeNull();
  });

  it('历史活动不复活已开始的upcoming/live，保留明确回放、公告和未来活动', async () => {
    const common: DailyLinkItem = { id: 'event', title: '发布会', summary: '官方信息', url: 'https://example.com/event', sourceName: 'Official', sourceType: 'official', timeZone: 'UTC' };
    const items: DailyLinkItem[] = [
      { ...common, id: 'expired-upcoming', phase: 'upcoming', startAt: '2026-10-22T10:00:00Z' },
      { ...common, id: 'expired-live', phase: 'live', startAt: '2026-10-22T10:00:00Z' },
      { ...common, id: 'replay', phase: 'replay', startAt: '2026-10-22T10:00:00Z' },
      { ...common, id: 'announcement', phase: 'announcement' },
      { ...common, id: 'future', phase: 'upcoming', startAt: '2026-10-24T10:00:00Z' },
    ];
    mocks.editions.mockResolvedValue([]); mocks.previous.mockResolvedValue({ events: '2026-10-22' });
    mocks.recent.mockResolvedValue([edition({ channel: 'events', date: '2026-10-22', content: { kind: 'events', items } })]);
    const row = (await getDailyPreview(date, { recent: true })).editions.find(value => value.channel === 'events')!;
    expect(row).toMatchObject({ status: 'published', contentDate: '2026-10-22', currentStatus: 'unpublished', totalCount: 3 });
    if (row.content?.kind !== 'events') throw new Error('missing events');
    expect(row.content.items.map(item => item.id)).toEqual(['replay', 'announcement', 'future']);
    expect(items).toHaveLength(5);
    mocks.recent.mockResolvedValue([edition({ channel: 'events', date: '2026-10-22', content: { kind: 'events', items: items.slice(0, 2) } })]);
    expect((await getDailyPreview(date, { recent: true })).editions.find(value => value.channel === 'events')).toMatchObject({ status: 'unpublished', content: null });
  });

  it('历史预告或直播缺少时间不回退，今日原稿和明确历史页不改写', async () => {
    const common: DailyLinkItem = { id: 'event', title: '官方活动', summary: '时间尚未确认', url: 'https://example.com/event', sourceName: 'Official', sourceType: 'official' };
    const items: DailyLinkItem[] = [{ ...common, id: 'unknown-upcoming', phase: 'upcoming' }, { ...common, id: 'unknown-live', phase: 'live' }];
    const previous = edition({ channel: 'events', date: '2026-10-22', content: { kind: 'events', items } });
    mocks.editions.mockResolvedValue([]); mocks.previous.mockResolvedValue({ events: '2026-10-22' }); mocks.recent.mockResolvedValue([previous]);
    expect((await getDailyPreview(date, { recent: true })).editions.find(row => row.channel === 'events')).toMatchObject({ status: 'unpublished', content: null });
    mocks.editions.mockResolvedValue([{ ...previous, date }]);
    expect((await getDailyPreview(date, { recent: true })).editions.find(row => row.channel === 'events')).toMatchObject({ status: 'published', totalCount: 2 });
    mocks.editions.mockResolvedValue([previous]);
    expect((await getDailyPreview('2026-10-22', { recent: true })).editions.find(row => row.channel === 'events')).toMatchObject({ status: 'published', totalCount: 2 });
  });

  it('最新一期在读取前下架不泄漏正文，也不把其日期标成可读回退', async () => {
    mocks.editions.mockResolvedValue([]); mocks.previous.mockResolvedValue({ english: '2026-10-22' });
    mocks.recent.mockResolvedValue([edition({ date: '2026-10-22', status: 'draft', title: 'private-title' })]);
    const result = await getDailyPreview(date, { recent: true });
    expect(result.editions[0]).toMatchObject({ status: 'unpublished', content: null });
    expect(result.editions[0]).not.toHaveProperty('contentDate');
    expect(JSON.stringify(result)).not.toContain('private-title');
  });
  it('空稿和失败重试不抬高实际正文的更新时间', async () => {
    mocks.editions.mockResolvedValue([edition(), edition({ channel: 'events', status: 'empty', content: null, updatedAt: `${date}T15:40:00.000Z` })]);
    expect((await getDailyPreview(date)).updatedAt).toBe(updatedAt);
    mocks.editions.mockResolvedValue([edition({ status: 'failed', content: null })]);
    expect((await getDailyPreview(date)).updatedAt).toBeNull();
  });
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
    mocks.editions.mockResolvedValue([]);
    mocks.previous.mockResolvedValue(Object.fromEntries(DAILY_EDITION_CHANNEL_IDS.map(channel => [channel, '2026-10-22'])));
    mocks.recent.mockResolvedValue(rows.map(row => ({ ...row, date: '2026-10-22' })));
    const recent = await getDailyPreview(date, { recent: true });
    expect(Buffer.byteLength(JSON.stringify(recent), 'utf8')).toBeLessThanOrEqual(DAILY_PREVIEW_MAX_BYTES);
    expect(recent.editions[0]).toMatchObject({ contentDate: '2026-10-22', currentStatus: 'unpublished' });
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
