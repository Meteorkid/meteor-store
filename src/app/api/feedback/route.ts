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

/**
 * 清理用户输入，移除潜在的 XSS 内容
 * 保留原始文本用于分析，但移除 HTML 标签
 */
function sanitizeInput(input: string): string {
  // 移除 HTML 标签，保留文本内容
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .trim();
}

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

    // 清理内容，移除潜在的 XSS 内容
    const sanitizedContent = sanitizeInput(content);

    await db.insert(feedbacks).values({
      id,
      email: email || null,
      type,
      content: sanitizedContent,
      createdAt: now,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json(
      { error: '提交失败，请稍后重试' },
      { status: 500 }
    );
  }
}
