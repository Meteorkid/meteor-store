import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { sendAdminAlert } from '@/lib/email';
import { updatePost, deletePost, withdrawPost } from '@/lib/posts';
import { blogSections } from '@/data/blog-sections';
import { revalidatePublishedPaths } from '@/lib/revalidate';

const SECTION_IDS = blogSections.map((s) => s.id) as [string, ...string[]];

const PatchSchema = z.object({
  action: z.enum(['update', 'withdraw']).default('update'),
  // update 专用字段
  title: z.string().trim().min(4, '标题太短了').max(80, '标题不要超过 80 字').optional(),
  excerpt: z.string().trim().min(10, '摘要至少 10 个字').max(200, '摘要不要超过 200 字').optional(),
  content: z.string().trim().min(200, '正文至少 200 字').max(50_000, '正文太长了').optional(),
  sectionId: z.enum(SECTION_IDS).optional(),
  tags: z.array(z.string().trim().min(1).max(24)).max(8, '最多 8 个标签').optional(),
  submit: z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  const { id: postId } = await params;

  const ip = getClientIp(req);
  const { limited } = await rateLimit(`post-edit:${session.userId}:${ip}`, 20, 60_000, {
    fallback: 'memory',
  });
  if (limited) {
    return NextResponse.json({ error: '操作太频繁，稍后再试' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { action, ...data } = parsed.data;

  // 撤回：pending → draft
  if (action === 'withdraw') {
    const result = await withdrawPost({ postId, authorId: session.userId });
    if (!result.ok) {
      if (result.reason === 'notFound') {
        return NextResponse.json({ error: '文章不存在' }, { status: 404 });
      }
      if (result.reason === 'notAuthor') {
        return NextResponse.json({ error: '没有权限' }, { status: 403 });
      }
      return NextResponse.json({ error: '只有待审核的文章能撤回' }, { status: 409 });
    }
    return NextResponse.json({ success: true, status: 'draft' });
  }

  // action === 'update'
  const hasField =
    data.title !== undefined ||
    data.excerpt !== undefined ||
    data.content !== undefined ||
    data.sectionId !== undefined ||
    data.tags !== undefined;
  if (!hasField && !data.submit) {
    return NextResponse.json({ error: '没有要修改的内容' }, { status: 400 });
  }

  const isAdmin = isAdminEmail(session.email);

  const result = await updatePost({
    postId,
    authorId: session.userId,
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    sectionId: data.sectionId,
    tags: data.tags,
    submit: data.submit,
    adminPublish: isAdmin || undefined,
    // 管理员越权编辑：可编辑任何人的投稿，包括 pending 状态
    asAdmin: isAdmin || undefined,
  });

  if (!result.ok) {
    if (result.reason === 'notFound') {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }
    if (result.reason === 'notAuthor') {
      return NextResponse.json({ error: '没有权限' }, { status: 403 });
    }
    // pendingCannotEdit
    return NextResponse.json(
      { error: '待审核的文章不能直接编辑，请先撤回' },
      { status: 409 },
    );
  }

  // 文章内容有公开变化时失效缓存：已发布文章被编辑（下架或管理员直发），
  // 或草稿被管理员直接发布。
  if (result.wasPublished || result.status === 'published') {
    revalidatePublishedPaths();
  }

  // 提交审核时通知管理员。published → pending 是下架重审，管理员会在审核
  // 队列里看到，不需要额外邮件——且邮件文案是"投稿更新待审核"，对下架重审
  // 语义不符。
  if (result.status === 'pending' && !result.wasPublished) {
    void sendAdminAlert('投稿更新待审核', {
      标题: data.title ?? '(编辑)',
      分区: data.sectionId ?? '',
      作者: session.name || session.email,
      查看: '/admin/review',
    });
  }

  return NextResponse.json({ success: true, status: result.status });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  const { id: postId } = await params;

  const ip = getClientIp(req);
  const { limited } = await rateLimit(`post-delete:${session.userId}:${ip}`, 10, 60_000, {
    fallback: 'memory',
  });
  if (limited) {
    return NextResponse.json({ error: '操作太频繁，稍后再试' }, { status: 429 });
  }

  const result = await deletePost({ postId, authorId: session.userId });
  if (!result.ok) {
    if (result.reason === 'notFound') {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }
    return NextResponse.json({ error: '没有权限' }, { status: 403 });
  }

  if (result.wasPublished) {
    revalidatePublishedPaths();
  }

  return NextResponse.json({ success: true });
}
