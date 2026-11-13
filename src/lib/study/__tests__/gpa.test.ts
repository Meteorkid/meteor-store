import { describe, expect, it } from 'vitest';
import { GPA_SCALE, gradePointFor, summarizeCourses } from '../gpa';

describe('GPA 分档换算', () => {
  it.each([
    [100, 4.0], [90, 4.0], [89.9, 3.7],
    [85, 3.7], [84.9, 3.3], [82, 3.3],
    [81.9, 3.0], [78, 3.0], [77.9, 2.7],
    [75, 2.7], [74.9, 2.3], [72, 2.3],
    [71.9, 2.0], [68, 2.0], [67.9, 1.5],
    [64, 1.5], [63.9, 1.0], [60, 1.0],
    [59.9, 0], [0, 0],
  ])('%s 分 → %s 绩点', (score, point) => {
    expect(gradePointFor(score)).toBe(point);
  });

  it('分档表按最低分降序，保证第一个命中即最高档', () => {
    for (let index = 1; index < GPA_SCALE.length; index += 1) {
      expect(GPA_SCALE[index][0]).toBeLessThan(GPA_SCALE[index - 1][0]);
    }
    expect(GPA_SCALE[GPA_SCALE.length - 1][0]).toBe(0);
  });
});

describe('成绩汇总', () => {
  it('按学分加权计算平均分与 GPA', () => {
    const summary = summarizeCourses([
      { credits: 3, score: 90 },
      { credits: 1, score: 60 },
    ]);
    expect(summary.weightedAverage).toBe(82.5);
    expect(summary.gpa).toBe(3.25);
    expect(summary.scoredCredits).toBe(4);
    expect(summary.totalCredits).toBe(4);
    expect(summary.scoredCount).toBe(2);
    expect(summary.totalCount).toBe(2);
  });

  it('未出分课程不计入平均分与 GPA，但计入学分进度', () => {
    const summary = summarizeCourses([
      { credits: 2, score: null },
      { credits: 3, score: 85 },
    ]);
    expect(summary.weightedAverage).toBe(85);
    expect(summary.gpa).toBe(3.7);
    expect(summary.scoredCredits).toBe(3);
    expect(summary.totalCredits).toBe(5);
    expect(summary.scoredCount).toBe(1);
    expect(summary.totalCount).toBe(2);
  });

  it('结果四舍五入到两位小数，不受浮点误差影响', () => {
    const summary = summarizeCourses([
      { credits: 3, score: 75 },
      { credits: 2, score: 90 },
    ]);
    // (75×3 + 90×2) / 5 = 81；(2.7×3 + 4.0×2) / 5 = 3.22
    expect(summary.weightedAverage).toBe(81);
    expect(summary.gpa).toBe(3.22);
  });

  it('没有任何已出分课程时两个指标为 null', () => {
    const summary = summarizeCourses([
      { credits: 2, score: null },
      { credits: 4, score: null },
    ]);
    expect(summary.weightedAverage).toBeNull();
    expect(summary.gpa).toBeNull();
    expect(summary.scoredCredits).toBe(0);
    expect(summary.totalCredits).toBe(6);
    expect(summary.scoredCount).toBe(0);
    expect(summary.totalCount).toBe(2);
  });

  it('空列表返回全零与 null，不抛错', () => {
    const summary = summarizeCourses([]);
    expect(summary).toEqual({
      scoredCredits: 0, totalCredits: 0, scoredCount: 0, totalCount: 0,
      weightedAverage: null, gpa: null,
    });
  });

  it('支持 0.5 步进学分（含小数合计）', () => {
    const summary = summarizeCourses([
      { credits: 1.5, score: 90 },
      { credits: 0.5, score: 80 },
    ]);
    expect(summary.weightedAverage).toBe(87.5);
    // (1.5×4.0 + 0.5×3.0) / 2 = 3.75
    expect(summary.gpa).toBe(3.75);
    expect(summary.scoredCredits).toBe(2);
  });
});
