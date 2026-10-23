import { NextRequest, NextResponse } from 'next/server';
import { getDailyPreview } from '@/lib/daily/preview';
import { dailyDate, isDailyHistoryDate } from '@/lib/daily/types';

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date') ?? dailyDate();
  if (!isDailyHistoryDate(date)) return NextResponse.json({ error: 'Invalid date' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
  try {
    return NextResponse.json(await getDailyPreview(date), {
      headers: { 'Cache-Control': 'public, max-age=30, stale-while-revalidate=30' },
    });
  } catch {
    return NextResponse.json({ error: 'Preview temporarily unavailable' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
