import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { createSession, getSession } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { isR2Configured, keyFromUrl, deleteAvatar } from '@/lib/avatar-storage';

const MAX_AVATAR_BYTES = 150_000;
const MAX_DATAURL_BYTES = 200_000;

// R2 配置好时：avatar 必须是 R2 公开 URL（https），或空字符串表示删除头像
// R2 未配置时：avatar 仍允许 data URL（开发环境降级到老逻辑）
const avatarSchema = isR2Configured()
  ? z
      .string()
      .refine(
        (v) =>
          v === '' ||
          (v.startsWith('https://') && v.length <= 500),
        '头像格式不正确',
      )
      .optional()
  : z
      .string()
      .refine((v) => v === '' || v.startsWith('data:image/'), '头像格式不正确')
      .refine(
        (v) => v === '' || v.length <= MAX_DATAURL_BYTES,
        '头像文件过大',
      )
      .optional();

const ProfileSchema = z.object({
  name: z.string().trim().max(30, '昵称不要超过 30 个字').optional(),
  bio: z.string().trim().max(200, '个人简介不要超过 200 字').optional(),
  avatar: avatarSchema,
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

  // 头像被清空时，把当前指向的旧 R2 对象删掉避免堆积。
  // 头像被替换的清理在 /api/avatar/upload 写新对象时已经做了。
  if (updates.avatarUrl === null && isR2Configured()) {
    const [row] = await db
      .select({ avatarUrl: users.avatarUrl })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);
    if (row?.avatarUrl) {
      const oldKey = keyFromUrl(row.avatarUrl);
      if (oldKey) await deleteAvatar(oldKey);
    }
  }

  await db.update(users).set(updates).where(eq(users.id, session.userId));

  // 重签会话时带上当前 tokenVersion，避免 getSession 误判为过期。
  // 改昵称不应踢掉其他设备，所以这里不递增 tokenVersion。
  const newName = 'name' in updates ? updates.name : session.name;
  await createSession({
    userId: session.userId,
    email: session.email,
    name: newName ?? undefined,
    emailVerified: true,
    tokenVersion: session.tokenVersion,
  });

  return NextResponse.json({ success: true });
}
