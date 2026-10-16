import { afterEach, describe, expect, it, vi } from 'vitest';
import { parseGreenhouseBoardIds, parseGreenhouseJobs, parseGreenhouseMembershipCursor } from '../ingestion/parse';
import { PATHFINDER_SYNC_SOURCE_MAP } from '../ingestion/sources';

const source = PATHFINDER_SYNC_SOURCE_MAP.get('databricks-student-jobs')!;
const job = (id: number) => ({ id, title: 'Software Engineer Intern', absolute_url: `https://job-boards.greenhouse.io/databricks/jobs/${id}`, location: { name: 'London, UK' } });

afterEach(() => vi.restoreAllMocks());

describe('Greenhouse 完整职位板证据', () => {
  it('展示只取 20 条，关闭判据仍保留完整 35 个原始岗位 ID', () => {
    const body = JSON.stringify({ jobs: Array.from({ length: 35 }, (_, i) => job(i + 1)), meta: { total: 35 } });
    expect(parseGreenhouseJobs(source, body)).toHaveLength(20);
    expect(parseGreenhouseBoardIds(body)).toEqual(Array.from({ length: 35 }, (_, i) => String(i + 1)));
  });

  it.each([
    '{}', '{"error":"upstream failed"}', '{"jobs":null}',
    JSON.stringify({ jobs: [job(1)], meta: { total: 2 } }),
    JSON.stringify({ jobs: [job(1), { title: 'missing id' }] }),
  ])('缺失或不完整的响应不能被解析为空板并关闭岗位：%s', body => {
    expect(() => parseGreenhouseBoardIds(body)).toThrow();
    expect(() => parseGreenhouseJobs(source, body)).toThrow();
  });

  it('有效空板可证明所有岗位消失；更新时间不冒充首次发布时间', () => {
    expect(parseGreenhouseBoardIds('{"jobs":[],"meta":{"total":0}}')).toEqual([]);
    expect(parseGreenhouseJobs(source, JSON.stringify({ jobs: [{ ...job(1), updated_at: '2026-10-15T00:00:00Z' }] }))[0].publishedAt).toBeNull();
  });

  it('仅接受完整岗位板 v2 游标；旧截断列表不能冒充完整证据', () => {
    expect(parseGreenhouseMembershipCursor(JSON.stringify({ version: 1, externalIds: ['1'] }))).toBeNull();
    expect(parseGreenhouseMembershipCursor(JSON.stringify({ version: 2, kind: 'greenhouse-board', externalIds: ['1', '35'] }))).toEqual(['1', '35']);
    expect(parseGreenhouseMembershipCursor(JSON.stringify({ version: 2, kind: 'greenhouse-board', externalIds: [] }))).toEqual([]);
    expect(parseGreenhouseMembershipCursor('{broken')).toBeNull();
  });
});
