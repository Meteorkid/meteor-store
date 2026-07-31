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

  // 当前并未真正发送验证邮件，也没有后续的 token 校验与优惠码发放流程。
  // 在补全流程之前直接返回 503，避免对用户说谎（前端展示「邮件已发送」会让用户白等）。
  // 待发信链路完成、token 表与兑换流程接通后再去掉此 503。
  return NextResponse.json(
    { error: '学生认证功能正在升级，暂时无法使用，请稍后再来。' },
    { status: 503 },
  );
}
