import { NextRequest, NextResponse } from 'next/server';
import { and, eq, asc } from 'drizzle-orm';
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

/** 公开评论返回的字段——不包含 authorId(内部用户 ID)、status、reviewedAt 等内部字段 */
const publicCommentColumns = {
  id: comments.id,
  targetId: comments.targetId,
  authorName: comments.authorName,
  authorAvatar: comments.authorAvatar,
  content: comments.content,
  parentId: comments.parentId,
  createdAt: comments.createdAt,
} as const;

export async function GET(req: NextRequest) {
  const targetId = req.nextUrl.searchParams.get('targetId');
  if (!targetId) {
    return NextResponse.json({ error: '缺少 targetId' }, { status: 400 });
  }

  // 只返回 approved 评论——管理员审核 pending/rejected 后,这些评论对公众不再可见
  const rows = await db
    .select(publicCommentColumns)
    .from(comments)
    .where(and(eq(comments.targetId, targetId), eq(comments.status, 'approved')))
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

  // 校验 parentId:必须存在、属于同一 targetId、且是顶层评论(防止无限嵌套)
  // 只允许回复顶层评论(parentId 为 null),不允许对回复再回复——限制深度为 2 层
  if (parsed.data.parentId) {
    const [parent] = await db
      .select({ targetId: comments.targetId, parentId: comments.parentId })
      .from(comments)
      .where(eq(comments.id, parsed.data.parentId))
      .limit(1);

    if (!parent) {
      return NextResponse.json({ error: '回复的评论不存在' }, { status: 400 });
    }
    if (parent.targetId !== parsed.data.targetId) {
      // 防止跨文章回复:A 文章的评论不能用 B 文章的 parentId
      return NextResponse.json({ error: '回复的评论不属于该文章' }, { status: 400 });
    }
    if (parent.parentId !== null) {
      // 父评论本身就是回复,不允许对回复再回复(限制深度)
      return NextResponse.json({ error: '不能回复子评论' }, { status: 400 });
    }
  }

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
      authorName: user?.name || session.name || session.email.split('@')[0],
      authorAvatar: user?.avatarUrl ?? null,
      content: parsed.data.content,
      parentId: parsed.data.parentId ?? null,
      createdAt: now,
    },
  });
}
