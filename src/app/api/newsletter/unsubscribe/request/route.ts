import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendNewsletterUnsubscribeConfirmation } from '@/lib/email';
import { hasNewsletterContact, isNewsletterConfigured } from '@/lib/newsletter';
import { createNewsletterUnsubscribeToken } from '@/lib/newsletter-unsubscribe';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

const RequestSchema = z.object({
  email: z.string().trim().email().max(254),
  locale: z.enum(['zh', 'en']).default('zh'),
});

const successResponse = () => NextResponse.json({ success: true });

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const byIp = await rateLimit(`newsletter-unsubscribe-request:ip:${ip}`, 10, 60 * 60_000, {
    failClosed: true,
  });
  if (byIp.limited) {
    return NextResponse.json({ error: '请求过于频繁，请稍后再试' }, { status: 429 });
  }

  const parsed = RequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: '邮箱格式无效' }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const byEmail = await rateLimit(
    `newsletter-unsubscribe-request:email:${email}`,
    3,
    15 * 60_000,
    { failClosed: true },
  );
  if (byEmail.limited) {
    return NextResponse.json({ error: '请求过于频繁，请稍后再试' }, { status: 429 });
  }

  if (!isNewsletterConfigured()) {
    return NextResponse.json({ error: '退订服务暂不可用，请稍后重试' }, { status: 503 });
  }

  try {
    if (!(await hasNewsletterContact(email))) return successResponse();
    const token = await createNewsletterUnsubscribeToken(email);
    await sendNewsletterUnsubscribeConfirmation({
      email,
      token,
      locale: parsed.data.locale,
    });
  } catch (error) {
    console.error('Newsletter unsubscribe request failed', error);
  }

  // 无论订阅是否存在都返回相同结果，避免泄露邮箱是否在名单中。
  return successResponse();
}
