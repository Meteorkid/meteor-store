import { PathfinderApiResponseSchema, PathfinderPlanRequestSchema } from './schema';
import { pruneTaskIds } from './plan-edit';
import type { PathfinderApiResponse } from './plan-view';
import type { PathfinderFormValue } from '@/components/pathfinder/PathfinderForm';

export interface OwnedPathfinderPlan {
  version: 3;
  userId: string | null;
  savedAt: string;
  response: PathfinderApiResponse;
  completedTaskIds: string[];
  pinnedTaskIds: string[];
  profile: PathfinderFormValue | null;
}

export const planStorageKey = (userId: string | null) =>
  `meteor-pathfinder:plan:v3:${userId === null ? 'guest' : `user:${encodeURIComponent(userId)}`}`;

export function parsePlanProfile(value: unknown): PathfinderFormValue | null {
  const parsed = PathfinderPlanRequestSchema.safeParse(value);
  return parsed.success ? { profile: parsed.data.profile, preferredItemId: parsed.data.preferredItemId } : null;
}

function planIds(value: unknown, response: PathfinderApiResponse): string[] {
  const ids = Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string').slice(0, 200) : [];
  return response.kind === 'plan' ? pruneTaskIds(response.plan, ids) : [];
}

export function parseOwnedPlan(raw: string | null, userId: string | null): OwnedPathfinderPlan | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    const parsed = PathfinderApiResponseSchema.safeParse(value?.response);
    if (value?.version !== 3 || value.userId !== userId || !parsed.success
      || typeof value.savedAt !== 'string' || !Number.isFinite(Date.parse(value.savedAt))) return null;
    return { version: 3, userId, savedAt: value.savedAt, response: parsed.data,
      completedTaskIds: planIds(value.completedTaskIds, parsed.data),
      pinnedTaskIds: planIds(value.pinnedTaskIds, parsed.data), profile: parsePlanProfile(value.profile) };
  } catch { return null; }
}

export function assertPlanOwner(value: unknown, userId: string | null): asserts value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || !('userId' in value) || value.userId !== userId) {
    throw new Error('Account changed');
  }
}

export function parseRemotePlan(value: unknown, userId: string): OwnedPathfinderPlan | null {
  assertPlanOwner(value, userId);
  if (value.plan === null) return null;
  if (!value.plan || typeof value.plan !== 'object') throw new Error('Invalid saved plan');
  const remote = value.plan as Record<string, unknown>;
  const draft = parseOwnedPlan(JSON.stringify({ version: 3, userId, savedAt: remote.updatedAt,
    response: { kind: 'plan', source: 'deterministic', plan: remote.plan },
    completedTaskIds: remote.completedTaskIds, pinnedTaskIds: remote.pinnedTaskIds, profile: remote.profile }), userId);
  if (!draft) throw new Error('Invalid saved plan');
  return draft;
}
