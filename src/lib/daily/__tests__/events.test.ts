import { PgDialect } from 'drizzle-orm/pg-core';
import type { SQL } from 'drizzle-orm';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DailyContentSchema } from '../types';

const mocks = vi.hoisted(() => ({ select: vi.fn(), where: vi.fn(), orderBy: vi.fn(), limit: vi.fn() }));
vi.mock('@/lib/db', () => ({ db: { select: mocks.select } }));

const date = '2026-10-15';
const now = '2026-10-15T04:00:00.000Z';

function announcement(overrides: Record<string, unknown> = {}) {
  return {
    id: 'openai-devday', sourceId: 'openai-news', status: 'published', trustLevel: 'official', sourceName: 'OpenAI News',
    titleZh: '', titleEn: 'Join us for DevDay 2026', summaryZh: '', summaryEn: 'The official announcement introduces the developer event.',
    canonicalUrl: 'https://openai.com/news/devday-2026', publishedAt: '2026-10-14T08:00:00.000Z',
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.setSystemTime(new Date(now));
  mocks.limit.mockResolvedValue([]);
  const query = { from: vi.fn(), innerJoin: vi.fn(), where: mocks.where, orderBy: mocks.orderBy, limit: mocks.limit };
  query.from.mockReturnValue(query);
  query.innerJoin.mockReturnValue(query);
  mocks.where.mockReturnValue(query);
  mocks.orderBy.mockReturnValue(query);
  mocks.select.mockReturnValue(query);
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

describe('每日官方活动公告', () => {
  it('发布可信公告，保留来源日期，不把文章发布日期猜成活动时间', async () => {
    const { loadDailyEvents } = await import('../events');
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    mocks.limit.mockResolvedValue([announcement()]);

    const result = await loadDailyEvents(date, []);
    expect(result.status).toBe('published');
    expect(result.sourceKey).toMatch(/^events:[a-f0-9]{64}$/);
    expect(DailyContentSchema.safeParse(result.content).success).toBe(true);
    if (result.content?.kind !== 'events') throw new Error('Expected events');
    expect(result.content.items).toEqual([{
      id: 'openai-devday', title: 'Join us for DevDay 2026', summary: 'The official announcement introduces the developer event.',
      url: 'https://openai.com/news/devday-2026', sourceName: 'OpenAI News', sourceType: 'official',
      sourcePublishedAt: '2026-10-14T08:00:00.000Z', phase: 'announcement',
    }]);
    expect(result.content.items[0]).not.toHaveProperty('startAt');
    expect(result.content.items[0]).not.toHaveProperty('timeZone');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    'Watch the keynote', 'A new launch event', 'Official press conference', 'OpenAI DevDay',
    'Join our Dev Day', 'Developer Conference 2026', "Developers’ Summit", '新品发布会', '开发者大会', '開發者大會',
  ])('标题识别活动信号：%s', async title => {
    const { loadDailyEvents } = await import('../events');
    mocks.limit.mockResolvedValue([announcement({ titleEn: title })]);
    expect((await loadDailyEvents(date, [])).status).toBe('published');
  });

  it.each([
    'Event-based cameras for robot learning', 'A new paper on event extraction',
    'Launching a model for event-driven research', 'Conference paper acceptance statistics',
    'A benchmark of press conference question answering', 'Keynote speech recognition dataset',
    '事件预测研究论文', '开发者大会语音识别数据集',
  ])('不把普通研究、论文与数据集当活动：%s', async title => {
    const { loadDailyEvents } = await import('../events');
    mocks.limit.mockResolvedValue([announcement({ titleEn: title })]);
    expect(await loadDailyEvents(date, [])).toMatchObject({ status: 'empty', content: null });
  });

  it('中文和英文标题都参与识别，展示优先保留已有中文内容', async () => {
    const { loadDailyEvents } = await import('../events');
    mocks.limit.mockResolvedValue([announcement({ titleZh: '年度开发者大会', summaryZh: '<p>官方已公布大会信息。</p>' })]);
    const result = await loadDailyEvents(date, []);
    if (result.content?.kind !== 'events') throw new Error('Expected events');
    expect(result.content.items[0]).toMatchObject({ title: '年度开发者大会', summary: '官方已公布大会信息。' });
  });

  it('SQL先筛已发布、官方、近30天及活动标题，避免普通新闻占满候选窗口', async () => {
    const { loadDailyEvents } = await import('../events');
    await loadDailyEvents(date, []);
    const query = new PgDialect().sqlToQuery(mocks.where.mock.calls[0][0] as SQL);
    expect(query.params).toContain('published');
    expect(query.params).toContain('official');
    expect(query.params).toContain('2026-09-15T16:00:00.000Z');
    expect(query.params).toContain('2026-10-15T16:00:00.000Z');
    expect(query.params).toContain(now);
    expect(query.sql).toContain('"pathfinder_items"."published_at"');
    expect(query.sql).toContain('ilike');
    expect(mocks.orderBy).toHaveBeenCalledOnce();
    expect(mocks.limit).toHaveBeenCalledWith(200);
  });

  it('日期边界包含最早一天和当前时刻，剔除早于窗口与尚未发生的来源时间', async () => {
    const { loadDailyEvents } = await import('../events');
    mocks.limit.mockResolvedValue([
      announcement({ id: 'earliest', canonicalUrl: 'https://openai.com/news/earliest', publishedAt: '2026-09-15T16:00:00Z' }),
      announcement({ id: 'too-old', canonicalUrl: 'https://openai.com/news/old', publishedAt: '2026-09-15T15:59:59Z' }),
      announcement({ id: 'now', canonicalUrl: 'https://openai.com/news/now', publishedAt: now }),
      announcement({ id: 'later-today', canonicalUrl: 'https://openai.com/news/later', publishedAt: '2026-10-15T05:00:00Z' }),
      announcement({ id: 'tomorrow', canonicalUrl: 'https://openai.com/news/tomorrow', publishedAt: '2026-10-15T16:00:00Z' }),
      announcement({ id: 'no-date', canonicalUrl: 'https://openai.com/news/no-date', publishedAt: null }),
      announcement({ id: 'bad-date', canonicalUrl: 'https://openai.com/news/bad-date', publishedAt: 'not-a-date' }),
    ]);
    const result = await loadDailyEvents(date, []);
    if (result.content?.kind !== 'events') throw new Error('Expected events');
    expect(result.content.items.map(item => item.id)).toEqual(['earliest', 'now']);
  });

  it.each([
    { status: 'pending' }, { trustLevel: 'verified' }, { sourceId: 'unregistered-official-feed' },
    { sourceId: 'hugging-face-blog', canonicalUrl: 'https://huggingface.co/blog/devday' },
    { canonicalUrl: 'https://www.microsoft.com/en-us/research/blog/launch-event/' },
    { canonicalUrl: 'http://openai.com/news/devday' },
    { canonicalUrl: 'https://openai.com.evil.test/news/devday' },
    { canonicalUrl: 'https://openai.com@127.0.0.1/devday' },
    { canonicalUrl: 'https://user:pass@openai.com/news/devday' },
    { canonicalUrl: 'https://openai.com:8443/news/devday' },
    { canonicalUrl: 'javascript:alert(1)' },
  ])('状态、来源及每个来源自己的HTTPS白名单都必须满足：%j', async overrides => {
    const { loadDailyEvents } = await import('../events');
    mocks.limit.mockResolvedValue([announcement(overrides)]);
    expect(await loadDailyEvents(date, [])).toMatchObject({ status: 'empty', content: null });
  });

  it('按归一化URL和ID去重，跳过历史已用条目，最多发布五条', async () => {
    const { loadDailyEvents } = await import('../events');
    mocks.limit.mockResolvedValue([
      announcement({ id: 'used-id' }),
      announcement({ id: 'used-url', canonicalUrl: 'https://openai.com/news/previous?utm_source=feed' }),
      announcement({ id: 'empty-summary', summaryEn: '   ', summaryZh: '' }),
      ...Array.from({ length: 7 }, (_, i) => announcement({ id: `event-${i}`, canonicalUrl: `https://openai.com/news/event-${i}` })),
      announcement({ id: 'duplicate', canonicalUrl: 'https://openai.com/news/event-0?utm_campaign=another' }),
    ]);
    const result = await loadDailyEvents(date, ['used-id', 'https://openai.com/news/previous']);
    if (result.content?.kind !== 'events') throw new Error('Expected events');
    expect(result.content.items.map(item => item.id)).toEqual(['event-0', 'event-1', 'event-2', 'event-3', 'event-4']);
  });

  it('同批重复URL与ID不能挤占精选位置', async () => {
    const { loadDailyEvents } = await import('../events');
    mocks.limit.mockResolvedValue([
      announcement(),
      announcement({ id: 'same-url', canonicalUrl: 'https://openai.com/news/devday-2026?utm_source=duplicate' }),
      announcement({ canonicalUrl: 'https://openai.com/news/renamed' }),
      announcement({ id: 'another', canonicalUrl: 'https://openai.com/news/another' }),
    ]);
    const result = await loadDailyEvents(date, []);
    if (result.content?.kind !== 'events') throw new Error('Expected events');
    expect(result.content.items.map(item => item.id)).toEqual(['openai-devday', 'another']);
  });

  it('来源键只取稳定条目身份，不因说明文字修订而变化', async () => {
    const { loadDailyEvents } = await import('../events');
    mocks.limit.mockResolvedValueOnce([announcement()]).mockResolvedValueOnce([announcement({ summaryEn: 'Updated official event description.' })]);
    expect((await loadDailyEvents(date, [])).sourceKey).toBe((await loadDailyEvents(date, [])).sourceKey);
  });

  it('没有事件是empty，数据库异常必须向上传递', async () => {
    const { loadDailyEvents } = await import('../events');
    expect(await loadDailyEvents(date, [])).toMatchObject({ status: 'empty', content: null });
    mocks.limit.mockRejectedValueOnce(new Error('database unavailable'));
    await expect(loadDailyEvents(date, [])).rejects.toThrow('database unavailable');
  });

  it('非法期次在读库前拒绝', async () => {
    const { loadDailyEvents } = await import('../events');
    await expect(loadDailyEvents('2026-02-30', [])).rejects.toThrow();
    expect(mocks.select).not.toHaveBeenCalled();
  });
});
