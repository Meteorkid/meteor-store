import { describe, expect, it } from 'vitest';
import { buildMastersTimeline } from '../timeline';
import { roundFixture } from '@/components/masters/__tests__/fixtures';

const NOW = new Date('2026-11-10T04:00:00Z');

/** 10-15 开放、12-20 截止：时间轴 2026-10-01 → 2026-12-31，共 92 天。 */
function windowRound(overrides = {}) {
  const base = roundFixture();
  return roundFixture({
    details: { ...base.details, opensOn: '2026-10-15', deadlineOn: '2026-12-20' },
    ...overrides,
  });
}

const round = (n: number) => Math.round(n * 1000) / 1000;

describe('甘特投影', () => {
  it('没有可投影的轮次时返回空轴而不是抛错', () => {
    const timeline = buildMastersTimeline([], NOW);
    expect(timeline.rows).toHaveLength(0);
    expect(timeline.months).toHaveLength(0);
    expect(timeline.todayPct).toBeNull();
    expect(timeline.deadlineCount).toBe(0);
  });

  it('时间轴向月边界取整，让整月都落在轴上', () => {
    const timeline = buildMastersTimeline([windowRound()], NOW);
    expect(timeline.start).toBe('2026-10-01');
    expect(timeline.end).toBe('2026-12-31');
  });

  it('月份按真实天数占宽，2 月不会被拉成和 1 月一样长', () => {
    const timeline = buildMastersTimeline([windowRound()], NOW);
    expect(timeline.months.map(month => month.key)).toEqual(['2026-10', '2026-11', '2026-12']);
    // 10 月 31 天 / 11 月 30 天 / 12 月 31 天，共 92 天
    expect(timeline.months.map(month => round(month.width))).toEqual([33.696, 32.609, 33.696]);
    expect(timeline.months[0].left).toBe(0);
  });

  it('条形按天定位，末端补一天让截止日当天整日落进条内', () => {
    const [row] = buildMastersTimeline([windowRound()], NOW).rows;
    // 起点 10-15 距 10-01 为 14 天；末端 12-21（截止次日）距 10-01 为 81 天
    expect(round(row.left)).toBe(15.217);
    expect(round(row.width)).toBe(72.826);
    expect(round(row.left + row.width)).toBe(88.043);
  });

  it('今天落在轴上时给出百分比，落在轴外时为 null', () => {
    expect(buildMastersTimeline([windowRound()], NOW).todayPct).not.toBeNull();
    const later = buildMastersTimeline([windowRound()], new Date('2027-05-01T04:00:00Z'));
    expect(later.todayPct).toBeNull();
  });

  it('末轮截止刻度落在条形右端内侧，不会贴死边缘', () => {
    const [row] = buildMastersTimeline([windowRound()], NOW).rows;
    expect(row.deadlineTicks).toHaveLength(1);
    const tick = row.deadlineTicks[0];
    expect(tick).toBeGreaterThan(95);
    expect(tick).toBeLessThan(100);
  });

  it('默认按学校分组，切到截止日排序把先截止的排在前面', () => {
    const base = roundFixture();
    const alpha = roundFixture({
      id: 'alpha', details: { ...base.details, university: 'Alpha University', opensOn: '2026-10-01', deadlineOn: '2027-02-01' },
    });
    const beta = roundFixture({
      id: 'beta', details: { ...base.details, university: 'Beta University', opensOn: '2026-11-01', deadlineOn: '2026-12-01' },
    });
    const bySchool = buildMastersTimeline([beta, alpha], NOW, 'zh', 'school');
    expect(bySchool.rows.map(row => row.university)).toEqual(['Alpha University', 'Beta University']);
    const byDeadline = buildMastersTimeline([alpha, beta], NOW, 'zh', 'deadline');
    expect(byDeadline.rows.map(row => row.university)).toEqual(['Beta University', 'Alpha University']);
  });

  it('同校不同项目各自一行，颜色一致', () => {
    const base = roundFixture();
    const first = roundFixture({ id: 'a', details: { ...base.details, programme: 'MSc A', opensOn: '2026-10-01', deadlineOn: '2027-01-01' } });
    const second = roundFixture({ id: 'b', details: { ...base.details, programme: 'MSc B', opensOn: '2026-11-01', deadlineOn: '2027-02-01' } });
    const rows = buildMastersTimeline([second, first], NOW, 'zh', 'school').rows;
    expect(rows).toHaveLength(2);
    expect(rows.map(row => row.programme)).toEqual(['MSc A', 'MSc B']);
    expect(rows[0].hue).toBe(rows[1].hue);
  });

  it('起点未公布的轮次也成行，由调用方决定画法', () => {
    const base = roundFixture();
    const openOnly = roundFixture({
      details: { ...base.details, opensOn: null, openingState: 'open', deadlineOn: '2026-12-20' },
    });
    const [row] = buildMastersTimeline([openOnly], NOW).rows;
    expect(row.start).toBe('2026-11-10');
    expect(row.startKnown).toBe(false);
    expect(row.left).toBeGreaterThan(0);
  });

  it('月份超过 12 个时标签退化为纯数字，避免挤成一片', () => {
    const base = roundFixture();
    const long = roundFixture({ details: { ...base.details, opensOn: '2026-01-01', deadlineOn: '2027-06-30' } });
    const timeline = buildMastersTimeline([long], NOW);
    expect(timeline.months.length).toBeGreaterThan(12);
    expect(timeline.months.every(month => /^\d{1,2}$/.test(month.label))).toBe(true);
  });

  it('统计范围内出现过的截止日数量', () => {
    const base = roundFixture();
    const first = roundFixture({ id: 'a', details: { ...base.details, programme: 'MSc A', opensOn: '2026-10-01', deadlineOn: '2027-01-01' } });
    const second = roundFixture({ id: 'b', details: { ...base.details, programme: 'MSc B', opensOn: '2026-11-01', deadlineOn: '2027-02-01' } });
    expect(buildMastersTimeline([first, second], NOW).deadlineCount).toBe(2);
  });

  it('只有截止日的轮次也成行，但标成 deadline 不画时长', () => {
    const base = roundFixture();
    const onlyDeadline = roundFixture({
      details: { ...base.details, opensOn: null, openingState: 'unknown', deadlineOn: '2027-03-15' },
    });
    const timeline = buildMastersTimeline([onlyDeadline], NOW);
    expect(timeline.rows).toHaveLength(1);
    const [row] = timeline.rows;
    expect(row.kind).toBe('deadline');
    // 开放日未知就不给起点，避免把「这天才开放」画出来
    expect(row.start).toBeNull();
    expect(row.end).toBe('2027-03-15');
    expect(row.deadlineTicks).toEqual([]);
    expect(row.milestones.map(milestone => milestone.date)).toEqual(['2027-03-15']);
    expect(timeline.spanCount).toBe(0);
    expect(timeline.deadlineOnlyCount).toBe(1);
  });

  it('轴范围要容纳只有截止日的轮次，否则它会落到轴外', () => {
    const base = roundFixture();
    const withWindow = roundFixture({ id: 'w', details: { ...base.details, opensOn: '2026-10-15', deadlineOn: '2026-12-20' } });
    const onlyDeadline = roundFixture({
      id: 'd', details: { ...base.details, programme: 'MSc Late', opensOn: null, openingState: 'unknown', deadlineOn: '2027-05-31' },
    });
    const timeline = buildMastersTimeline([withWindow, onlyDeadline], NOW);
    expect(timeline.start).toBe('2026-10-01');
    expect(timeline.end).toBe('2027-05-31');
    const deadline = timeline.rows.find(row => row.kind === 'deadline')!;
    expect(deadline.milestones[0].pct).toBeGreaterThan(0);
    expect(deadline.milestones[0].pct).toBeLessThanOrEqual(100);
  });

  it('同一项目的多个只有截止日的轮次各自一行和一个截止点', () => {
    const base = roundFixture();
    const first = roundFixture({ id: 'a', details: { ...base.details, opensOn: null, openingState: 'unknown', deadlineOn: '2026-11-30' } });
    const second = roundFixture({ id: 'b', details: { ...base.details, opensOn: null, openingState: 'unknown', deadlineOn: '2027-05-31' } });
    const timeline = buildMastersTimeline([first, second], NOW);
    expect(timeline.rows).toHaveLength(2);
    expect(timeline.rows.every(row => row.rounds.length === 1)).toBe(true);
    expect(timeline.rows.flatMap(row => row.milestones.map(milestone => milestone.date))).toEqual(['2026-11-30', '2027-05-31']);
    expect(timeline.roundCount).toBe(2);
  });

  it('没有任何可用日期的轮次计入 undatedCount，不会被悄悄忽略', () => {
    const base = roundFixture();
    const undated = roundFixture({
      details: { ...base.details, opensOn: null, openingState: 'unknown', deadlineOn: null, deadlineStatus: 'unannounced' },
    });
    const timeline = buildMastersTimeline([undated], NOW);
    expect(timeline.rows).toHaveLength(0);
    expect(timeline.undatedCount).toBe(1);
    expect(timeline.roundCount).toBe(0);
  });

  it('两个项目同时开放时算出重叠区间，端点相接不算重叠', () => {
    const base = roundFixture();
    // A 10-01 → 12-20，B 11-01 → 01-15：重叠 11-01 至 12-20
    const wide = roundFixture({ id: 'a', details: { ...base.details, programme: 'MSc A', opensOn: '2026-10-01', deadlineOn: '2026-12-20' } });
    const late = roundFixture({ id: 'b', details: { ...base.details, programme: 'MSc B', opensOn: '2026-11-01', deadlineOn: '2027-01-15' } });
    const timeline = buildMastersTimeline([wide, late], NOW);
    expect(timeline.overlaps).toHaveLength(1);
    expect(timeline.overlaps[0].start).toBe('2026-11-01');
    expect(timeline.overlaps[0].end).toBe('2026-12-20');
    expect(timeline.overlaps[0].count).toBe(2);
    // 11-01 → 12-20 含首尾共 50 天
    expect(timeline.overlapDays).toBe(50);

    // 前一段截止的次日才开放，没有共同日，不算重叠
    const touching = roundFixture({ id: 'c', details: { ...base.details, programme: 'MSc C', opensOn: '2026-12-21', deadlineOn: '2027-01-20' } });
    expect(buildMastersTimeline([wide, touching], NOW).overlaps).toHaveLength(0);
  });

  it('重叠区间按真实天数给出百分比，与条形同基准', () => {
    const base = roundFixture();
    const wide = roundFixture({ id: 'a', details: { ...base.details, programme: 'MSc A', opensOn: '2026-10-01', deadlineOn: '2026-12-31' } });
    const late = roundFixture({ id: 'b', details: { ...base.details, programme: 'MSc B', opensOn: '2026-11-01', deadlineOn: '2026-12-31' } });
    const timeline = buildMastersTimeline([wide, late], NOW);
    // 轴 10-01 → 12-31 共 92 天；重叠起点 11-01 是第 31 天
    expect(round(timeline.overlaps[0].left)).toBe(33.696);
    expect(round(timeline.overlaps[0].left + timeline.overlaps[0].width)).toBe(100);
  });

  it('同项目仅截止的批次独立成行，不扩张另一批次窗口或虚构重叠', () => {
    const base = roundFixture();
    const window = roundFixture({ id: 'window', details: { ...base.details, opensOn: '2026-10-01', deadlineOn: '2026-10-31' } });
    const deadline = roundFixture({ id: 'deadline', details: { ...base.details, opensOn: null, openingState: 'unknown', deadlineOn: '2026-12-31' } });
    const other = roundFixture({ id: 'other', details: { ...base.details, programme: 'MSc Other', opensOn: '2026-11-01', deadlineOn: '2026-11-30' } });
    const timeline = buildMastersTimeline([window, deadline, other], NOW);
    const row = timeline.rows.find(row => row.rounds[0].id === 'window')!;
    expect(row.end).toBe('2026-10-31');
    expect(row.latestDeadline).toBe('2026-10-31');
    expect(row.outsideMarkers).toEqual([]);
    expect(timeline.rows.find(row => row.rounds[0].id === 'deadline')).toMatchObject({ kind: 'deadline', start: null,
      milestones: [{ date: '2026-12-31', roundId: 'deadline' }] });
    expect(timeline.overlapDays).toBe(0);
  });

  it('同项目的所有批次各自成行，不把仅截止的批次附到另一段', () => {
    const base = roundFixture();
    const early = roundFixture({ id: 'early', details: { ...base.details, opensOn: '2026-10-01', deadlineOn: '2026-10-31' } });
    const late = roundFixture({ id: 'late', details: { ...base.details, opensOn: '2027-01-01', deadlineOn: '2027-01-31' } });
    const before = roundFixture({ id: 'before', details: { ...base.details, opensOn: null, openingState: 'unknown', deadlineOn: '2026-09-30' } });
    const after = roundFixture({ id: 'after', details: { ...base.details, opensOn: null, openingState: 'unknown', deadlineOn: '2027-02-01' } });
    const timeline = buildMastersTimeline([late, before, early, after], NOW);
    expect(timeline.rows).toHaveLength(4);
    expect(timeline.rows.every(row => row.rounds.length === 1 && row.outsideMarkers.length === 0)).toBe(true);
    expect(timeline.rows.flatMap(row => row.rounds.map(round => round.id)).sort()).toEqual(['after', 'before', 'early', 'late']);
    expect(timeline.roundCount).toBe(4);
    expect(timeline.overlapDays).toBe(0);
  });

  it('同日不同轮次的截止点仍可独立定位', () => {
    const base = roundFixture();
    const first = roundFixture({ id: 'first' });
    const second = roundFixture({ id: 'second' });
    const windows = buildMastersTimeline([first, second], NOW).rows;
    expect(windows).toHaveLength(2);
    expect(windows.map(row => row.milestones[0].roundId)).toEqual(['first', 'second']);
    const details = { ...base.details, opensOn: null, openingState: 'unknown' as const };
    const deadlines = buildMastersTimeline([roundFixture({ id: 'first', details }), roundFixture({ id: 'second', details })], NOW).rows;
    expect(deadlines).toHaveLength(2);
    expect(deadlines.map(row => row.milestones[0].roundId)).toEqual(['first', 'second']);
  });

  it('按最近尚有效截止排序，排除已过期、已关闭和已过精确时刻的轮次', () => {
    const base = roundFixture();
    const make = (id: string, programme: string, deadlineOn: string, details = {}) => roundFixture({
      id, details: { ...base.details, programme, opensOn: null, openingState: 'unknown', deadlineOn, ...details },
    });
    const rounds = [
      make('ended', 'Ended', '2026-11-01'),
      make('closed', 'Closed', '2027-05-01', { openingState: 'closed' }),
      make('early', 'Multi-round', '2026-11-20'),
      make('late', 'Multi-round', '2027-05-01'),
      make('middle', 'Middle', '2026-12-01'),
      make('exact-ended', 'Exact ended', '2026-11-10', { deadlineAt: '2026-11-10T10:00:00+08:00', deadlineTimeZone: 'Asia/Shanghai' }),
      { ...make('future-verification', 'Future verification', '2026-11-11'), verifiedOn: '2026-11-11' },
      { ...make('unverified', 'Unverified', '2026-11-11'), verifiedOn: null },
    ];
    const timeline = buildMastersTimeline(rounds, NOW, 'zh', 'deadline');
    expect(timeline.rows.slice(0, 3).map(row => [row.programme, row.recentDeadline])).toEqual([
      ['Multi-round', '2026-11-20'], ['Middle', '2026-12-01'], ['Multi-round', '2027-05-01'],
    ]);
    expect(timeline.rows.slice(3).every(row => row.recentDeadline === null)).toBe(true);
    const exact = timeline.rows.find(row => row.programme === 'Exact ended')!;
    expect(exact.milestones[0].past).toBe(true);
  });

  it('同项目多个开放批次分别成行，但重叠摘要只计算不同项目', () => {
    const base = roundFixture();
    const details = { ...base.details, opensOn: null, openingState: 'open' as const };
    const first = roundFixture({ id: 'r1', details: { ...details, deadlineOn: '2026-11-20' } });
    const second = roundFixture({ id: 'r2', details: { ...details, deadlineOn: '2026-12-20' } });
    const third = roundFixture({ id: 'r3', details: { ...details, deadlineOn: '2027-01-20' } });
    const alone = buildMastersTimeline([third, first, second], NOW);
    expect(alone.rows).toHaveLength(3);
    expect(alone.rows.every(row => row.start === '2026-11-10')).toBe(true);
    expect(new Set(alone.rows.map(row => row.hue)).size).toBe(1);
    expect(alone.overlapDays).toBe(0);
    const other = roundFixture({ id: 'other', details: { ...details, programme: 'Other project', deadlineOn: '2026-11-30' } });
    const together = buildMastersTimeline([first, second, third, other], NOW);
    expect(together.overlaps).toMatchObject([{ start: '2026-11-10', end: '2026-11-30', count: 2 }]);
    expect(together.overlapDays).toBe(21);
  });

  it('提前明确关闭的官方窗口保留灰色行，但不参与项目重叠', () => {
    const base = roundFixture();
    const closed = roundFixture({ id: 'closed', details: { ...base.details, programme: 'Closed project', openingState: 'closed', deadlineOn: '2026-12-31' } });
    const other = roundFixture({ id: 'other', details: { ...base.details, programme: 'Other project', opensOn: '2026-11-01', deadlineOn: '2026-12-31' } });
    const timeline = buildMastersTimeline([closed, other], NOW);
    expect(timeline.rows.find(row => row.key === 'closed')).toMatchObject({ kind: 'span', past: true, start: '2026-10-01', end: '2026-12-31' });
    expect(timeline.overlapDays).toBe(0);
    const naturallyEnded = { ...closed, details: { ...closed.details, openingState: 'scheduled' as const } };
    const historical = buildMastersTimeline([naturallyEnded, other], new Date('2027-01-02T04:00:00Z'));
    expect(historical.rows.every(row => row.past)).toBe(true);
    expect(historical.overlapDays).toBe(61);
  });

  it('精确截止跨到北京时间次月时，范围、条尾、截止点和最近截止保持一致', () => {
    const base = roundFixture();
    const exact = roundFixture({ id: 'exact', details: { ...base.details, university: 'A exact',
      deadlineOn: '2026-10-31', deadlineAt: '2026-10-31T23:59:00Z', deadlineTimeZone: 'Europe/London' } });
    const dateOnly = roundFixture({ id: 'date-only', details: { ...base.details, university: 'Z date only',
      opensOn: null, openingState: 'unknown', deadlineOn: '2026-10-31' } });
    const now = new Date('2026-10-30T20:00:00Z');
    const timeline = buildMastersTimeline([exact, dateOnly], now, 'zh', 'deadline');
    expect(timeline.rows.map(row => row.key)).toEqual(['date-only', 'exact']);
    const row = timeline.rows[1];
    expect(row).toMatchObject({ end: '2026-11-01', latestDeadline: '2026-11-01', recentDeadline: '2026-11-01',
      milestones: [{ roundId: 'exact', date: '2026-11-01', past: false }] });
    expect(timeline.end).toBe('2026-11-30');
    expect(timeline.months.map(month => month.key)).toEqual(['2026-10', '2026-11']);
    expect(row.rounds[0].details.deadlineOn).toBe('2026-10-31');
    const unknownOpening = { ...exact, details: { ...exact.details, opensOn: null, openingState: 'unknown' as const } };
    expect(buildMastersTimeline([unknownOpening], now).rows[0]).toMatchObject({
      kind: 'deadline', start: null, end: '2026-11-01', recentDeadline: '2026-11-01', milestones: [{ date: '2026-11-01' }],
    });
  });
});
