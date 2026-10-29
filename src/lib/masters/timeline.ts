import { dailyDate, shiftDailyDate } from '@/lib/daily/types';
import {
  collectMastersCalendarSpans, daysInMonth, mastersCalendarHue, monthOf, shiftMonth,
} from './calendar';
import type { MastersRegion, MastersRound } from './types';

/** 一天一号的序号，只用来算比例。YYYY-MM-DD 按 UTC 解析，与月历同一口径。 */
const dayNumber = (date: string): number => Math.round(Date.parse(`${date}T00:00:00Z`) / 86_400_000);

const CALENDAR_DATE = /^\d{4}-\d{2}-\d{2}$/;
const MONTHS_EN_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** 默认按学校分组，同校多项目相邻；按截止日排能看出哪几个项目挤在同一段冲刺期。 */
export type MastersTimelineSort = 'school' | 'deadline';

/**
 * span：起止都可画，出时长条。
 * deadline：只公布了截止日，开放状态未知——不画时长（会被读成「这段一直在开放」），
 * 只标截止点，但必须成行，否则等于静默丢掉这个项目。
 */
export type MastersTimelineRowKind = 'span' | 'deadline';

export interface MastersTimelineMonth {
  /** 2026-10 */
  key: string;
  label: string;
  /** 窄屏用的纯数字标签：8 个月挤在 390px 上时「10月」会换行堆叠。 */
  short: string;
  /** 相对时间轴区域（不含左侧学校列）的百分比。 */
  left: number;
  width: number;
}

export interface MastersTimelineMilestone {
  date: string;
  /** 相对时间轴的百分比。 */
  pct: number;
  past: boolean;
}

export interface MastersTimelineRow {
  kind: MastersTimelineRowKind;
  key: string;
  university: string;
  programme: string;
  region: MastersRegion;
  /** 该行合并进来的轮次：港科 MIMT 这类四轮项目是一行四条刻度。 */
  rounds: MastersRound[];
  hue: number;
  /** 时长条起点；只公布截止日的行为 null。 */
  start: string | null;
  /** 最后一个截止日。 */
  end: string;
  /** 起点是否由官方公布。false 表示从核验日画起，条形起点淡出。 */
  startKnown: boolean;
  changed: boolean;
  /** 整段已经结束（末日在今天之前），仅用于降透明度。 */
  past: boolean;
  /** 相对时间轴的百分比；只公布截止日的行仅用于排序与汇总，不渲染成条。 */
  left: number;
  width: number;
  /** 条形内部的截止刻度，相对条形自身宽度。只公布截止日的行为空。 */
  deadlineTicks: number[];
  /** 各轮截止在轴上的位置。 */
  milestones: MastersTimelineMilestone[];
  /** 落在条形之外的截止点（如该轮在核验日之前就已截止），挂在同一项目行上，避免同项目拆两行。 */
  outsideMarkers: MastersTimelineMilestone[];
}

/** 两个及以上项目同时开放的时间带。 */
export interface MastersTimelineOverlap {
  start: string;
  end: string;
  left: number;
  width: number;
  count: number;
}

export interface MastersTimeline {
  start: string;
  end: string;
  months: MastersTimelineMonth[];
  /** 今天在时间轴上的百分比；不在范围内为 null。 */
  todayPct: number | null;
  rows: MastersTimelineRow[];
  /** 范围内出现的不同截止日数量。 */
  deadlineCount: number;
  /** 画进行里的轮次数量（不含毫无可用日期的轮次）。 */
  roundCount: number;
  spanCount: number;
  deadlineOnlyCount: number;
  /** 一个可用日期都没有、放不上时间轴的轮次数量。 */
  undatedCount: number;
  overlaps: MastersTimelineOverlap[];
  /** 存在两个及以上项目同时开放的总天数。 */
  overlapDays: number;
}

function lastDayOf(month: string): string {
  return `${month}-${String(daysInMonth(month)).padStart(2, '0')}`;
}

function monthLabel(month: string, locale: 'zh' | 'en', dense: boolean): string {
  const index = Number(month.slice(5, 7));
  if (dense) return String(index);
  return locale === 'zh' ? `${index}月` : MONTHS_EN_SHORT[index - 1];
}

/** 与月历的色带标识同一套写法：同项目合并后仍是一所学校的一条。 */
function rowKey(round: MastersRound): string {
  const details = round.details;
  return `${round.region}:${details.university.trim().toLowerCase()}:${details.programme.trim().toLowerCase()}`;
}

function emptyTimeline(today: string, undatedCount: number): MastersTimeline {
  return {
    start: today, end: today, months: [], todayPct: null, rows: [],
    deadlineCount: 0, roundCount: 0, spanCount: 0, deadlineOnlyCount: 0, undatedCount,
    overlaps: [], overlapDays: 0,
  };
}

/**
 * 把轮次投影成甘特图：一行一个申请期，横轴按真实天数比例。
 * 时间轴按天等距而非月份等宽——月份等宽会让 2 月的短窗口被拉长，长条端点位置失真。
 */
export function buildMastersTimeline(
  rounds: MastersRound[],
  now = new Date(),
  locale: 'zh' | 'en' = 'zh',
  sort: MastersTimelineSort = 'school',
): MastersTimeline {
  const today = dailyDate(now);
  const recent = new Date(`${shiftDailyDate(today, -7)}T00:00:00+08:00`).toISOString();
  const spans = collectMastersCalendarSpans(rounds, now);
  const covered = new Set(spans.flatMap(span => span.rounds.map(round => round.id)));

  // 有截止日但开放状态未知的轮次不画时长条，但同样要成行。
  const pending = new Map<string, MastersRound[]>();
  for (const round of rounds) {
    if (covered.has(round.id)) continue;
    const deadline = round.details.deadlineOn;
    if (!deadline || !CALENDAR_DATE.test(deadline)) continue;
    const key = rowKey(round);
    const bucket = pending.get(key);
    if (bucket) bucket.push(round); else pending.set(key, [round]);
  }

  // 轴范围必须同时容纳时长条与截止点，否则只公布截止日的项目会落到轴外。
  const knownDates = [
    ...spans.flatMap(span => [span.start, span.end]),
    ...[...pending.values()].flatMap(group => group.map(round => round.details.deadlineOn as string)),
  ];
  if (knownDates.length === 0) return emptyTimeline(today, rounds.length);

  const earliest = knownDates.reduce((min, date) => (date < min ? date : min), knownDates[0]);
  const latest = knownDates.reduce((max, date) => (date > max ? date : max), knownDates[0]);
  const start = `${monthOf(earliest)}-01`;
  const end = lastDayOf(monthOf(latest));

  const axisStart = dayNumber(start);
  // 末端再补一天：截止日是闭区间，画到当天结束而不是当天零点。
  const axisSpan = Math.max(1, dayNumber(shiftDailyDate(end, 1)) - axisStart);
  const toPct = (value: number) => Math.min(100, Math.max(0, (value / axisSpan) * 100));
  const datePct = (date: string) => toPct(dayNumber(date) - axisStart);

  const monthKeys: string[] = [];
  for (let cursor = monthOf(start); cursor <= monthOf(end); cursor = shiftMonth(cursor, 1)) monthKeys.push(cursor);
  const dense = monthKeys.length > 12;
  const months = monthKeys.map(key => {
    const last = lastDayOf(key);
    const left = datePct(`${key}-01`);
    return {
      key, label: monthLabel(key, locale, dense), short: String(Number(key.slice(5, 7))),
      left, width: Math.max(0, datePct(shiftDailyDate(last, 1)) - left),
    };
  });

  const spanRows: MastersTimelineRow[] = spans.map(span => {
    const barStart = dayNumber(span.start);
    const barSpan = Math.max(1, dayNumber(shiftDailyDate(span.end, 1)) - barStart);
    const deadlines = [...new Set(span.deadlines)].sort();
    return {
      kind: 'span' as const,
      key: span.key,
      university: span.university, programme: span.programme, region: span.region,
      rounds: span.rounds,
      hue: mastersCalendarHue(span),
      start: span.start, end: span.end, startKnown: span.startKnown,
      changed: span.changed, past: span.past,
      left: datePct(span.start),
      width: Math.max(0.6, datePct(shiftDailyDate(span.end, 1)) - datePct(span.start)),
      // 用截止日当天（而非次日）在条形内的位置，末轮刻度才会落在右端内侧而不是贴死边缘。
      deadlineTicks: deadlines.map(date => ((dayNumber(date) - barStart) / barSpan) * 100),
      milestones: deadlines.map(date => ({ date, pct: datePct(date), past: date < today })),
      outsideMarkers: [],
    };
  });

  // 同一项目若已有时长条，条外的截止点挂到那一行，而不是再开一行——
  // 港科 MIMT 的首轮在核验日之前就已截止，共用逻辑正确地拒绝为它画时长，
  // 但同一项目出现两行会被读成重复条目。
  const spanByKey = new Map(spanRows.map(row => [row.key, row]));
  const milestoneRows: MastersTimelineRow[] = [];
  for (const [key, group] of pending) {
    const sorted = [...group].sort((first, second) =>
      (first.details.deadlineOn as string).localeCompare(second.details.deadlineOn as string));
    const dates = sorted.map(round => round.details.deadlineOn as string);
    const milestones = dates.map(date => ({ date, pct: datePct(date), past: date < today }));
    const changed = sorted.some(round => !!round.dateChangedAt && round.dateChangedAt >= recent);
    const host = spanByKey.get(key);
    if (host) {
      host.outsideMarkers.push(...milestones);
      host.rounds = [...host.rounds, ...sorted];
      host.changed = host.changed || changed;
      // 条外还有更晚的截止时，行内的「最后一个截止日」要跟着推后，否则标签和标记自相矛盾。
      const latest = dates[dates.length - 1];
      if (latest > host.end) host.end = latest;
      continue;
    }
    const pcts = milestones.map(milestone => milestone.pct);
    const left = Math.min(...pcts);
    const first = sorted[0];
    milestoneRows.push({
      kind: 'deadline',
      key,
      university: first.details.university, programme: first.details.programme, region: first.region,
      rounds: sorted,
      hue: mastersCalendarHue({ region: first.region, university: first.details.university }),
      start: null, end: dates[dates.length - 1], startKnown: false,
      changed,
      past: dates.every(date => date < today),
      left, width: Math.max(0.6, Math.max(...pcts) - left),
      deadlineTicks: [],
      milestones,
      outsideMarkers: [],
    });
  }

  const rows = [...spanRows, ...milestoneRows].sort((first, second) => {
    const byUniversity = first.university.localeCompare(second.university);
    const byDeadline = first.end.localeCompare(second.end);
    const byStart = (first.start ?? first.end).localeCompare(second.start ?? second.end);
    return (sort === 'deadline' ? byDeadline || byStart : byUniversity || byStart)
      || first.programme.localeCompare(second.programme);
  });

  // 重叠区间用扫描线算：起点 +1、终点次日 -1，同一天先减后加，
  // 这样「A 的截止日正好是 B 的开放日」不会被算成重叠。
  const events = spanRows.flatMap(row => [
    { date: row.start as string, delta: 1 },
    { date: shiftDailyDate(row.end, 1), delta: -1 },
  ]).sort((first, second) => first.date.localeCompare(second.date) || first.delta - second.delta);

  const overlaps: MastersTimelineOverlap[] = [];
  let active = 0;
  for (let index = 0; index < events.length; index += 1) {
    active += events[index].delta;
    const boundary = events[index].date;
    const next = events[index + 1];
    if (active < 2 || !next || next.date <= boundary) continue;
    const previous = overlaps[overlaps.length - 1];
    if (previous && previous.count === active && shiftDailyDate(previous.end, 1) === boundary) {
      previous.end = shiftDailyDate(next.date, -1);
      previous.width = datePct(next.date) - previous.left;
      continue;
    }
    const left = datePct(boundary);
    overlaps.push({
      start: boundary, end: shiftDailyDate(next.date, -1),
      left, width: datePct(next.date) - left, count: active,
    });
  }

  const roundCount = rows.reduce((total, row) => total + row.rounds.length, 0);

  return {
    start, end, months,
    todayPct: today >= start && today <= end ? datePct(today) : null,
    rows,
    deadlineCount: new Set(rows.flatMap(row => [...row.milestones, ...row.outsideMarkers].map(marker => marker.date))).size,
    roundCount,
    spanCount: spanRows.length,
    deadlineOnlyCount: milestoneRows.length,
    undatedCount: Math.max(0, rounds.length - roundCount),
    overlaps,
    overlapDays: overlaps.reduce((total, overlap) =>
      total + (dayNumber(overlap.end) + 1 - dayNumber(overlap.start)), 0),
  };
}
