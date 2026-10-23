import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getUserEntitlementSummary } from '@/lib/entitlements';

function privateJson(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return privateJson({ userId: null, hasPass: false, currentPlan: null, expiresAt: null });
    }
    const { activePass } = await getUserEntitlementSummary(session.userId, session.email);
    if (activePass && !activePass.planId) {
      return privateJson({ error: '会员档位暂时无法确认，请稍后重试' }, 503);
    }
    return privateJson({
      userId: session.userId,
      hasPass: activePass !== null,
      currentPlan: activePass?.planId ?? null,
      expiresAt: activePass?.expiresAt ?? null,
    });
  } catch {
    return privateJson({ error: '会员状态暂时无法读取，请稍后重试' }, 503);
  }
}
