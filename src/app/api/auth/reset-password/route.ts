import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { readPasswordResetToken } from '@/lib/password-reset';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

const ResetSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8, '新密码至少 8 位').max(200),
});

const invalidTokenResponse = () => NextResponse.json(
  { error: '重置链接无效、已过期或已使用' },
  { status: 400 },
);

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const byIp = await rateLimit(`password-reset:ip:${ip}`, 10, 15 * 60_000, {
    failClosed: true,
  });
  if (byIp.limited) {
    return NextResponse.json({ error: '尝试过于频繁，请稍后再试' }, { status: 429 });
  }

  const parsed = ResetSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const identity = await readPasswordResetToken(parsed.data.token);
  if (!identity) return invalidTokenResponse();

  const byUser = await rateLimit(`password-reset:user:${identity.userId}`, 5, 60 * 60_000, {
    failClosed: true,
  });
  if (byUser.limited) {
    return NextResponse.json({ error: '尝试过于频繁，请稍后再试' }, { status: 429 });
  }

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      emailVerified: users.emailVerified,
      tokenVersion: users.tokenVersion,
    })
    .from(users)
    .where(eq(users.id, identity.userId))
    .limit(1);

  if (
    !user?.emailVerified ||
    user.email !== identity.email ||
    user.tokenVersion !== identity.tokenVersion
  ) {
    return invalidTokenResponse();
  }

  const nextTokenVersion = user.tokenVersion + 1;
  const result = await db
    .update(users)
    .set({
      passwordHash: await hash(parsed.data.newPassword, 12),
      tokenVersion: nextTokenVersion,
    })
    .where(and(
      eq(users.id, identity.userId),
      eq(users.email, identity.email),
      eq(users.emailVerified, true),
      eq(users.tokenVersion, identity.tokenVersion),
    ));

  if ((result.rowCount ?? 0) === 0) return invalidTokenResponse();

  return NextResponse.json({ success: true });
}
