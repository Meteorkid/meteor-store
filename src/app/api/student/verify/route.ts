import { NextRequest, NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { readStudentVerificationToken } from '@/lib/student-verification';

const VerifySchema = z.object({
  token: z.string().min(1).max(4096),
});

const invalidResponse = () => NextResponse.json(
  { error: '学生验证链接无效或已过期' },
  { status: 400 },
);

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { limited } = await rateLimit(`student:verify:${ip}`, 20, 60 * 60_000, {
    fallback: 'memory',
  });
  if (limited) {
    return NextResponse.json({ error: '请求过于频繁，请稍后再试' }, { status: 429 });
  }

  const parsed = VerifySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return invalidResponse();

  const identity = await readStudentVerificationToken(parsed.data.token);
  if (!identity) return invalidResponse();

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      emailVerified: users.emailVerified,
      isStudent: users.isStudent,
      studentEmail: users.studentEmail,
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
    return invalidResponse();
  }
  if (user.isStudent) {
    return user.studentEmail === null || user.studentEmail === identity.studentEmail
      ? NextResponse.json({ success: true })
      : invalidResponse();
  }

  try {
    const result = await db
      .update(users)
      .set({
        isStudent: true,
        studentEmail: identity.studentEmail,
        studentVerifiedAt: new Date().toISOString(),
      })
      .where(and(
        eq(users.id, identity.userId),
        eq(users.email, identity.email),
        eq(users.emailVerified, true),
        eq(users.isStudent, false),
        eq(users.tokenVersion, identity.tokenVersion),
      ));
    if ((result.rowCount ?? 0) === 0) return invalidResponse();
    return NextResponse.json({ success: true });
  } catch (error) {
    if ((error as { code?: string }).code === '23505') {
      return NextResponse.json(
        { error: '该教育邮箱已用于其他账户的学生认证' },
        { status: 409 },
      );
    }
    console.error('Student verification failed', { userId: identity.userId, error });
    return NextResponse.json({ error: '学生认证失败，请稍后重试' }, { status: 500 });
  }
}
