import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PgDialect } from 'drizzle-orm/pg-core';
import { pathfinderSources } from '@/lib/db/schema';
import type { DailyEdition } from '../types';

const mocks = vi.hoisted(() => ({ select: vi.fn(), sourceRows: [] as unknown[], rows: [] as unknown[], filters: [] as unknown[] }));
vi.mock('@/lib/db', () => ({ db: { select: mocks.select } }));
const now = '2026-10-15T05:00:00.000Z';
const checked = '2026-10-15T04:27:00.000Z';

function source(id = 'codeforces-contests', overrides = {}) {
  return { id, name: id, enabled: true, autoPublish: true, trustLevel: 'official', lastSuccessAt: checked, consecutiveFailures: 0,
    cursor: JSON.stringify({ version: 2, kind: 'greenhouse-board', externalIds: ['1', '2', '3', '4', '5'] }), ...overrides };
}
function contest(overrides = {}) {
  return { id: 'pf_1', externalId: '1', sourceId: 'codeforces-contests', status: 'published', itemType: 'competition',
    titleZh: '编程比赛', titleEn: 'Codeforces Round', summaryZh: '旧描述不能充当报名截止事实', summaryEn: '',
    canonicalUrl: 'https://codeforces.com/contests/1', publishedAt: null, discoveredAt: checked, verifiedAt: checked,
    deadlineAt: '2026-10-17T05:00:00.000Z', deadlineDate: '2026-10-17', organization: 'Codeforces',
    region: 'global', remoteStatus: 'remote', eligibilityZh: '以官方规则为准', ...overrides };
}
function internship(overrides = {}) {
  return contest({ sourceId: 'databricks-student-jobs', itemType: 'internship', titleZh: '软件工程实习', titleEn: 'Software Engineer Intern',
    canonicalUrl: 'https://job-boards.greenhouse.io/databricks/jobs/1', publishedAt: '2026-09-01T00:00:00.000Z',
    deadlineAt: null, deadlineDate: null, organization: 'Databricks', region: 'London, UK', remoteStatus: 'onsite',
    eligibilityZh: '面向学生，年级和工作许可须核对。', ...overrides });
}

beforeEach(() => {
  vi.clearAllMocks(); vi.useFakeTimers(); vi.setSystemTime(now);
  mocks.sourceRows = [source()]; mocks.rows = []; mocks.filters = [];
  mocks.select.mockImplementation(() => ({ from: (table: unknown) => ({
    where: (filter: unknown) => {
      mocks.filters.push(filter);
      return table === pathfinderSources ? Promise.resolve(mocks.sourceRows)
        : { orderBy: () => ({ limit: () => Promise.resolve(mocks.rows) }) };
    },
  }) }));
});
afterEach(() => vi.useRealTimers());

describe('每日竞赛与实习', () => {
  it('未来 Codeforces 比赛显示开赛时间，不伪造报名截止，最多三条且按近期开始排序', async () => {
    const { loadDailyOpportunities } = await import('../opportunities');
    mocks.rows = [4, 2, 1, 3].map(id => contest({ id: `pf_${id}`, externalId: String(id), canonicalUrl: `https://codeforces.com/contests/${id}`, deadlineAt: `2026-10-${16 + id}T05:00:00.000Z` }));
    const result = await loadDailyOpportunities('competitions', '2026-10-15', []);
    expect(result.status).toBe('published');
    expect(result.content).toMatchObject({ kind: 'competitions', items: [
      { id: 'pf_1', startAt: '2026-10-17T05:00:00.000Z', timeZone: 'UTC' }, { id: 'pf_2' }, { id: 'pf_3' },
    ] });
    expect(JSON.stringify(result.content)).not.toContain('开始后不能再报名');
    expect(result.summary).toContain('开赛');
  });

  it('排除已开始、远期且旧收录、未来发布时间、非白名单或非公开条目', async () => {
    const { loadDailyOpportunities } = await import('../opportunities');
    mocks.rows = [contest({ deadlineAt: now }), contest({ deadlineAt: '2027-01-01T00:00:00Z' }),
      contest({ publishedAt: '2026-10-16T00:00:00Z' }), contest({ sourceId: 'untrusted' }),
      contest({ status: 'archived' }), contest({ canonicalUrl: 'https://codeforces.com.evil.test/contests/1' }),
      contest({ canonicalUrl: 'https://codeforces.com/contests' }),
      contest({ canonicalUrl: 'https://user@codeforces.com/contests/1' }),
      contest({ verifiedAt: '2026-10-13T00:00:00Z' })];
    expect((await loadDailyOpportunities('competitions', '2026-10-15', [])).status).toBe('empty');
  });

  it('按 ID 和规范链接跨期去重，单期不重复同一机会', async () => {
    const { loadDailyOpportunities } = await import('../opportunities');
    mocks.rows = [contest(), contest({ id: 'copy' }), contest({ id: 'pf_2', canonicalUrl: 'https://codeforces.com/contests/2' })];
    const result = await loadDailyOpportunities('competitions', '2026-10-15', ['https://codeforces.com/contests/1?utm_source=x']);
    expect(result.content).toMatchObject({ items: [{ id: 'pf_2' }] });
    expect((await loadDailyOpportunities('competitions', '2026-10-15', ['pf_1', 'copy', 'pf_2'])).status).toBe('empty');
  });

  it.each([{ lastSuccessAt: '2026-10-13T00:00:00Z' }, { lastSuccessAt: '2026-10-16T00:00:00Z' }, { consecutiveFailures: 1 }, { enabled: false }, { autoPublish: false }])('来源不健康不能伪装为空稿：%j', async change => {
    const { loadDailyOpportunities } = await import('../opportunities');
    mocks.sourceRows = [source('codeforces-contests', change)];
    await expect(loadDailyOpportunities('competitions', '2026-10-15', [])).rejects.toThrow(/来源/);
  });

  it('实习只接纳完整当前职位板存在且同次核验的岗位，并展示海外现场地点与资格', async () => {
    const { loadDailyOpportunities } = await import('../opportunities');
    mocks.sourceRows = [source('databricks-student-jobs'), source('scale-ai-student-jobs')];
    mocks.rows = [internship(), internship({ id: 'removed', externalId: '999' }), internship({ id: 'old', verifiedAt: '2026-10-15T03:27:00.000Z' }),
      internship({ id: 'portal', canonicalUrl: 'https://databricks.com/company/careers' })];
    const result = await loadDailyOpportunities('internships', '2026-10-15', []);
    expect(result.content).toMatchObject({ kind: 'internships', items: [{ id: 'pf_1', organization: 'Databricks', verifiedAt: checked }] });
    const item = result.content && 'items' in result.content ? result.content.items[0] : null;
    expect(item?.location).toContain('London');
    expect(item?.location).toContain('现场');
    expect(item?.eligibility).toContain('工作许可');
    expect(result.summary).not.toContain('今日新增');
  });

  it('旧截断游标不能证明岗位仍在招聘，失败不能假装无实习', async () => {
    const { loadDailyOpportunities } = await import('../opportunities');
    mocks.sourceRows = [source('databricks-student-jobs', { cursor: JSON.stringify({ version: 1, externalIds: ['1'] }) })];
    mocks.rows = [internship()];
    await expect(loadDailyOpportunities('internships', '2026-10-15', [])).rejects.toThrow(/来源/);
  });

  it('部分来源失败仍可公开健康来源内容；健康来源也无候选时报告失败而非空稿', async () => {
    const { loadDailyOpportunities } = await import('../opportunities');
    mocks.sourceRows = [source('databricks-student-jobs'), source('scale-ai-student-jobs', { consecutiveFailures: 1 })];
    mocks.rows = [internship()];
    expect((await loadDailyOpportunities('internships', '2026-10-15', [])).summary).toContain('暂不可用');
    mocks.rows = [];
    await expect(loadDailyOpportunities('internships', '2026-10-15', [])).rejects.toThrow(/来源/);
  });

  it('未来/历史日期不能用当前机会回填，数据库错误不能静态降级', async () => {
    const { loadDailyOpportunities } = await import('../opportunities');
    await expect(loadDailyOpportunities('internships', '2026-10-16', [])).rejects.toThrow();
    await expect(loadDailyOpportunities('internships', '2026-10-14', [])).rejects.toThrow();
    mocks.select.mockImplementation(() => { throw new Error('database unavailable'); });
    await expect(loadDailyOpportunities('competitions', '2026-10-15', [])).rejects.toThrow('database unavailable');
  });

  it('数据库查询本身限定类型/发布状态/来源并且按类型取数，不使用全站 500 条目录', async () => {
    const { loadDailyOpportunities } = await import('../opportunities');
    await loadDailyOpportunities('competitions', '2026-10-15', []);
    const sql = new PgDialect().sqlToQuery(mocks.filters[1] as Parameters<PgDialect['sqlToQuery']>[0]);
    expect(sql.params).toEqual(expect.arrayContaining(['published', 'competition', 'codeforces-contests']));
  });

  it('同日重复选择幂等，跨日合法重选不会撞永久 sourceKey 唯一索引', async () => {
    const { loadDailyOpportunities } = await import('../opportunities');
    mocks.rows = [contest()];
    const first = await loadDailyOpportunities('competitions', '2026-10-15', []);
    expect((await loadDailyOpportunities('competitions', '2026-10-15', [])).sourceKey).toBe(first.sourceKey);
    vi.setSystemTime('2026-10-16T04:00:00.000Z');
    const next = await loadDailyOpportunities('competitions', '2026-10-16', []);
    expect(next.sourceKey).not.toBe(first.sourceKey);
    expect(next.sourceKey).toContain('competitions:2026-10-16:');
  });
});

function edition(kind: 'competitions' | 'internships', ids = ['pf_1']): DailyEdition {
  return { id: `daily_${kind}`, date: '2026-10-15', channel: kind, status: 'published', title: '旧标题', summary: '旧摘要',
    content: { kind, items: ids.map(id => ({ id, title: '旧机会', summary: '旧事实', url: 'https://example.com/old', sourceName: 'old', sourceType: 'official' })) },
    sourceKey: 'old-source-key', publishedAt: checked, updatedAt: checked };
}

describe('今日机会快照的公开读取', () => {
  it('没有机会正文时原样返回且零数据库读取', async () => {
    const { filterAvailableDailyOpportunities } = await import('../opportunities');
    const editions: DailyEdition[] = [{ ...edition('competitions'), status: 'empty', content: null }];
    expect(await filterAvailableDailyOpportunities(editions)).toBe(editions);
    expect(mocks.select).not.toHaveBeenCalled();
  });

  it('读取时隐藏已开赛比赛及已关闭岗位，清空元信息并保持数据库快照对象不变', async () => {
    const { filterAvailableDailyOpportunities } = await import('../opportunities');
    mocks.sourceRows = [source(), source('databricks-student-jobs')];
    mocks.rows = [contest({ deadlineAt: now }), internship({ id: 'job', status: 'expired' })];
    const original = [edition('competitions'), edition('internships', ['job'])];
    const result = await filterAvailableDailyOpportunities(original);
    expect(result).toEqual(original.map(item => ({ ...item, status: 'empty', title: '', summary: '', content: null, sourceKey: null, publishedAt: null })));
    expect(original.every(item => item.status === 'published' && item.content !== null)).toBe(true);
    expect(mocks.select).toHaveBeenCalledTimes(2);
  });

  it('未关闭但已从完整成功职位板消失的岗位同样不再公开', async () => {
    const { filterAvailableDailyOpportunities } = await import('../opportunities');
    mocks.sourceRows = [source('databricks-student-jobs', { cursor: '{"version":2,"kind":"greenhouse-board","externalIds":[]}' })];
    mocks.rows = [internship()];
    expect((await filterAvailableDailyOpportunities([edition('internships')]))[0].status).toBe('empty');
  });

  it('来源故障仅表示无法核验，不伪称岗位已关闭；数据库故障仍上抛', async () => {
    const { filterAvailableDailyOpportunities } = await import('../opportunities');
    mocks.sourceRows = [source('databricks-student-jobs', { consecutiveFailures: 1 })];
    mocks.rows = [internship()];
    expect((await filterAvailableDailyOpportunities([edition('internships')]))[0]).toMatchObject({ status: 'failed', content: null, title: '', summary: '', sourceKey: null, publishedAt: null });
    mocks.select.mockImplementation(() => { throw new Error('db unavailable'); });
    await expect(filterAvailableDailyOpportunities([edition('internships')])).rejects.toThrow('db unavailable');
  });

  it('保留仍有效条目并用最近官方字段更新今日展示，不保留已经失效的计数', async () => {
    const { filterAvailableDailyOpportunities } = await import('../opportunities');
    mocks.sourceRows = [source('databricks-student-jobs')];
    mocks.rows = [internship({ titleZh: '更新后的岗位标题', region: 'Amsterdam, Netherlands' }), internship({ id: 'closed', status: 'expired' })];
    const [result] = await filterAvailableDailyOpportunities([edition('internships', ['pf_1', 'closed'])]);
    expect(result.content).toMatchObject({ items: [{ title: '更新后的岗位标题', location: 'Amsterdam, Netherlands · 现场 / On-site' }] });
    expect(result.summary).toMatch(/^1 个/);
  });
});
