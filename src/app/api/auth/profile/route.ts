import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { createSession, getSession } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { isR2Configured, keyFromUrl, deleteAvatar, avatarExists } from '@/lib/avatar-storage';

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

  // 头像 URL 只能指向本人前缀下的 R2 对象（由 /api/avatar/upload 签发）。
  // 若接受任意 https 地址，「设成他人头像 URL → 清空/替换」就能删掉别人的对象
  if (isR2Configured() && parsed.data.avatar) {
    if (!keyFromUrl(parsed.data.avatar, session.userId)) {
      return NextResponse.json({ error: '头像格式不正确' }, { status: 400 });
    }
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

  if ('avatarUrl' in updates && isR2Configured()) {
    const newKey = updates.avatarUrl ? keyFromUrl(updates.avatarUrl, session.userId) : null;
    let oldKey: string | null;
    try {
      const saved = await db.transaction(async tx => {
        const [row] = await tx.select({ avatarUrl: users.avatarUrl }).from(users)
          .where(eq(users.id, session.userId)).limit(1).for('update');
        if (!row) return { error: 'account_missing' as const };
        // 与清理共用用户行锁：旧表单须在清理完成后重新确认对象仍可用。
        if (newKey && !await avatarExists(newKey)) return { error: 'avatar_missing' as const };
        await tx.update(users).set(updates).where(eq(users.id, session.userId));
        return { oldKey: row.avatarUrl ? keyFromUrl(row.avatarUrl, session.userId) : null };
      });
      if ('error' in saved) {
        return NextResponse.json({ error: saved.error === 'avatar_missing' ? '头像已失效，请重新上传' : '请重新登录' },
          { status: saved.error === 'avatar_missing' ? 409 : 401 });
      }
      oldKey = saved.oldKey;
    } catch (err) {
      console.error('profile save failed:', err);
      return NextResponse.json({ error: '资料保存失败，请稍后重试' }, { status: 500 });
    }

    // 必须等资料事务提交后再删；重新加锁复查，保留被另一请求重新选中的旧头像。
    if (oldKey && oldKey !== newKey) {
      try {
        await db.transaction(async tx => {
          const [current] = await tx.select({ avatarUrl: users.avatarUrl }).from(users)
            .where(eq(users.id, session.userId)).limit(1).for('update');
          if (current && (!current.avatarUrl || keyFromUrl(current.avatarUrl, session.userId) !== oldKey)) {
            await deleteAvatar(oldKey);
          }
        });
      } catch (err) {
        console.error('avatar cleanup skipped after profile save:', err);
      }
    }
  } else {
    await db.update(users).set(updates).where(eq(users.id, session.userId));
  }

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
