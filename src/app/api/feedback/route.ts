import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { feedbacks } from '@/lib/db/schema';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { sanitizeUserInput } from '@/lib/sanitize';

const FeedbackSchema = z.object({
  email: z.string().email().max(254).optional(),
  // night-whisper: 深夜树洞（前端 0:00–5:00 才展示该选项，后端始终接受）
  type: z.enum(['bug', 'feature', 'question', 'other', 'night-whisper']),
  content: z.string().min(1).max(5000),
});

/**
 * @deprecated 改用 src/lib/sanitize.ts 的 sanitizeUserInput。
 * 保留 re-export 是为了让既有测试 (`__tests__/route.test.ts`) 在重构过渡期不红,
 * 逻辑实际由共享函数提供,见 AGENTS.md「输入净化统一」一节。
 */
export const sanitizeInput = sanitizeUserInput;

export async function POST(request: NextRequest) {
  // 速率限制：每 IP 每分钟最多 5 次
  const ip = getClientIp(request);
  const { limited } = await rateLimit(`feedback:${ip}`, 5, 60_000, { fallback: 'memory' });
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

    // 清理内容,移除字面 HTML 标签。详见 src/lib/sanitize.ts。
    const sanitizedContent = sanitizeUserInput(content);

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
      { error: '提交失败，请稍后再试' },
      { status: 500 }
    );
  }
}
