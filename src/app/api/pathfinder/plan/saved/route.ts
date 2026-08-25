import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { deleteUserPlan, getUserPlan, saveUserPlan } from '@/lib/pathfinder/plan-store';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

/**
 * 已保存学习路径的读写。
 *
 * 路径跟账号走，所以三个方法都要求登录。未登录时 GET 返回空而不是 401——
 * 客户端会退回浏览器本地存储，这是未登录用户的正常路径，不是错误。
 */
export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ plan: null });
  return NextResponse.json({ plan: await getUserPlan(session.userId) });
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: '请先登录' }, { status: 401 });

  const ip = getClientIp(request);
  // 编辑路径时每次改动都会保存一次，配额要够日常连点，又不至于被刷
  const { limited } = await rateLimit(`pathfinder-plan:${session.userId}:${ip}`, 60, 60_000, {
    fallback: 'memory',
  });
  if (limited) return NextResponse.json({ error: '操作太频繁，稍后再试' }, { status: 429 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: '请求格式不正确' }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const result = await saveUserPlan(session.userId, {
    plan: payload.plan,
    completedTaskIds: payload.completedTaskIds,
    pinnedTaskIds: payload.pinnedTaskIds,
    profile: payload.profile,
  });
  if (!result.ok) return NextResponse.json({ error: result.reason }, { status: 400 });

  return NextResponse.json({ plan: result.state });
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: '请先登录' }, { status: 401 });

  const ip = getClientIp(request);
  const { limited } = await rateLimit(`pathfinder-plan-del:${session.userId}:${ip}`, 20, 60_000, {
    fallback: 'memory',
  });
  if (limited) return NextResponse.json({ error: '操作太频繁，稍后再试' }, { status: 429 });

  await deleteUserPlan(session.userId);
  return NextResponse.json({ ok: true });
}
