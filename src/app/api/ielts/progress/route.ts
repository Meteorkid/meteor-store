import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { assertMatchingOrigin } from '@/lib/csrf';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { IeltsPairSlugSchema } from '@/lib/ielts/types';
import { listIeltsProgress, toggleIeltsProgress } from '@/lib/ielts/service';

/**
 * 雅思对照的学习状态：已学 / 收藏。
 *
 * 与文章收藏同口径——未登录 401，限流 30 次/分钟，响应 no-store；
 * 切换后回读真实状态，客户端按返回值渲染，不做乐观猜测。
 */

const headers = { 'Cache-Control': 'no-store' };
const json = (data: unknown, status = 200) => NextResponse.json(data, { status, headers });

const ToggleSchema = z.object({
  slug: IeltsPairSlugSchema,
  kind: z.enum(['studied', 'bookmarked']),
}).strict();

async function readInput(request: NextRequest) {
  const text = await request.text();
  if (text.length > 1024) return null;
  try { return JSON.parse(text) as unknown; } catch { return null; }
}

export async function GET() {
  const session = await getSession();
  if (!session) return json({ error: 'Unauthorized' }, 401);
  try {
    return json({ userId: session.userId, progress: await listIeltsProgress(session.userId) });
  } catch {
    return json({ error: 'Progress unavailable' }, 503);
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return json({ error: 'Unauthorized' }, 401);
  if (assertMatchingOrigin(request)) return json({ error: 'Forbidden' }, 403);
  if (request.headers.get('x-ielts-user') !== session.userId) return json({ error: 'Account changed' }, 409);
  const { limited } = await rateLimit(`ielts-progress:${session.userId}:${getClientIp(request)}`, 30, 60_000, { fallback: 'memory' });
  if (limited) return json({ error: 'Too many requests' }, 429);

  const input = ToggleSchema.safeParse(await readInput(request));
  if (!input.success) return json({ error: 'Invalid request' }, 400);

  try {
    const entry = await toggleIeltsProgress(session.userId, input.data.slug, input.data.kind);
    return json({ userId: session.userId, progress: entry });
  } catch {
    return json({ error: 'Could not save progress' }, 503);
  }
}
