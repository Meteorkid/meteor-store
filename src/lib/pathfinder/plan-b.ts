import type { RealityConstraints } from './contract';
import type { PathfinderTask } from './schema';
import { createTimeShortageEvent, simulateRealityChange, type TaskDecision } from './simulation';

export interface PlanBRequest {
  remainingMinutes: number;
  constraints: RealityConstraints;
  originalPlan: readonly PathfinderTask[];
}

export interface PlanBResult {
  tasks: PathfinderTask[];
  summary: string;
  skipped: number;
  deferred: TaskDecision[];
}

/**
 * 在计划被打断时，从原计划中确定性筛出仍可完成的任务。
 * 预置案例和真实生成共用此逻辑，绝不额外调用模型。
 */
export function generatePlanB({ remainingMinutes, constraints, originalPlan }: PlanBRequest): PlanBResult {
  const simulation = simulateRealityChange(
    originalPlan,
    constraints,
    createTimeShortageEvent(remainingMinutes),
  );

  return {
    tasks: simulation.kept,
    skipped: simulation.deferred.length,
    deferred: simulation.deferred,
    summary: simulation.minimumAction
      ? `今天先休息，明天继续也没关系。${simulation.minimumAction}`
      : `已保留 ${simulation.kept.length} 项仍可在 ${remainingMinutes} 分钟内完成的行动，其余 ${simulation.deferred.length} 项可留到之后。`,
  };
}
