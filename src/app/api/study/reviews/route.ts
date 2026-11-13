import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { assertMatchingOrigin } from '@/lib/csrf';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { StudyReviewInputSchema } from '@/lib/study/types';
import { reviewStudyProblem } from '@/lib/study/service';

const headers = { 'Cache-Control': 'no-store' };
const json = (data: unknown, status = 200) => NextResponse.json(data, { status, headers });
async function readInput(request: NextRequest) {
  const text = await request.text();
  if (text.length > 1024) return null;
  try { return JSON.parse(text) as unknown; } catch { return null; }
}

/** 记录一次复习结果。只接受「已解决」题目；其他状态返回 404。 */
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return json({ error: 'Unauthorized' }, 401);
  if (assertMatchingOrigin(request)) return json({ error: 'Forbidden' }, 403);
  if (request.headers.get('x-study-user') !== session.userId) return json({ error: 'Account changed' }, 409);
  const { limited } = await rateLimit(`study-review:${session.userId}:${getClientIp(request)}`, 120, 60_000, { fallback: 'memory' });
  if (limited) return json({ error: 'Too many requests' }, 429);
  const input = StudyReviewInputSchema.safeParse(await readInput(request));
  if (!input.success) return json({ error: 'Invalid review' }, 400);
  try {
    const problem = await reviewStudyProblem(session.userId, input.data);
    return problem ? json({ userId: session.userId, problem }) : json({ error: 'Problem not found' }, 404);
  } catch { return json({ error: 'Could not record review' }, 503); }
}
