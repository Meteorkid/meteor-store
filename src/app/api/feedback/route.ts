import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { feedbacks } from '@/lib/db/schema';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const FeedbackSchema = z.object({
  email: z.string().email().max(254).optional(),
  type: z.enum(['bug', 'feature', 'question', 'other']),
  content: z.string().min(1).max(5000),
});

export async function POST(request: NextRequest) {
  // 速率限制：每 IP 每分钟最多 5 次
  const ip = getClientIp(request);
  const { limited } = rateLimit(`feedback:${ip}`, 5, 60_000);
  if (limited) {
    return NextResponse.json({ error: '请求过于频繁，请稍后再试' }, { status: 429 });
  }

  try {
    const body = await request.json();

    const parsed = FeedbackSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, type, content } = parsed.data;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await db.insert(feedbacks).values({
      id,
      email: email || null,
      type,
      content,
      createdAt: now,
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json(
      { error: '提交失败，请稍后重试' },
      { status: 500 }
    );
  }
}
