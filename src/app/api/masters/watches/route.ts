import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { assertMatchingOrigin } from '@/lib/csrf';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { MastersWatchInputSchema } from '@/lib/masters/types';
import { getMastersRoundsByIds, getMastersWatches, removeMastersWatch, saveMastersWatch } from '@/lib/masters/service';

const headers = { 'Cache-Control': 'no-store' };
const json = (data: unknown, status = 200) => NextResponse.json(data, { status, headers });
async function readInput(request: NextRequest) {
  const text = await request.text();
  if (text.length > 2048) return null;
  try { return JSON.parse(text) as unknown; } catch { return null; }
}

export async function GET() {
  const session = await getSession();
  if (!session) return json({ error: 'Unauthorized' }, 401);
  try {
    const watches = await getMastersWatches(session.userId);
    return json({ userId: session.userId, watches, rounds: await getMastersRoundsByIds(watches.map(watch => watch.roundId)) });
  } catch { return json({ error: 'Applications unavailable' }, 503); }
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) return json({ error: 'Unauthorized' }, 401);
  if (assertMatchingOrigin(request)) return json({ error: 'Forbidden' }, 403);
  if (request.headers.get('x-masters-user') !== session.userId) return json({ error: 'Account changed' }, 409);
  const { limited } = await rateLimit(`masters-watch:${session.userId}:${getClientIp(request)}`, 30, 60_000, { fallback: 'memory' });
  if (limited) return json({ error: 'Too many requests' }, 429);
  const input = MastersWatchInputSchema.safeParse(await readInput(request));
  if (!input.success) return json({ error: 'Invalid application state' }, 400);
  try {
    const watch = await saveMastersWatch(session.userId, input.data);
    return watch ? json({ userId: session.userId, watch }) : json({ error: 'Application no longer available' }, 404);
  } catch { return json({ error: 'Could not save application' }, 503); }
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session) return json({ error: 'Unauthorized' }, 401);
  if (assertMatchingOrigin(request)) return json({ error: 'Forbidden' }, 403);
  if (request.headers.get('x-masters-user') !== session.userId) return json({ error: 'Account changed' }, 409);
  const { limited } = await rateLimit(`masters-watch:${session.userId}:${getClientIp(request)}`, 30, 60_000, { fallback: 'memory' });
  if (limited) return json({ error: 'Too many requests' }, 429);
  const input = z.object({ roundId: z.string().regex(/^[a-zA-Z0-9_-]{1,100}$/) }).strict().safeParse(await readInput(request));
  if (!input.success) return json({ error: 'Invalid application' }, 400);
  try {
    await removeMastersWatch(session.userId, input.data.roundId);
    return json({ userId: session.userId, success: true });
  } catch { return json({ error: 'Could not remove application' }, 503); }
}
