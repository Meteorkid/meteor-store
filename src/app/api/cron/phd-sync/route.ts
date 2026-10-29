import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { syncPhdSources } from '@/lib/phd/automation';

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
  const { limited } = await rateLimit(`phd-sync:${getClientIp(request)}`, 5, 60_000, { failClosed: true });
  if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers });
  try {
    const result = await syncPhdSources();
    revalidatePath('/[locale]/phd', 'page');
    return NextResponse.json({ success: result.failed === 0, ...result }, { status: result.failed ? 503 : 200, headers });
  } catch {
    console.error({ event: 'phd_sync_failed' });
    return NextResponse.json({ success: false, error: 'Official source sync failed' }, { status: 503, headers });
  }
}
