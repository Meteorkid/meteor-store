import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PgDialect } from 'drizzle-orm/pg-core';
import type { SQL } from 'drizzle-orm';
import { pathfinderItems, pathfinderSources } from '@/lib/db/schema';
import { parseGreenhouseJobs } from '../ingestion/parse';
import { PATHFINDER_SYNC_SOURCE_MAP } from '../ingestion/sources';

const mocks = vi.hoisted(() => ({
  select: vi.fn(), insert: vi.fn(), update: vi.fn(), delete: vi.fn(), fetch: vi.fn(),
  existing: [] as Record<string, unknown>[], updates: [] as { table: unknown; values: Record<string, unknown>; filter: SQL }[],
}));
vi.mock('@/lib/db', () => ({ db: { select: mocks.select, insert: mocks.insert, update: mocks.update, delete: mocks.delete } }));
vi.mock('../ingestion/fetch-source', () => ({ fetchPathfinderSource: mocks.fetch }));
vi.mock('../translate', () => ({ isTranslationEnabled: () => false, needsTranslation: () => false, translateAll: vi.fn() }));

const source = PATHFINDER_SYNC_SOURCE_MAP.get('databricks-student-jobs')!;
const sourceRow = { id: source.id, enabled: true, autoPublish: true, lastSuccessAt: null, syncIntervalMinutes: 60, etag: 'old-etag', lastModified: null, cursor: '{"version":1,"externalIds":["1"]}' };
const job = (id: number) => ({ id, title: 'Software Engineer Intern', absolute_url: `https://job-boards.greenhouse.io/databricks/jobs/${id}`, location: { name: 'London, UK' } });
const query = (filter: SQL) => new PgDialect().sqlToQuery(filter);
const closureUpdates = () => mocks.updates.filter(update => update.table === pathfinderItems && query(update.filter).params.includes(source.id));

beforeEach(() => {
  vi.clearAllMocks(); mocks.existing = []; mocks.updates = [];
  mocks.select.mockReturnValue({ from: (table: unknown) => table === pathfinderSources
    ? Promise.resolve([sourceRow]) : { where: () => Promise.resolve(mocks.existing) } });
  mocks.insert.mockReturnValue({ values: () => ({ onConflictDoUpdate: () => Promise.resolve(), onConflictDoNothing: () => Promise.resolve() }) });
  mocks.delete.mockReturnValue({ where: () => Promise.resolve() });
  mocks.update.mockImplementation((table: unknown) => ({ set: (values: Record<string, unknown>) => ({ where: (filter: SQL) => {
    mocks.updates.push({ table, values, filter });
    const result = Promise.resolve();
    return Object.assign(result, { returning: () => Promise.resolve(
      table === pathfinderItems && query(filter).params.includes(source.id) ? [{ id: 'closed' }] : [],
    ) });
  } }) }));
});

describe('Greenhouse 同步关闭行为', () => {
  it('完整职位板超过 20 条时仅过期未在原始集合的岗位，保存全量游标', async () => {
    const { syncPathfinderSources } = await import('../ingestion/sync');
    const body = JSON.stringify({ jobs: Array.from({ length: 35 }, (_, i) => job(i + 1)), meta: { total: 35 } });
    mocks.fetch.mockResolvedValue({ body, notModified: false, etag: 'new-etag', lastModified: null });
    mocks.existing = parseGreenhouseJobs(source, body).map(item => ({
      ...item, id: `pf_${item.externalId}`, status: item.externalId === '1' ? 'expired'
        : item.externalId === '2' ? 'archived' : item.externalId === '3' ? 'rejected' : 'published', reviewerId: null, reviewedAt: null,
    }));
    const result = await syncPathfinderSources([source.id]);
    expect(result.results[0]).toMatchObject({ fetched: 20, updated: 1, notModified: false });
    expect(result.results[0].error).toBeUndefined();
    expect(mocks.fetch).toHaveBeenCalledWith(expect.objectContaining({ id: source.id }), {});
    const [closed] = closureUpdates();
    expect(closed.values).toMatchObject({ status: 'expired' });
    const sql = query(closed.filter);
    expect(sql.sql).toContain('not in');
    expect(sql.params).toEqual([source.id, 'internship', 'published', 'stale', ...Array.from({ length: 35 }, (_, i) => String(i + 1))]);
    const success = mocks.updates.find(update => update.table === pathfinderSources && update.values.lastSuccessAt);
    expect(JSON.parse(success!.values.cursor as string)).toMatchObject({ version: 2, kind: 'greenhouse-board', externalIds: expect.arrayContaining(['1', '21', '35']) });
    // 消失后重新开放的已过期岗位可恢复；人工 archived/rejected 不在此恢复分支。
    expect(mocks.updates.find(update => query(update.filter).params.includes('pf_1'))?.values.status).toBe('published');
    expect(mocks.updates.find(update => query(update.filter).params.includes('pf_2'))?.values.status).toBe('archived');
    expect(mocks.updates.find(update => query(update.filter).params.includes('pf_3'))?.values.status).toBe('rejected');
  });

  it('有效完整空板关闭已有公开岗位，不碰人工下架/驳回状态', async () => {
    const { syncPathfinderSources } = await import('../ingestion/sync');
    mocks.fetch.mockResolvedValue({ body: '{"jobs":[],"meta":{"total":0}}', notModified: false, etag: null, lastModified: null });
    await syncPathfinderSources([source.id]);
    const sql = query(closureUpdates()[0].filter);
    expect(sql.params).toEqual([source.id, 'internship', 'published', 'stale']);
    expect(sql.sql).not.toContain('not in');
  });

  it.each(['network', 'invalid', 'truncated', '304'])('%s 失败不关闭任何岗位也不覆盖成功 membership', async mode => {
    const { syncPathfinderSources } = await import('../ingestion/sync');
    if (mode === 'network') mocks.fetch.mockRejectedValue(new Error('network unavailable'));
    else mocks.fetch.mockResolvedValue({ body: mode === 'invalid' ? '{}' : JSON.stringify({ jobs: [job(1)], meta: { total: 35 } }), notModified: mode === '304', etag: null, lastModified: null });
    const result = await syncPathfinderSources([source.id]);
    expect(result.results[0].error).toBeTruthy();
    expect(closureUpdates()).toHaveLength(0);
    const sourceUpdates = mocks.updates.filter(update => update.table === pathfinderSources);
    expect(sourceUpdates).toHaveLength(1);
    expect(sourceUpdates[0].values).not.toHaveProperty('cursor');
    expect(sourceUpdates[0].values).not.toHaveProperty('lastSuccessAt');
    expect(sourceUpdates[0].values).toHaveProperty('consecutiveFailures');
  });
});
