import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { notifyExpiringPasses } from '@/lib/pass-expiry';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

// 涉及多个邮件发送 IO，显式延长函数超时时间
export const maxDuration = 60;

/**
 * 触发 Meteor Pass 到期提醒。
 * 用法：POST /api/cron/pass-expiry
 * Header: Authorization: Bearer <PATHFINDER_CRON_SECRET>
 *
 * 由服务器 crontab 按天调用（`scripts/pass-expiry-cron.mjs`）。
 * 幂等：pass_reminders 表按 (email, expiresAt) 去重，同一个到期日只发一次。
 *
 * 与其它维护任务共用 PATHFINDER_CRON_SECRET：都是同一台调度器上的后台任务，
 * 再拆一个密钥只会多一个要轮换的东西。**这里原本读的是独有的
 * `PASS_EXPIRY_CRON_SECRET`，而那个变量从来没配到服务器上**——于是即便有人
 * 打这个接口也只会拿到 401，到期提醒上线一个月一封都没发出去。
 */
export async function POST(request: NextRequest) {
  // token 鉴权（常数时间比较，防时序侧信道）
  const authHeader = request.headers.get('authorization') || '';
  const secret = process.env.PATHFINDER_CRON_SECRET;
  const expected = `Bearer ${secret}`;
  const a = Buffer.from(authHeader);
  const b = Buffer.from(expected);
  if (!secret || a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  // 限流：每 IP 每分钟最多 5 次（涉及批量发信成本，Redis 异常时 fail-closed）
  const ip = getClientIp(request);
  const { limited } = await rateLimit(`pass-expiry-cron:${ip}`, 5, 60_000, { failClosed: true });
  if (limited) {
    return NextResponse.json({ error: '请求过于频繁' }, { status: 429 });
  }

  try {
    const result = await notifyExpiringPasses();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Pass expiry reminder error:', error);
    return NextResponse.json({ error: '提醒任务失败' }, { status: 500 });
  }
}