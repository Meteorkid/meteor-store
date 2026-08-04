import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { unsubscribeNewsletterContact } from '@/lib/newsletter';
import { readNewsletterUnsubscribeToken } from '@/lib/newsletter-unsubscribe';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

const ConfirmSchema = z.object({
  token: z.string().min(1).max(4096),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { limited } = await rateLimit(`newsletter-unsubscribe-confirm:${ip}`, 20, 60 * 60_000, {
    fallback: 'memory',
  });
  if (limited) {
    return NextResponse.json({ error: '请求过于频繁，请稍后再试' }, { status: 429 });
  }

  const parsed = ConfirmSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: '退订链接无效或已过期' }, { status: 400 });
  }

  const identity = await readNewsletterUnsubscribeToken(parsed.data.token);
  if (!identity) {
    return NextResponse.json({ error: '退订链接无效或已过期' }, { status: 400 });
  }

  try {
    await unsubscribeNewsletterContact(identity.email);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter unsubscribe failed', error);
    return NextResponse.json({ error: '退订失败，请稍后重试' }, { status: 500 });
  }
}
