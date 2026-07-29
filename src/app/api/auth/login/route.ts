import { NextRequest, NextResponse } from 'next/server';
import { compare, hash } from 'bcryptjs';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { createSession } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { eq } from 'drizzle-orm';

/**
 * 邮箱不存在时用来消耗等量时间的假哈希，避免用响应快慢区分账号是否已注册。
 * 惰性生成并缓存，内容是对随机串的哈希，永远匹配不上任何密码。
 */
let dummyHash: Promise<string> | null = null;
function getDummyHash(): Promise<string> {
  dummyHash ??= hash(`${Date.now()}-${Math.random()}`, 12);
  return dummyHash;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!email || !password) {
    return NextResponse.json({ error: '请输入邮箱和密码' }, { status: 400 });
  }

  // 双维度限流：
  //   按 IP —— 挡住来自单一来源的批量尝试
  //   按邮箱 —— 挡住换 IP 针对同一账号的爆破，这是只按 IP 限流拦不住的
  // 两者都 failClosed：Redis 异常时宁可拒绝登录，也不留出「先打挂 Redis 再撞库」的窗口。
  // 代价是 Redis 故障期间无人能登录，对本站规模属于可接受的取舍。
  const ip = getClientIp(req);
  const [byIp, byEmail] = await Promise.all([
    rateLimit(`login:ip:${ip}`, 10, 60_000, { failClosed: true }),
    rateLimit(`login:email:${email}`, 10, 900_000, { failClosed: true }),
  ]);

  if (byIp.limited || byEmail.limited) {
    return NextResponse.json({ error: '登录尝试过于频繁，请稍后再试' }, { status: 429 });
  }

  const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
  const user = rows[0];

  // 邮箱不存在时也跑一次 compare，让两种失败路径耗时接近，避免账号枚举
  const passwordMatches = await compare(password, user?.passwordHash ?? (await getDummyHash()));

  if (!user || !passwordMatches) {
    return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 });
  }

  await createSession({ userId: user.id, email: user.email, name: user.name ?? undefined });

  return NextResponse.json({
    success: true,
    user: { id: user.id, email: user.email, name: user.name },
  });
}
