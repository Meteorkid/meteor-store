import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getUserEntitlementSummary } from '@/lib/entitlements';
import { PASS_PRODUCT_ID, type PassPlanId } from '@/data/pass';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ hasPass: false, currentPlan: null });
  }

  const { entitlements } = await getUserEntitlementSummary(session.userId, session.email);
  const passEntitlement = entitlements.find((e) => e.productId === PASS_PRODUCT_ID);

  if (!passEntitlement) {
    return NextResponse.json({ hasPass: false, currentPlan: null });
  }

  return NextResponse.json({
    hasPass: true,
    currentPlan: passEntitlement.passPlanId as PassPlanId | null,
    expiresAt: passEntitlement.expiresAt,
  });
}
