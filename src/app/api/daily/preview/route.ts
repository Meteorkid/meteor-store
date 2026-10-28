import { NextRequest, NextResponse } from 'next/server';
import { getDailyPreview } from '@/lib/daily/preview';
import { dailyDate, isDailyHistoryDate } from '@/lib/daily/types';

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date') ?? dailyDate();
  const recent = request.nextUrl.searchParams.get('recent');
  if ((recent !== null && recent !== '1') || request.nextUrl.searchParams.getAll('recent').length > 1) {
    return NextResponse.json({ error: 'Invalid preview mode' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
  }
  if (!isDailyHistoryDate(date)) return NextResponse.json({ error: 'Invalid date' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
  try {
    return NextResponse.json(await (recent === '1' ? getDailyPreview(date, { recent: true }) : getDailyPreview(date)), {
      headers: { 'Cache-Control': 'public, max-age=30, stale-while-revalidate=30' },
    });
  } catch {
    return NextResponse.json({ error: 'Preview temporarily unavailable' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
