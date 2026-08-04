import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { isNewsletterConfigured, subscribeNewsletterContact } from '@/lib/newsletter';

const NewsletterSchema = z.object({
  email: z.string().email().max(254),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { limited } = await rateLimit(`newsletter:${ip}`, 5, 60_000, { fallback: 'memory' });
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

    if (!isNewsletterConfigured()) {
      console.error('Newsletter: RESEND_API_KEY or RESEND_AUDIENCE_ID not configured');
      return NextResponse.json(
        { error: '订阅服务暂不可用，请稍后重试' },
        { status: 503 }
      );
    }

    await subscribeNewsletterContact(email.toLowerCase());
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json(
      { error: '订阅失败，请稍后重试' },
      { status: 500 }
    );
  }
}
