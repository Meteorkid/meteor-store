import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { syncPhdNotices } from '@/lib/phd/service';

export const runtime = 'nodejs';
export const maxDuration = 120;
const headers = { 'Cache-Control': 'no-store' };

export async function POST(request: NextRequest) {
  const secret = process.env.PATHFINDER_CRON_SECRET;
  const provided = Buffer.from(request.headers.get('authorization') ?? '');
  const wanted = Buffer.from(`Bearer ${secret}`);
  if (!secret || Buffer.byteLength(secret) < 32 || provided.length !== wanted.length || !crypto.timingSafeEqual(provided, wanted)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers });
  }
  const { limited } = await rateLimit(`phd-cron:${getClientIp(request)}`, 5, 60_000, { failClosed: true });
  if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers });
  try { return NextResponse.json({ success: true, ...await syncPhdNotices() }, { headers }); }
  catch {
    console.error({ event: 'phd_deadlines_failed' });
    return NextResponse.json({ success: false, error: 'Application reminders failed' }, { status: 503, headers });
  }
}
