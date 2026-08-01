import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { sendAdminAlert } from '@/lib/email';
import { createPost, getPostsByAuthor } from '@/lib/posts';
import { blogSections } from '@/data/blog-sections';
import { revalidatePublishedPaths } from '@/lib/revalidate';

const SECTION_IDS = blogSections.map((s) => s.id) as [string, ...string[]];

export const PostSubmissionSchema = z.object({
  title: z.string().trim().min(4, '标题太短了').max(80, '标题不要超过 80 字'),
  excerpt: z.string().trim().min(10, '摘要至少 10 个字').max(200, '摘要不要超过 200 字'),
  content: z.string().trim().min(200, '正文至少 200 字').max(50_000, '正文太长了'),
  sectionId: z.enum(SECTION_IDS),
  tags: z.array(z.string().trim().min(1).max(24)).max(8, '最多 8 个标签').default([]),
  // 存草稿还是提交审核
  submit: z.boolean().default(false),
});

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  const posts = await getPostsByAuthor(session.userId);
  // 只回列表需要的字段，正文可能很长
  return NextResponse.json({
    posts: posts.map(({ content: _content, ...rest }) => rest),
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

  const isAdmin = isAdminEmail(session.email);

  const id = await createPost({
    authorId: session.userId,
    ...data,
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
    revalidatePublishedPaths();
  }

  return NextResponse.json({ success: true, id, status: submit ? (isAdmin ? 'published' : 'pending') : 'draft' });
}
