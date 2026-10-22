import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { assertMatchingOrigin } from '@/lib/csrf';
import { deleteUserPlan, getUserPlan, saveUserPlan } from '@/lib/pathfinder/plan-store';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';
const json = (data: unknown, status = 200) => NextResponse.json(data, {
  status, headers: { 'Cache-Control': 'no-store' },
});

export async function GET() {
  const session = await getSession();
  if (!session) return json({ userId: null, plan: null });
  try { return json({ userId: session.userId, plan: await getUserPlan(session.userId) }); }
  catch { return json({ error: '无法读取学习路径，请稍后重试' }, 503); }
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) return json({ error: '请先登录' }, 401);
  if (assertMatchingOrigin(request)) return json({ error: 'Forbidden' }, 403);
  if (request.headers.get('x-pathfinder-user') !== session.userId) return json({ error: '账号已变化，请刷新页面' }, 409);
  const { limited } = await rateLimit(`pathfinder-plan:${session.userId}:${getClientIp(request)}`, 60, 60_000, { fallback: 'memory' });
  if (limited) return json({ error: '操作太频繁，稍后再试' }, 429);
  const text = await request.text();
  if (text.length > 100_000) return json({ error: '请求过大' }, 413);
  let payload;
  try { payload = JSON.parse(text); } catch { return json({ error: '请求格式不正确' }, 400); }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return json({ error: '请求格式不正确' }, 400);
  try {
    const result = await saveUserPlan(session.userId, {
      plan: payload.plan, completedTaskIds: payload.completedTaskIds,
      pinnedTaskIds: payload.pinnedTaskIds, profile: payload.profile,
    }, payload.importOnly === true);
    if (!result.ok) return json({ error: result.reason }, result.conflict ? 409 : 400);
    return json({ userId: session.userId, plan: result.state });
  } catch { return json({ error: '未能保存学习路径，请重试' }, 503); }
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session) return json({ error: '请先登录' }, 401);
  if (assertMatchingOrigin(request)) return json({ error: 'Forbidden' }, 403);
  if (request.headers.get('x-pathfinder-user') !== session.userId) return json({ error: '账号已变化，请刷新页面' }, 409);
  const { limited } = await rateLimit(`pathfinder-plan-del:${session.userId}:${getClientIp(request)}`, 20, 60_000, { fallback: 'memory' });
  if (limited) return json({ error: '操作太频繁，稍后再试' }, 429);
  try {
    await deleteUserPlan(session.userId);
    return json({ userId: session.userId, ok: true });
  } catch { return json({ error: '未能清空学习路径，请重试' }, 503); }
}
