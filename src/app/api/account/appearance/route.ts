import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { assertMatchingOrigin } from '@/lib/csrf';
import { isSiteTheme } from '@/lib/appearance';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

const headers = { 'Cache-Control': 'no-store' };
const BodySchema = z.object({ theme: z.enum(['classic', 'nebula']) }).strict();

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers });
  try {
    const [row] = await db.select({ themePreference: users.themePreference })
      .from(users).where(eq(users.id, session.userId)).limit(1);
    if (!row) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers });
    return NextResponse.json({ theme: isSiteTheme(row.themePreference) ? row.themePreference : null }, { headers });
  } catch {
    return NextResponse.json({ error: 'Appearance unavailable' }, { status: 503, headers });
  }
}

export async function PATCH(request: NextRequest) {
  const forbidden = assertMatchingOrigin(request);
  if (forbidden) { forbidden.headers.set('Cache-Control', 'no-store'); return forbidden; }
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers });
  if (request.headers.get('x-appearance-user') !== session.userId) {
    return NextResponse.json({ error: 'Account changed', code: 'account_changed' }, { status: 409, headers });
  }
  const { limited } = await rateLimit(`appearance:${session.userId}:${getClientIp(request)}`, 20, 60_000, { fallback: 'memory' });
  if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers });
  if (Number(request.headers.get('content-length')) > 256) return NextResponse.json({ error: 'Request too large' }, { status: 413, headers });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid appearance' }, { status: 400, headers }); }
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid appearance' }, { status: 400, headers });
  try {
    await db.update(users).set({ themePreference: parsed.data.theme }).where(eq(users.id, session.userId));
    return NextResponse.json({ theme: parsed.data.theme }, { headers });
  } catch {
    return NextResponse.json({ error: 'Could not save appearance' }, { status: 503, headers });
  }
}
