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
    expect(bySchool.rows.map(row => row.span.university)).toEqual(['Alpha University', 'Beta University']);
    const byDeadline = buildMastersTimeline([alpha, beta], NOW, 'zh', 'deadline');
    expect(byDeadline.rows.map(row => row.span.university)).toEqual(['Beta University', 'Alpha University']);
  });

  it('同校不同项目各自一行，颜色一致', () => {
    const base = roundFixture();
    const first = roundFixture({ id: 'a', details: { ...base.details, programme: 'MSc A', opensOn: '2026-10-01', deadlineOn: '2027-01-01' } });
    const second = roundFixture({ id: 'b', details: { ...base.details, programme: 'MSc B', opensOn: '2026-11-01', deadlineOn: '2027-02-01' } });
    const rows = buildMastersTimeline([second, first], NOW, 'zh', 'school').rows;
    expect(rows).toHaveLength(2);
    expect(rows.map(row => row.span.programme)).toEqual(['MSc A', 'MSc B']);
    expect(rows[0].hue).toBe(rows[1].hue);
  });

  it('起点未公布的轮次也成行，由调用方决定画法', () => {
    const base = roundFixture();
    const openOnly = roundFixture({
      details: { ...base.details, opensOn: null, openingState: 'open', deadlineOn: '2026-12-20' },
    });
    const [row] = buildMastersTimeline([openOnly], NOW).rows;
    expect(row.span.start).toBe('2026-10-12');
    expect(row.span.startKnown).toBe(false);
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
});
