import { describe, expect, it } from 'vitest';
import { getMastersRoundState } from '../dates';
import type { MastersRound } from '../types';

function round(details: Partial<MastersRound['details']> = {}, overrides: Partial<MastersRound> = {}): MastersRound {
  return {
    id: 'application-2027', intakeYear: 2027, region: 'hong-kong', status: 'published',
    verifiedOn: '2026-10-14', revision: 1, dateVersion: 1, dateChangedAt: null, previousDeadlineText: null,
    createdAt: '2026-10-14T00:00:00Z', updatedAt: '2026-10-14T00:00:00Z',
    details: {
      university: 'Test University', programme: 'MSc Computing', subject: '计算机', studyType: 'taught',
      studyMode: '全日制', intakeLabel: '2027年秋季', applicantGroup: '国际申请者', roundName: '主轮', eventType: 'application',
      opensOn: '2026-10-01', openingNote: '官方开放日', openingState: 'scheduled', deadlineStatus: 'confirmed',
      deadlineOn: '2027-01-31', deadlineAt: null, deadlineTimeZone: null, deadlineText: '31 January 2027',
      rolling: false, mayCloseEarly: false, officialUrl: 'https://example.edu/admissions', sourceNote: '官方项目日期。',
      ...details,
    },
    ...overrides,
  };
}

describe('硕士申请日期精度与提醒档位', () => {
  it.each([
    ['2026-12-31T01:00:00Z', 31, null],
    ['2027-01-01T01:00:00Z', 30, 30],
    ['2027-01-23T01:00:00Z', 8, 30],
    ['2027-01-24T01:00:00Z', 7, 7],
    ['2027-01-29T01:00:00Z', 2, 7],
    ['2027-01-30T01:00:00Z', 1, 1],
    ['2027-01-31T01:00:00Z', 0, 1],
  ])('%s 只返回最近一个提醒档位', (now, daysLeft, leadDays) => {
    expect(getMastersRoundState(round(), new Date(now as string))).toMatchObject({ daysLeft, leadDays });
  });

  it('未知时区的仅日期在北京时间过日后关闭，不继续宣称还能申请', () => {
    expect(getMastersRoundState(round(), new Date('2027-01-31T15:59:59Z'))).toMatchObject({ state: 'closing', daysLeft: 0, leadDays: 1 });
    expect(getMastersRoundState(round(), new Date('2027-01-31T16:00:00Z'))).toEqual({ state: 'closed', daysLeft: 0, leadDays: null });
  });

  it('已知时区的仅日期按该地日期计算，不套用北京时间', () => {
    const value = round({ deadlineTimeZone: 'Europe/London' });
    expect(getMastersRoundState(value, new Date('2027-01-31T16:00:00Z'))).toMatchObject({ state: 'closing', daysLeft: 0 });
    expect(getMastersRoundState(value, new Date('2027-02-01T00:00:00Z'))).toMatchObject({ state: 'closed', leadDays: null });
  });

  it('精确时间按毫秒判断，临界时刻不再提醒', () => {
    const value = round({ deadlineOn: '2027-01-06', deadlineAt: '2027-01-06T12:00:00Z', deadlineTimeZone: 'Europe/London' });
    expect(getMastersRoundState(value, new Date('2027-01-05T11:59:59Z'))).toMatchObject({ daysLeft: 2, leadDays: 7 });
    expect(getMastersRoundState(value, new Date('2027-01-05T12:00:00Z'))).toMatchObject({ daysLeft: 1, leadDays: 1 });
    expect(getMastersRoundState(value, new Date('2027-01-06T11:59:59Z'))).toMatchObject({ state: 'closing', daysLeft: 1 });
    expect(getMastersRoundState(value, new Date('2027-01-06T12:00:00Z'))).toEqual({ state: 'closed', daysLeft: 0, leadDays: null });
  });

  it('跨夏令时的日期级天数不因一天只有23小时而少一天', () => {
    const value = round({ deadlineOn: '2027-03-29', deadlineTimeZone: 'Europe/London' });
    expect(getMastersRoundState(value, new Date('2027-03-27T12:00:00Z')).daysLeft).toBe(2);
  });

  it('未知开放日不推断已开放，但已确认截止仍可提醒关注者', () => {
    const value = round({ openingState: 'unknown', opensOn: null });
    expect(getMastersRoundState(value, new Date('2027-01-24T01:00:00Z'))).toEqual({ state: 'unverified', daysLeft: 7, leadDays: 7 });
    expect(getMastersRoundState(value, new Date('2027-01-31T01:00:00Z')).state).toBe('closing');
  });

  it('明确未来开放日显示 upcoming，官方明确已开放但日期未知则可以 open', () => {
    expect(getMastersRoundState(round({ opensOn: '2027-01-25' }), new Date('2027-01-24T01:00:00Z')).state).toBe('upcoming');
    expect(getMastersRoundState(round({ opensOn: null, openingState: 'open' }), new Date('2026-11-01T01:00:00Z')).state).toBe('open');
  });

  it.each(['unannounced', 'unverified'] as const)('%s 截止不能产生天数或提醒', (deadlineStatus) => {
    expect(getMastersRoundState(round({ deadlineStatus, deadlineOn: null }), new Date('2027-01-30T01:00:00Z'))).toEqual({ state: deadlineStatus, daysLeft: null, leadDays: null });
  });

  it('明确提前关闭优先于仍在未来的截止日', () => {
    expect(getMastersRoundState(round({ openingState: 'closed', mayCloseEarly: true }), new Date('2027-01-24T01:00:00Z'))).toEqual({ state: 'closed', daysLeft: null, leadDays: null });
  });

  it.each([
    { status: 'draft' as const }, { verifiedOn: null }, { verifiedOn: '2028-01-01' },
  ])('草稿或未经有效核验的记录不发提醒 %j', (overrides) => {
    expect(getMastersRoundState(round({}, overrides), new Date('2027-01-30T01:00:00Z')).leadDays).toBeNull();
  });

  it('无效日期、错配时区日期、仅精确时刻却无时区一律不参与提醒', () => {
    const cases = [
      { deadlineOn: '2027-02-30' },
      { deadlineAt: '2027-01-31T23:00:00Z', deadlineTimeZone: 'Asia/Hong_Kong' },
      { deadlineAt: '2027-01-31T12:00:00Z', deadlineTimeZone: null },
      { deadlineTimeZone: 'invalid-time-zone' },
    ];
    for (const details of cases) {
      expect(getMastersRoundState(round(details), new Date('2027-01-24T01:00:00Z'))).toEqual({ state: 'unverified', daysLeft: null, leadDays: null });
    }
  });

  it('入学2027年但截止2026年仍按真正截止处理', () => {
    expect(getMastersRoundState(round({ deadlineOn: '2026-11-30' }), new Date('2026-11-29T01:00:00Z'))).toMatchObject({ daysLeft: 1, leadDays: 1 });
  });
});
