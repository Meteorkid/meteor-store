import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { DAILY_EDITION_CHANNEL_IDS, dailyDate } from '@/lib/daily/types';
import { freezeDailyReminder, generateDailyEditions } from '@/lib/daily/service';

export const runtime = 'nodejs';
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  const secret = process.env.PATHFINDER_CRON_SECRET;
  const provided = Buffer.from(request.headers.get('authorization') ?? '');
  const wanted = Buffer.from(`Bearer ${secret}`);
  if (!secret || Buffer.byteLength(secret) < 32 || provided.length !== wanted.length || !crypto.timingSafeEqual(provided, wanted)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { limited } = await rateLimit(`daily-cron:${getClientIp(request)}`, 5, 60_000, { failClosed: true });
  if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  const action = request.nextUrl.searchParams.get('action');
  if (action !== 'generate' && action !== 'remind') return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  try {
    if (action === 'remind') return NextResponse.json({ success: true, ...await freezeDailyReminder() });
    const editions = await generateDailyEditions(dailyDate());
    revalidatePath('/[locale]/daily', 'page');
    // 插入唯一键冲突或不完整任务不能因为「没有 failed 行」就伪装成功。
    const failed = DAILY_EDITION_CHANNEL_IDS.some(channel => {
      const edition = editions.find(row => row.channel === channel);
      return !edition || edition.status === 'failed' || (edition.status === 'draft' && !edition.automationPaused);
    });
    return NextResponse.json({ success: !failed, editions: editions.map(({ channel, status }) => ({ channel, status })) }, { status: failed ? 503 : 200 });
  } catch {
    console.error({ event: 'daily_cron_failed', action });
    return NextResponse.json({ success: false, error: 'Daily job failed' }, { status: 503 });
  }
}
