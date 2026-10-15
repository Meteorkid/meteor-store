import { NextRequest, NextResponse } from 'next/server';
import { getDailyEditions } from '@/lib/daily/service';
import { dailyDate, isDailyHistoryDate } from '@/lib/daily/types';

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date') ?? dailyDate();
  if (!isDailyHistoryDate(date)) return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
  try {
    return NextResponse.json({ date, editions: await getDailyEditions(date) }, {
      headers: { 'Cache-Control': 'public, max-age=30, stale-while-revalidate=30' },
    });
  } catch {
    return NextResponse.json({ error: 'Content temporarily unavailable' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
