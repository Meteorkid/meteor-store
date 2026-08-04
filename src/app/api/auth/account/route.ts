import { compare } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isAdminSession } from '@/lib/admin';
import { deleteUserAccount } from '@/lib/account-deletion';
import { destroySession, getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

const DeleteSchema = z.object({
  password: z.string().min(1).max(200),
  confirmation: z.literal('DELETE'),
});

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }
  if (isAdminSession(session)) {
    return NextResponse.json(
      { error: '管理员账户需先从 ADMIN_EMAILS 移除后才能注销' },
      { status: 403 },
    );
  }

  const ip = getClientIp(req);
  const { limited } = await rateLimit(
    `account-delete:${session.userId}:${ip}`,
    3,
    60 * 60_000,
    { failClosed: true },
  );
  if (limited) {
    return NextResponse.json({ error: '尝试过于频繁，请稍后再试' }, { status: 429 });
  }

  const parsed = DeleteSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: '请输入当前密码并填写确认短语 DELETE' }, { status: 400 });
  }

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      passwordHash: users.passwordHash,
      avatarUrl: users.avatarUrl,
    })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);
  if (!user || user.email !== session.email) {
    return NextResponse.json({ error: '账户不存在' }, { status: 401 });
  }
  if (!(await compare(parsed.data.password, user.passwordHash))) {
    return NextResponse.json({ error: '当前密码不正确' }, { status: 401 });
  }

  try {
    await deleteUserAccount({
      userId: user.id,
      email: user.email,
      avatarUrl: user.avatarUrl,
    });
  } catch (error) {
    console.error('Account deletion failed', { userId: user.id, error });
    return NextResponse.json({ error: '账户注销失败，请稍后重试' }, { status: 500 });
  }

  await destroySession();
  return NextResponse.json({ success: true });
}
