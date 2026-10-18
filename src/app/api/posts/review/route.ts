import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { isAdminSession } from '@/lib/admin';
import { logAdminAction } from '@/lib/admin-audit';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { reviewPost } from '@/lib/posts';
import { revalidatePublishedPaths } from '@/lib/revalidate';

export const ReviewSchema = z.object({
  postId: z.string().min(1),
  expectedUpdatedAt: z.string().datetime({ precision: 3 }),
  approve: z.boolean(),
  note: z.string().trim().max(500).optional(),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }
  if (!isAdminSession(session)) {
    // 不透露「这个接口存在但你没权限」，统一按不存在处理
    return NextResponse.json({ error: '没有权限' }, { status: 403 });
  }

  const { limited } = await rateLimit(`post-review:${session.userId}`, 60, 60_000, {
    fallback: 'memory',
  });
  if (limited) {
    return NextResponse.json({ error: '操作过于频繁' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = ReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { postId, expectedUpdatedAt, approve, note } = parsed.data;

  if (!approve && !note) {
    return NextResponse.json({ error: '驳回需要写明理由' }, { status: 400 });
  }

  const changed = await reviewPost({
    postId,
    expectedUpdatedAt,
    reviewerId: session.userId,
    approve,
    note,
  });

  if (!changed) {
    // 版本或状态已变化，不能把旧页面上的决定应用到新稿件。
    return NextResponse.json({ error: '稿件已变更或已处理，请重新加载后审核' }, { status: 409 });
  }

  await logAdminAction(session, {
    action: approve ? 'post.approve' : 'post.reject',
    targetType: 'post',
    targetId: postId,
    detail: note ? { note } : undefined,
    ip: getClientIp(req),
  });

  if (approve) {
    // 跨区文章会出现在多个分区；统一失效全部公开路径，避免只刷新主分区。
    try {
      revalidatePublishedPaths();
    } catch (error) {
      console.error('published post cache revalidation failed:', error);
    }
  }

  return NextResponse.json({ success: true });
}
