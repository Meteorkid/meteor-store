import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

/** 旧调度兼容入口：每日一新启用后停止全站广播，历史公告保留。 */
export async function POST(request: NextRequest) {
  // 常数时间比较，防时序侧信道
  const authHeader = request.headers.get('authorization') || '';
  const secret = process.env.PATHFINDER_CRON_SECRET;
  const provided = Buffer.from(authHeader);
  const wanted = Buffer.from(`Bearer ${secret}`);
  if (!secret || provided.length !== wanted.length || !crypto.timingSafeEqual(provided, wanted)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  const ip = getClientIp(request);
  const { limited } = await rateLimit(`pathfinder-digest-cron:${ip}`, 5, 60_000, { failClosed: true });
  if (limited) return NextResponse.json({ error: '请求过于频繁' }, { status: 429 });

  return NextResponse.json({ success: true, status: 'retired', replacement: '/api/cron/daily' });
}
