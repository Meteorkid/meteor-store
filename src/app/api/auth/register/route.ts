import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { createSession } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  const name = typeof body?.name === 'string' ? body.name.trim() : undefined;

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: '请输入有效的邮箱地址' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: '密码至少 8 位' }, { status: 400 });
  }

  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing.length > 0) {
    return NextResponse.json({ error: '该邮箱已注册' }, { status: 409 });
  }

  const id = `U${Date.now()}${Math.random().toString(36).slice(2, 6)}`;
  const passwordHash = await hash(password, 12);

  await db.insert(users).values({
    id,
    email,
    passwordHash,
    name: name || null,
    createdAt: new Date().toISOString(),
  });

  await createSession({ userId: id, email, name });

  return NextResponse.json({ success: true, user: { id, email, name } });
}
