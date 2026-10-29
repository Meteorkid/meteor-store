import { dailyDate, shiftDailyDate } from '@/lib/daily/types';
import {
  collectMastersCalendarSpans, daysInMonth, mastersCalendarHue, monthOf, shiftMonth,
  type MastersCalendarSpan,
} from './calendar';
import type { MastersRound } from './types';

/** 一天一号的序号，只用来算比例。YYYY-MM-DD 按 UTC 解析，与月历同一口径。 */
const dayNumber = (date: string): number => Math.round(Date.parse(`${date}T00:00:00Z`) / 86_400_000);

const MONTHS_EN_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** 默认按学校分组，同校多项目相邻；按截止日排能看出哪几个项目挤在同一段冲刺期。 */
export type MastersTimelineSort = 'school' | 'deadline';

export interface MastersTimelineMonth {
  /** 2026-10 */
  key: string;
  label: string;
  /** 相对时间轴区域（不含左侧学校列）的百分比。 */
  left: number;
  width: number;
}

export interface MastersTimelineRow {
  span: MastersCalendarSpan;
  hue: number;
  /** 相对时间轴的百分比。 */
  left: number;
  width: number;
  /** 各轮截止在条形内部的相对百分比，用来在条形上打刻度。 */
  deadlineTicks: number[];
}

export interface MastersTimeline {
  start: string;
  end: string;
  months: MastersTimelineMonth[];
  /** 今天在时间轴上的百分比；不在范围内为 null。 */
  todayPct: number | null;
  rows: MastersTimelineRow[];
  /** 该范围内落了几个截止日，用于摘要。 */
  deadlineCount: number;
}

function lastDayOf(month: string): string {
  return `${month}-${String(daysInMonth(month)).padStart(2, '0')}`;
}

function monthLabel(month: string, locale: 'zh' | 'en', dense: boolean): string {
  const index = Number(month.slice(5, 7));
  if (dense) return String(index);
  return locale === 'zh' ? `${index}月` : MONTHS_EN_SHORT[index - 1];
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
  const spans = collectMastersCalendarSpans(rounds, now);
  const today = dailyDate(now);
  if (spans.length === 0) {
    return { start: today, end: today, months: [], todayPct: null, rows: [], deadlineCount: 0 };
  }

  const firstStart = spans.reduce((min, span) => (span.start < min ? span.start : min), spans[0].start);
  const lastEnd = spans.reduce((max, span) => (span.end > max ? span.end : max), spans[0].end);
  const start = `${monthOf(firstStart)}-01`;
  const end = lastDayOf(monthOf(lastEnd));

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
      key,
      label: monthLabel(key, locale, dense),
      left,
      width: Math.max(0, datePct(shiftDailyDate(last, 1)) - left),
    };
  });

  const ordered = [...spans].sort((first, second) => (sort === 'deadline'
    ? first.end.localeCompare(second.end) || first.start.localeCompare(second.start)
    : first.university.localeCompare(second.university) || first.start.localeCompare(second.start))
    || first.programme.localeCompare(second.programme));

  const rows = ordered.map(span => {
    const barStart = dayNumber(span.start);
    const barSpan = Math.max(1, dayNumber(shiftDailyDate(span.end, 1)) - barStart);
    return {
      span,
      hue: mastersCalendarHue(span),
      left: datePct(span.start),
      width: Math.max(0.6, datePct(shiftDailyDate(span.end, 1)) - datePct(span.start)),
      // 用截止日当天（而非次日）在条形内的位置，末轮刻度才会落在右端内侧而不是贴死边缘。
      deadlineTicks: span.deadlines.map(date => ((dayNumber(date) - barStart) / barSpan) * 100),
    };
  });

  return {
    start,
    end,
    months,
    todayPct: today >= start && today <= end ? datePct(today) : null,
    rows,
    deadlineCount: new Set(spans.flatMap(span => span.deadlines)).size,
  };
}
