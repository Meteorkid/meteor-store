import type { CompetitionDateWindow, NationalCompetition } from '@/data/national-competitions';

export type CompetitionStatus = 'open' | 'upcoming' | 'ended' | 'pending';
export type CompetitionSort = 'soon' | 'source';

export interface CompetitionFilters {
  query: string;
  field: string;
  status: CompetitionStatus | 'all';
  sort: CompetitionSort;
}

export function scheduleForYear(competition: NationalCompetition, year: number): CompetitionDateWindow | undefined {
  return competition.schedules.find((schedule) => schedule.year === year);
}

function monthIndex(value: string): number | null {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) return null;
  return year * 12 + month - 1;
}

function currentShanghaiMonth(now: Date): number {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit' })
    .formatToParts(now);
  const year = Number(parts.find((part) => part.type === 'year')?.value);
  const month = Number(parts.find((part) => part.type === 'month')?.value);
  return year * 12 + month - 1;
}

export function competitionStatus(schedule: CompetitionDateWindow | undefined, now: Date): CompetitionStatus {
  if (!schedule || !schedule.start) return 'pending';
  const start = monthIndex(schedule.start);
  const end = schedule.end ? monthIndex(schedule.end) : null;
  const current = currentShanghaiMonth(now);
  if (start === null) return 'pending';
  if (current < start) return 'upcoming';
  if (end !== null && current > end) return 'ended';
  return 'open';
}

export function primaryCompetitionField(competition: NationalCompetition): string {
  return competition.field.split('/')[0]!.trim();
}

export function competitionFields(competitions: readonly NationalCompetition[]): string[] {
  return [...new Set(competitions.map(primaryCompetitionField))].sort((left, right) => left.localeCompare(right, 'zh-CN'));
}

export function filterNationalCompetitions(
  competitions: readonly NationalCompetition[],
  year: number,
  filters: CompetitionFilters,
  now: Date,
): NationalCompetition[] {
  const query = filters.query.trim().toLocaleLowerCase('zh-CN');
  const statuses = new Map(competitions.map((competition) => [
    competition.id,
    competitionStatus(scheduleForYear(competition, year), now),
  ]));
  const statusOrder: Record<CompetitionStatus, number> = { open: 0, upcoming: 1, ended: 2, pending: 3 };
  return competitions
    .filter((competition) => {
      const schedule = scheduleForYear(competition, year);
      const status = statuses.get(competition.id)!;
      if (filters.field && primaryCompetitionField(competition) !== filters.field) return false;
      if (filters.status !== 'all' && status !== filters.status) return false;
      if (!query) return true;
      return [competition.name, competition.organizer, competition.field, schedule?.startLabel, schedule?.endLabel]
        .filter(Boolean).join(' ').toLocaleLowerCase('zh-CN').includes(query);
    })
    .sort((left, right) => {
      if (filters.sort === 'source') return left.order - right.order;
      const leftStatus = statuses.get(left.id)!;
      const rightStatus = statuses.get(right.id)!;
      const byStatus = statusOrder[leftStatus] - statusOrder[rightStatus];
      if (byStatus !== 0) return byStatus;
      const leftStart = scheduleForYear(left, year)?.start ?? '9999-99';
      const rightStart = scheduleForYear(right, year)?.start ?? '9999-99';
      return leftStart.localeCompare(rightStart) || left.order - right.order;
    });
}
