import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { assertMatchingOrigin } from '@/lib/csrf';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { getDailyPreferencesState, saveDailyPreferences } from '@/lib/daily/service';
import { DailyPreferencesSaveSchema } from '@/lib/daily/types';

const headers = { 'Cache-Control': 'no-store' };

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers });
  try {
    return NextResponse.json({ userId: session.userId, ...await getDailyPreferencesState(session.userId) }, { headers });
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
    return NextResponse.json({ error: 'Account changed; reload preferences', code: 'account_changed' }, { status: 409, headers });
  }
  const { limited } = await rateLimit(`daily-preferences:${session.userId}:${getClientIp(request)}`, 30, 60_000, { fallback: 'memory' });
  if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers });
  const body = await request.text();
  if (body.length > 2048) return NextResponse.json({ error: 'Request too large' }, { status: 413, headers });
  let input: unknown;
  try { input = JSON.parse(body); } catch { input = null; }
  if (input && typeof input === 'object' && !Array.isArray(input) && !('expectedRevision' in input)) {
    return NextResponse.json({ error: 'Reload preferences before saving', code: 'revision_required' }, { status: 409, headers });
  }
  const parsed = DailyPreferencesSaveSchema.safeParse(input);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid preferences' }, { status: 400, headers });
  try {
    const { expectedRevision, ...preferences } = parsed.data;
    const saved = await saveDailyPreferences(session.userId, preferences, expectedRevision);
    if (!saved) return NextResponse.json({ error: 'Preferences changed; reload before saving', code: 'revision_conflict' }, { status: 409, headers });
    return NextResponse.json({ userId: session.userId, ...saved }, { headers });
  } catch {
    return NextResponse.json({ error: 'Could not save preferences' }, { status: 503, headers });
  }
}
