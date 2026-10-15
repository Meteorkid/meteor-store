import { describe, expect, it } from 'vitest';
import { filterMastersRounds, unavailableWatches, parseMastersWatches, parseMastersWatch, canExportMastersRound, mastersDeadlineLabel, mastersStateLabel } from '../state';
import { roundFixture, watchFixture } from './fixtures';

const now = new Date('2026-10-14T04:00:00Z');

describe('申请日历阅读与个人状态边界', () => {
  it('入学年份与筛选组合不会合并同校的不同轮次', () => {
    const first = roundFixture();
    const second = roundFixture({ id: 'round2', details: { ...first.details, roundName: 'Round 2' } });
    const nextYear = roundFixture({ id: 'next-year', intakeYear: 2028 });
    const filters = { year: 2027, region: 'hong-kong', school: 'Example University', subject: 'Computer Science', studyType: 'taught', intake: 'September 2027' };
    expect(filterMastersRounds([first, second, nextYear], filters).map(round => round.id)).toEqual([first.id, second.id]);
    expect(filterMastersRounds([first], { ...filters, studyType: 'research' })).toEqual([]);
  });

  it('跨年公开轮次不会误判成已下架关注', () => {
    const first = roundFixture();
    const nextYear = roundFixture({ id: 'next-year', intakeYear: 2028 });
    const watches = [watchFixture(first.id), watchFixture(nextYear.id), watchFixture('unpublished')];
    expect(unavailableWatches(watches, [first, nextYear])).toEqual([watches[2]]);
  });

  it('私人响应必须属于请求账号，缺失rounds不能伪装成已下架', () => {
    const value = { userId: 'user-a', watches: [watchFixture()], rounds: [roundFixture()] };
    expect(parseMastersWatches(value, 'user-a').watches).toEqual(value.watches);
    expect(() => parseMastersWatches(value, 'user-b')).toThrow();
    expect(() => parseMastersWatches({ userId: 'user-a', watches: [] }, 'user-a')).toThrow();
    expect(() => parseMastersWatch({ userId: 'user-b', watch: watchFixture() }, 'user-a')).toThrow();
    expect(parseMastersWatch({ userId: 'user-a', watch: watchFixture() }, 'user-a').reminders).toBe(false);
  });

  it('只有核验过且未截止的明确日期可选入ICS', () => {
    const round = roundFixture();
    expect(canExportMastersRound(round, now)).toBe(true);
    expect(canExportMastersRound({ ...round, status: 'draft' }, now)).toBe(false);
    expect(canExportMastersRound({ ...round, verifiedOn: null }, now)).toBe(false);
    expect(canExportMastersRound({ ...round, verifiedOn: '2026-11-01' }, now)).toBe(false);
    expect(canExportMastersRound({ ...round, details: { ...round.details, deadlineStatus: 'unannounced', deadlineOn: null } }, now)).toBe(false);
    expect(canExportMastersRound({ ...round, details: { ...round.details, openingState: 'closed' } }, now)).toBe(false);
  });

  it('日期精度不会被渲染成午夜截止，也不会宣称官方已关闭', () => {
    const round = roundFixture();
    expect(mastersDeadlineLabel(round, 'zh')).toBe('2026-12-01');
    const later = new Date('2026-12-02T04:00:00Z');
    expect(mastersStateLabel(round, later, 'zh')).toBe('截止日期已过');
    expect(mastersStateLabel({ ...round, details: { ...round.details, openingState: 'closed' } }, later, 'zh')).toBe('官方已关闭');
  });

  it('已核验截止但未知开放日时不冒充开放中', () => {
    const round = roundFixture();
    const unknownOpening = { ...round, details: { ...round.details, opensOn: null, openingState: 'unknown' as const } };
    expect(mastersStateLabel(unknownOpening, now, 'zh')).toBe('开放状态待确认');
    expect(canExportMastersRound(unknownOpening, now)).toBe(true);
  });
});
