import { describe, expect, it } from 'vitest';
import { repair, validate, type RealityConstraints } from '../contract';
import type { PathfinderTask } from '../schema';

const constraints: RealityConstraints = {
  dailyMinutes: 20,
  budget: 0,
  device: '仅手机',
  network: '流量有限',
  hasMentor: false,
};

function task(overrides: Partial<PathfinderTask> = {}): PathfinderTask {
  return {
    day: 1,
    title: '完成一项学习任务',
    minutes: 15,
    cost: 0,
    device: '手机',
    network: '普通',
    evidence: '笔记',
    ...overrides,
  };
}

describe('Reality Contract validate', () => {
  it('每日 20 分钟时，60 分钟任务违规', () => {
    expect(validate([task({ minutes: 60 })], constraints)).toContainEqual(
      expect.objectContaining({ rule: 'time' }),
    );
  });

  it('预算 0 时，付费任务违规', () => {
    expect(validate([task({ cost: 30 })], constraints)).toContainEqual(
      expect.objectContaining({ rule: 'cost' }),
    );
  });

  it('仅手机时，电脑专属任务违规', () => {
    expect(validate([task({ device: '电脑' })], constraints)).toContainEqual(
      expect.objectContaining({ rule: 'device' }),
    );
  });

  it('弱网时，稳定网络任务违规', () => {
    expect(validate([task({ network: '稳定' })], constraints)).toContainEqual(
      expect.objectContaining({ rule: 'network' }),
    );
  });
});

describe('Reality Contract repair', () => {
  it('时间违规可压缩到 dailyMinutes', () => {
    const tasks = [task({ minutes: 60 })];
    const { repaired } = repair(tasks, constraints, validate(tasks, constraints));
    expect(repaired[0].minutes).toBeLessThanOrEqual(20);
  });

  it('成本违规不可压缩时删除任务', () => {
    const tasks = [task({ cost: 30 })];
    const { repaired, removed } = repair(tasks, constraints, validate(tasks, constraints));
    expect(repaired).toHaveLength(0);
    expect(removed).toHaveLength(1);
  });

  it('设备违规直接删除，不尝试降级', () => {
    const tasks = [task({ device: '电脑' })];
    const { repaired, removed } = repair(tasks, constraints, validate(tasks, constraints));
    expect(repaired).toHaveLength(0);
    expect(removed).toHaveLength(1);
  });
});
