import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getUserEntitlements } from '@/lib/entitlements';

/**
 * GET /api/entitlements — 返回当前登录用户已获得访问权的产品列表。
 * 供「我的产品」页与付费门控组件使用。数据只对本人可见，无需限流。
 */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  const entitlements = await getUserEntitlements(session.userId, session.email);

  return NextResponse.json({ entitlements });
}