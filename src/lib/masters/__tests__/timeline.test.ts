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
    expect(row.start).toBe('2026-10-12');
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

  it('同一项目的多个只有截止日的轮次合成一行、多个截止点', () => {
    const base = roundFixture();
    const first = roundFixture({ id: 'a', details: { ...base.details, opensOn: null, openingState: 'unknown', deadlineOn: '2026-11-30' } });
    const second = roundFixture({ id: 'b', details: { ...base.details, opensOn: null, openingState: 'unknown', deadlineOn: '2027-05-31' } });
    const timeline = buildMastersTimeline([first, second], NOW);
    expect(timeline.rows).toHaveLength(1);
    expect(timeline.rows[0].rounds).toHaveLength(2);
    expect(timeline.rows[0].milestones.map(milestone => milestone.date)).toEqual(['2026-11-30', '2027-05-31']);
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
});
