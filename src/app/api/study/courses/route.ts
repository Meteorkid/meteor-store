import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { assertMatchingOrigin } from '@/lib/csrf';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { StudyCourseInputSchema, StudyCoursePatchSchema, StudyIdSchema } from '@/lib/study/types';
import { createStudyCourse, deleteStudyCourse, listStudyCourses, updateStudyCourse } from '@/lib/study/service';

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
    return json({ userId: session.userId, courses: await listStudyCourses(session.userId) });
  } catch { return json({ error: 'Courses unavailable' }, 503); }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return json({ error: 'Unauthorized' }, 401);
  if (assertMatchingOrigin(request)) return json({ error: 'Forbidden' }, 403);
  if (request.headers.get('x-study-user') !== session.userId) return json({ error: 'Account changed' }, 409);
  const { limited } = await rateLimit(`study-course:${session.userId}:${getClientIp(request)}`, 60, 60_000, { fallback: 'memory' });
  if (limited) return json({ error: 'Too many requests' }, 429);
  const input = StudyCourseInputSchema.safeParse(await readInput(request));
  if (!input.success) return json({ error: 'Invalid course' }, 400);
  try {
    return json({ userId: session.userId, course: await createStudyCourse(session.userId, input.data) });
  } catch { return json({ error: 'Could not save course' }, 503); }
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session) return json({ error: 'Unauthorized' }, 401);
  if (assertMatchingOrigin(request)) return json({ error: 'Forbidden' }, 403);
  if (request.headers.get('x-study-user') !== session.userId) return json({ error: 'Account changed' }, 409);
  const { limited } = await rateLimit(`study-course:${session.userId}:${getClientIp(request)}`, 60, 60_000, { fallback: 'memory' });
  if (limited) return json({ error: 'Too many requests' }, 429);
  const input = StudyCoursePatchSchema.safeParse(await readInput(request));
  if (!input.success) return json({ error: 'Invalid course' }, 400);
  try {
    const course = await updateStudyCourse(session.userId, input.data);
    return course ? json({ userId: session.userId, course }) : json({ error: 'Course not found' }, 404);
  } catch { return json({ error: 'Could not save course' }, 503); }
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session) return json({ error: 'Unauthorized' }, 401);
  if (assertMatchingOrigin(request)) return json({ error: 'Forbidden' }, 403);
  if (request.headers.get('x-study-user') !== session.userId) return json({ error: 'Account changed' }, 409);
  const { limited } = await rateLimit(`study-course-del:${session.userId}:${getClientIp(request)}`, 30, 60_000, { fallback: 'memory' });
  if (limited) return json({ error: 'Too many requests' }, 429);
  const input = StudyIdSchema.safeParse(await readInput(request));
  if (!input.success) return json({ error: 'Invalid course' }, 400);
  try {
    return json({ userId: session.userId, success: await deleteStudyCourse(session.userId, input.data.id) });
  } catch { return json({ error: 'Could not delete course' }, 503); }
}
