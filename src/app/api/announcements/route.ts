import { NextResponse } from 'next/server';
import { listPublishedAnnouncements } from '@/lib/announcements';

export const dynamic = 'force-dynamic';

export async function GET() {
  const announcements = await listPublishedAnnouncements();
  // 公告不常变，但铃铛要实时反映新公告：CDN 缓存 60s 足够，本地仍走 fallback
  return NextResponse.json(
    { announcements },
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } },
  );
}
