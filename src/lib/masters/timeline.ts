import { DailyDateSchema, dailyDate, shiftDailyDate } from '@/lib/daily/types';
import {
  calendarDeadlineDate, collectMastersCalendarSpans, daysInMonth, mastersCalendarHue, mastersCalendarProjectKey, monthOf, shiftMonth,
} from './calendar';
import { getMastersRoundState } from './dates';
import type { MastersRegion, MastersRound } from './types';

/** 一天一号的序号，只用来算比例。YYYY-MM-DD 按 UTC 解析，与月历同一口径。 */
const dayNumber = (date: string): number => Math.round(Date.parse(`${date}T00:00:00Z`) / 86_400_000);

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
  roundId: string;
  date: string;
  /** 相对时间轴的百分比。 */
  pct: number;
  past: boolean;
}

export interface MastersTimelineRow {
  kind: MastersTimelineRowKind;
  key: string;
  projectKey: string;
  university: string;
  programme: string;
  region: MastersRegion;
  /** 每行仅包含一个申请轮次，数组形状保留给现有显示层。 */
  rounds: MastersRound[];
  hue: number;
  /** 时长条起点；只公布截止日的行为 null。 */
  start: string | null;
  /** 真实时长条终点；仅截止行取最后一个截止日。条外节点不能延长时长。 */
  end: string;
  latestDeadline: string;
  /** 最近尚未截止且未明确关闭的轮次日期，全部结束时为 null。 */
  recentDeadline: string | null;
  /** 起点是否由官方公布。false 表示从北京时间今天画剩余窗口。 */
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
  /** 兼容现有显示层；不同轮次各自成行，此数组保持为空。 */
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
  const pending: MastersRound[] = [];
  for (const round of rounds) {
    if (covered.has(round.id)) continue;
    if (!calendarDeadlineDate(round)) continue;
    pending.push(round);
  }

  // 轴范围必须同时容纳时长条与截止点，否则只公布截止日的项目会落到轴外。
  const knownDates = [
    ...spans.flatMap(span => [span.start, span.end]),
    ...pending.map(round => calendarDeadlineDate(round) as string),
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
  const milestoneFor = (round: MastersRound): MastersTimelineMilestone => {
    const date = calendarDeadlineDate(round) as string;
    return { roundId: round.id, date, pct: datePct(date), past: getMastersRoundState(round, now).state === 'closed' };
  };

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
    const milestones = span.rounds.map(milestoneFor);
    return {
      kind: 'span' as const,
      key: span.key, projectKey: span.projectKey,
      university: span.university, programme: span.programme, region: span.region,
      rounds: span.rounds,
      hue: mastersCalendarHue(span),
      start: span.start, end: span.end, startKnown: span.startKnown,
      latestDeadline: span.end, recentDeadline: null,
      changed: span.changed, past: span.past,
      left: datePct(span.start),
      width: Math.max(0.6, datePct(shiftDailyDate(span.end, 1)) - datePct(span.start)),
      // 用截止日当天（而非次日）在条形内的位置，末轮刻度才会落在右端内侧而不是贴死边缘。
      deadlineTicks: milestones.map(marker => ((dayNumber(marker.date) - barStart) / barSpan) * 100),
      milestones,
      outsideMarkers: [],
    };
  });

  const milestoneRows: MastersTimelineRow[] = pending.map(round => {
    const milestone = milestoneFor(round);
    return {
      kind: 'deadline',
      key: round.id, projectKey: mastersCalendarProjectKey(round),
      university: round.details.university, programme: round.details.programme, region: round.region,
      rounds: [round],
      hue: mastersCalendarHue({ region: round.region, university: round.details.university }),
      start: null, end: milestone.date, startKnown: false,
      latestDeadline: milestone.date, recentDeadline: null,
      changed: !!round.dateChangedAt && round.dateChangedAt >= recent,
      past: milestone.past,
      left: milestone.pct, width: 0,
      deadlineTicks: [],
      milestones: [milestone],
      outsideMarkers: [],
    };
  });

  const rows = [...spanRows, ...milestoneRows];
  for (const row of rows) {
    const nextRound = row.rounds.find(round => {
      if (round.details.deadlineStatus !== 'confirmed' || !round.verifiedOn
        || !DailyDateSchema.safeParse(round.verifiedOn).success || round.verifiedOn > today) return false;
      const timing = getMastersRoundState(round, now);
      // 开放状态未知但截止已经核实的轮次仍需排序；精确时刻已过或明确关闭的则排除。
      return timing.state !== 'closed' && timing.daysLeft !== null;
    });
    row.recentDeadline = nextRound ? calendarDeadlineDate(nextRound) : null;
  }
  rows.sort((first, second) => {
    const byUniversity = first.university.localeCompare(second.university);
    const byProgramme = first.programme.localeCompare(second.programme);
    const byDeadline = first.recentDeadline === null
      ? (second.recentDeadline === null ? 0 : 1)
      : second.recentDeadline === null ? -1 : first.recentDeadline.localeCompare(second.recentDeadline);
    const byStart = (first.start ?? first.end).localeCompare(second.start ?? second.end);
    return (sort === 'deadline' ? byDeadline || byStart : byUniversity || byProgramme || first.end.localeCompare(second.end))
      || byUniversity || byProgramme || first.key.localeCompare(second.key);
  });

  // 日期区间包含截止当天：起点 +1、终点次日 -1；前一段截止次日才开放才没有共同日。
  // 明确提前关闭的窗口缺少真实关闭边界，保留灰色行但不能用于重叠推断；正常历史窗口仍计入。
  const events = spanRows.filter(row => row.rounds[0].details.openingState !== 'closed').flatMap(row => [
    { date: row.start as string, projectKey: row.projectKey, delta: 1 },
    { date: shiftDailyDate(row.end, 1), projectKey: row.projectKey, delta: -1 },
  ]).sort((first, second) => first.date.localeCompare(second.date) || first.delta - second.delta);

  const overlaps: MastersTimelineOverlap[] = [];
  // 同一项目可有多批同时开放，只计一个项目，不能因拆行而虚增重叠。
  const activeProjects = new Map<string, number>();
  for (let index = 0; index < events.length; index += 1) {
    const event = events[index];
    const batchCount = (activeProjects.get(event.projectKey) ?? 0) + event.delta;
    if (batchCount > 0) activeProjects.set(event.projectKey, batchCount);
    else activeProjects.delete(event.projectKey);
    const active = activeProjects.size;
    const boundary = event.date;
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
