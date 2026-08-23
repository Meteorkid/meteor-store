import { describe, expect, it } from 'vitest';
import {
  mergeTollowBookProgress,
  tollowFavoriteCreateSchema,
  tollowFavoritePatchSchema,
  tollowImportSchema,
  tollowPracticeSessionSchema,
  tollowProgressSchema,
} from '../tollow-contract';

const progress = {
  bookId: 'the-little-prince',
  sectionId: 'chapter-one',
  segmentIndex: 2,
  offset: 18,
  updatedAt: '2026-08-23T08:00:00+08:00',
};

describe('Tollow API 合约', () => {
  it('规范化阅读进度时间并拒绝负数位置', () => {
    expect(tollowProgressSchema.parse(progress).updatedAt).toBe('2026-08-23T00:00:00.000Z');
    expect(tollowProgressSchema.safeParse({ ...progress, offset: -1 }).success).toBe(false);
  });

  it('阅读进度冲突时保留 updatedAt 较新的记录', () => {
    const older = tollowProgressSchema.parse(progress);
    const newer = { ...older, offset: 42, updatedAt: '2026-08-24T00:00:00.000Z' };

    expect(mergeTollowBookProgress(older, newer)).toEqual(newer);
    expect(mergeTollowBookProgress(newer, older)).toEqual(newer);
    expect(mergeTollowBookProgress(null, newer)).toEqual(newer);
  });

  it('练习会话约束时间顺序和指标范围', () => {
    const valid = {
      clientRecordId: 'session-1',
      bookId: 'the-little-prince',
      bookTitle: '小王子',
      startedAt: '2026-08-23T00:00:00.000Z',
      endedAt: '2026-08-23T00:01:00.000Z',
      durationMs: 60_000,
      wordsTyped: 120,
      wpm: 120.25,
      accuracy: 98.5,
      errorCount: 2,
    };

    expect(tollowPracticeSessionSchema.safeParse(valid).success).toBe(true);
    expect(tollowPracticeSessionSchema.safeParse({ ...valid, accuracy: 101 }).success).toBe(false);
    expect(tollowPracticeSessionSchema.safeParse({ ...valid, endedAt: valid.startedAt.slice(0, 10) + 'T00:00:00.000Z' }).success).toBe(true);
    expect(tollowPracticeSessionSchema.safeParse({ ...valid, endedAt: '2026-08-22T23:59:00.000Z' }).success).toBe(false);
  });

  it('收藏限制原文、笔记和标签并去除重复标签', () => {
    const valid = {
      clientRecordId: 'favorite-1',
      bookId: 'the-little-prince',
      bookTitle: '小王子',
      sectionId: 'chapter-one',
      sectionTitle: '第一章',
      segmentIndex: 0,
      startOffset: 2,
      endOffset: 8,
      quote: '真正重要的东西，用眼睛是看不见的。',
      note: '提醒自己。',
      tags: ['哲思', ' 哲思 ', '成长'],
    };

    expect(tollowFavoriteCreateSchema.parse(valid).tags).toEqual(['哲思', '成长']);
    expect(tollowFavoriteCreateSchema.safeParse({ ...valid, clientRecordId: undefined }).success).toBe(false);
    expect(tollowFavoriteCreateSchema.safeParse({ ...valid, quote: 'x'.repeat(10_001) }).success).toBe(false);
    expect(tollowFavoriteCreateSchema.safeParse({ ...valid, note: 'x'.repeat(2_001) }).success).toBe(false);
    expect(tollowFavoriteCreateSchema.safeParse({ ...valid, tags: Array.from({ length: 11 }, (_, i) => `t${i}`) }).success).toBe(false);
    expect(tollowFavoriteCreateSchema.safeParse({ ...valid, endOffset: 1 }).success).toBe(false);
    expect(tollowFavoritePatchSchema.safeParse({ userId: 'other-user' }).success).toBe(false);
  });

  it('首次导入每批最多处理 100 条记录', () => {
    expect(tollowImportSchema.safeParse({ progress: [], sessions: [] }).success).toBe(true);
    expect(tollowImportSchema.safeParse({ progress: Array(101).fill(progress), sessions: [] }).success).toBe(false);
    expect(tollowImportSchema.safeParse({ progress: Array(60).fill(progress), sessions: Array(41).fill({}) }).success).toBe(false);
  });
});
