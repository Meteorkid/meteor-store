import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const NewsletterSchema = z.object({
  email: z.string().email().max(254),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { limited } = rateLimit(`newsletter:${ip}`, 5, 60_000);
  if (limited) {
    return NextResponse.json({ error: '请求过于频繁，请稍后再试' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = NewsletterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    // 检查 Resend 配置是否完整
    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (!apiKey || apiKey === 're_' || !audienceId) {
      console.error('Newsletter: RESEND_API_KEY or RESEND_AUDIENCE_ID not configured');
      return NextResponse.json(
        { error: '订阅服务暂不可用，请稍后重试' },
        { status: 503 }
      );
    }

    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);

    // 尝试创建联系人（Resend 会自动处理重复）
    const { error } = await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    });

    // 如果是重复订阅错误，返回成功
    if (error?.message?.includes('already exists')) {
      return NextResponse.json({ success: true, message: '您已订阅过' });
    }

    if (error) {
      console.error('Resend contacts.create error:', error);
      return NextResponse.json(
        { error: '订阅失败，请稍后重试' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json(
      { error: '订阅失败，请稍后重试' },
      { status: 500 }
    );
  }
}
