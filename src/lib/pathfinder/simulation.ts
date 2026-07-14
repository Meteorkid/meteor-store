import { validate, type RealityConstraints, type Violation } from './contract';
import type { PathfinderTask } from './schema';

export type RealityEvent =
  | {
    id: 'time-shortage';
    kind: 'time';
    label: string;
    description: string;
    remainingMinutes: number;
  }
  | {
    id: 'phone-only';
    kind: 'device';
    label: string;
    description: string;
  }
  | {
    id: 'low-data';
    kind: 'network';
    label: string;
    description: string;
  }
  | {
    id: 'zero-budget';
    kind: 'budget';
    label: string;
    description: string;
  };

export interface TaskDecision {
  task: PathfinderTask;
  status: 'kept' | 'deferred';
  reasons: Array<Pick<Violation, 'rule' | 'message'>>;
}

export interface RealitySimulation {
  event: RealityEvent;
  effectiveConstraints: RealityConstraints;
  remainingMinutes: number;
  kept: PathfinderTask[];
  deferred: TaskDecision[];
  decisions: TaskDecision[];
  summary: string;
  minimumAction: string | null;
}

/** 创建“可用时间突然缩短”的现实变化。 */
export function createTimeShortageEvent(remainingMinutes: number): Extract<RealityEvent, { kind: 'time' }> {
  return {
    id: 'time-shortage',
    kind: 'time',
    label: `本周只剩 ${remainingMinutes} 分钟`,
    description: '不重新许愿，只保住仍能做完的一步。',
    remainingMinutes,
  };
}

/** 只返回会让用户条件更严格的变化，避免展示没有实际效果的按钮。 */
export function getAvailableRealityEvents(constraints: RealityConstraints): RealityEvent[] {
  const timeLimit = constraints.dailyMinutes > 10 ? 10 : 5;
  const events: RealityEvent[] = [createTimeShortageEvent(timeLimit)];

  if (constraints.device !== '仅手机') {
    events.push({
      id: 'phone-only',
      kind: 'device',
      label: '临时只剩手机',
      description: '电脑任务先暂停，保留手机上能完成的行动。',
    });
  }

  if (constraints.network !== '流量有限') {
    events.push({
      id: 'low-data',
      kind: 'network',
      label: '流量突然不够',
      description: '稳定网络任务先暂停，避免把流量压力留给你。',
    });
  }

  if (constraints.budget > 0) {
    events.push({
      id: 'zero-budget',
      kind: 'budget',
      label: '这周预算归零',
      description: '付费任务不再被当作可行选项。',
    });
  }

  return events;
}

/** 将某个现实变化收紧为可复用的约束集合。 */
export function applyRealityEvent(
  constraints: RealityConstraints,
  event: RealityEvent,
): { constraints: RealityConstraints; remainingMinutes: number } {
  switch (event.kind) {
    case 'time':
      return {
        constraints: { ...constraints, dailyMinutes: Math.min(constraints.dailyMinutes, event.remainingMinutes) },
        remainingMinutes: event.remainingMinutes,
      };
    case 'device':
      return {
        constraints: { ...constraints, device: '仅手机' },
        remainingMinutes: constraints.dailyMinutes,
      };
    case 'network':
      return {
        constraints: { ...constraints, network: '流量有限' },
        remainingMinutes: constraints.dailyMinutes,
      };
    case 'budget':
      return {
        constraints: { ...constraints, budget: 0 },
        remainingMinutes: constraints.dailyMinutes,
      };
  }
}

/**
 * 将“现实变化”应用到整条路径，并给出每项任务保留或暂缓的明确原因。
 *
 * 该函数是纯函数，不调用模型；预置案例与真实生成路径共用同一套裁决。
 */
export function simulateRealityChange(
  originalPlan: readonly PathfinderTask[],
  constraints: RealityConstraints,
  event: RealityEvent,
): RealitySimulation {
  const applied = applyRealityEvent(constraints, event);
  const decisions = originalPlan.map((task) => {
    const reasons = validate([task], applied.constraints).map(({ rule, message }) => ({ rule, message }));

    return {
      task,
      status: reasons.length === 0 ? 'kept' : 'deferred',
      reasons,
    } satisfies TaskDecision;
  });
  const kept = decisions.filter((decision) => decision.status === 'kept').map((decision) => decision.task);
  const deferred = decisions.filter((decision) => decision.status === 'deferred');

  if (kept.length === 0) {
    return {
      event,
      effectiveConstraints: applied.constraints,
      remainingMinutes: applied.remainingMinutes,
      kept,
      deferred,
      decisions,
      summary: '这次变化后，没有任务能被诚实地保留。先不勉强完成原计划。',
      minimumAction: '保留 5 分钟回看目标，并写下下一次只准备补的一项能力。',
    };
  }

  return {
    event,
    effectiveConstraints: applied.constraints,
    remainingMinutes: applied.remainingMinutes,
    kept,
    deferred,
    decisions,
    summary: `现实变化后，保住了 ${kept.length} 项仍可完成的行动；${deferred.length} 项先暂缓。`,
    minimumAction: null,
  };
}
