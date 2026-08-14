import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { isAdminSession } from '@/lib/admin';
import { logAdminAction } from '@/lib/admin-audit';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import {
  createAnnouncement,
  deleteAnnouncement,
  listAllAnnouncements,
  updateAnnouncement,
} from '@/lib/announcements';

const textField = z.string().trim().max(2000).nullable().optional();
const titleField = z.string().trim().max(120).nullable().optional();

const SaveSchema = z.object({
  id: z.string().min(1).max(100).optional(),
  titleZh: titleField,
  titleEn: titleField,
  bodyZh: textField,
  bodyEn: textField,
  published: z.boolean().optional(),
});

function forbidden() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function GET() {
  const session = await getSession();
  if (!session || !isAdminSession(session)) return forbidden();
  return NextResponse.json({ announcements: await listAllAnnouncements() });
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { limited } = await rateLimit(`admin-announcements:ip:${ip}`, 30, 60_000, {
    fallback: 'memory',
  });
  if (limited) {
    return NextResponse.json({ error: '请求过于频繁' }, { status: 429 });
  }

  const session = await getSession();
  if (!session || !isAdminSession(session)) return forbidden();

  const parsed = SaveSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: '参数无效' }, { status: 400 });
  }

  const announcement = await createAnnouncement({
    titleZh: parsed.data.titleZh,
    titleEn: parsed.data.titleEn,
    bodyZh: parsed.data.bodyZh,
    bodyEn: parsed.data.bodyEn,
    published: parsed.data.published,
  });
  await logAdminAction(session, {
    action: 'announcement.create',
    targetType: 'announcement',
    targetId: announcement.id,
    detail: { published: parsed.data.published ?? false },
    ip,
  });
  return NextResponse.json({ announcement }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const ip = getClientIp(req);
  const { limited } = await rateLimit(`admin-announcements:ip:${ip}`, 30, 60_000, {
    fallback: 'memory',
  });
  if (limited) {
    return NextResponse.json({ error: '请求过于频繁' }, { status: 429 });
  }

  const session = await getSession();
  if (!session || !isAdminSession(session)) return forbidden();

  const parsed = SaveSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success || !parsed.data.id) {
    return NextResponse.json({ error: '参数无效' }, { status: 400 });
  }

  const announcement = await updateAnnouncement(parsed.data.id, {
    titleZh: parsed.data.titleZh,
    titleEn: parsed.data.titleEn,
    bodyZh: parsed.data.bodyZh,
    bodyEn: parsed.data.bodyEn,
    published: parsed.data.published,
  });
  if (!announcement) {
    return NextResponse.json({ error: '公告不存在' }, { status: 404 });
  }
  await logAdminAction(session, {
    action: 'announcement.update',
    targetType: 'announcement',
    targetId: parsed.data.id,
    detail: { published: parsed.data.published },
    ip,
  });
  return NextResponse.json({ announcement });
}

export async function DELETE(req: NextRequest) {
  const ip = getClientIp(req);
  const { limited } = await rateLimit(`admin-announcements:ip:${ip}`, 30, 60_000, {
    fallback: 'memory',
  });
  if (limited) {
    return NextResponse.json({ error: '请求过于频繁' }, { status: 429 });
  }

  const session = await getSession();
  if (!session || !isAdminSession(session)) return forbidden();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id') ?? '';
  if (!id) {
    return NextResponse.json({ error: '参数无效' }, { status: 400 });
  }

  const ok = await deleteAnnouncement(id);
  if (!ok) {
    return NextResponse.json({ error: '公告不存在' }, { status: 404 });
  }
  await logAdminAction(session, {
    action: 'announcement.delete',
    targetType: 'announcement',
    targetId: id,
    ip,
  });
  return NextResponse.json({ success: true });
}
