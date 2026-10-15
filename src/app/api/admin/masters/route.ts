import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { isAdminSession } from '@/lib/admin';
import { logAdminAction } from '@/lib/admin-audit';
import { assertMatchingOrigin } from '@/lib/csrf';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { defaultMastersYear, MastersRoundInputSchema } from '@/lib/masters/types';
import { importMastersSeeds, listAdminMastersRounds, saveMastersRound, unpublishMastersRound } from '@/lib/masters/service';

const YearSchema = z.coerce.number().int().min(2020).max(2100);
const ImportSchema = z.object({ action: z.literal('import') }).strict();
const PatchSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('save'), input: MastersRoundInputSchema }).strict(),
  z.object({
    action: z.literal('unpublish'),
    id: z.string().regex(/^[a-zA-Z0-9_-]{1,100}$/),
    expectedUpdatedAt: z.string().datetime({ offset: true }),
  }).strict(),
]);

function privateJson(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

function failure(code: string, status: number) {
  return privateJson({ error: code === 'not_found' ? 'Not found' : code, errorCode: code }, status);
}

/** 大小上限作用于实际请求流，不依赖可能缺失的 Content-Length。 */
async function readBody(request: Request): Promise<{ value: unknown } | { response: NextResponse }> {
  const limit = 128 * 1024;
  if (Number(request.headers.get('content-length')) > limit) return { response: failure('too_large', 413) };
  if (!request.body) return { response: failure('invalid', 400) };
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel().catch(() => undefined);
        return { response: failure('too_large', 413) };
      }
      chunks.push(value);
    }
    return { value: JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown };
  } catch {
    return { response: failure('invalid', 400) };
  } finally { reader.releaseLock(); }
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session || !isAdminSession(session)) return failure('not_found', 404);
  const year = YearSchema.safeParse(new URL(request.url).searchParams.get('year') ?? defaultMastersYear());
  if (!year.success) return failure('invalid', 400);
  try {
    return privateJson({ rounds: await listAdminMastersRounds(year.data) });
  } catch (error) {
    console.error('Masters admin list failed:', error);
    return failure('load_failed', 500);
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || !isAdminSession(session)) return failure('not_found', 404);
  if (assertMatchingOrigin(request)) return failure('origin', 403);
  const ip = getClientIp(request);
  const { limited } = await rateLimit(`admin-masters:import:${session.userId}:${ip}`, 5, 60_000, { fallback: 'memory' });
  if (limited) return failure('rate_limited', 429);
  const body = await readBody(request);
  if ('response' in body) return body.response;
  if (!ImportSchema.safeParse(body.value).success) return failure('invalid', 400);
  try {
    const result = await importMastersSeeds();
    await logAdminAction(session, {
      action: 'masters.import', targetType: 'masters-round', detail: { created: result.created, status: 'draft' }, ip,
    });
    return privateJson(result);
  } catch (error) {
    console.error('Masters admin import failed:', error);
    return failure('import_failed', 500);
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session || !isAdminSession(session)) return failure('not_found', 404);
  if (assertMatchingOrigin(request)) return failure('origin', 403);
  const ip = getClientIp(request);
  const { limited } = await rateLimit(`admin-masters:edit:${session.userId}:${ip}`, 30, 60_000, { fallback: 'memory' });
  if (limited) return failure('rate_limited', 429);
  const body = await readBody(request);
  if ('response' in body) return body.response;
  const parsed = PatchSchema.safeParse(body.value);
  if (!parsed.success) return failure('invalid', 400);
  try {
    if (parsed.data.action === 'unpublish') {
      const { id, expectedUpdatedAt } = parsed.data;
      if (!await unpublishMastersRound(id, expectedUpdatedAt)) return failure('conflict', 409);
      await logAdminAction(session, {
        action: 'masters.unpublish', targetType: 'masters-round', targetId: id,
        detail: { previousUpdatedAt: expectedUpdatedAt, status: 'draft' }, ip,
      });
      return privateJson({ success: true });
    }
    const input = parsed.data.input;
    if (input.id && !input.expectedUpdatedAt) return failure('conflict', 409);
    const round = await saveMastersRound(input);
    if (!round) return failure('conflict', 409);
    await logAdminAction(session, {
      action: input.status === 'published' ? 'masters.publish' : 'masters.save',
      targetType: 'masters-round', targetId: round.id,
      detail: { intakeYear: round.intakeYear, university: round.details.university, programme: round.details.programme,
        roundName: round.details.roundName, status: round.status, revision: round.revision, dateVersion: round.dateVersion }, ip,
    });
    return privateJson({ round });
  } catch (error) {
    console.error('Masters admin save failed:', error);
    return failure('save_failed', 500);
  }
}
