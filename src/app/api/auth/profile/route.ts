import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { createSession, getSession } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const ProfileSchema = z.object({
  // 允许清空昵称（回落成用邮箱前缀显示），所以下限是 0
  name: z.string().trim().max(30, '昵称不要超过 30 个字'),
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

  const name = parsed.data.name || null;

  await db.update(users).set({ name }).where(eq(users.id, session.userId));

  // 会话里存着昵称，导航栏直接读它。不重新签发的话，改完名字要等下次登录才生效。
  await createSession({
    userId: session.userId,
    email: session.email,
    name: name ?? undefined,
  });

  return NextResponse.json({ success: true, user: { ...session, name } });
}
