import { describe, expect, it } from 'vitest';
import {
  assignMastersCalendarLanes, buildMastersCalendarMonth, clampMonth, collectMastersCalendarNodes,
  collectMastersCalendarPending, collectMastersCalendarSpans, daysInMonth, formatMastersCalendarDate,
  formatMastersMonth, initialMastersCalendarMonth, mastersCalendarBounds, mastersCalendarHue, monthOf,
  shiftMonth, spansOnDate, weekdayIndex,
} from '../calendar';
import { roundFixture } from '@/components/masters/__tests__/fixtures';
import { withMastersOpeningEvidence } from '../opening-evidence';

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
    const previous = roundFixture({ id: 'previous', details: { ...base.details, opensOn: '2026-09-28', deadlineOn: '2026-09-30' } });
    const next = roundFixture({ id: 'next', details: { ...base.details, opensOn: '2026-11-01', deadlineOn: '2026-11-01' } });
    const rounds = [inMonth, previous, next];
    const view = buildMastersCalendarMonth('2026-10', collectMastersCalendarNodes(rounds, NOW), '2026-10-14', collectMastersCalendarSpans(rounds, NOW));
    expect(view.opensCount).toBe(1);
    expect(view.deadlineCount).toBe(1);
    expect(view.spanCount).toBe(1);
    expect(view.weeks.flat().filter(cell => !cell.inMonth).some(cell => cell.nodes.length > 0)).toBe(true);
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

describe('申请期区间投影', () => {
  it('官方公布开放日时区间起止都确定', () => {
    const spans = collectMastersCalendarSpans([roundFixture()], NOW);
    expect(spans).toHaveLength(1);
    expect(spans[0]).toMatchObject({ start: '2026-10-01', end: '2026-12-01', startKnown: true });
  });

  it('官方确认正在开放但未公布开放日时，从核验日起画且标为起点未知', () => {
    const base = roundFixture();
    const round = roundFixture({ details: { ...base.details, opensOn: null, openingState: 'open' }, verifiedOn: '2026-10-05' });
    const spans = collectMastersCalendarSpans([round], NOW);
    expect(spans[0]).toMatchObject({ start: '2026-10-05', startKnown: false });
    // 不能把核验日说成开放日
    expect(spans[0].start).not.toBe(round.details.opensOn);
  });

  it('开放状态未知且无开放日时不画区间，避免暗示此前都在开放', () => {
    const base = roundFixture();
    const unknown = roundFixture({ details: { ...base.details, opensOn: null, openingState: 'unknown' } });
    const closed = roundFixture({ details: { ...base.details, opensOn: null, openingState: 'closed' } });
    expect(collectMastersCalendarSpans([unknown, closed], NOW)).toHaveLength(0);
  });

  it('无确认截止日的轮次不画区间', () => {
    const base = roundFixture();
    const unannounced = roundFixture({ details: { ...base.details, deadlineStatus: 'unannounced', deadlineOn: null } });
    expect(collectMastersCalendarSpans([unannounced], NOW)).toHaveLength(0);
  });

  it('同项目重叠轮次合并成一段，保留各轮截止刻度', () => {
    const base = roundFixture();
    const later = roundFixture({ id: 'later', details: { ...base.details, deadlineOn: '2027-02-01' } });
    const spans = collectMastersCalendarSpans([base, later], NOW);
    expect(spans).toHaveLength(1);
    expect(spans[0].end).toBe('2027-02-01');
    expect(spans[0].deadlines).toEqual(['2026-12-01', '2027-02-01']);
    expect(spans[0].rounds).toHaveLength(2);
  });

  it('不重叠的同项目轮次各自成段，不硬拼成一条', () => {
    const base = roundFixture();
    const separate = roundFixture({ id: 'sep', details: { ...base.details, opensOn: '2027-03-01', deadlineOn: '2027-04-01' } });
    expect(collectMastersCalendarSpans([base, separate], NOW)).toHaveLength(2);
  });

  it('不相交窗口不受输入顺序影响，分段标识唯一且共享项目标识', () => {
    const base = roundFixture();
    const later = roundFixture({ id: 'a-later', details: { ...base.details, opensOn: '2027-03-01', deadlineOn: '2027-04-01' } });
    const forward = collectMastersCalendarSpans([base, later], NOW);
    const reversed = collectMastersCalendarSpans([later, base], NOW);
    expect(reversed).toEqual(forward);
    expect(reversed.map(span => [span.start, span.end])).toEqual([
      ['2026-10-01', '2026-12-01'], ['2027-03-01', '2027-04-01'],
    ]);
    expect(new Set(reversed.map(span => span.key)).size).toBe(2);
    expect(reversed[0].projectKey).toBe(reversed[1].projectKey);
  });

  it('第二段与后续重叠段合并，跨越两段的轮次可合并整个连通区间', () => {
    const base = roundFixture();
    const later = roundFixture({ id: 'later', details: { ...base.details, opensOn: '2027-03-01', deadlineOn: '2027-04-01' } });
    const tail = roundFixture({ id: 'tail', details: { ...base.details, opensOn: '2027-03-15', deadlineOn: '2027-05-01' } });
    const bridge = roundFixture({ id: 'bridge', details: { ...base.details, opensOn: '2026-11-01', deadlineOn: '2027-03-10' } });
    const separated = collectMastersCalendarSpans([tail, base, later], NOW);
    expect(separated).toHaveLength(2);
    expect(separated[1]).toMatchObject({ start: '2027-03-01', end: '2027-05-01' });
    const connected = collectMastersCalendarSpans([tail, base, later, bridge], NOW);
    expect(connected).toHaveLength(1);
    expect(connected[0]).toMatchObject({ start: '2026-10-01', end: '2027-05-01' });
    expect(new Set(connected[0].rounds.map(round => round.id)).size).toBe(4);
  });

  it('首次证实开放的日期不随最新核验日右移，截止后仍保留历史区间', () => {
    const base = roundFixture();
    const details = { ...base.details, opensOn: null, openingState: 'open' as const, firstObservedOpenOn: '2026-10-05' };
    const current = roundFixture({ details, verifiedOn: '2026-10-14' });
    expect(collectMastersCalendarSpans([current], NOW)[0]).toMatchObject({ start: '2026-10-05', startKnown: false });
    const expired = roundFixture({ details, verifiedOn: '2026-12-10' });
    expect(collectMastersCalendarSpans([expired], new Date('2026-12-10T04:00:00Z'))[0])
      .toMatchObject({ start: '2026-10-05', end: '2026-12-01', past: true });
  });

  it.each(['closed', 'unknown'] as const)('提前转为%s后，不能在原截止日过去时复活长条', openingState => {
    const base = roundFixture();
    const previous = roundFixture({ details: { ...base.details, opensOn: null, openingState: 'open', firstObservedOpenOn: '2026-10-01' } });
    const input = { id: previous.id, intakeYear: previous.intakeYear, region: previous.region,
      status: previous.status, verifiedOn: '2026-10-29', details: { ...previous.details, openingState } };
    const closedAt = new Date('2026-10-29T04:00:00Z');
    const saved = { ...previous, ...withMastersOpeningEvidence(input, previous, closedAt) };
    expect(saved.details.firstObservedOpenOn).toBe('2026-10-01');
    expect(collectMastersCalendarSpans([saved], closedAt)).toHaveLength(0);
    expect(collectMastersCalendarSpans([saved], new Date('2026-12-02T04:00:00Z'))).toHaveLength(0);
    expect(collectMastersCalendarNodes([saved], closedAt).map(node => node.kind)).toEqual(['deadline']);
  });

  it('非法或未来的首次开放证据不能成为区间起点', () => {
    const base = roundFixture();
    for (const firstObservedOpenOn of ['2026-02-30', '2027-01-01']) {
      const details = { ...base.details, opensOn: null, openingState: 'open' as const, firstObservedOpenOn };
      expect(collectMastersCalendarSpans([roundFixture({ details })], NOW)[0].start).toBe('2026-10-12');
      expect(collectMastersCalendarSpans([roundFixture({ details: { ...details, openingState: 'unknown' } })], NOW)).toHaveLength(0);
    }
  });

  it('合并后只要有一段起点未知，整条就按起点未知处理', () => {
    const base = roundFixture();
    const openEnded = roundFixture({
      id: 'open-ended', verifiedOn: '2026-10-05',
      details: { ...base.details, opensOn: null, openingState: 'open', deadlineOn: '2027-02-01' },
    });
    const spans = collectMastersCalendarSpans([base, openEnded], NOW);
    expect(spans).toHaveLength(1);
    expect(spans[0].startKnown).toBe(false);
  });

  it('跨月判断包含起止两端', () => {
    const spans = collectMastersCalendarSpans([roundFixture()], NOW);
    expect(spansOnDate(spans, '2026-09-30')).toHaveLength(0);
    expect(spansOnDate(spans, '2026-10-01')).toHaveLength(1);
    expect(spansOnDate(spans, '2026-11-15')).toHaveLength(1);
    expect(spansOnDate(spans, '2026-12-01')).toHaveLength(1);
    expect(spansOnDate(spans, '2026-12-02')).toHaveLength(0);
  });

  it('同校色相稳定，不同学校色相不同', () => {
    const base = roundFixture();
    const other = roundFixture({ id: 'other', details: { ...base.details, university: '另一所大学' } });
    const first = mastersCalendarHue({ region: base.region, university: base.details.university });
    const again = mastersCalendarHue({ region: base.region, university: base.details.university });
    const second = mastersCalendarHue({ region: other.region, university: other.details.university });
    expect(first).toBe(again);
    expect(first).not.toBe(second);
    expect(first).toBeGreaterThanOrEqual(0);
    expect(first).toBeLessThan(360);
  });

  it('重叠区间分到不同车道，不重叠的可复用同一车道', () => {
    const base = roundFixture();
    const overlapping = roundFixture({ id: 'overlap', details: { ...base.details, university: '重叠大学', deadlineOn: '2027-01-01' } });
    const later = roundFixture({ id: 'later', details: { ...base.details, university: '后续大学', opensOn: '2027-03-01', deadlineOn: '2027-04-01' } });
    const spans = collectMastersCalendarSpans([base, overlapping, later], NOW);
    const lanes = assignMastersCalendarLanes(spans);
    const key = (university: string) => spans.find(span => span.university === university)!.key;
    expect(lanes.get(key('Example University'))).not.toBe(lanes.get(key('重叠大学')));
    expect(lanes.get(key('后续大学'))).toBe(0);
  });

  it('区间起点纳入翻月范围，起点在核验日时不会翻不到', () => {
    const base = roundFixture();
    const round = roundFixture({ details: { ...base.details, opensOn: null, openingState: 'open' }, verifiedOn: '2026-10-05' });
    const spans = collectMastersCalendarSpans([round], NOW);
    // 无 spans 时范围只有截止月；带上 spans 后应覆盖 2026-10
    expect(mastersCalendarBounds([round], 2027)).toMatchObject({ min: '2026-12' });
    expect(mastersCalendarBounds([round], 2027, spans)).toMatchObject({ min: '2026-10', max: '2026-12' });
  });

  it('月网格把区间铺进格子并统计出现过的申请期', () => {
    const spans = collectMastersCalendarSpans([roundFixture()], NOW);
    const view = buildMastersCalendarMonth('2026-10', collectMastersCalendarNodes([roundFixture()], NOW), '2026-10-14', spans);
    const first = view.weeks.flat().find(cell => cell.date === '2026-10-01');
    expect(first?.spans).toHaveLength(1);
    expect(view.spanCount).toBe(1);
    // 区间跨到 12 月，10 月的网格只算一次，不重复计入
    expect(buildMastersCalendarMonth('2026-11', [], '2026-10-14', spans).spanCount).toBe(1);
  });
});
