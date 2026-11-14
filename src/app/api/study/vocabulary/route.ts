import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { assertMatchingOrigin } from '@/lib/csrf';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { verifyVocabularyReceipt } from '@/lib/ielts/vocabulary-receipt';
import {
  VOCABULARY_RECEIPT_MAX_BYTES, VocabularyIdSchema, VocabularyListInputSchema, VocabularySaveInputSchema,
} from '@/lib/study/vocabulary-types';
import {
  deleteVocabulary, findVocabularyBySourceKey, listVocabulary, saveVocabulary, VocabularyInputError,
} from '@/lib/study/vocabulary-service';

const headers = { 'Cache-Control': 'no-store' };
const json = (data: unknown, status = 200) => NextResponse.json(data, { status, headers });

async function readInput(request: Request, limit: number): Promise<unknown> {
  if (!request.body) return null;
  if (Number(request.headers.get('content-length')) > limit) {
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
      if (total > limit) {
        void reader.cancel().catch(() => undefined);
        return null;
      }
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown;
  } catch { return null; } finally { reader.releaseLock(); }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return json({ error: 'unauthorized' }, 401);
    const { limited } = await rateLimit(`study-vocabulary-read:${session.userId}:${getClientIp(request)}`, 120, 60_000, { fallback: 'memory' });
    if (limited) return json({ error: 'rate_limited' }, 429);
    const params = request.nextUrl.searchParams;
    if (params.has('sourceKey')) {
      const sourceKey = params.get('sourceKey')!;
      if (!/^[0-9a-f]{64}$/.test(sourceKey)) return json({ error: 'invalid' }, 400);
      return json({ userId: session.userId, entry: await findVocabularyBySourceKey(session.userId, sourceKey) });
    }
    const dueOnly = params.get('dueOnly');
    if (dueOnly !== null && !['1', '0', 'true', 'false'].includes(dueOnly)) return json({ error: 'invalid' }, 400);
    const parsed = VocabularyListInputSchema.safeParse({
      query: params.get('query') ?? undefined,
      dueOnly: dueOnly === null ? undefined : dueOnly === '1' || dueOnly === 'true',
      cursor: params.get('cursor') ?? undefined,
      limit: params.has('limit') ? Number(params.get('limit')) : undefined,
    });
    if (!parsed.success) return json({ error: 'invalid' }, 400);
    return json({ userId: session.userId, ...await listVocabulary(session.userId, parsed.data) });
  } catch (error) {
    return error instanceof VocabularyInputError ? json({ error: 'invalid' }, 400) : json({ error: 'unavailable' }, 503);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return json({ error: 'unauthorized' }, 401);
    if (assertMatchingOrigin(request)) return json({ error: 'forbidden' }, 403);
    if (request.headers.get('x-study-user') !== session.userId) return json({ error: 'account_changed' }, 409);
    const { limited } = await rateLimit(`study-vocabulary-save:${session.userId}:${getClientIp(request)}`, 60, 60_000, { fallback: 'memory' });
    if (limited) return json({ error: 'rate_limited' }, 429);
    const input = VocabularySaveInputSchema.safeParse(await readInput(request, VOCABULARY_RECEIPT_MAX_BYTES + 128));
    if (!input.success) return json({ error: 'invalid' }, 400);
    const receipt = verifyVocabularyReceipt(input.data.saveToken);
    if (!receipt) return json({ error: 'invalid_receipt' }, 400);
    return json({ userId: session.userId, ...await saveVocabulary(session.userId, receipt.snapshot) });
  } catch { return json({ error: 'unavailable' }, 503); }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return json({ error: 'unauthorized' }, 401);
    if (assertMatchingOrigin(request)) return json({ error: 'forbidden' }, 403);
    if (request.headers.get('x-study-user') !== session.userId) return json({ error: 'account_changed' }, 409);
    const { limited } = await rateLimit(`study-vocabulary-delete:${session.userId}:${getClientIp(request)}`, 30, 60_000, { fallback: 'memory' });
    if (limited) return json({ error: 'rate_limited' }, 429);
    const input = VocabularyIdSchema.safeParse(await readInput(request, 1024));
    if (!input.success) return json({ error: 'invalid' }, 400);
    return json({ userId: session.userId, success: await deleteVocabulary(session.userId, input.data.id) });
  } catch { return json({ error: 'unavailable' }, 503); }
}
