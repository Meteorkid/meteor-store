import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

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

export async function POST(req: NextRequest) {
  // 目前只校验邮箱格式，接入发信后（见下方 TODO）这里就是发信轰炸的入口
  const ip = getClientIp(req);
  const { limited } = await rateLimit(`student:ip:${ip}`, 5, 600_000, { fallback: 'memory' });
  if (limited) {
    return NextResponse.json({ error: '请求过于频繁，请稍后再试' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const email = typeof body?.email === 'string' ? body.email.trim() : '';

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: '请输入有效的邮箱地址' }, { status: 400 });
  }

  if (!isEduEmail(email)) {
    return NextResponse.json(
      { error: '请使用 .edu 或 .edu.cn 等教育邮箱' },
      { status: 400 },
    );
  }

  // TODO: 接入邮件发送服务（Resend / Nodemailer）发送验证链接
  // 目前直接返回成功，后续可加入：
  // 1. 生成 token 存入 KV / DB
  // 2. 发送包含 token 的验证链接到学生邮箱
  // 3. 验证通过后发放优惠码

  return NextResponse.json({
    success: true,
    message: '验证邮件已发送，请查收你的学校邮箱。',
  });
}
