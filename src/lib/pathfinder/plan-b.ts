import { validate, type RealityConstraints } from './contract';
import type { PathfinderTask } from './schema';

export interface PlanBRequest {
  remainingMinutes: number;
  constraints: RealityConstraints;
  originalPlan: readonly PathfinderTask[];
}

export interface PlanBResult {
  tasks: PathfinderTask[];
  summary: string;
  skipped: number;
}

/**
 * 在计划被打断时，从原计划中确定性筛出仍可完成的任务。
 * 预置案例和真实生成共用此逻辑，绝不额外调用模型。
 */
export function generatePlanB({ remainingMinutes, constraints, originalPlan }: PlanBRequest): PlanBResult {
  const tasks = originalPlan.filter((task) => (
    task.minutes <= remainingMinutes && validate([task], constraints).length === 0
  ));
  const skipped = originalPlan.length - tasks.length;

  if (tasks.length === 0) {
    return {
      tasks: [],
      skipped,
      summary: '今天先休息，明天继续也没关系。请保留 5 分钟，回看目标并选择一项最小行动。',
    };
  }

  return {
    tasks,
    skipped,
    summary: `已保留 ${tasks.length} 项仍可在 ${remainingMinutes} 分钟内完成的行动，其余 ${skipped} 项可留到之后。`,
  };
}
