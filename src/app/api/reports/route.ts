import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { createReport, ReportError, type ReportReason, type ReportTargetType } from '@/lib/reports';

const ReportSchema = z.object({
  targetType: z.enum(['comment', 'post']),
  targetId: z.string().min(1).max(200),
  reason: z.enum(['spam', 'abuse', 'nsfw', 'illegal', 'other']),
  detail: z.string().trim().max(500).optional(),
});

/**
 * 用户提交举报。需要登录——匿名举报容易被刷,且无助于管理员后续联系。
 *
 * 限流:每用户每分钟 5 次。举报不是高频操作,且队列是人工处理,
 * 被刷会让管理员看不过来。失败(目标不存在等)也算入限流,避免枚举 targetId。
 */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  const ip = getClientIp(req);
  const { limited } = await rateLimit(
    `report:${session.userId}:${ip}`,
    5,
    60_000,
    { fallback: 'memory' },
  );
  if (limited) {
    return NextResponse.json({ error: '举报提交太频繁,稍后再试' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = ReportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  try {
    const { id } = await createReport({
      targetType: parsed.data.targetType as ReportTargetType,
      targetId: parsed.data.targetId,
      reporterId: session.userId,
      reason: parsed.data.reason as ReportReason,
      detail: parsed.data.detail,
    });
    return NextResponse.json({ id });
  } catch (err) {
    if (err instanceof ReportError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }
}
