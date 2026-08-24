import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { notifyPathfinderDeadlines } from '@/lib/pathfinder/deadline-reminders';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

// 涉及多封邮件 IO，显式延长函数超时时间
export const maxDuration = 60;

/**
 * 触发 Pathfinder 收藏条目的截止提醒。
 * 用法：POST /api/cron/pathfinder-deadlines
 * Header: Authorization: Bearer <PATHFINDER_CRON_SECRET>
 *
 * 与同步任务共用 PATHFINDER_CRON_SECRET：两者都是同一台调度器上的 Pathfinder 维护任务，
 * 再拆一个密钥只会多一个要轮换的东西。
 * 幂等：pathfinder_deadline_reminders 按 (user_id, item_id, deadline) 去重，
 * 同一个截止时间只发一次，按天调用即可。
 */
export async function POST(request: NextRequest) {
  // 常数时间比较，防时序侧信道
  const authHeader = request.headers.get('authorization') || '';
  const secret = process.env.PATHFINDER_CRON_SECRET;
  const expected = `Bearer ${secret}`;
  const provided = Buffer.from(authHeader);
  const wanted = Buffer.from(expected);
  if (!secret || provided.length !== wanted.length || !crypto.timingSafeEqual(provided, wanted)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  // 批量发信成本高，Redis 异常时 fail-closed
  const ip = getClientIp(request);
  const { limited } = await rateLimit(`pathfinder-deadlines-cron:${ip}`, 5, 60_000, {
    failClosed: true,
  });
  if (limited) return NextResponse.json({ error: '请求过于频繁' }, { status: 429 });

  try {
    return NextResponse.json({ success: true, ...await notifyPathfinderDeadlines() });
  } catch (error) {
    console.error('Pathfinder deadline reminder error:', error);
    return NextResponse.json({ error: '提醒任务失败' }, { status: 500 });
  }
}
