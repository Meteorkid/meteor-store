import { NextRequest, NextResponse } from 'next/server';
import { compare, hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { createSession, getSession } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

const PasswordSchema = z.object({
  currentPassword: z.string().min(1, '请输入当前密码'),
  newPassword: z.string().min(8, '新密码至少 8 位').max(200),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  // 这里要验旧密码，等于是另一个可以爆破的入口（虽然得先有会话）。
  // 与 login 同样 failClosed：Redis 异常时宁可拒绝。
  const { limited } = await rateLimit(`password:${session.userId}`, 5, 900_000, {
    failClosed: true,
  });
  if (limited) {
    return NextResponse.json({ error: '尝试过于频繁，请稍后再试' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = PasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { currentPassword, newPassword } = parsed.data;

  const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
  if (!user) {
    return NextResponse.json({ error: '账户不存在' }, { status: 401 });
  }

  if (!(await compare(currentPassword, user.passwordHash))) {
    return NextResponse.json({ error: '当前密码不正确' }, { status: 401 });
  }

  if (await compare(newPassword, user.passwordHash)) {
    return NextResponse.json({ error: '新密码不能和当前密码相同' }, { status: 400 });
  }

  // 改密时递增 tokenVersion：所有旧设备上持有的会话因 tokenVersion 不匹配
  // 被 getSession 判为过期。当前这台设备紧接着重新签发，继续可用。
  // neon-http 驱动不支持 RETURNING，本地计算 nextTokenVersion 一并写入。
  const nextTokenVersion = (user.tokenVersion ?? 0) + 1;

  await db
    .update(users)
    .set({
      passwordHash: await hash(newPassword, 12),
      tokenVersion: nextTokenVersion,
    })
    .where(eq(users.id, session.userId));

  await createSession({
    userId: user.id,
    email: user.email,
    name: user.name ?? undefined,
    emailVerified: true,
    tokenVersion: nextTokenVersion,
  });

  return NextResponse.json({ success: true });
}
