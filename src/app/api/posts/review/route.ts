import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin';
import { rateLimit } from '@/lib/rate-limit';
import { getPostById, reviewPost } from '@/lib/posts';
import { getSectionById } from '@/data/blog-sections';

export const ReviewSchema = z.object({
  postId: z.string().min(1),
  approve: z.boolean(),
  note: z.string().trim().max(500).optional(),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }
  if (!isAdminEmail(session.email)) {
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

  const { postId, approve, note } = parsed.data;

  if (!approve && !note) {
    return NextResponse.json({ error: '驳回需要写明理由' }, { status: 400 });
  }

  const changed = await reviewPost({
    postId,
    reviewerId: session.userId,
    approve,
    note,
  });

  if (!changed) {
    // 条件更新没命中：要么 id 不存在，要么已经被处理过
    return NextResponse.json({ error: '这篇已经处理过了' }, { status: 409 });
  }

  if (approve) {
    // 通过即发布。博客列表是静态的，这里按需失效，让新文章立刻可见，
    // 同时不必把整个博客改成动态渲染。
    const post = await getPostById(postId);
    revalidatePath('/blog');
    revalidatePath('/blog/tags');
    if (post) {
      const section = getSectionById(post.sectionId);
      if (section) revalidatePath(`/blog/section/${section.slug}`);
      post.tags.forEach((tag) => revalidatePath(`/blog/tag/${encodeURIComponent(tag)}`));
    }
  }

  return NextResponse.json({ success: true });
}
