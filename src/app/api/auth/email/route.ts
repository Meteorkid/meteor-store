import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { compare } from 'bcryptjs';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { getSession } from '@/lib/auth';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const EmailSchema = z.object({
  newEmail: z.string().email('请提供有效的邮箱地址'),
  password: z.string().min(1, '请输入当前密码'),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  const ip = getClientIp(req);
  const { limited } = await rateLimit(`email-change:${session.userId}`, 3, 3600_000, { fallback: 'memory' });
  if (limited) {
    return NextResponse.json({ error: '操作太频繁了，请一小时后再试' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = EmailSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { newEmail, password } = parsed.data;

  const [user] = await db
    .select({ id: users.id, passwordHash: users.passwordHash, email: users.email })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  if (!user) {
    return NextResponse.json({ error: '用户不存在' }, { status: 404 });
  }

  const valid = await compare(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: '密码错误' }, { status: 403 });
  }

  if (newEmail === user.email) {
    return NextResponse.json({ error: '新邮箱与当前邮箱相同' }, { status: 400 });
  }

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, newEmail))
    .limit(1);

  if (existing) {
    return NextResponse.json({ error: '该邮箱已被注册' }, { status: 409 });
  }

  await db
    .update(users)
    .set({ email: newEmail, emailVerified: false })
    .where(eq(users.id, user.id));

  return NextResponse.json({ success: true });
}
