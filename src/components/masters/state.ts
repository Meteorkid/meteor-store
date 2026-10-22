import { z } from 'zod';
import { DailyDateSchema, dailyDate } from '@/lib/daily/types';
import { getMastersRoundState } from '@/lib/masters/dates';
import { MastersWatchInputSchema, type MastersRound, type MastersWatch } from '@/lib/masters/types';

const WatchSchema = MastersWatchInputSchema.extend({ updatedAt: z.string().datetime({ offset: true }) });

export interface MastersFilters {
  year: number;
  region: string;
  school: string;
  subject: string;
  studyType: string;
  intake: string;
  deadlineWindow?: 30 | 60 | 90;
}

export function filterMastersRounds(rounds: MastersRound[], filters: MastersFilters, now = new Date()): MastersRound[] {
  return rounds.filter(round => {
    const matches = round.intakeYear === filters.year
    && (!filters.region || round.region === filters.region)
    && (!filters.school || round.details.university === filters.school)
    && (!filters.subject || round.details.subject === filters.subject)
    && (!filters.studyType || round.details.studyType === filters.studyType)
    && (!filters.intake || round.details.intakeLabel === filters.intake);
    if (!matches || !filters.deadlineWindow) return matches;
    const timing = getMastersRoundState(round, now);
    return canExportMastersRound(round, now) && timing.daysLeft !== null && timing.daysLeft <= filters.deadlineWindow;
  });
}

/** 使用既有日期口径排序；日期未核验或开放未知，不凭排序推断申请已开放。 */
export function organizeMastersRounds(rounds: MastersRound[], now: Date) {
  const rank = (round: MastersRound) => {
    const timing = getMastersRoundState(round, now);
    return canExportMastersRound(round, now) && timing.daysLeft !== null ? timing.daysLeft : Infinity;
  };
  const sorted = [...rounds].sort((first, second) => rank(first) - rank(second)
    || (first.details.deadlineAt && second.details.deadlineAt ? Date.parse(first.details.deadlineAt) - Date.parse(second.details.deadlineAt) : 0)
    || (first.details.deadlineOn ?? '').localeCompare(second.details.deadlineOn ?? '')
    || first.id.localeCompare(second.id));
  const active = sorted.filter(round => getMastersRoundState(round, now).state !== 'closed');
  const closed = sorted.filter(round => getMastersRoundState(round, now).state === 'closed');
  return { active: groupMastersRounds(active), closed: groupMastersRounds(closed), activeCount: active.length, closedCount: closed.length };
}

function groupMastersRounds(rounds: MastersRound[]) {
  const groups = new Map<string, { key: string; rounds: MastersRound[] }>();
  for (const round of rounds) {
    const key = JSON.stringify([round.region, round.details.university, round.details.programme, round.intakeYear, round.details.intakeLabel, round.details.studyType]);
    const group = groups.get(key) ?? { key, rounds: [] };
    group.rounds.push(round);
    groups.set(key, group);
  }
  return [...groups.values()];
}

export function assertMastersOwner(value: unknown, userId: string): asserts value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || !('userId' in value) || value.userId !== userId) {
    throw new Error('Account changed');
  }
}

export function parseMastersWatches(value: unknown, userId: string): { watches: MastersWatch[]; rounds: MastersRound[] } {
  assertMastersOwner(value, userId);
  const watches = z.array(WatchSchema).parse(value.watches);
  if (!Array.isArray(value.rounds)) throw new Error('Rounds unavailable');
  return { watches, rounds: value.rounds as MastersRound[] };
}

export function parseMastersWatch(value: unknown, userId: string): MastersWatch {
  assertMastersOwner(value, userId);
  return WatchSchema.parse(value.watch);
}

export function unavailableWatches(watches: MastersWatch[], publishedRounds: MastersRound[]) {
  const known = new Set(publishedRounds.map(round => round.id));
  return watches.filter(watch => !known.has(watch.roundId));
}

export function canExportMastersRound(round: MastersRound, now: Date): boolean {
  return round.status === 'published' && !!round.verifiedOn
    && DailyDateSchema.safeParse(round.verifiedOn).success && round.verifiedOn <= dailyDate(now)
    && round.details.deadlineStatus === 'confirmed' && !!round.details.deadlineOn
    && getMastersRoundState(round, now).state !== 'closed';
}

export function mastersDeadlineLabel(round: MastersRound, locale: 'zh' | 'en'): string {
  const details = round.details;
  if (details.deadlineStatus !== 'confirmed' || !details.deadlineOn) return details.deadlineText;
  if (!details.deadlineAt || !details.deadlineTimeZone) return details.deadlineOn;
  try {
    return `${new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-GB', {
      timeZone: details.deadlineTimeZone, year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    }).format(new Date(details.deadlineAt))} (${details.deadlineTimeZone})`;
  } catch { return details.deadlineOn; }
}

/** 只有官方明确关闭时才使用“已关闭”，日期推算不能替代官方状态。 */
export function mastersStateLabel(round: MastersRound, now: Date, locale: 'zh' | 'en'): string {
  const state = getMastersRoundState(round, now).state;
  if (state === 'closed') {
    if (round.details.openingState === 'closed') return locale === 'zh' ? '官方已关闭' : 'Closed by the university';
    if (round.details.deadlineAt) return locale === 'zh' ? '截止时间已过' : 'Deadline time has passed';
    return locale === 'zh' ? '截止日期已过' : 'Deadline date has passed';
  }
  if (state === 'unverified' && round.details.deadlineStatus === 'confirmed') return locale === 'zh' ? '开放状态待确认' : 'Opening status unconfirmed';
  const labels = {
    unverified: { zh: '日期待核验', en: 'Date awaiting verification' },
    unannounced: { zh: '截止未公布', en: 'Deadline not announced' },
    upcoming: { zh: '尚未开放', en: 'Not open yet' },
    open: { zh: '开放中', en: 'Open' },
    closing: { zh: '即将截止', en: 'Closing soon' },
  };
  return labels[state][locale];
}
