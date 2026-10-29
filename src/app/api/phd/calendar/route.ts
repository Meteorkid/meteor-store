import { NextRequest, NextResponse } from 'next/server';
import { getPhdRoundsByIds } from '@/lib/phd/service';
import { buildPhdCalendar } from '@/lib/phd/ics';

export async function GET(request: NextRequest) {
  const headers = { 'Cache-Control': 'no-store' };
  const ids = [...new Set((request.nextUrl.searchParams.get('ids') ?? '').split(','))];
  if (!ids.length || ids.length > 50 || ids.some(id => !/^[a-zA-Z0-9_-]{1,100}$/.test(id))) {
    return NextResponse.json({ error: 'Select between 1 and 50 applications' }, { status: 400, headers });
  }
  try {
    const calendar = buildPhdCalendar(await getPhdRoundsByIds(ids));
    if (!calendar.includes('BEGIN:VEVENT')) return NextResponse.json({ error: 'No confirmed upcoming deadlines' }, { status: 404, headers });
    return new NextResponse(calendar, { headers: { ...headers,
      'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': 'attachment; filename="phd-applications.ics"',
      'X-Content-Type-Options': 'nosniff',
    } });
  } catch { return NextResponse.json({ error: 'Calendar export unavailable' }, { status: 503, headers }); }
}
