import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { assertMatchingOrigin } from '@/lib/csrf';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { StudyDeadlineInputSchema, StudyDeadlinePatchSchema, StudyIdSchema } from '@/lib/study/types';
import { createStudyDeadline, deleteStudyDeadline, listStudyDeadlines, updateStudyDeadline } from '@/lib/study/service';

const headers = { 'Cache-Control': 'no-store' };
const json = (data: unknown, status = 200) => NextResponse.json(data, { status, headers });
async function readInput(request: NextRequest) {
  const text = await request.text();
  if (text.length > 4096) return null;
  try { return JSON.parse(text) as unknown; } catch { return null; }
}

export async function GET() {
  const session = await getSession();
  if (!session) return json({ error: 'Unauthorized' }, 401);
  try {
    return json({ userId: session.userId, deadlines: await listStudyDeadlines(session.userId) });
  } catch { return json({ error: 'Deadlines unavailable' }, 503); }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return json({ error: 'Unauthorized' }, 401);
  if (assertMatchingOrigin(request)) return json({ error: 'Forbidden' }, 403);
  if (request.headers.get('x-study-user') !== session.userId) return json({ error: 'Account changed' }, 409);
  const { limited } = await rateLimit(`study-deadline:${session.userId}:${getClientIp(request)}`, 60, 60_000, { fallback: 'memory' });
  if (limited) return json({ error: 'Too many requests' }, 429);
  const input = StudyDeadlineInputSchema.safeParse(await readInput(request));
  if (!input.success) return json({ error: 'Invalid deadline' }, 400);
  try {
    const deadline = await createStudyDeadline(session.userId, input.data);
    return deadline ? json({ userId: session.userId, deadline }) : json({ error: 'Course not found' }, 404);
  } catch { return json({ error: 'Could not save deadline' }, 503); }
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session) return json({ error: 'Unauthorized' }, 401);
  if (assertMatchingOrigin(request)) return json({ error: 'Forbidden' }, 403);
  if (request.headers.get('x-study-user') !== session.userId) return json({ error: 'Account changed' }, 409);
  const { limited } = await rateLimit(`study-deadline:${session.userId}:${getClientIp(request)}`, 60, 60_000, { fallback: 'memory' });
  if (limited) return json({ error: 'Too many requests' }, 429);
  const input = StudyDeadlinePatchSchema.safeParse(await readInput(request));
  if (!input.success) return json({ error: 'Invalid deadline' }, 400);
  try {
    const deadline = await updateStudyDeadline(session.userId, input.data);
    return deadline ? json({ userId: session.userId, deadline }) : json({ error: 'Deadline not found' }, 404);
  } catch { return json({ error: 'Could not save deadline' }, 503); }
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session) return json({ error: 'Unauthorized' }, 401);
  if (assertMatchingOrigin(request)) return json({ error: 'Forbidden' }, 403);
  if (request.headers.get('x-study-user') !== session.userId) return json({ error: 'Account changed' }, 409);
  const { limited } = await rateLimit(`study-deadline-del:${session.userId}:${getClientIp(request)}`, 30, 60_000, { fallback: 'memory' });
  if (limited) return json({ error: 'Too many requests' }, 429);
  const input = StudyIdSchema.safeParse(await readInput(request));
  if (!input.success) return json({ error: 'Invalid deadline' }, 400);
  try {
    return json({ userId: session.userId, success: await deleteStudyDeadline(session.userId, input.data.id) });
  } catch { return json({ error: 'Could not delete deadline' }, 503); }
}
