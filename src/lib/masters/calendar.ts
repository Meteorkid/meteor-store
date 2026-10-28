import { DailyDateSchema, dailyDate, shiftDailyDate } from '@/lib/daily/types';
import { getMastersRoundState } from './dates';
import type { MastersRound } from './types';

/**
 * 月历只投影有明确日历日的节点。官方未公布或待核验的日期不进入网格——
 * 网格天然暗示“这一天有事发生”，画上去等于替官方背书。
 */
export type MastersCalendarNodeKind = 'opens' | 'deadline';

/** past 只表示该节点描述的日期已经过去，不是对申请状态的判断。 */
export type MastersCalendarTone = 'closing' | 'deadline' | 'opens' | 'past';

export interface MastersCalendarNode {
  date: string;
  kind: MastersCalendarNodeKind;
  round: MastersRound;
  tone: MastersCalendarTone;
  /** 官方在近 7 天内改过该轮次的日期。 */
  changed: boolean;
}

export interface MastersCalendarCell {
  date: string;
  day: number;
  inMonth: boolean;
  isToday: boolean;
  nodes: MastersCalendarNode[];
}

export interface MastersCalendarMonth {
  month: string;
  weeks: MastersCalendarCell[][];
  opensCount: number;
  deadlineCount: number;
}

export interface MastersCalendarPending {
  round: MastersRound;
  reason: 'unannounced' | 'unverified';
}

export interface MastersCalendarBounds { min: string; max: string }

/** 与 30/7/1 天提醒同一口径：剩 7 天及以内算临近。 */
const CLOSING_DAYS = 7;

export const MASTERS_CALENDAR_WEEKDAYS = {
  zh: ['一', '二', '三', '四', '五', '六', '日'],
  en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
} as const;

const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

function isCalendarDate(value: string | null): value is string {
  return !!value && DailyDateSchema.safeParse(value).success;
}

function parseMonth(month: string): { year: number; month: number } | null {
  if (!/^\d{4}-\d{2}$/.test(month)) return null;
  const year = Number(month.slice(0, 4));
  const index = Number(month.slice(5, 7));
  if (index < 1 || index > 12) return null;
  return { year, month: index };
}

export function monthOf(date: string): string {
  return date.slice(0, 7);
}

export function shiftMonth(month: string, delta: number): string {
  const parsed = parseMonth(month);
  if (!parsed) return month;
  const total = parsed.year * 12 + (parsed.month - 1) + delta;
  return `${String(Math.floor(total / 12)).padStart(4, '0')}-${String((total % 12) + 1).padStart(2, '0')}`;
}

/** 周一起始：0 为周一，6 为周日。 */
export function weekdayIndex(date: string): number {
  const day = new Date(`${date}T00:00:00Z`).getUTCDay();
  return (day + 6) % 7;
}

export function daysInMonth(month: string): number {
  const parsed = parseMonth(month);
  if (!parsed) return 30;
  return new Date(Date.UTC(parsed.year, parsed.month, 0)).getUTCDate();
}

export function formatMastersMonth(month: string, locale: 'zh' | 'en'): string {
  const parsed = parseMonth(month);
  if (!parsed) return month;
  return locale === 'zh' ? `${parsed.year} 年 ${parsed.month} 月` : `${MONTHS_EN[parsed.month - 1]} ${parsed.year}`;
}

export function formatMastersCalendarDate(date: string, locale: 'zh' | 'en'): string {
  if (!isCalendarDate(date)) return date;
  const year = Number(date.slice(0, 4));
  const month = Number(date.slice(5, 7));
  const day = Number(date.slice(8, 10));
  const weekday = MASTERS_CALENDAR_WEEKDAYS[locale][weekdayIndex(date)];
  return locale === 'zh'
    ? `${year} 年 ${month} 月 ${day} 日 · 周${weekday}`
    : `${weekday}, ${day} ${MONTHS_EN[month - 1]} ${year}`;
}

/** 截止节点的紧急度沿用系统既有的 7 天档，不另立标准。 */
function deadlineTone(state: string, daysLeft: number | null): MastersCalendarTone {
  if (state === 'closed') return 'past';
  if (daysLeft !== null && daysLeft <= CLOSING_DAYS) return 'closing';
  return 'deadline';
}

/** 同一天先排截止（要动手的事），再排开放。 */
function compareNodes(first: MastersCalendarNode, second: MastersCalendarNode): number {
  const order: Record<MastersCalendarNodeKind, number> = { deadline: 0, opens: 1 };
  return first.date.localeCompare(second.date)
    || order[first.kind] - order[second.kind]
    || first.round.details.university.localeCompare(second.round.details.university)
    || first.round.id.localeCompare(second.round.id);
}

export function collectMastersCalendarNodes(rounds: MastersRound[], now = new Date()): MastersCalendarNode[] {
  const today = dailyDate(now);
  const recent = new Date(`${shiftDailyDate(today, -7)}T00:00:00+08:00`).toISOString();
  const nodes: MastersCalendarNode[] = [];
  for (const round of rounds) {
    const details = round.details;
    const timing = getMastersRoundState(round, now);
    const changed = !!round.dateChangedAt && round.dateChangedAt >= recent;
    if (isCalendarDate(details.opensOn)) nodes.push({
      date: details.opensOn, kind: 'opens', round, changed,
      tone: details.opensOn >= today ? 'opens' : 'past',
    });
    if (isCalendarDate(details.deadlineOn)) nodes.push({
      date: details.deadlineOn, kind: 'deadline', round, changed,
      tone: deadlineTone(timing.state, timing.daysLeft),
    });
  }
  return nodes.sort(compareNodes);
}

/** 没有可落格的截止日期：官方未公布与待核验分开表述，不能混为一谈。 */
export function collectMastersCalendarPending(rounds: MastersRound[]): MastersCalendarPending[] {
  return rounds.flatMap(round => {
    const status = round.details.deadlineStatus;
    if (status === 'confirmed' && isCalendarDate(round.details.deadlineOn)) return [];
    return [{ round, reason: status === 'unannounced' ? 'unannounced' as const : 'unverified' as const }];
  });
}

/** 可翻月范围取自实际节点，避免让用户翻到一堆空月份。 */
export function mastersCalendarBounds(rounds: MastersRound[], year: number): MastersCalendarBounds {
  const months = rounds
    .flatMap(round => [round.details.opensOn, round.details.deadlineOn])
    .filter(isCalendarDate)
    .map(monthOf)
    .sort();
  if (months.length) return { min: months[0], max: months[months.length - 1] };
  return { min: `${year}-01`, max: `${year}-12` };
}

export function clampMonth(month: string, bounds: MastersCalendarBounds): string {
  if (month < bounds.min) return bounds.min;
  if (month > bounds.max) return bounds.max;
  return month;
}

/** 优先停在今天所在月；落在范围外时贴到最近的有内容月份。 */
export function initialMastersCalendarMonth(bounds: MastersCalendarBounds, today = dailyDate()): string {
  return clampMonth(monthOf(today), bounds);
}

export function buildMastersCalendarMonth(month: string, nodes: MastersCalendarNode[], today = dailyDate()): MastersCalendarMonth {
  const weeks: MastersCalendarCell[][] = [];
  if (!parseMonth(month)) return { month, weeks, opensCount: 0, deadlineCount: 0 };

  const byDate = new Map<string, MastersCalendarNode[]>();
  for (const node of nodes) {
    const bucket = byDate.get(node.date);
    if (bucket) bucket.push(node); else byDate.set(node.date, [node]);
  }

  const first = `${month}-01`;
  const total = daysInMonth(month);
  const cells: MastersCalendarCell[] = [];
  for (let offset = weekdayIndex(first); offset > 0; offset -= 1) {
    const date = shiftDailyDate(first, -offset);
    cells.push({ date, day: Number(date.slice(8, 10)), inMonth: false, isToday: date === today, nodes: [] });
  }
  for (let day = 1; day <= total; day += 1) {
    const date = `${month}-${String(day).padStart(2, '0')}`;
    cells.push({ date, day, inMonth: true, isToday: date === today, nodes: byDate.get(date) ?? [] });
  }
  for (let next = 1; cells.length % 7 !== 0; next += 1) {
    const date = shiftDailyDate(`${month}-${String(total).padStart(2, '0')}`, next);
    cells.push({ date, day: Number(date.slice(8, 10)), inMonth: false, isToday: date === today, nodes: [] });
  }

  let opensCount = 0;
  let deadlineCount = 0;
  for (const cell of cells) {
    for (const node of cell.nodes) {
      if (node.kind === 'opens') opensCount += 1; else deadlineCount += 1;
    }
  }
  for (let index = 0; index < cells.length; index += 7) weeks.push(cells.slice(index, index + 7));
  return { month, weeks, opensCount, deadlineCount };
}
