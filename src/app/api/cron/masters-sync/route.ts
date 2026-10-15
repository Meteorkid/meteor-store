import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { syncMastersSources } from '@/lib/masters/automation';

export const runtime = 'nodejs';
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  const secret = process.env.PATHFINDER_CRON_SECRET;
  const provided = Buffer.from(request.headers.get('authorization') ?? '');
  const wanted = Buffer.from(`Bearer ${secret}`);
  if (!secret || Buffer.byteLength(secret) < 32 || provided.length !== wanted.length || !crypto.timingSafeEqual(provided, wanted)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { limited } = await rateLimit(`masters-sync:${getClientIp(request)}`, 5, 60_000, { failClosed: true });
  if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  try {
    const result = await syncMastersSources();
    revalidatePath('/[locale]/masters', 'page');
    revalidatePath('/[locale]/daily', 'page');
    return NextResponse.json({ success: result.failed === 0, ...result }, { status: result.failed ? 503 : 200 });
  } catch {
    console.error({ event: 'masters_sync_failed' });
    return NextResponse.json({ success: false, error: 'Official source sync failed' }, { status: 503 });
  }
}
