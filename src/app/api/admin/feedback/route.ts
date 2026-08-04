import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isAdminSession } from '@/lib/admin';
import { listFeedback, resolveFeedback } from '@/lib/admin-feedback';
import { getSession } from '@/lib/auth';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

const ResolveSchema = z.object({
  id: z.string().min(1).max(100),
  status: z.enum(['resolved', 'dismissed']),
});

function forbidden() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function GET() {
  const session = await getSession();
  if (!session || !isAdminSession(session)) return forbidden();
  return NextResponse.json({ feedback: await listFeedback() });
}

export async function PATCH(req: NextRequest) {
  const ip = getClientIp(req);
  const { limited } = await rateLimit(`admin-feedback:ip:${ip}`, 30, 60_000, {
    fallback: 'memory',
  });
  if (limited) {
    return NextResponse.json({ error: '请求过于频繁' }, { status: 429 });
  }

  const session = await getSession();
  if (!session || !isAdminSession(session)) return forbidden();
  const parsed = ResolveSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: '参数无效' }, { status: 400 });
  }

  const updated = await resolveFeedback(
    parsed.data.id,
    parsed.data.status,
    session.userId,
  );
  if (!updated) {
    return NextResponse.json({ error: '反馈已被其他管理员处理' }, { status: 409 });
  }
  return NextResponse.json({ success: true });
}
