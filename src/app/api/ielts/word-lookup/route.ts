import { NextRequest, NextResponse } from 'next/server';
import { assertMatchingOrigin } from '@/lib/csrf';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { WordLookupRequestSchema } from '@/lib/ielts/word-lookup';
import { lookupIeltsWord, WordLookupError } from '@/lib/ielts/word-lookup-service';

function json(body: unknown, status = 200, retryAfter?: number) {
  return NextResponse.json(body, { status, headers: {
    'Cache-Control': 'no-store',
    ...(retryAfter ? { 'Retry-After': String(retryAfter) } : {}),
  } });
}

async function readBody(request: Request): Promise<unknown> {
  const limit = 2 * 1024;
  if (!request.body) throw new WordLookupError('invalid');
  if (Number(request.headers.get('content-length')) > limit) {
    void request.body.cancel().catch(() => undefined);
    throw new WordLookupError('invalid');
  }
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > limit) {
        void reader.cancel().catch(() => undefined);
        throw new WordLookupError('invalid');
      }
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown;
  } catch {
    throw new WordLookupError('invalid');
  } finally {
    reader.releaseLock();
  }
}

export async function POST(request: NextRequest) {
  if (assertMatchingOrigin(request)) return json({ error: 'invalid' }, 403);
  try {
    const limit = await rateLimit(`ielts-word:${getClientIp(request)}`, 30, 60_000, { fallback: 'memory', failClosed: true });
    if (limit.limited) {
      const retryAfter = Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000));
      return json({ error: 'rate_limited' }, 429, retryAfter);
    }
    const input = WordLookupRequestSchema.safeParse(await readBody(request));
    if (!input.success) return json({ error: 'invalid' }, 400);
    return json(await lookupIeltsWord(input.data));
  } catch (error) {
    if (error instanceof WordLookupError) return json({ error: error.code }, error.status, error.retryAfter);
    return json({ error: 'unavailable' }, 503);
  }
}
