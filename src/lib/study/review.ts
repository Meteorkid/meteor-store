import { dailyDate, shiftDailyDate } from '@/lib/daily/types';
import {
  STUDY_REVIEW_INTERVALS_DAYS,
  STUDY_REVIEW_MAX_STAGE,
  type StudyProblem,
  type StudyReviewResult,
} from './types';

/**
 * 算法题的间隔复习调度。
 *
 * 规则有意保持简单可预期：1、3、7、14、30、60 天六档，
 * 「记得」前进一档，「忘了」退回第一档。比 SM-2 那种浮动系数更容易解释，
 * 出错时用户自己也能算出来下一次是哪天。
 *
 * 日期统一用北京时间的日历日期（`dailyDate()`），不按时刻比较——
 * 复习是「今天做不做」的事，跨时区换算只会带来歧义。
 */

export interface StudyReviewSchedule {
  stage: number;
  intervalDays: number;
  dueOn: string;
  lastReviewedOn: string | null;
}

/** 题目刚被标记为已解决：明天第一次复习。 */
export function initialReviewSchedule(today = dailyDate()): StudyReviewSchedule {
  return {
    stage: 0,
    intervalDays: STUDY_REVIEW_INTERVALS_DAYS[0],
    dueOn: shiftDailyDate(today, STUDY_REVIEW_INTERVALS_DAYS[0]),
    lastReviewedOn: null,
  };
}

/**
 * 一次复习之后的下一档。
 *
 * 「忘了」不是失败记录，只是回到短间隔重新巩固；stage 归零让
 * 「这题我还不熟」在列表里一眼可见。
 */
export function nextReviewSchedule(
  current: { stage: number },
  result: StudyReviewResult,
  today = dailyDate(),
): StudyReviewSchedule {
  const stage = result === 'remembered'
    ? Math.min(Math.max(current.stage, 0) + 1, STUDY_REVIEW_MAX_STAGE)
    : 0;
  const intervalDays = STUDY_REVIEW_INTERVALS_DAYS[stage];
  return {
    stage,
    intervalDays,
    dueOn: shiftDailyDate(today, intervalDays),
    lastReviewedOn: today,
  };
}

/** 今日复习队列：已解决且到期（含逾期）。纯函数，方便测试与工作台聚合。 */
export function dueReviewProblems(problems: StudyProblem[], today = dailyDate()): StudyProblem[] {
  return problems
    .filter(problem => problem.status === 'solved' && problem.reviewDueOn !== null && problem.reviewDueOn <= today)
    .sort((a, b) => (a.reviewDueOn ?? '').localeCompare(b.reviewDueOn ?? ''));
}
