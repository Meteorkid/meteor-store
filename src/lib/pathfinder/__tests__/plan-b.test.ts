import { describe, expect, it } from 'vitest';
import { generatePlanB } from '../plan-b';
import type { RealityConstraints } from '../contract';
import type { PathfinderTask } from '../schema';

const constraints: RealityConstraints = {
  dailyMinutes: 30,
  budget: 0,
  device: '仅手机',
  network: '流量有限',
  hasMentor: false,
};

function task(overrides: Partial<PathfinderTask> = {}): PathfinderTask {
  return {
    day: 1,
    title: '任务',
    minutes: 10,
    cost: 0,
    device: '手机',
    network: '普通',
    evidence: '笔记',
    ...overrides,
  };
}

describe('generatePlanB', () => {
  it('剩余 10 分钟时，只保留 minutes ≤ 10 的任务', () => {
    const result = generatePlanB({
      remainingMinutes: 10,
      constraints,
      originalPlan: [task({ title: '5 分钟任务', minutes: 5 }), task({ title: '15 分钟任务', minutes: 15 })],
    });
    expect(result.tasks).toHaveLength(1);
    expect(result.tasks[0].minutes).toBeLessThanOrEqual(10);
    expect(result.skipped).toBe(1);
  });

  it('Plan B 任务必须仍满足设备约束', () => {
    const result = generatePlanB({
      remainingMinutes: 30,
      constraints,
      originalPlan: [task({ title: '手机任务' }), task({ title: '电脑任务', device: '电脑' })],
    });
    expect(result.tasks.every((item) => item.device === '手机')).toBe(true);
  });

  it('所有任务都超时，返回空列表与说明', () => {
    const result = generatePlanB({
      remainingMinutes: 5,
      constraints,
      originalPlan: [task({ minutes: 15 })],
    });
    expect(result.tasks).toHaveLength(0);
    expect(result.summary).toMatch(/今天先休息|明天继续/);
  });
});
