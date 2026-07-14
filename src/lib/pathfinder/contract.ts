import type { PathfinderInput, PathfinderTask } from './schema';

/** 用于校验任务是否可在用户现实条件下完成的最小约束集合。 */
export interface RealityConstraints {
  dailyMinutes: number;
  budget: number;
  device: '仅手机' | '手机和电脑' | '电脑';
  network: '流量有限' | '普通网络' | '稳定网络';
  hasMentor: boolean;
}

export interface Violation {
  taskIndex: number;
  rule: 'time' | 'cost' | 'device' | 'network';
  message: string;
}

/** 将通过表单校验的输入转换为规则层所需的现实条件。 */
export function toRealityConstraints(input: PathfinderInput): RealityConstraints {
  return {
    dailyMinutes: input.dailyMinutes,
    budget: input.budget,
    device: input.device,
    network: input.network,
    hasMentor: input.hasMentor,
  };
}

/**
 * 验证任务是否违背用户的现实约束。
 *
 * 这是一个纯函数：不依赖模型、网络或环境变量，因此可直接作为工程证据测试。
 */
export function validate(tasks: readonly PathfinderTask[], constraints: RealityConstraints): Violation[] {
  const violations: Violation[] = [];

  tasks.forEach((task, taskIndex) => {
    if (task.minutes > constraints.dailyMinutes) {
      violations.push({
        taskIndex,
        rule: 'time',
        message: `任务耗时 ${task.minutes} 分钟，超过每天可用的 ${constraints.dailyMinutes} 分钟。`,
      });
    }
    if (task.cost > constraints.budget) {
      violations.push({
        taskIndex,
        rule: 'cost',
        message: `任务成本 ${task.cost} 元，超过预算 ${constraints.budget} 元。`,
      });
    }
    if (task.device === '电脑' && constraints.device === '仅手机') {
      violations.push({
        taskIndex,
        rule: 'device',
        message: '该任务需要电脑，但当前条件只有手机。',
      });
    }
    if (task.network === '稳定' && constraints.network === '流量有限') {
      violations.push({
        taskIndex,
        rule: 'network',
        message: '该任务需要稳定网络，但当前网络流量有限。',
      });
    }
  });

  return violations;
}

/**
 * 对可修复的任务作最小调整；成本和设备不满足时直接移除，避免伪造可行性。
 */
export function repair(
  tasks: readonly PathfinderTask[],
  constraints: RealityConstraints,
  violations: readonly Violation[],
): { repaired: PathfinderTask[]; removed: PathfinderTask[] } {
  const rulesByTask = new Map<number, Set<Violation['rule']>>();
  for (const violation of violations) {
    const rules = rulesByTask.get(violation.taskIndex) ?? new Set<Violation['rule']>();
    rules.add(violation.rule);
    rulesByTask.set(violation.taskIndex, rules);
  }

  const repaired: PathfinderTask[] = [];
  const removed: PathfinderTask[] = [];

  tasks.forEach((task, index) => {
    const rules = rulesByTask.get(index);
    if (!rules) {
      repaired.push(task);
      return;
    }

    if (rules.has('cost') || rules.has('device')) {
      removed.push(task);
      return;
    }

    repaired.push({
      ...task,
      minutes: rules.has('time') ? Math.min(task.minutes, constraints.dailyMinutes) : task.minutes,
      network: rules.has('network') ? '普通' : task.network,
    });
  });

  return { repaired, removed };
}
