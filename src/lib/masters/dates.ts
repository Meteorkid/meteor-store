import { DailyDateSchema, dailyDate } from '@/lib/daily/types';
import type { MastersRound } from './types';

export interface MastersRoundState {
  state: 'unverified' | 'unannounced' | 'upcoming' | 'open' | 'closing' | 'closed';
  daysLeft: number | null;
  leadDays: 30 | 7 | 1 | null;
}

const DAY_MS = 86_400_000;

function dateInTimeZone(now: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now);
}

/** 日期精度不能升级成虚构的截止时刻，且截止在未来不等于申请已经开放。 */
export function getMastersRoundState(round: MastersRound, now = new Date()): MastersRoundState {
  const details = round.details;
  const result = (state: MastersRoundState['state'], daysLeft: number | null = null, leadDays: MastersRoundState['leadDays'] = null): MastersRoundState => ({ state, daysLeft, leadDays });
  if (details.openingState === 'closed') return result('closed');
  if (details.deadlineStatus === 'unverified') return result('unverified');
  if (details.deadlineStatus === 'unannounced') return result('unannounced');
  if (!details.deadlineOn || !DailyDateSchema.safeParse(details.deadlineOn).success
    || !Number.isFinite(now.getTime())) return result('unverified');

  let referenceDate: string;
  try {
    referenceDate = details.deadlineTimeZone ? dateInTimeZone(now, details.deadlineTimeZone) : dailyDate(now);
  } catch {
    return result('unverified');
  }

  let daysLeft: number;
  if (details.deadlineAt) {
    const deadline = Date.parse(details.deadlineAt);
    if (!details.deadlineTimeZone || !Number.isFinite(deadline)) return result('unverified');
    if (dateInTimeZone(new Date(deadline), details.deadlineTimeZone) !== details.deadlineOn) return result('unverified');
    if (now.getTime() >= deadline) return result('closed', 0);
    daysLeft = Math.ceil((deadline - now.getTime()) / DAY_MS);
  } else {
    // 时区未公布时只按北京时间的日历日期提醒，过日即不再宣称还可提交。
    if (referenceDate > details.deadlineOn) return result('closed', 0);
    daysLeft = Math.max(0, Math.round((Date.parse(details.deadlineOn) - Date.parse(referenceDate)) / DAY_MS));
  }

  const eligible = round.status === 'published' && !!round.verifiedOn
    && DailyDateSchema.safeParse(round.verifiedOn).success && round.verifiedOn <= dailyDate(now);
  const leadDays = !eligible ? null : daysLeft <= 1 ? 1 : daysLeft <= 7 ? 7 : daysLeft <= 30 ? 30 : null;
  if (details.opensOn) {
    if (!DailyDateSchema.safeParse(details.opensOn).success || details.opensOn > details.deadlineOn) return result('unverified');
    if (referenceDate < details.opensOn) return result('upcoming', daysLeft, leadDays);
  }
  const isOpen = details.openingState === 'open'
    || (details.openingState === 'scheduled' && details.opensOn !== null && referenceDate >= details.opensOn);
  // 已核验截止仍需提醒已关注的人，不能因为未披露开放日而漏掉截止。
  if (!isOpen && daysLeft !== 0) return result('unverified', daysLeft, leadDays);
  return result(daysLeft <= 7 ? 'closing' : 'open', daysLeft, leadDays);
}
