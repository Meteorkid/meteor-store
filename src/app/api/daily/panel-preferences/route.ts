import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { assertMatchingOrigin } from '@/lib/csrf';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { getDailyPanelPreferences, saveDailyPanelPreferences } from '@/lib/daily/panel-service';
import { SaveDailyPanelPreferencesSchema } from '@/lib/daily/panel-types';

const headers = { 'Cache-Control': 'no-store' };
export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers });
    return NextResponse.json(await getDailyPanelPreferences(session.userId), { headers });
  } catch {
    return NextResponse.json({ error: 'Panel preferences unavailable' }, { status: 503, headers });
  }
}

const MAX_BODY_BYTES = 4096;
async function readBody(request: NextRequest): Promise<{ value: unknown } | { response: NextResponse }> {
  const tooLarge = () => ({ response: NextResponse.json({ error: 'Request too large' }, { status: 413, headers }) });
  if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) return tooLarge();
  if (!request.body) return { value: null };
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let text = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BODY_BYTES) { await reader.cancel(); return tooLarge(); }
      text += decoder.decode(value, { stream: true });
    }
    return { value: JSON.parse(text + decoder.decode()) };
  } catch {
    return { value: null };
  } finally {
    reader.releaseLock();
  }
}

export async function PUT(request: NextRequest) {
  const forbidden = assertMatchingOrigin(request);
  if (forbidden) { forbidden.headers.set('Cache-Control', 'no-store'); return forbidden; }
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers });
    if (request.headers.get('x-daily-user') !== session.userId) {
      return NextResponse.json({ error: 'Account changed; reload preferences', code: 'account_changed' }, { status: 409, headers });
    }
    const { limited } = await rateLimit(`daily-panel-preferences:${session.userId}:${getClientIp(request)}`, 30, 60_000, { fallback: 'memory' });
    if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers });
    const body = await readBody(request);
    if ('response' in body) return body.response;
    const parsed = SaveDailyPanelPreferencesSchema.safeParse(body.value);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid panel preferences' }, { status: 400, headers });
    const saved = await saveDailyPanelPreferences(session.userId, parsed.data);
    if (!saved) return NextResponse.json({ error: 'Panel preferences changed; reload before saving', code: 'revision_conflict' }, { status: 409, headers });
    return NextResponse.json(saved, { headers });
  } catch {
    return NextResponse.json({ error: 'Could not save panel preferences' }, { status: 503, headers });
  }
}
