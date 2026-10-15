import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { isAdminSession } from '@/lib/admin';
import { logAdminAction } from '@/lib/admin-audit';
import { assertMatchingOrigin } from '@/lib/csrf';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { DailyEditionChannelSchema, DailyContentSchema, DailyDateSchema, dailyDate } from '@/lib/daily/types';
import { generateDailyEditions, listDailyEditions, retireDailyEdition, saveDailyEdition } from '@/lib/daily/service';

const GenerateSchema = z.object({
  action: z.literal('generate'),
  date: DailyDateSchema,
  channel: DailyEditionChannelSchema.optional(),
}).strict();

function isTimeZone(value: string | undefined): boolean {
  if (!value) return false;
  try {
    new Intl.DateTimeFormat('en', { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}

const SaveSchema = z.object({
  action: z.literal('save'),
  id: z.string().min(1).max(100).optional(),
  date: DailyDateSchema,
  channel: DailyEditionChannelSchema,
  title: z.string().trim().min(1).max(300),
  summary: z.string().trim().max(2000),
  content: DailyContentSchema,
  status: z.enum(['draft', 'published']),
  expectedUpdatedAt: z.string().datetime({ offset: true }).optional(),
}).strict().superRefine((value, context) => {
  if (value.content.kind !== value.channel) {
    context.addIssue({ code: 'custom', path: ['content'], message: 'Content does not match the channel' });
  }
  if (value.id && value.id !== `${value.date}:${value.channel}`) {
    context.addIssue({ code: 'custom', path: ['id'], message: 'Edition does not match the date and channel' });
  }
  if (value.content.kind === 'events') {
    for (const [index, item] of value.content.items.entries()) {
      if (item.sourceType !== 'official' || !item.phase || (item.startAt && !isTimeZone(item.timeZone))) {
        context.addIssue({ code: 'custom', path: ['content', 'items', index], message: 'Confirm the official source, phase and time zone before publishing' });
      }
    }
  }
});

const RetireSchema = z.object({
  action: z.literal('retire'),
  id: z.string().min(1).max(100),
  expectedUpdatedAt: z.string().datetime({ offset: true }),
}).strict();
const PatchSchema = z.discriminatedUnion('action', [SaveSchema, RetireSchema]);

function privateJson(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

function failure(code: string, status: number) {
  return privateJson({ error: code === 'not_found' ? 'Not found' : code, errorCode: code }, status);
}

/** 同时检查声明长度和实际流量，不能让省略 Content-Length 绕过上限。 */
async function readBody(request: Request): Promise<{ value: unknown } | { response: NextResponse }> {
  const limit = 128 * 1024;
  if (Number(request.headers.get('content-length')) > limit) return { response: failure('too_large', 413) };
  if (!request.body) return { response: failure('invalid', 400) };
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > limit) {
        await reader.cancel().catch(() => undefined);
        return { response: failure('too_large', 413) };
      }
      chunks.push(value);
    }
    return { value: JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown };
  } catch {
    return { response: failure('invalid', 400) };
  } finally {
    reader.releaseLock();
  }
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session || !isAdminSession(session)) return failure('not_found', 404);
  const parsed = DailyDateSchema.safeParse(new URL(request.url).searchParams.get('date') ?? dailyDate());
  if (!parsed.success) return failure('invalid', 400);
  try {
    return privateJson({ editions: await listDailyEditions(parsed.data) });
  } catch (error) {
    console.error('Daily admin list failed:', error);
    return failure('load_failed', 500);
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || !isAdminSession(session)) return failure('not_found', 404);
  if (assertMatchingOrigin(request)) return failure('origin', 403);
  const ip = getClientIp(request);
  const { limited } = await rateLimit(`admin-daily:generate:${session.userId}:${ip}`, 5, 60_000, { fallback: 'memory' });
  if (limited) return failure('rate_limited', 429);
  const body = await readBody(request);
  if ('response' in body) return body.response;
  const parsed = GenerateSchema.safeParse(body.value);
  if (!parsed.success) return failure('invalid', 400);
  if (parsed.data.date !== dailyDate()) return failure('today_only', 400);
  try {
    const editions = await generateDailyEditions(parsed.data.date, parsed.data.channel);
    await logAdminAction(session, {
      action: 'daily.generate', targetType: 'daily-edition',
      detail: { date: parsed.data.date, channel: parsed.data.channel ?? 'all', results: editions.map(item => ({ id: item.id, status: item.status })) },
      ip,
    });
    return privateJson({ editions });
  } catch (error) {
    console.error('Daily admin generation failed:', error);
    return failure('generate_failed', 500);
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session || !isAdminSession(session)) return failure('not_found', 404);
  if (assertMatchingOrigin(request)) return failure('origin', 403);
  const ip = getClientIp(request);
  const { limited } = await rateLimit(`admin-daily:edit:${session.userId}:${ip}`, 30, 60_000, { fallback: 'memory' });
  if (limited) return failure('rate_limited', 429);
  const body = await readBody(request);
  if ('response' in body) return body.response;
  const parsed = PatchSchema.safeParse(body.value);
  if (!parsed.success) return failure('invalid', 400);
  try {
    if (parsed.data.action === 'retire') {
      const { id, expectedUpdatedAt } = parsed.data;
      if (!await retireDailyEdition(id, expectedUpdatedAt)) return failure('conflict', 409);
      await logAdminAction(session, {
        action: 'daily.retire', targetType: 'daily-edition', targetId: id,
        detail: { previousUpdatedAt: expectedUpdatedAt, status: 'draft' }, ip,
      });
      return privateJson({ success: true });
    }
    const { id, date, channel, title, summary, content, status, expectedUpdatedAt } = parsed.data;
    const input = { id, date, channel, title, summary, content, status, expectedUpdatedAt };
    const edition = await saveDailyEdition(input);
    if (!edition) return failure('conflict', 409);
    await logAdminAction(session, {
      action: input.status === 'published' ? 'daily.publish' : 'daily.save',
      targetType: 'daily-edition', targetId: edition.id,
      detail: { date: edition.date, channel: edition.channel, title: edition.title, status: edition.status }, ip,
    });
    return privateJson({ edition });
  } catch (error) {
    console.error('Daily admin save failed:', error);
    return failure('save_failed', 500);
  }
}
