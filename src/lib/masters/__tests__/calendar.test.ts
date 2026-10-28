import { describe, expect, it } from 'vitest';
import {
  buildMastersCalendarMonth, clampMonth, collectMastersCalendarNodes, collectMastersCalendarPending,
  daysInMonth, formatMastersCalendarDate, formatMastersMonth, initialMastersCalendarMonth,
  mastersCalendarBounds, monthOf, shiftMonth, weekdayIndex,
} from '../calendar';
import { roundFixture } from '@/components/masters/__tests__/fixtures';

const NOW = new Date('2026-10-14T04:00:00Z');

describe('日历投影', () => {
  it('把开放日与截止日各投影成一个节点，同一天先排截止', () => {
    const round = roundFixture();
    const nodes = collectMastersCalendarNodes([round], NOW);
    expect(nodes.map(node => [node.date, node.kind])).toEqual([
      ['2026-10-01', 'opens'],
      ['2026-12-01', 'deadline'],
    ]);
    const same = collectMastersCalendarNodes([roundFixture({ details: { ...round.details, opensOn: '2026-12-01' } })], NOW);
    expect(same.map(node => node.kind)).toEqual(['deadline', 'opens']);
  });

  it('未公布或待核验的日期不进入网格，也不冒充已确认', () => {
    const base = roundFixture();
    const unannounced = roundFixture({ id: 'unannounced', details: { ...base.details, deadlineStatus: 'unannounced', deadlineOn: null } });
    const unverified = roundFixture({ id: 'unverified', details: { ...base.details, deadlineStatus: 'unverified', deadlineOn: null } });
    const nodes = collectMastersCalendarNodes([unannounced, unverified], NOW);
    expect(nodes.every(node => node.kind === 'opens')).toBe(true);
    expect(nodes.filter(node => node.kind === 'deadline')).toHaveLength(0);
    expect(collectMastersCalendarPending([unannounced, unverified]).map(item => item.reason))
      .toEqual(['unannounced', 'unverified']);
    expect(collectMastersCalendarPending([base])).toHaveLength(0);
  });

  it('截止节点按既有 7 天档区分临近，过期不算临近', () => {
    const base = roundFixture();
    const soon = roundFixture({ id: 'soon', details: { ...base.details, deadlineOn: '2026-10-20' } });
    const far = roundFixture({ id: 'far', details: { ...base.details, deadlineOn: '2027-03-01' } });
    const past = roundFixture({ id: 'past', details: { ...base.details, deadlineOn: '2026-09-01' } });
    const tone = (round: typeof base) => collectMastersCalendarNodes([round], NOW).find(node => node.kind === 'deadline')?.tone;
    expect(tone(soon)).toBe('closing');
    expect(tone(far)).toBe('deadline');
    expect(tone(past)).toBe('past');
  });

  it('近 7 天改期标记变更，更早的改期不标记', () => {
    const base = roundFixture();
    expect(collectMastersCalendarNodes([{ ...base, dateChangedAt: '2026-10-13T00:00:00.000Z' }], NOW)[0].changed).toBe(true);
    expect(collectMastersCalendarNodes([{ ...base, dateChangedAt: '2026-09-01T00:00:00.000Z' }], NOW)[0].changed).toBe(false);
  });
});

describe('月网格', () => {
  it('周一起始并补齐前后填充格', () => {
    // 2026-10-01 是周四 → 前面补 3 格（周一至周三）
    const view = buildMastersCalendarMonth('2026-10', [], '2026-10-14');
    expect(weekdayIndex('2026-10-01')).toBe(3);
    expect(view.weeks[0]).toHaveLength(7);
    expect(view.weeks[0][0].date).toBe('2026-09-28');
    expect(view.weeks[0][0].inMonth).toBe(false);
    expect(view.weeks[0][3].date).toBe('2026-10-01');
    expect(view.weeks[0][3].inMonth).toBe(true);
    expect(view.weeks.flat().filter(cell => cell.inMonth)).toHaveLength(31);
    expect(view.weeks.every(week => week.length === 7)).toBe(true);
  });

  it('标记今天，且只在当月格上标记', () => {
    const view = buildMastersCalendarMonth('2026-10', [], '2026-10-14');
    const today = view.weeks.flat().filter(cell => cell.isToday);
    expect(today.map(cell => cell.date)).toEqual(['2026-10-14']);
    expect(today[0].inMonth).toBe(true);
  });

  it('跨年归格：12 月与次年 1 月各自落在正确月份', () => {
    const base = roundFixture();
    const december = roundFixture({ id: 'dec', details: { ...base.details, deadlineOn: '2026-12-01' } });
    const january = roundFixture({ id: 'jan', details: { ...base.details, deadlineOn: '2027-01-06' } });
    const nodes = collectMastersCalendarNodes([december, january], NOW);
    const dec = buildMastersCalendarMonth('2026-12', nodes, '2026-10-14');
    const jan = buildMastersCalendarMonth('2027-01', nodes, '2026-10-14');
    expect(dec.weeks.flat().find(cell => cell.date === '2026-12-01')?.nodes).toHaveLength(1);
    expect(dec.weeks.flat().some(cell => cell.date === '2027-01-06')).toBe(false);
    expect(jan.weeks.flat().find(cell => cell.date === '2027-01-06')?.nodes).toHaveLength(1);
    expect(dec.deadlineCount).toBe(1);
    expect(jan.deadlineCount).toBe(1);
  });

  it('统计本月开放与截止数量，填充格上的节点不计入', () => {
    const base = roundFixture();
    const inMonth = roundFixture({ id: 'in', details: { ...base.details, opensOn: '2026-10-02', deadlineOn: '2026-10-30' } });
    const view = buildMastersCalendarMonth('2026-10', collectMastersCalendarNodes([inMonth], NOW), '2026-10-14');
    expect(view.opensCount).toBe(1);
    expect(view.deadlineCount).toBe(1);
  });

  it('非法月份返回空网格而不抛错', () => {
    expect(buildMastersCalendarMonth('2026-13', [], '2026-10-14').weeks).toHaveLength(0);
  });
});

describe('翻月与范围', () => {
  it('翻月跨年前后正确', () => {
    expect(shiftMonth('2026-12', 1)).toBe('2027-01');
    expect(shiftMonth('2027-01', -1)).toBe('2026-12');
    expect(shiftMonth('2026-10', 12)).toBe('2027-10');
    expect(shiftMonth('bad', 1)).toBe('bad');
  });

  it('范围取自实际节点，不受入学年限制', () => {
    const base = roundFixture();
    const early = roundFixture({ id: 'early', details: { ...base.details, deadlineOn: '2026-11-30' } });
    const late = roundFixture({ id: 'late', details: { ...base.details, deadlineOn: '2027-05-31' } });
    expect(mastersCalendarBounds([early, late], 2027)).toEqual({ min: '2026-10', max: '2027-05' });
  });

  it('没有可落格日期时回落到入学年的十二个月', () => {
    expect(mastersCalendarBounds([], 2027)).toEqual({ min: '2027-01', max: '2027-12' });
  });

  it('越界月份贴到最近边界，初始月优先停在今天', () => {
    const bounds = { min: '2026-11', max: '2027-05' };
    expect(clampMonth('2026-01', bounds)).toBe('2026-11');
    expect(clampMonth('2028-01', bounds)).toBe('2027-05');
    expect(clampMonth('2027-02', bounds)).toBe('2027-02');
    // 今天 2026-10 早于范围起点 → 贴到 2026-11
    expect(initialMastersCalendarMonth(bounds, '2026-10-14')).toBe('2026-11');
    expect(initialMastersCalendarMonth(bounds, '2027-03-02')).toBe('2027-03');
  });

  it('月份天数按真实日历，含闰年二月', () => {
    expect(daysInMonth('2026-02')).toBe(28);
    expect(daysInMonth('2028-02')).toBe(29);
    expect(daysInMonth('2026-10')).toBe(31);
    expect(monthOf('2027-05-31')).toBe('2027-05');
  });
});

describe('日历文案格式', () => {
  it('月份与日期按语言格式化', () => {
    expect(formatMastersMonth('2027-01', 'zh')).toBe('2027 年 1 月');
    expect(formatMastersMonth('2027-01', 'en')).toBe('January 2027');
    // 2026-12-01 是周二
    expect(formatMastersCalendarDate('2026-12-01', 'zh')).toBe('2026 年 12 月 1 日 · 周二');
    expect(formatMastersCalendarDate('2026-12-01', 'en')).toBe('Tue, 1 December 2026');
    expect(formatMastersCalendarDate('bad', 'zh')).toBe('bad');
  });
});
