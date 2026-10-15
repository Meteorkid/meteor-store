import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { assertMatchingOrigin } from '@/lib/csrf';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { getMastersNotices, markMastersNoticesRead } from '@/lib/masters/service';

const headers = { 'Cache-Control': 'no-store' };
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ userId: null, notices: [] }, { headers });
  try {
    return NextResponse.json({ userId: session.userId, notices: await getMastersNotices(session.userId) }, { headers });
  } catch { return NextResponse.json({ error: 'Application reminders unavailable' }, { status: 503, headers }); }
}
export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers });
  if (assertMatchingOrigin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers });
  if (request.headers.get('x-masters-user') !== session.userId) return NextResponse.json({ error: 'Account changed' }, { status: 409, headers });
  const { limited } = await rateLimit(`masters-notices:${session.userId}:${getClientIp(request)}`, 30, 60_000, { fallback: 'memory' });
  if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers });
  const input = z.object({ ids: z.array(z.string().regex(/^[a-f0-9]{64}$/)).min(1).max(20) }).strict().safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: 'Invalid notices' }, { status: 400, headers });
  try {
    await markMastersNoticesRead(session.userId, input.data.ids);
    return NextResponse.json({ userId: session.userId, success: true }, { headers });
  } catch { return NextResponse.json({ error: 'Could not mark reminders read' }, { status: 503, headers }); }
}
