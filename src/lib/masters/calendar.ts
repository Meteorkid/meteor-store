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
  /** 覆盖这一天的申请期，按学校色相铺成色带。 */
  spans: MastersCalendarSpan[];
}

export interface MastersCalendarMonth {
  month: string;
  weeks: MastersCalendarCell[][];
  opensCount: number;
  deadlineCount: number;
  /** 本月出现过的申请期数量，用于摘要。 */
  spanCount: number;
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

/** 可翻月范围取自实际节点与申请期起点，避免让用户翻到一堆空月份。 */
export function mastersCalendarBounds(rounds: MastersRound[], year: number, spans: MastersCalendarSpan[] = []): MastersCalendarBounds {
  const months = [
    ...rounds.flatMap(round => [round.details.opensOn, round.details.deadlineOn]),
    ...spans.flatMap(span => [span.start, span.end]),
  ]
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

/** 一段申请期：同项目内重叠的轮次已合并，deadlines 保留各轮截止刻度。 */
export interface MastersCalendarSpan {
  /** 区间唯一标识，同项目的不相交窗口仍是不同色带。 */
  key: string;
  /** 用于把同项目的多个窗口及仅截止节点归组。 */
  projectKey: string;
  university: string;
  programme: string;
  region: MastersRound['region'];
  start: string;
  end: string;
  /** 起点是否由官方公布。false 表示从核验日画起，条形起点淡出。 */
  startKnown: boolean;
  /** 合并进来的各轮截止日，用于在条形内标刻度。 */
  deadlines: string[];
  rounds: MastersRound[];
  /** 合并的轮次里最早改期的记录，用于标变更。 */
  changed: boolean;
  /** 整段申请期已经结束（末日在今天之前），仅用于条形降透明度。 */
  past: boolean;
}

export function mastersCalendarProjectKey(round: MastersRound): string {
  const details = round.details;
  return `${round.region}:${details.university.trim().toLowerCase()}:${details.programme.trim().toLowerCase()}`;
}

/**
 * 把轮次投影成申请期长条。只投影区间可知的轮次：
 * 官方公布开放日 → 起止都确定；官方确认正在开放但未公布开放日 → 从首次开放证据日起画，
 * 起点标为未知。只有截止日、开放状态未知的轮次不画条，避免暗示「这天之前都在开放」。
 */
export function collectMastersCalendarSpans(rounds: MastersRound[], now = new Date()): MastersCalendarSpan[] {
  const today = dailyDate(now);
  const recent = new Date(`${shiftDailyDate(today, -7)}T00:00:00+08:00`).toISOString();
  const spans: MastersCalendarSpan[] = [];
  for (const round of rounds) {
    const details = round.details;
    if (!isCalendarDate(details.deadlineOn)) continue;
    let start: string | null = null;
    let startKnown = false;
    const firstObservedOpenOn = details.firstObservedOpenOn ?? null;
    if (isCalendarDate(details.opensOn)) {
      start = details.opensOn; startKnown = true;
    } else if (details.openingState === 'open'
      && isCalendarDate(firstObservedOpenOn)
      && firstObservedOpenOn <= today && firstObservedOpenOn <= details.deadlineOn) {
      // 最新核验只更新信息新鲜度，不能把已证实开放的历史窗口每天向右抹掉。
      // 已关闭或状态未知时不画：没有关闭日期证据，不能把原截止日前整段都说成开放。
      start = firstObservedOpenOn;
    } else if (details.openingState === 'open' && isCalendarDate(round.verifiedOn)
      && round.verifiedOn <= today && round.verifiedOn <= details.deadlineOn) {
      start = round.verifiedOn;
    }
    if (!start) continue;
    if (start > details.deadlineOn) continue;
    const projectKey = mastersCalendarProjectKey(round);
    spans.push({
      key: `${projectKey}#${start}`, projectKey,
      university: details.university, programme: details.programme, region: round.region,
      start, end: details.deadlineOn, startKnown, deadlines: [details.deadlineOn],
      rounds: [round], changed: !!round.dateChangedAt && round.dateChangedAt >= recent,
      past: details.deadlineOn < today,
    });
  }

  // 同项目重叠轮次合并成一条，否则港科 MIMT 这类四轮项目会叠出四条同色条，看着像渲染错误。
  // 按项目和起点排序后，只需与最后一段比较；否则较早但不相交的窗口会被错误填平。
  const ordered = spans.sort((first, second) => first.projectKey.localeCompare(second.projectKey)
    || first.start.localeCompare(second.start) || first.end.localeCompare(second.end)
    || first.rounds[0].id.localeCompare(second.rounds[0].id));
  const merged: MastersCalendarSpan[] = [];
  for (const span of ordered) {
    const current = merged[merged.length - 1];
    if (!current || current.projectKey !== span.projectKey || span.start > current.end) {
      merged.push(span);
      continue;
    }
    current.end = span.end > current.end ? span.end : current.end;
    // 合并后只要有一段起点未知，整条就按未知处理，不把边界说死。
    current.startKnown = current.startKnown && span.startKnown;
    current.deadlines = [...current.deadlines, span.end].sort();
    current.rounds = [...current.rounds, ...span.rounds];
    current.changed = current.changed || span.changed;
    current.past = current.past && span.past;
  }
  return merged.sort((first, second) =>
    first.start.localeCompare(second.start)
    || first.university.localeCompare(second.university)
    || first.programme.localeCompare(second.programme));
}

/**
 * 按学校稳定分配色相：同一所学校在任何月份、任何筛选下都是同一个颜色，
 * 用户才能靠颜色认出「这条是港科」。色相取自字符串哈希，避免随渲染顺序漂移。
 */
export function mastersCalendarHue(span: Pick<MastersCalendarSpan, 'region' | 'university'>): number {
  const seed = `${span.region}:${span.university.trim().toLowerCase()}`;
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) % 100_000;
  }
  // 落在 0–359 的色相环上，跳过偏灰的窄区间会让相邻色相撞色，这里不额外裁剪。
  return hash % 360;
}

/** 某一天命中的申请期，供格子判断是否落在区间内。 */
export function spansOnDate(spans: MastersCalendarSpan[], date: string): MastersCalendarSpan[] {
  return spans.filter(span => span.start <= date && date <= span.end);
}

/**
 * 给每条申请期分配固定车道（行号）。车道在整个月份内不变，同一条长条才会
 * 在相邻格子里落在同一水平线上，跨格连成一条直线；否则会随渲染顺序上下跳。
 */
export function assignMastersCalendarLanes(spans: MastersCalendarSpan[]): Map<string, number> {
  const laneEnds: string[] = [];
  const lanes = new Map<string, number>();
  const ordered = [...spans].sort((first, second) =>
    first.start.localeCompare(second.start)
    || first.end.localeCompare(second.end)
    || first.university.localeCompare(second.university));
  for (const span of ordered) {
    let lane = laneEnds.findIndex(end => end < span.start);
    if (lane === -1) { lane = laneEnds.length; laneEnds.push(span.end); }
    else laneEnds[lane] = span.end;
    lanes.set(span.key, lane);
  }
  return lanes;
}

export function buildMastersCalendarMonth(month: string, nodes: MastersCalendarNode[], today = dailyDate(), spans: MastersCalendarSpan[] = []): MastersCalendarMonth {
  const weeks: MastersCalendarCell[][] = [];
  if (!parseMonth(month)) return { month, weeks, opensCount: 0, deadlineCount: 0, spanCount: 0 };

  const byDate = new Map<string, MastersCalendarNode[]>();
  for (const node of nodes) {
    const bucket = byDate.get(node.date);
    if (bucket) bucket.push(node); else byDate.set(node.date, [node]);
  }

  const first = `${month}-01`;
  const total = daysInMonth(month);
  const cells: MastersCalendarCell[] = [];
  const pushCell = (date: string, inMonth: boolean) => {
    cells.push({
      date, day: Number(date.slice(8, 10)), inMonth, isToday: date === today,
      nodes: byDate.get(date) ?? [], spans: spansOnDate(spans, date),
    });
  };
  for (let offset = weekdayIndex(first); offset > 0; offset -= 1) {
    pushCell(shiftDailyDate(first, -offset), false);
  }
  for (let day = 1; day <= total; day += 1) {
    pushCell(`${month}-${String(day).padStart(2, '0')}`, true);
  }
  for (let next = 1; cells.length % 7 !== 0; next += 1) {
    pushCell(shiftDailyDate(`${month}-${String(total).padStart(2, '0')}`, next), false);
  }

  let opensCount = 0;
  let deadlineCount = 0;
  for (const cell of cells) {
    if (!cell.inMonth) continue;
    for (const node of cell.nodes) {
      if (node.kind === 'opens') opensCount += 1; else deadlineCount += 1;
    }
  }
  for (let index = 0; index < cells.length; index += 7) weeks.push(cells.slice(index, index + 7));
  // 补位格保持色带连续，但摘要只统计本月真正覆盖的窗口。
  const spanKeys = new Set(cells.filter(cell => cell.inMonth).flatMap(cell => cell.spans.map(span => span.key)));
  return { month, weeks, opensCount, deadlineCount, spanCount: spanKeys.size };
}
