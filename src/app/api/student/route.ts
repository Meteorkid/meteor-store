import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { isEmailDeliveryConfigured, sendStudentVerification } from '@/lib/email';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { createStudentVerificationToken } from '@/lib/student-verification';

const EDU_DOMAINS = [
  '.edu',
  '.edu.cn',
  '.ac.uk',
  '.ac.jp',
  '.edu.au',
  '.edu.sg',
  '.ac.kr',
];

export function isEduEmail(email: string): boolean {
  const lower = email.toLowerCase().trim();
  return EDU_DOMAINS.some((d) => lower.endsWith(d));
}

const RequestSchema = z.object({
  studentEmail: z.string().trim().email().max(254),
  locale: z.enum(['zh', 'en']).default('zh'),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { limited } = await rateLimit(`student:ip:${ip}`, 5, 10 * 60_000, { failClosed: true });
  if (limited) {
    return NextResponse.json({ error: '请求过于频繁，请稍后再试' }, { status: 429 });
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  const parsed = RequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: '请输入有效的邮箱地址' }, { status: 400 });
  }

  const studentEmail = parsed.data.studentEmail.toLowerCase();
  if (!isEduEmail(studentEmail)) {
    return NextResponse.json(
      { error: '请使用 .edu 或 .edu.cn 等教育邮箱' },
      { status: 400 },
    );
  }

  const byUser = await rateLimit(
    `student:user:${session.userId}`,
    3,
    15 * 60_000,
    { failClosed: true },
  );
  if (byUser.limited) {
    return NextResponse.json({ error: '请求过于频繁，请稍后再试' }, { status: 429 });
  }

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      emailVerified: users.emailVerified,
      isStudent: users.isStudent,
      tokenVersion: users.tokenVersion,
    })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);
  if (!user?.emailVerified) {
    return NextResponse.json({ error: '账户邮箱尚未验证' }, { status: 401 });
  }
  if (user.isStudent) {
    return NextResponse.json({ success: true, alreadyVerified: true });
  }

  const [owner] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.studentEmail, studentEmail))
    .limit(1);
  if (owner && owner.id !== user.id) {
    return NextResponse.json({ error: '该教育邮箱已用于其他账户的学生认证' }, { status: 409 });
  }

  if (!isEmailDeliveryConfigured()) {
    return NextResponse.json({ error: '验证邮件服务暂不可用，请稍后重试' }, { status: 503 });
  }

  const token = await createStudentVerificationToken({
    userId: user.id,
    email: user.email,
    studentEmail,
    tokenVersion: user.tokenVersion,
  });
  try {
    await sendStudentVerification({
      email: studentEmail,
      token,
      locale: parsed.data.locale,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Student verification email failed', { userId: user.id, error });
    return NextResponse.json({ error: '验证邮件发送失败，请稍后重试' }, { status: 500 });
  }
}
