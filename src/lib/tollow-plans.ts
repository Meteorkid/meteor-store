export const TOLLOW_PRODUCT_ID = 'tollow';

export type TollowAccessLevel = 'none' | 'free' | 'pro';
export type TollowPlanId = Exclude<TollowAccessLevel, 'none'>;

const TOLLOW_PLAN_RANK: Record<TollowAccessLevel, number> = {
  none: 0,
  free: 1,
  pro: 2,
};

/** 历史订单没有 planId，必须按既有套餐名兼容，避免老 Pro 被降级。 */
export function normalizeTollowPlanId(
  planId: string | null | undefined,
  planName: string | null | undefined,
): TollowPlanId | null {
  const stableId = planId?.trim().toLowerCase();
  if (stableId === 'pro') return 'pro';
  if (stableId === 'free' || stableId === 'basic') return 'free';

  const legacyName = planName?.trim().toLowerCase();
  if (legacyName === 'pro') return 'pro';
  if (legacyName === 'free' || legacyName === 'basic') return 'free';
  return null;
}

export function getTollowPlanRank(level: TollowAccessLevel | null): number {
  return level ? TOLLOW_PLAN_RANK[level] : 0;
}
