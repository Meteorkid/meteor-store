import { NextResponse } from 'next/server';
import { getSession, type SessionPayload } from './auth';
import { getUserEntitlements } from './entitlements';
import {
  TOLLOW_PRODUCT_ID,
  normalizeTollowPlanId,
  type TollowAccessLevel,
} from './tollow-plans';

export type TollowAccessSource = 'none' | 'order' | 'invite' | 'pass' | 'admin';

export type TollowAccess = {
  level: TollowAccessLevel;
  source: TollowAccessSource;
};

export async function getTollowAccess(userId: string, email: string): Promise<TollowAccess> {
  const entitlement = (await getUserEntitlements(userId, email))
    .find((item) => item.productId === TOLLOW_PRODUCT_ID);
  if (!entitlement) return { level: 'none', source: 'none' };

  const level = normalizeTollowPlanId(entitlement.planId, entitlement.planName) ?? 'free';
  const source: TollowAccessSource = entitlement.viaPass
    ? 'pass'
    : entitlement.planName === '管理员'
      ? 'admin'
      : entitlement.billingPeriod === 'invite'
        ? 'invite'
        : 'order';
  return { level, source };
}

type TollowProResult =
  | { ok: true; session: SessionPayload; access: TollowAccess }
  | { ok: false; response: NextResponse };

/** Tollow 云端能力的统一服务端关卡；业务路由不得接受客户端传入的套餐等级。 */
export async function requireTollowPro(): Promise<TollowProResult> {
  const session = await getSession();
  if (!session) {
    return {
      ok: false,
      response: NextResponse.json({ error: '请先登录' }, { status: 401 }),
    };
  }

  const access = await getTollowAccess(session.userId, session.email);
  if (access.level !== 'pro') {
    return {
      ok: false,
      response: NextResponse.json(
        { error: '需要 Tollow Pro', code: 'TOLLOW_PRO_REQUIRED' },
        { status: 403 },
      ),
    };
  }
  return { ok: true, session, access };
}
