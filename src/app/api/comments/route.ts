import { NextRequest, NextResponse } from 'next/server';
import { eq, asc } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { comments, users } from '@/lib/db/schema';
import { getSession } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const CommentSchema = z.object({
  targetId: z.string().min(1).max(200),
  content: z.string().trim().min(1, '评论不能为空').max(500, '评论不要超过 500 字'),
  parentId: z.string().nullable().optional(),
});

export async function GET(req: NextRequest) {
  const targetId = req.nextUrl.searchParams.get('targetId');
  if (!targetId) {
    return NextResponse.json({ error: '缺少 targetId' }, { status: 400 });
  }

  const rows = await db
    .select()
    .from(comments)
    .where(eq(comments.targetId, targetId))
    .orderBy(asc(comments.createdAt));

  return NextResponse.json({ comments: rows });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  const ip = getClientIp(req);
  const { limited } = await rateLimit(`comment:${session.userId}:${ip}`, 10, 60_000, {
    fallback: 'memory',
  });
  if (limited) {
    return NextResponse.json({ error: '评论太频繁了，稍后再试' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = CommentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const [user] = await db
    .select({ name: users.name, avatarUrl: users.avatarUrl })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db.insert(comments).values({
    id,
    targetId: parsed.data.targetId,
    authorId: session.userId,
    authorName: user?.name || session.name || session.email.split('@')[0],
    authorAvatar: user?.avatarUrl ?? null,
    content: parsed.data.content,
    parentId: parsed.data.parentId ?? null,
    createdAt: now,
  });

  return NextResponse.json({
    comment: {
      id,
      targetId: parsed.data.targetId,
      authorId: session.userId,
      authorName: user?.name || session.name || session.email.split('@')[0],
      authorAvatar: user?.avatarUrl ?? null,
      content: parsed.data.content,
      parentId: parsed.data.parentId ?? null,
      createdAt: now,
    },
  });
}
