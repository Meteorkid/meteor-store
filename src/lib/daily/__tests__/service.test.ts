import { PgDialect } from 'drizzle-orm/pg-core';
import { SQL } from 'drizzle-orm';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { dailyEditions, dailyPreferences, dailyReminders } from '@/lib/db/schema';
import type { DailyContent, DailyEdition } from '../types';
import { englishLessons } from '../english-lessons';

type Operation = {
  kind: 'select' | 'insert' | 'update';
  table?: unknown;
  selection?: Record<string, unknown>;
  groupBy?: unknown[];
  limit?: number;
  where?: SQL;
  values?: Record<string, unknown>;
  conflict?: 'nothing' | 'update';
  conflictTarget?: unknown;
};
const state = vi.hoisted(() => ({
  responses: [] as unknown[][],
  operations: [] as Operation[],
  loadContent: vi.fn(), filterOpportunities: vi.fn(async (rows: unknown[]) => rows),
}));

vi.mock('@/lib/daily/content', () => ({ loadDailyContent: state.loadContent }));
vi.mock('@/lib/daily/opportunities', () => ({ filterAvailableDailyOpportunities: state.filterOpportunities }));
vi.mock('@/lib/db', () => {
  function query(kind: Operation['kind'], table?: unknown, selection?: Record<string, unknown>) {
    const operation: Operation = { kind, table, selection };
    state.operations.push(operation);
    const builder = {
      from(value: unknown) { operation.table = value; return builder; },
      where(value: SQL) { operation.where = value; return builder; },
      limit(value: number) { operation.limit = value; return builder; },
      groupBy(...columns: unknown[]) { operation.groupBy = columns; return builder; },
      values(value: Record<string, unknown>) { operation.values = value; return builder; },
      set(value: Record<string, unknown>) { operation.values = value; return builder; },
      returning() { return builder; },
      onConflictDoNothing() { operation.conflict = 'nothing'; return builder; },
      onConflictDoUpdate(input: { target: unknown }) {
        operation.conflict = 'update'; operation.conflictTarget = input.target; return builder;
      },
      then(resolve: (rows: unknown[]) => unknown) {
        return Promise.resolve(state.responses.shift() ?? []).then(resolve);
      },
    };
    return builder;
  }
  return { db: {
    select: (selection?: Record<string, unknown>) => query('select', undefined, selection),
    insert: (table: unknown) => query('insert', table),
    update: (table: unknown) => query('update', table),
  } };
});

import {
  freezeDailyReminder, generateDailyEditions, getDailyEditions, getDailyPreferences, getDailyPreferencesState,
  getDailyReminder, getLatestPublishedDailyDates, getPublishedDailyEditionsByDates, publicDailyEdition, retireDailyEdition, saveDailyEdition, saveDailyPreferences,
} from '../service';

const date = '2026-10-14';
const cutoff = '2026-10-14T01:30:00.000Z';
const aiContent: DailyContent = { kind: 'ai', items: [{
  id: 'source-ai-1', title: '来源标题', summary: '来源已经发布的事实摘要。',
  url: 'https://openai.com/news/example', sourceName: 'OpenAI', sourceType: 'official',
  sourcePublishedAt: '2026-10-14T00:00:00.000Z',
}] };

function edition(overrides: Partial<DailyEdition> = {}): DailyEdition {
  return {
    id: `${date}:ai`, date, channel: 'ai', status: 'published', title: '已发布日刊',
    summary: '当天摘要', content: aiContent, sourceKey: 'source:private-key',
    publishedAt: '2026-10-14T01:00:00.000Z', updatedAt: '2026-10-14T01:00:00.000Z',
    error: null, ...overrides,
  };
}

function whereSql(operation: Operation) {
  if (!operation.where) throw new Error('Expected a conditional query');
  return new PgDialect().sqlToQuery(operation.where);
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(cutoff));
  state.responses = [];
  state.operations = [];
  state.loadContent.mockReset();
});
afterEach(() => vi.useRealTimers());

describe('日刊公开边界与日期', () => {
  it.each(['draft', 'failed', 'empty'] as const)('%s 仅暴露状态，不带正文、答案、来源键和错误详情', (status) => {
    const row = edition({ status, channel: 'english', content: englishLessons[0].content, error: 'private upstream detail' });
    const result = publicDailyEdition(row);
    expect(result).toMatchObject({ status, title: '', summary: '', content: null, sourceKey: null, publishedAt: null });
    expect(result).not.toHaveProperty('error');
    expect(JSON.stringify(result)).not.toContain('private');
    expect(JSON.stringify(result)).not.toContain('answerIndex');
  });

  it('已发布内容可读，但仍不外泄内部来源键和任意新增服务端字段', () => {
    const result = publicDailyEdition({ ...edition(), serverSecret: 'not-public' } as DailyEdition);
    expect(result.content).toEqual(aiContent);
    expect(result.sourceKey).toBeNull();
    expect(result).not.toHaveProperty('error');
    expect(result).not.toHaveProperty('serverSecret');
  });

  it.each(['2026-02-30', '2026-10-15', '2026-09-14', '../2026-10-14'])('拒绝回看范围外日期 %s，且不查询数据库', async (value) => {
    await expect(getDailyEditions(value)).rejects.toThrow('Date outside daily history');
    expect(state.operations).toHaveLength(0);
  });

  it.each([date, '2026-09-15'])('允许今天和最近30天最早一天 %s，并执行公开过滤', async (value) => {
    state.responses.push([edition({ date: value, status: 'draft' })]);
    const result = await getDailyEditions(value);
    expect(result[0].content).toBeNull();
    expect(whereSql(state.operations[0]).params).toEqual([value]);
  });

  it('中国标准时间跨日后查询范围随之变化', async () => {
    vi.setSystemTime(new Date('2026-10-14T16:00:00.000Z'));
    await expect(getDailyEditions('2026-09-15')).rejects.toThrow('Date outside daily history');
    state.responses.push([]);
    expect(await getDailyEditions('2026-10-15')).toEqual([]);
  });
});

describe('个人偏好', () => {
  it('未设置返回 null，明确空选保持空数组', async () => {
    state.responses.push([], [{ channels: [], reminders: false }]);
    expect(await getDailyPreferences('user-new')).toBeNull();
    expect(await getDailyPreferences('user-empty')).toEqual({ channels: [], reminders: false });
    expect(whereSql(state.operations[0]).params).toEqual(['user-new']);
    expect(whereSql(state.operations[1]).params).toEqual(['user-empty']);
  });

  it('读取关注版本，面板先建行也保留真实版本和明确空选', async () => {
    state.responses.push([], [{ channels: [], reminders: false, updatedAt: cutoff }]);
    expect(await getDailyPreferencesState('user-new')).toEqual({ preferences: null, revision: null });
    expect(await getDailyPreferencesState('panel-user')).toEqual({ preferences: { channels: [], reminders: false }, revision: cutoff });
    expect(Object.keys(state.operations[1].selection!)).toEqual(['channels', 'reminders', 'updatedAt']);
  });

  it('首次保存空选只插入，不覆盖已存在的关注或面板行', async () => {
    state.responses.push([{ channels: [], reminders: true, updatedAt: cutoff }]);
    expect(await saveDailyPreferences('user-1', { channels: [], reminders: true }, null)).toEqual({ preferences: { channels: [], reminders: true }, revision: cutoff });
    expect(state.operations).toHaveLength(1);
    expect(state.operations[0]).toMatchObject({
      kind: 'insert', table: dailyPreferences, conflict: 'nothing',
      values: { userId: 'user-1', channels: [], reminders: true },
    });
  });

  it('重复栏目被拒绝，不能写入无效偏好', async () => {
    await expect(saveDailyPreferences('user-1', { channels: ['ai', 'ai'], reminders: false }, null)).rejects.toThrow();
    expect(state.operations).toHaveLength(0);
  });

  it('已有版本只条件更新关注列，未匹配不插入也不修改面板列', async () => {
    expect(await saveDailyPreferences('user-1', { channels: ['papers'], reminders: false }, cutoff)).toBeNull();
    expect(state.operations).toHaveLength(1);
    expect(state.operations[0].kind).toBe('update');
    expect(whereSql(state.operations[0]).params).toEqual(['user-1', cutoff]);
    expect(whereSql(state.operations[0]).sql).toContain('"daily_preferences"."updated_at" =');
    expect(Object.keys(state.operations[0].values!).sort()).toEqual(['channels', 'reminders', 'updatedAt']);
  });

  it('并发首次保存遇到已存在的面板行返回冲突，不做upsert覆盖', async () => {
    expect(await saveDailyPreferences('panel-user', { channels: ['english'], reminders: true }, null)).toBeNull();
    expect(state.operations).toHaveLength(1);
    expect(state.operations[0].conflict).toBe('nothing');
    expect(Object.keys(state.operations[0].values!).sort()).toEqual(['channels', 'reminders', 'updatedAt', 'userId']);
  });

  it('同毫秒或时钟回拨时关注版本严格前进', async () => {
    const future = '2099-10-14T01:30:00.000Z';
    const next = '2099-10-14T01:30:00.001Z';
    state.responses.push([{ channels: [], reminders: false, updatedAt: next }]);
    expect(await saveDailyPreferences('user-1', { channels: [], reminders: false }, future)).toEqual({ preferences: { channels: [], reminders: false }, revision: next });
    expect(state.operations[0].values?.updatedAt).toBe(next);
    state.responses.push([{ channels: [], reminders: true, updatedAt: '2026-10-14T01:30:00.001Z' }]);
    await saveDailyPreferences('user-1', { channels: [], reminders: true }, cutoff);
    expect(state.operations[1].values?.updatedAt).toBe('2026-10-14T01:30:00.001Z');
  });
});

describe('管理员编辑并发与下架', () => {
  const input = { date, channel: 'ai' as const, title: '更新标题', summary: '事实摘要', content: aiContent, status: 'published' as const };

  it('首次写入只插入，已有同一期时返回冲突且不覆盖', async () => {
    state.responses.push([]);
    expect(await saveDailyEdition(input)).toBeNull();
    expect(state.operations).toHaveLength(1);
    expect(state.operations[0]).toMatchObject({ kind: 'insert', table: dailyEditions, conflict: 'nothing', values: { id: `${date}:ai`, date, channel: 'ai' } });
  });

  it('修改必须同时匹配期刊ID和版本，旧版本失败不能退回无条件插入', async () => {
    state.responses.push([]);
    expect(await saveDailyEdition({ ...input, expectedUpdatedAt: cutoff })).toBeNull();
    expect(state.operations).toHaveLength(1);
    const operation = state.operations[0];
    expect(operation.kind).toBe('update');
    expect(whereSql(operation).params).toEqual([`${date}:ai`, cutoff]);
    expect(whereSql(operation).sql).toContain('"daily_editions"."updated_at"');
    expect(operation.values?.updatedAt).toBe('2026-10-14T01:30:00.001Z');
  });

  it('保存草稿撤销公开时间，只有数据库更新成功才返回结果', async () => {
    const draft = edition({ status: 'draft', publishedAt: null });
    state.responses.push([draft]);
    expect(await saveDailyEdition({ ...input, status: 'draft', expectedUpdatedAt: cutoff })).toEqual(draft);
    expect(state.operations[0].values).toMatchObject({ status: 'draft', publishedAt: null, error: null });
  });

  it('编辑已发布内容保留首次发布时间，避免晚于09:30的修订从提醒中消失', async () => {
    vi.setSystemTime(new Date('2026-10-14T03:00:00.000Z'));
    state.responses.push([edition()]);
    await saveDailyEdition({ ...input, expectedUpdatedAt: '2026-10-14T01:00:00.000Z' });
    const publication = state.operations[0].values?.publishedAt;
    expect(publication).toBeInstanceOf(SQL);
    const query = new PgDialect().sqlToQuery(publication as SQL);
    expect(query.sql).toMatch(/coalesce\s*\(/i);
    expect(query.sql).toContain('"published_at"');
    expect(query.params).toContain('2026-10-14T03:00:00.000Z');
  });

  it('身份与内容栏目不一致时不写库', async () => {
    await expect(saveDailyEdition({ ...input, id: `${date}:papers` })).rejects.toThrow('Edition identity mismatch');
    await expect(saveDailyEdition({ ...input, content: englishLessons[0].content })).rejects.toThrow('Content channel mismatch');
    expect(state.operations).toHaveLength(0);
  });

  it('发布会拒绝聚合来源与缺失活动阶段', async () => {
    const event = { ...aiContent.items[0], phase: 'upcoming' as const };
    await expect(saveDailyEdition({ ...input, channel: 'events', content: { kind: 'events', items: [{ ...event, sourceType: 'aggregator' }] } })).rejects.toThrow('official source');
    await expect(saveDailyEdition({ ...input, channel: 'events', content: { kind: 'events', items: [aiContent.items[0]] } })).rejects.toThrow('phase');
    expect(state.operations).toHaveLength(0);
  });

  it('已给活动开始时刻时必须有已确认有效时区，只有日期待定则允许', async () => {
    const event = { ...aiContent.items[0], phase: 'upcoming' as const, startAt: '2026-10-15T12:00:00.000Z' };
    await expect(saveDailyEdition({ ...input, channel: 'events', content: { kind: 'events', items: [event] } })).rejects.toThrow('timezone');
    await expect(saveDailyEdition({ ...input, channel: 'events', content: { kind: 'events', items: [{ ...event, timeZone: 'not-a-timezone' }] } })).rejects.toThrow();
    expect(state.operations).toHaveLength(0);
    state.responses.push([edition({ channel: 'events' })]);
    await expect(saveDailyEdition({ ...input, channel: 'events', content: { kind: 'events', items: [{ ...aiContent.items[0], phase: 'upcoming' }] } })).resolves.not.toBeNull();
  });

  it('下架只影响版本仍匹配的已发布日刊，不删除记录', async () => {
    state.responses.push([{ id: `${date}:ai` }], []);
    expect(await retireDailyEdition(`${date}:ai`, cutoff)).toBe(true);
    expect(await retireDailyEdition(`${date}:ai`, cutoff)).toBe(false);
    for (const operation of state.operations) {
      expect(operation.kind).toBe('update');
      expect(whereSql(operation).params).toEqual([`${date}:ai`, cutoff, 'published']);
      expect(operation.values).toMatchObject({ status: 'draft', automationPaused: true, publishedAt: null });
    }
  });
});

describe('按日生成与失败重试', () => {
  it('自动草稿原样发布，发布时间取当前时间而不重新采集', async () => {
    const draft = edition({ status: 'draft', publishedAt: null, automationPaused: false });
    state.responses.push([draft], [], [], [{ id: draft.id }], [edition()]);
    await generateDailyEditions(date, 'ai');
    expect(state.loadContent).not.toHaveBeenCalled();
    const write = state.operations.find(operation => operation.kind === 'update')!;
    expect(write.values).toMatchObject({ status: 'published', content: draft.content, publishedAt: cutoff });
    expect(whereSql(write).sql).toContain('"automation_paused"');
    expect(whereSql(write).params).toContain(false);
  });

  it('人工接管或下架的草稿保持暂停，定时任务不能复活', async () => {
    const draft = edition({ status: 'draft', automationPaused: true });
    state.responses.push([draft], [], [], [draft]);
    await generateDailyEditions(date, 'ai');
    expect(state.loadContent).not.toHaveBeenCalled();
    expect(state.operations.every(operation => operation.kind === 'select')).toBe(true);
  });

  it('正常内容直接公开，即使旧适配器仍返回draft也不再等待人工发布', async () => {
    state.responses.push([], [], [], [{ id: `${date}:english` }], []);
    state.loadContent.mockResolvedValue({ status: 'draft', title: '新课', summary: '今日课程', content: englishLessons[0].content, sourceKey: 'english:generated:2026-10-14' });
    await generateDailyEditions(date, 'english');
    expect(state.operations.find(operation => operation.kind === 'insert')?.values).toMatchObject({ status: 'published', publishedAt: cutoff });
  });

  it('跨午夜完成的采集不倒填昨天期刊', async () => {
    state.responses.push([], [], []);
    state.loadContent.mockImplementation(async () => {
      vi.setSystemTime(new Date('2026-10-14T16:00:01Z'));
      return { status: 'published', title: 'AI', summary: '摘要', content: aiContent };
    });
    await expect(generateDailyEditions(date, 'ai')).rejects.toThrow('midnight');
    expect(state.operations.every(operation => operation.kind === 'select')).toBe(true);
  });
  it.each(['2026-10-13', '2026-10-15'])('不使用今天来源倒填或预填 %s', async (value) => {
    await expect(generateDailyEditions(value)).rejects.toThrow('Only today can be generated');
    expect(state.operations).toHaveLength(0);
    expect(state.loadContent).not.toHaveBeenCalled();
  });

  it('已发布与暂停草稿均不重新采集，历史来源按栏目隔离', async () => {
    const previousPaper = { kind: 'papers' as const, items: [{ ...aiContent.items[0], id: 'https://arxiv.org/abs/2610.12345' }] };
    const existing = [edition(), edition({ id: `${date}:papers`, channel: 'papers', status: 'draft', content: previousPaper, automationPaused: true })];
    state.responses.push(existing, [{ sourceKey: 'english:small-first-step' }], [{ content: previousPaper }], [], [], [], [], [], existing);
    state.loadContent.mockImplementation(async (channel: string) => channel === 'english'
      ? { status: 'draft', title: '英语初稿', summary: '等待审核', content: englishLessons[1].content, sourceKey: `english:${englishLessons[1].id}` }
      : { status: 'empty', title: '发布会', summary: '无新活动', content: null });
    expect(await generateDailyEditions(date)).toEqual(existing);
    expect(state.loadContent.mock.calls.map((call) => call[0])).toEqual(['english', 'events', 'open-source', 'competitions', 'internships']);
    expect(state.loadContent).toHaveBeenCalledWith('english', date, ['english:small-first-step'], []);
    expect(state.loadContent).toHaveBeenCalledWith('events', date, ['english:small-first-step'], []);
    const writes = state.operations.filter((operation) => operation.kind !== 'select');
    expect(writes).toHaveLength(5);
    expect(writes.every((operation) => operation.kind === 'insert' && operation.conflict === 'nothing')).toBe(true);
  });

  it('失败和空稿可以重试，但更新限定ID、旧版本及可重试状态', async () => {
    const failed = edition({ status: 'failed', content: null });
    state.responses.push([failed], [], [], [], [edition()]);
    state.loadContent.mockResolvedValue({ status: 'published', title: 'AI', summary: '事实', content: aiContent, sourceKey: 'ai:new' });
    await generateDailyEditions(date, 'ai');
    const write = state.operations.find((operation) => operation.kind === 'update')!;
    expect(whereSql(write).params).toEqual([failed.id, failed.updatedAt, false, 'empty', 'failed', 'draft']);
    expect(write.values).toMatchObject({ status: 'published', sourceKey: 'ai:new', error: null });
    expect(state.operations.filter((operation) => operation.kind === 'insert')).toHaveLength(0);
  });

  it('采集异常记录为 failed，不把可能含凭证的错误原文存入日刊', async () => {
    state.responses.push([], [], [], [], []);
    state.loadContent.mockRejectedValue(new Error('upstream failed: token=private'));
    await generateDailyEditions(date, 'ai');
    const write = state.operations.find((operation) => operation.kind === 'insert')!;
    expect(write.values).toMatchObject({ status: 'failed', content: null, sourceKey: null, error: 'content_unavailable' });
    expect(JSON.stringify(write.values)).not.toContain('token');
  });

  it('适配器返回错栏目内容时拒绝发布，保存失败状态', async () => {
    state.responses.push([], [], [], [], []);
    state.loadContent.mockResolvedValue({ status: 'published', title: 'wrong', summary: '', content: englishLessons[0].content });
    await generateDailyEditions(date, 'ai');
    const write = state.operations.find((operation) => operation.kind === 'insert')!;
    expect(write.values?.status).toBe('failed');
  });

  it('采集跨过09:30时按完成时间发布，不能倒填进当日提醒快照', async () => {
    vi.setSystemTime(new Date('2026-10-14T01:29:59.000Z'));
    const finishedAt = '2026-10-14T01:30:10.000Z';
    state.responses.push([], [], [], [], []);
    state.loadContent.mockImplementation(async () => {
      vi.setSystemTime(new Date(finishedAt));
      return { status: 'published', title: 'AI', summary: '事实摘要', content: aiContent, sourceKey: 'ai:after-cutoff' };
    });

    await generateDailyEditions(date, 'ai');

    const write = state.operations.find((operation) => operation.kind === 'insert')!;
    expect(write.values).toMatchObject({ status: 'published', publishedAt: finishedAt, updatedAt: finishedAt });
    expect(Date.parse(write.values?.publishedAt as string)).toBeGreaterThan(Date.parse(cutoff));
  });
});

describe('09:30 日刊提醒快照', () => {
  it('09:30 前不创建快照，不查库', async () => {
    expect(await freezeDailyReminder(new Date('2026-10-14T01:29:59.999Z'))).toEqual({ status: 'not-due', date });
    expect(state.operations).toHaveLength(0);
  });

  it('延迟执行仍只纳入截止09:30已经发布的栏目，按日期幂等插入', async () => {
    state.responses.push([{ id: `${date}:ai` }], [{ date }]);
    expect(await freezeDailyReminder(new Date('2026-10-14T04:00:00.000Z'))).toEqual({ status: 'created', date });
    expect(whereSql(state.operations[0]).params).toEqual([date, 'published', cutoff]);
    expect(whereSql(state.operations[0]).sql).toContain(' <= ');
    expect(state.operations[1]).toMatchObject({
      kind: 'insert', table: dailyReminders, conflict: 'nothing',
      values: { date, editionIds: [`${date}:ai`], publishedAt: cutoff },
    });
  });

  it('09:30无稿也固定空快照，补跑不会为晚到内容生成第二次提醒', async () => {
    state.responses.push([], [{ date }], [{ id: `${date}:ai` }], []);
    expect(await freezeDailyReminder()).toEqual({ status: 'empty', date });
    expect(await freezeDailyReminder(new Date('2026-10-14T04:00:00.000Z'))).toEqual({ status: 'duplicate', date });
    const writes = state.operations.filter((operation) => operation.kind === 'insert');
    expect(writes[0].values?.editionIds).toEqual([]);
    expect(writes.every((operation) => operation.conflict === 'nothing')).toBe(true);
  });

  it.each([
    null, { channels: ['ai'], reminders: false }, { channels: [], reminders: true },
  ])('未订阅或空选时不查询公共提醒 %j', async (preferences) => {
    state.responses.push(preferences ? [preferences] : []);
    expect(await getDailyReminder('user-1')).toBeNull();
    expect(state.operations).toHaveLength(1);
  });

  it('只组合快照中仍公开且被用户关注的栏目，不加入晚到内容', async () => {
    state.responses.push(
      [{ channels: ['ai', 'papers'], reminders: true }],
      [{ date, editionIds: [`${date}:english`, `${date}:ai`], publishedAt: cutoff }],
      [{ channel: 'ai' }],
    );
    expect(await getDailyReminder('user-1')).toEqual({ date, channels: ['ai'], publishedAt: cutoff });
    const query = whereSql(state.operations[2]);
    expect(query.params).toEqual([`${date}:english`, `${date}:ai`, 'published', 'ai', 'papers']);
    expect(query.sql).toContain('"daily_editions"."id" in');
    expect(query.sql).toContain('"daily_editions"."channel" in');
  });

  it('快照内容下架后不再提供提醒，保存的快照不被重写', async () => {
    state.responses.push(
      [{ channels: ['ai'], reminders: true }],
      [{ date, editionIds: [`${date}:ai`], publishedAt: cutoff }], [],
    );
    expect(await getDailyReminder('user-1')).toBeNull();
    expect(state.operations.every((operation) => operation.kind === 'select')).toBe(true);
    expect(whereSql(state.operations[2]).params).toContain('published');
  });
});


describe('最近有内容日刊日期', () => {
  it('最近期次正文按栏目日期组合一次批量读取，仅选仍公开且有正文的记录', async () => {
    state.responses.push([edition({ date: '2026-10-13' })]);
    const rows = await getPublishedDailyEditionsByDates({ ai: '2026-10-13', events: '2026-10-10' });
    expect(rows).toHaveLength(1);
    expect(rows[0].sourceKey).toBeNull();
    expect(state.operations).toHaveLength(1);
    expect(state.operations[0].limit).toBe(2);
    const query = whereSql(state.operations[0]);
    expect(query.params).toEqual(['published', 'ai', '2026-10-13', 'events', '2026-10-10']);
    expect(query.sql).toContain('"daily_editions"."content" is not null');
    expect(query.sql).toContain(' or ');
  });

  it('没有最近日期时不查正文，越界或非历史日期不能进入批量查询', async () => {
    expect(await getPublishedDailyEditionsByDates({})).toEqual([]);
    for (const invalid of ['2026-09-14', date, '2026-10-15', '2026-02-30']) {
      await expect(getPublishedDailyEditionsByDates({ english: invalid })).rejects.toThrow('Invalid previous edition date');
    }
    expect(state.operations).toHaveLength(0);
  });

  it('只聚合公开期次日期，在可回看30天内查找所选日期之前的正文', async () => {
    state.responses.push([{ channel: 'events', date: '2026-10-07' }, { channel: 'competitions', date: '2026-10-09' }]);
    expect(await getLatestPublishedDailyDates('2026-10-12')).toEqual({ events: '2026-10-07', competitions: '2026-10-09' });
    expect(state.operations).toHaveLength(1);
    const operation = state.operations[0];
    expect(Object.keys(operation.selection!)).toEqual(['channel', 'date']);
    expect(operation.groupBy).toEqual([dailyEditions.channel]);
    const query = whereSql(operation);
    expect(query.sql).toContain('"daily_editions"."status" =');
    expect(query.sql).toContain('"daily_editions"."content" is not null');
    expect(query.sql).toContain('"daily_editions"."date" <');
    expect(query.params).toEqual(expect.arrayContaining(['published', '2026-09-15', '2026-10-12']));
    expect(new PgDialect().sqlToQuery(operation.selection!.date as SQL).sql).toContain('max("daily_editions"."date")');
  });

  it('没有旧期时返回空映射', async () => {
    state.responses.push([]);
    expect(await getLatestPublishedDailyDates(date)).toEqual({});
  });

  it.each(['2026-10-15', '2026-09-14', '2026-02-30'])('非法或不可回看的 %s 不查询数据库', async value => {
    await expect(getLatestPublishedDailyDates(value)).rejects.toThrow('Date outside daily history');
    expect(state.operations).toHaveLength(0);
  });
});
