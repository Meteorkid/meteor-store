import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { assertMatchingOrigin } from '@/lib/csrf';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { VocabularyReviewInputSchema } from '@/lib/study/vocabulary-types';
import { reviewVocabulary, VocabularyConflictError } from '@/lib/study/vocabulary-service';

const headers = { 'Cache-Control': 'no-store' };
const json = (data: unknown, status = 200) => NextResponse.json(data, { status, headers });

async function readInput(request: Request): Promise<unknown> {
  if (!request.body) return null;
  if (Number(request.headers.get('content-length')) > 1024) {
    void request.body.cancel().catch(() => undefined);
    return null;
  }
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > 1024) {
        void reader.cancel().catch(() => undefined);
        return null;
      }
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown;
  } catch { return null; } finally { reader.releaseLock(); }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return json({ error: 'unauthorized' }, 401);
    if (assertMatchingOrigin(request)) return json({ error: 'forbidden' }, 403);
    if (request.headers.get('x-study-user') !== session.userId) return json({ error: 'account_changed' }, 409);
    const { limited } = await rateLimit(`study-vocabulary-review:${session.userId}:${getClientIp(request)}`, 120, 60_000, { fallback: 'memory' });
    if (limited) return json({ error: 'rate_limited' }, 429);
    const input = VocabularyReviewInputSchema.safeParse(await readInput(request));
    if (!input.success) return json({ error: 'invalid' }, 400);
    const entry = await reviewVocabulary(session.userId, input.data);
    return entry ? json({ userId: session.userId, entry }) : json({ error: 'not_found' }, 404);
  } catch (error) {
    return error instanceof VocabularyConflictError
      ? json({ error: 'review_conflict' }, 409) : json({ error: 'unavailable' }, 503);
  }
}
