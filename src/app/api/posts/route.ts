import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { isAdminSession } from '@/lib/admin';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { sendAdminAlert } from '@/lib/email';
import { createPost, getPostsByAuthor } from '@/lib/posts';
import { PostSubmissionSchema } from '@/lib/post-validation';
import { revalidatePublishedPaths } from '@/lib/revalidate';

export { PostSubmissionSchema } from '@/lib/post-validation';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  const posts = await getPostsByAuthor(session.userId);
  // 只回列表需要的字段，正文可能很长
  return NextResponse.json({
    posts: posts.map(({ content, ...rest }) => {
      void content;
      return rest;
    }),
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  // 投稿要写库、要发通知，且会占用审核精力，按人限流
  const ip = getClientIp(req);
  const { limited } = await rateLimit(`post-submit:${session.userId}:${ip}`, 10, 3_600_000, {
    fallback: 'memory',
  });
  if (limited) {
    return NextResponse.json({ error: '投稿太频繁了，稍后再来' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = PostSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { submit, ...data } = parsed.data;

  const isAdmin = isAdminSession(session);

  const created = await createPost({
    authorId: session.userId,
    ...data,
    eventDate: data.eventDate ?? null,
    status: submit ? (isAdmin ? 'published' : 'pending') : 'draft',
  });

  if (submit && !isAdmin) {
    // 先审后发：没有通知，投稿就会一直躺在队列里没人知道
    void sendAdminAlert('新的投稿待审核', {
      标题: data.title,
      分区: data.sectionId,
      作者: session.name || session.email,
      查看: `/admin/review`,
    });
  }

  // 管理员直接发布时刷新公开缓存
  if (submit && isAdmin) {
    try {
      revalidatePublishedPaths();
    } catch (error) {
      console.error('published post cache revalidation failed:', error);
    }
  }

  return NextResponse.json({
    success: true,
    id: created.id,
    status: submit ? (isAdmin ? 'published' : 'pending') : 'draft',
  });
}
