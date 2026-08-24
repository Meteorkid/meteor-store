import { PathfinderApiResponseSchema } from './schema';

export type PathfinderPlanPhase = 'prepare' | 'practice' | 'real-action' | 'deliver' | 'review';

export interface PathfinderPlanTaskView {
  id: string;
  action: string;
  estimatedMinutes: number;
  itemId: string;
  evidence: string;
  alternative: string;
  deadlineAt?: string;
  deadlineDate?: string;
}

export interface PathfinderPlanWeekView {
  week: number;
  phase: PathfinderPlanPhase;
  title: string;
  objective: string;
  estimatedMinutes: number;
  tasks: PathfinderPlanTaskView[];
}

export interface PathfinderGeneratedPlanView {
  version: 2;
  title: string;
  summary: string;
  durationWeeks: number;
  generatedAt: string;
  warnings: string[];
  weeks: PathfinderPlanWeekView[];
}

export type PathfinderApiResponse =
  | { kind: 'plan'; source: 'deterministic'; plan: PathfinderGeneratedPlanView }
  | { kind: 'safety'; source: 'safety'; message: string; actions: string[] };

export interface StoredPathfinderPlan {
  version: 2;
  savedAt: string;
  response: PathfinderApiResponse;
  completedTaskIds: string[];
}

export const PATHFINDER_PLAN_STORAGE_KEY = 'meteor-pathfinder:plan:v2';

export function pathfinderScrollBehavior(prefersReducedMotion: boolean): ScrollBehavior {
  return prefersReducedMotion ? 'auto' : 'smooth';
}

export function parseStoredPathfinderPlan(raw: string | null): StoredPathfinderPlan | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<StoredPathfinderPlan>;
    if (
      value.version !== 2 ||
      typeof value.savedAt !== 'string' ||
      !Number.isFinite(Date.parse(value.savedAt)) ||
      !value.response ||
      !PathfinderApiResponseSchema.safeParse(value.response).success ||
      !Array.isArray(value.completedTaskIds) ||
      !value.completedTaskIds.every((id) => typeof id === 'string')
    ) {
      return null;
    }
    return value as StoredPathfinderPlan;
  } catch {
    return null;
  }
}

export function withToggledTask(
  completedTaskIds: readonly string[],
  taskId: string,
) {
  return completedTaskIds.includes(taskId)
    ? completedTaskIds.filter((id) => id !== taskId)
    : [...completedTaskIds, taskId];
}
