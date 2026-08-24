export const TOLLOW_ANALYTICS_RANGES = ['7d', '30d', '90d', 'all'] as const;
export type TollowAnalyticsRange = (typeof TOLLOW_ANALYTICS_RANGES)[number];

export type TollowAnalyticsSession = {
  id: string;
  bookId: string | null;
  bookTitle: string;
  startedAt: string;
  endedAt: string;
  durationMs: number;
  wordsTyped: number;
  wpm: number;
  accuracy: number;
  errorCount: number;
};

export type TollowAnalyticsResponse = {
  range: TollowAnalyticsRange;
  timeZone: string;
  generatedAt: string;
  summary: {
    totalDurationMs: number;
    totalWordsTyped: number;
    practiceDays: number;
    currentStreak: number;
    longestStreak: number;
    averageWpm: number;
    bestWpm: number;
    averageAccuracy: number;
    totalErrors: number;
  };
  trend: Array<{
    bucket: string;
    durationMs: number;
    wordsTyped: number;
    averageWpm: number;
    averageAccuracy: number;
  }>;
  books: Array<{
    bookId: string | null;
    bookTitle: string;
    sessionCount: number;
    durationMs: number;
    wordsTyped: number;
  }>;
  recentSessions: TollowAnalyticsSession[];
};

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

export function isValidTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone }).format(new Date(0));
    return true;
  } catch {
    return false;
  }
}

function dateKey(value: string | Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(typeof value === 'string' ? new Date(value) : value);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

function shiftDateKey(value: string, days: number): string {
  const date = new Date(`${value}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function streaks(allDateKeys: string[], today: string): { current: number; longest: number } {
  const dates = [...new Set(allDateKeys)].sort();
  if (dates.length === 0) return { current: 0, longest: 0 };

  let longest = 1;
  let run = 1;
  for (let index = 1; index < dates.length; index += 1) {
    if (dates[index] === shiftDateKey(dates[index - 1], 1)) {
      run += 1;
      longest = Math.max(longest, run);
    } else {
      run = 1;
    }
  }

  const latest = dates[dates.length - 1];
  if (latest !== today && latest !== shiftDateKey(today, -1)) {
    return { current: 0, longest };
  }
  let current = 1;
  for (let index = dates.length - 1; index > 0; index -= 1) {
    if (dates[index - 1] !== shiftDateKey(dates[index], -1)) break;
    current += 1;
  }
  return { current, longest };
}

type Aggregate = {
  durationMs: number;
  wordsTyped: number;
  weightedWpm: number;
  weightedAccuracy: number;
};

function addAggregate(target: Aggregate, session: TollowAnalyticsSession): void {
  target.durationMs += session.durationMs;
  target.wordsTyped += session.wordsTyped;
  target.weightedWpm += session.wpm * session.durationMs;
  target.weightedAccuracy += session.accuracy * session.wordsTyped;
}

function averageWpm(aggregate: Aggregate): number {
  return aggregate.durationMs > 0 ? round(aggregate.weightedWpm / aggregate.durationMs) : 0;
}

function averageAccuracy(aggregate: Aggregate): number {
  return aggregate.wordsTyped > 0 ? round(aggregate.weightedAccuracy / aggregate.wordsTyped) : 0;
}

export function buildTollowAnalytics(
  sessions: TollowAnalyticsSession[],
  range: TollowAnalyticsRange,
  timeZone: string,
  now = new Date(),
): TollowAnalyticsResponse {
  const today = dateKey(now, timeZone);
  const rangeDays = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : null;
  const firstDay = rangeDays ? shiftDateKey(today, -(rangeDays - 1)) : null;
  const withDates = sessions
    .filter((session) => Number.isFinite(new Date(session.startedAt).getTime()))
    .map((session) => ({ session, day: dateKey(session.startedAt, timeZone) }));
  const selected = withDates.filter((item) => (
    item.day <= today && (!firstDay || item.day >= firstDay)
  ));

  const totals: Aggregate = { durationMs: 0, wordsTyped: 0, weightedWpm: 0, weightedAccuracy: 0 };
  let bestWpm = 0;
  let totalErrors = 0;
  for (const { session } of selected) {
    addAggregate(totals, session);
    bestWpm = Math.max(bestWpm, session.wpm);
    totalErrors += session.errorCount;
  }

  const allStreaks = streaks(withDates.map((item) => item.day), today);
  const trendMap = new Map<string, Aggregate>();
  for (const { session, day } of selected) {
    const bucket = range === 'all' ? day.slice(0, 7) : day;
    const aggregate = trendMap.get(bucket) ?? {
      durationMs: 0,
      wordsTyped: 0,
      weightedWpm: 0,
      weightedAccuracy: 0,
    };
    addAggregate(aggregate, session);
    trendMap.set(bucket, aggregate);
  }

  if (rangeDays) {
    for (let index = 0; index < rangeDays; index += 1) {
      const bucket = shiftDateKey(firstDay!, index);
      if (!trendMap.has(bucket)) {
        trendMap.set(bucket, { durationMs: 0, wordsTyped: 0, weightedWpm: 0, weightedAccuracy: 0 });
      }
    }
  }

  const bookMap = new Map<string, {
    bookId: string | null;
    bookTitle: string;
    sessionCount: number;
    durationMs: number;
    wordsTyped: number;
  }>();
  for (const { session } of selected) {
    const key = session.bookId ?? `title:${session.bookTitle}`;
    const book = bookMap.get(key) ?? {
      bookId: session.bookId,
      bookTitle: session.bookTitle,
      sessionCount: 0,
      durationMs: 0,
      wordsTyped: 0,
    };
    book.sessionCount += 1;
    book.durationMs += session.durationMs;
    book.wordsTyped += session.wordsTyped;
    bookMap.set(key, book);
  }

  return {
    range,
    timeZone,
    generatedAt: now.toISOString(),
    summary: {
      totalDurationMs: totals.durationMs,
      totalWordsTyped: totals.wordsTyped,
      practiceDays: new Set(selected.map((item) => item.day)).size,
      currentStreak: allStreaks.current,
      longestStreak: allStreaks.longest,
      averageWpm: averageWpm(totals),
      bestWpm: round(bestWpm),
      averageAccuracy: averageAccuracy(totals),
      totalErrors,
    },
    trend: [...trendMap.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([bucket, aggregate]) => ({
        bucket,
        durationMs: aggregate.durationMs,
        wordsTyped: aggregate.wordsTyped,
        averageWpm: averageWpm(aggregate),
        averageAccuracy: averageAccuracy(aggregate),
      })),
    books: [...bookMap.values()].sort((left, right) => (
      right.durationMs - left.durationMs || left.bookTitle.localeCompare(right.bookTitle, 'zh-CN')
    )),
    recentSessions: selected
      .map((item) => item.session)
      .sort((left, right) => right.startedAt.localeCompare(left.startedAt))
      .slice(0, 20),
  };
}
