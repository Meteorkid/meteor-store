import { describe, expect, it } from 'vitest';
import { validate, type RealityConstraints } from '../contract';
import type { PathfinderTask } from '../schema';
import {
  createTimeShortageEvent,
  getAvailableRealityEvents,
  simulateRealityChange,
  type RealityEvent,
} from '../simulation';

const constraints: RealityConstraints = {
  dailyMinutes: 30,
  budget: 50,
  device: '手机和电脑',
  network: '普通网络',
  hasMentor: false,
};

function task(overrides: Partial<PathfinderTask> = {}): PathfinderTask {
  return {
    day: 1,
    title: '完成一项学习任务',
    minutes: 10,
    cost: 0,
    device: '手机',
    network: '普通',
    evidence: '笔记',
    ...overrides,
  };
}

function event(id: RealityEvent['id']): RealityEvent {
  const found = getAvailableRealityEvents(constraints).find((item) => item.id === id);
  if (!found) throw new Error(`缺少事件：${id}`);
  return found;
}

describe('simulateRealityChange', () => {
  it('时间缩短后，只保留不超过剩余时间的任务，并说明超时原因', () => {
    const result = simulateRealityChange(
      [task({ title: '5 分钟任务', minutes: 5 }), task({ title: '15 分钟任务', minutes: 15 })],
      constraints,
      createTimeShortageEvent(10),
    );

    expect(result.kept).toHaveLength(1);
    expect(result.kept[0].minutes).toBeLessThanOrEqual(10);
    expect(result.deferred[0].reasons).toContainEqual(expect.objectContaining({ rule: 'time' }));
  });

  it('临时只剩手机时，电脑任务会被暂缓并说明设备原因', () => {
    const result = simulateRealityChange(
      [task({ title: '手机任务' }), task({ title: '电脑任务', device: '电脑' })],
      constraints,
      event('phone-only'),
    );

    expect(result.kept.map((item) => item.title)).toEqual(['手机任务']);
    expect(result.deferred[0].reasons).toContainEqual(expect.objectContaining({ rule: 'device' }));
  });

  it('预算归零后，付费任务会被暂缓并说明成本原因', () => {
    const result = simulateRealityChange(
      [task({ title: '免费任务' }), task({ title: '付费任务', cost: 20 })],
      constraints,
      event('zero-budget'),
    );

    expect(result.kept.map((item) => item.title)).toEqual(['免费任务']);
    expect(result.deferred[0].reasons).toContainEqual(expect.objectContaining({ rule: 'cost' }));
  });

  it('流量有限时，稳定网络任务会被暂缓并说明网络原因', () => {
    const result = simulateRealityChange(
      [task({ title: '低流量任务', network: '低流量' }), task({ title: '稳定网络任务', network: '稳定' })],
      constraints,
      event('low-data'),
    );

    expect(result.kept.map((item) => item.title)).toEqual(['低流量任务']);
    expect(result.deferred[0].reasons).toContainEqual(expect.objectContaining({ rule: 'network' }));
  });

  it('所有保留任务仍通过收紧后的 Reality Contract', () => {
    const result = simulateRealityChange(
      [task({ title: '手机任务' }), task({ title: '电脑任务', device: '电脑' })],
      constraints,
      event('phone-only'),
    );

    expect(result.kept.every((item) => validate([item], result.effectiveConstraints).length === 0)).toBe(true);
  });

  it('没有可保留任务时，返回诚实的最低成本动作', () => {
    const result = simulateRealityChange(
      [task({ minutes: 15 })],
      constraints,
      createTimeShortageEvent(5),
    );

    expect(result.kept).toHaveLength(0);
    expect(result.minimumAction).toMatch(/保留 5 分钟/);
  });
});
