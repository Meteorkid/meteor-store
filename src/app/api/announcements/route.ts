import { NextResponse } from 'next/server';
import { listPublishedAnnouncements } from '@/lib/announcements';

export const dynamic = 'force-dynamic';

export async function GET() {
  const announcements = await listPublishedAnnouncements();
  // 公告可能承载运营/合规内容（价格变更、致歉声明），撤下后必须尽快停止分发。
  // 写接口无法回源清 CDN，所以陈旧窗口只能靠这两个值兜住：最坏 s-maxage + swr ≈ 60s。
  return NextResponse.json(
    { announcements },
    { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=30' } },
  );
}
