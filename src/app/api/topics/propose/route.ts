import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { topicProposals } from '@/lib/db/schema';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { sendAdminAlert } from '@/lib/email';
import { TopicProposalSchema } from '@/lib/topic-validation';
import { sanitizeUserInput } from '@/lib/sanitize';

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
    const cleanTitle = sanitizeUserInput(title);
    const cleanPitch = sanitizeUserInput(pitch);

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

    // 提议不公开展示，没有通知就只能靠人主动连库去看。
    // 不 await：发信失败不该让读者看到提交失败，sendAdminAlert 内部已吞掉异常。
    void sendAdminAlert('新的话题提议', {
      分区: sectionId,
      标题: cleanTitle,
      理由: cleanPitch,
      提交者邮箱: email || '（未留）',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Topic proposal error:', error);
    return NextResponse.json({ error: '提交失败，请稍后再试' }, { status: 500 });
  }
}
