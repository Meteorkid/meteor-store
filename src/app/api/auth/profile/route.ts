import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { createSession, getSession } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const MAX_AVATAR_BYTES = 150_000;

const ProfileSchema = z.object({
  name: z.string().trim().max(30, '昵称不要超过 30 个字').optional(),
  bio: z.string().trim().max(200, '个人简介不要超过 200 字').optional(),
  avatar: z
    .string()
    .refine(
      (v) => v === '' || v.startsWith('data:image/'),
      '头像格式不正确',
    )
    .refine(
      (v) => v === '' || v.length <= MAX_AVATAR_BYTES,
      '头像文件过大',
    )
    .optional(),
});

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  const ip = getClientIp(req);
  const { limited } = await rateLimit(`profile:${session.userId}:${ip}`, 10, 60_000, {
    fallback: 'memory',
  });
  if (limited) {
    return NextResponse.json({ error: '改得太频繁了，稍后再试' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = ProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const updates: Record<string, string | null> = {};

  if (parsed.data.name !== undefined) {
    updates.name = parsed.data.name || null;
  }
  if (parsed.data.bio !== undefined) {
    updates.bio = parsed.data.bio || null;
  }
  if (parsed.data.avatar !== undefined) {
    updates.avatarUrl = parsed.data.avatar || null;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: '没有要修改的内容' }, { status: 400 });
  }

  await db.update(users).set(updates).where(eq(users.id, session.userId));

  const newName = 'name' in updates ? updates.name : session.name;
  await createSession({
    userId: session.userId,
    email: session.email,
    name: newName ?? undefined,
  });

  return NextResponse.json({ success: true });
}
