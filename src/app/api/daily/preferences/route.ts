import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { assertMatchingOrigin } from '@/lib/csrf';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { getDailyPreferences, saveDailyPreferences } from '@/lib/daily/service';
import { DailyPreferencesSchema } from '@/lib/daily/types';

const headers = { 'Cache-Control': 'no-store' };

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers });
  try {
    return NextResponse.json({ userId: session.userId, preferences: await getDailyPreferences(session.userId) }, { headers });
  } catch {
    return NextResponse.json({ error: 'Preferences unavailable' }, { status: 503, headers });
  }
}

export async function PUT(request: NextRequest) {
  const forbidden = assertMatchingOrigin(request);
  if (forbidden) { forbidden.headers.set('Cache-Control', 'no-store'); return forbidden; }
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers });
  if (request.headers.get('x-daily-user') !== session.userId) {
    return NextResponse.json({ error: 'Account changed; reload preferences' }, { status: 409, headers });
  }
  const { limited } = await rateLimit(`daily-preferences:${session.userId}:${getClientIp(request)}`, 30, 60_000, { fallback: 'memory' });
  if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers });
  const body = await request.text();
  if (body.length > 2048) return NextResponse.json({ error: 'Request too large' }, { status: 413, headers });
  let input: unknown;
  try { input = JSON.parse(body); } catch { input = null; }
  const parsed = DailyPreferencesSchema.safeParse(input);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid preferences' }, { status: 400, headers });
  try {
    return NextResponse.json({ userId: session.userId, preferences: await saveDailyPreferences(session.userId, parsed.data) }, { headers });
  } catch {
    return NextResponse.json({ error: 'Could not save preferences' }, { status: 503, headers });
  }
}
