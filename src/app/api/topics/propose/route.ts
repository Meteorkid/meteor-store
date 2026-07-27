import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { topicProposals } from '@/lib/db/schema';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { blogSections } from '@/data/blog-sections';

/** 只有开放提议的分区能收提议，白名单从分区配置推导 */
const PROPOSABLE_SECTION_IDS = blogSections
  .filter((s) => s.allowProposals)
  .map((s) => s.id) as [string, ...string[]];

export const TopicProposalSchema = z.object({
  sectionId: z.enum(PROPOSABLE_SECTION_IDS),
  title: z.string().trim().min(4, '话题标题太短了').max(80, '话题标题不要超过 80 字'),
  pitch: z.string().trim().min(10, '再多写几句为什么值得写').max(1000, '先写个梗概就好，不要超过 1000 字'),
  email: z.string().email('邮箱格式不对').max(254).optional(),
});

/**
 * 剥离字面 HTML 标签。与 feedback 一致：不反转义实体，
 * 避免把 &lt;script&gt; 还原成真正的标签。
 */
export function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

export async function POST(request: NextRequest) {
  // 速率限制：每 IP 每 10 分钟最多 3 条提议。
  // 未配置 Redis 时降级为实例内限流，避免这个公开写接口完全不设防。
  const ip = getClientIp(request);
  const { limited } = await rateLimit(`topic-propose:${ip}`, 3, 600_000, { fallback: 'memory' });
  if (limited) {
    return NextResponse.json({ error: '提议太频繁了，等十分钟再来' }, { status: 429 });
  }

  try {
    const body = await request.json();

    const parsed = TopicProposalSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { sectionId, title, pitch, email } = parsed.data;
    const cleanTitle = sanitizeInput(title);
    const cleanPitch = sanitizeInput(pitch);

    // 清理后可能被掏空（整条内容都是标签）
    if (!cleanTitle || !cleanPitch) {
      return NextResponse.json({ error: '内容为空，换个说法试试' }, { status: 400 });
    }

    await db.insert(topicProposals).values({
      id: crypto.randomUUID(),
      sectionId,
      title: cleanTitle,
      pitch: cleanPitch,
      submitterEmail: email || null,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Topic proposal error:', error);
    return NextResponse.json({ error: '提交失败，请稍后重试' }, { status: 500 });
  }
}
