import type { StudyCourse } from './types';

/**
 * 课程成绩与 GPA 计算。
 *
 * 只做两件有确定答案的事：
 * 1. 加权平均分 = Σ(学分×分数) / Σ学分（只统计已出分课程）。
 * 2. 按常见 4.0 分档换算的参考 GPA，页面必须同时标注换算规则——
 *    各校绩点制度不同，这里给出的是可解释的参考值，不冒充学校的官方算法。
 *
 * 未出分课程不计入两个指标，但计入学分进度，方便看清「还差几门没出分」。
 */

export interface StudyGpaSummary {
  /** 参与计算的学分（已出分课程） */
  scoredCredits: number;
  /** 全部课程学分（含未出分） */
  totalCredits: number;
  /** 已出分课程数 */
  scoredCount: number;
  totalCount: number;
  /** 加权平均分，无已出分课程时为 null */
  weightedAverage: number | null;
  /** 常见 4.0 分档参考 GPA，无已出分课程时为 null */
  gpa: number | null;
}

/** 常见 4.0 分档：[最低分, 绩点]，从高到低匹配。 */
export const GPA_SCALE: ReadonlyArray<readonly [number, number]> = [
  [90, 4.0],
  [85, 3.7],
  [82, 3.3],
  [78, 3.0],
  [75, 2.7],
  [72, 2.3],
  [68, 2.0],
  [64, 1.5],
  [60, 1.0],
  [0, 0],
];

export function gradePointFor(score: number): number {
  for (const [minimum, point] of GPA_SCALE) {
    if (score >= minimum) return point;
  }
  return 0;
}

const round2 = (value: number) => Math.round(value * 100) / 100;

export function summarizeCourses(courses: Array<Pick<StudyCourse, 'credits' | 'score'>>): StudyGpaSummary {
  let scoredCredits = 0;
  let totalCredits = 0;
  let scoreTimesCredits = 0;
  let pointTimesCredits = 0;
  let scoredCount = 0;

  for (const course of courses) {
    totalCredits += course.credits;
    if (course.score === null) continue;
    scoredCount += 1;
    scoredCredits += course.credits;
    scoreTimesCredits += course.credits * course.score;
    pointTimesCredits += course.credits * gradePointFor(course.score);
  }

  return {
    scoredCredits: round2(scoredCredits),
    totalCredits: round2(totalCredits),
    scoredCount,
    totalCount: courses.length,
    weightedAverage: scoredCredits > 0 ? round2(scoreTimesCredits / scoredCredits) : null,
    gpa: scoredCredits > 0 ? round2(pointTimesCredits / scoredCredits) : null,
  };
}
