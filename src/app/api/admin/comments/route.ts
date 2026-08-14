import { NextRequest, NextResponse } from 'next/server';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { comments } from '@/lib/db/schema';
import { getSession } from '@/lib/auth';
import { isAdminSession } from '@/lib/admin';
import { logAdminAction } from '@/lib/admin-audit';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

function forbidden() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

const PatchSchema = z.object({
  commentId: z.string().min(1),
  action: z.enum(['approve', 'reject']),
});

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || !isAdminSession(session)) return forbidden();

  const status = req.nextUrl.searchParams.get('status') ?? undefined;

  const condition = status ? eq(comments.status, status) : undefined;
  const rows = await db
    .select()
    .from(comments)
    .where(condition)
    .orderBy(desc(comments.createdAt));

  return NextResponse.json({ comments: rows });
}

export async function PATCH(req: NextRequest) {
  const ip = getClientIp(req);
  const { limited } = await rateLimit(`admin-comments:ip:${ip}`, 30, 60_000, {
    fallback: 'memory',
  });
  if (limited) {
    return NextResponse.json({ error: '请求过于频繁' }, { status: 429 });
  }

  const session = await getSession();
  if (!session || !isAdminSession(session)) return forbidden();

  const body = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { commentId, action } = parsed.data;
  const now = new Date().toISOString();
  const status = action === 'approve' ? 'approved' : 'rejected';

  await db
    .update(comments)
    .set({ status, reviewedAt: now })
    .where(eq(comments.id, commentId));

  await logAdminAction(session, {
    action: `comment.${action}`,
    targetType: 'comment',
    targetId: commentId,
    detail: { status },
    ip,
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const ip = getClientIp(req);
  const { limited } = await rateLimit(`admin-comments:ip:${ip}`, 30, 60_000, {
    fallback: 'memory',
  });
  if (limited) {
    return NextResponse.json({ error: '请求过于频繁' }, { status: 429 });
  }

  const session = await getSession();
  if (!session || !isAdminSession(session)) return forbidden();

  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: '缺少 id 参数' }, { status: 400 });
  }

  await db.delete(comments).where(eq(comments.id, id));

  await logAdminAction(session, {
    action: 'comment.delete',
    targetType: 'comment',
    targetId: id,
    ip,
  });

  return NextResponse.json({ success: true });
}