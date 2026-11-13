import { describe, expect, it } from 'vitest';
import { dueReviewProblems, initialReviewSchedule, nextReviewSchedule } from '../review';
import type { StudyProblem } from '../types';

function problem(overrides: Partial<StudyProblem> = {}): StudyProblem {
  return {
    id: 'problem-1', title: 'Two Sum', topic: '数组', difficulty: 'easy', url: null,
    status: 'solved', notes: null, reviewStage: 0, reviewDueOn: '2026-11-13',
    reviewIntervalDays: 1, lastReviewedOn: null,
    createdAt: '2026-11-01T00:00:00Z', updatedAt: '2026-11-01T00:00:00Z',
    ...overrides,
  };
}

describe('间隔复习调度', () => {
  it('首次标记已解决：明天第一次复习', () => {
    expect(initialReviewSchedule('2026-11-13')).toEqual({
      stage: 0, intervalDays: 1, dueOn: '2026-11-14', lastReviewedOn: null,
    });
  });

  it('「记得」按 1→3→7→14→30→60 前进并在 60 天封顶', () => {
    const intervals: number[] = [];
    let current = { stage: 0 };
    for (let index = 0; index < 7; index += 1) {
      const next = nextReviewSchedule(current, 'remembered', '2026-11-13');
      intervals.push(next.intervalDays);
      current = { stage: next.stage };
    }
    expect(intervals).toEqual([3, 7, 14, 30, 60, 60, 60]);
  });

  it('「记得」的到期日按当天起算，不叠加旧日期', () => {
    expect(nextReviewSchedule({ stage: 0 }, 'remembered', '2026-11-13')).toMatchObject({
      stage: 1, intervalDays: 3, dueOn: '2026-11-16', lastReviewedOn: '2026-11-13',
    });
  });

  it('「忘了」归零回 1 天档，跨月日期正确', () => {
    expect(nextReviewSchedule({ stage: 4 }, 'forgot', '2026-11-30')).toEqual({
      stage: 0, intervalDays: 1, dueOn: '2026-12-01', lastReviewedOn: '2026-11-30',
    });
  });

  it('异常的负档位不会产生越界间隔', () => {
    expect(nextReviewSchedule({ stage: -3 }, 'remembered', '2026-11-13')).toMatchObject({
      stage: 1, intervalDays: 3,
    });
  });
});

describe('今日复习队列', () => {
  it('只取已解决且到期（含逾期）的题目，并按到期日升序', () => {
    const queue = dueReviewProblems([
      problem({ id: 'later', reviewDueOn: '2026-11-14' }),
      problem({ id: 'overdue', reviewDueOn: '2026-11-10' }),
      problem({ id: 'today', reviewDueOn: '2026-11-13' }),
    ], '2026-11-13');
    expect(queue.map(item => item.id)).toEqual(['overdue', 'today']);
  });

  it('未解决、未排期与未到期的题目都不出现', () => {
    const queue = dueReviewProblems([
      problem({ id: 'todo', status: 'todo' }),
      problem({ id: 'unscheduled', reviewDueOn: null }),
      problem({ id: 'future', reviewDueOn: '2026-12-01' }),
    ], '2026-11-13');
    expect(queue).toEqual([]);
  });

  it('同一天的题目按到期日稳定排序，不改变原始对象', () => {
    const first = problem({ id: 'a', reviewDueOn: '2026-11-12' });
    const second = problem({ id: 'b', reviewDueOn: '2026-11-12' });
    const queue = dueReviewProblems([second, first], '2026-11-13');
    expect(queue.map(item => item.id)).toEqual(['b', 'a']);
    expect(second.reviewDueOn).toBe('2026-11-12');
  });
});
