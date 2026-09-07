import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { announceDailyDigest } from '@/lib/pathfinder/digest-announcement';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

/**
 * 把当天的资讯日报发进通知箱（Header 铃铛）。
 * 用法：POST /api/cron/pathfinder-digest
 * Header: Authorization: Bearer <PATHFINDER_CRON_SECRET>
 *
 * 与其它 Pathfinder 定时任务共用同一个密钥：它们是同一台调度器上的同类任务，
 * 再拆一个只会多一个要轮换的东西（`cron-secret.test.ts` 钉住了这条）。
 *
 * 幂等由 `announcements.source_key` 的唯一索引保证：同一期日报只会发一条公告，
 * 所以补跑、重试、手动触发都安全。
 */
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

  try {
    const result = await announceDailyDigest();
    // 公开公告接口是按请求读的，但铃铛所在的布局可能被缓存，发出后失效一次
    if (result.status === 'created') revalidatePath('/api/announcements');
    /*
     * 读不到目录要按失败报，让包装脚本非零退出、在 syslog 里看得见。
     * 报成功的话，某天数据库短暂不可用就会静默跳过当天通知而无人知晓。
     */
    if (result.status === 'catalog-unavailable') {
      console.error({ event: 'pathfinder_digest_catalog_unavailable' });
      return NextResponse.json({ success: false, ...result }, { status: 503 });
    }
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error({ event: 'pathfinder_digest_announce_failed', error: String(error) });
    return NextResponse.json({ error: '发送日报通知失败' }, { status: 500 });
  }
}
