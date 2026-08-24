import { describe, expect, it } from 'vitest';
import {
  buildTollowAnalytics,
  isValidTimeZone,
  type TollowAnalyticsSession,
} from '../tollow-analytics';

const session = (
  id: string,
  startedAt: string,
  overrides: Partial<TollowAnalyticsSession> = {},
): TollowAnalyticsSession => ({
  id,
  bookId: 'book-one',
  bookTitle: '第一本书',
  startedAt,
  endedAt: new Date(new Date(startedAt).getTime() + 60_000).toISOString(),
  durationMs: 60_000,
  wordsTyped: 100,
  wpm: 60,
  accuracy: 90,
  errorCount: 2,
  ...overrides,
});

describe('Tollow 真实统计', () => {
  it('按用户时区聚合并使用时长/字数加权平均', () => {
    const result = buildTollowAnalytics([
      session('S1', '2026-08-23T16:30:00.000Z'), // 上海 8/24
      session('S2', '2026-08-22T16:30:00.000Z', {
        durationMs: 180_000,
        wordsTyped: 300,
        wpm: 100,
        accuracy: 100,
        errorCount: 0,
        bookId: 'book-two',
        bookTitle: '第二本书',
      }),
    ], '7d', 'Asia/Shanghai', new Date('2026-08-24T04:00:00.000Z'));

    expect(result.summary).toMatchObject({
      totalDurationMs: 240_000,
      totalWordsTyped: 400,
      practiceDays: 2,
      currentStreak: 2,
      longestStreak: 2,
      averageWpm: 90,
      bestWpm: 100,
      averageAccuracy: 97.5,
      totalErrors: 2,
    });
    expect(result.trend).toHaveLength(7);
    expect(result.trend.at(-1)).toMatchObject({ bucket: '2026-08-24', averageWpm: 60 });
    expect(result.books.map((book) => book.bookTitle)).toEqual(['第二本书', '第一本书']);
    expect(result.recentSessions.map((item) => item.id)).toEqual(['S1', 'S2']);
  });

  it('全部历史使用月桶，范围筛选不截断历史最长连续天数', () => {
    const result = buildTollowAnalytics([
      session('S1', '2026-01-01T08:00:00.000Z'),
      session('S2', '2026-01-02T08:00:00.000Z'),
      session('S3', '2026-08-24T08:00:00.000Z'),
    ], 'all', 'UTC', new Date('2026-08-24T12:00:00.000Z'));

    expect(result.trend.map((item) => item.bucket)).toEqual(['2026-01', '2026-08']);
    expect(result.summary.currentStreak).toBe(1);
    expect(result.summary.longestStreak).toBe(2);
  });

  it('空数据返回零汇总和真实的空时间序列', () => {
    const result = buildTollowAnalytics([], '30d', 'UTC', new Date('2026-08-24T12:00:00.000Z'));

    expect(result.summary.totalWordsTyped).toBe(0);
    expect(result.summary.averageWpm).toBe(0);
    expect(result.trend).toHaveLength(30);
    expect(result.trend.every((item) => item.wordsTyped === 0)).toBe(true);
    expect(result.books).toEqual([]);
    expect(result.recentSessions).toEqual([]);
  });

  it('校验 IANA 时区', () => {
    expect(isValidTimeZone('Asia/Shanghai')).toBe(true);
    expect(isValidTimeZone('Not/A-Timezone')).toBe(false);
  });
});
