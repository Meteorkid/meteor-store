import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { assertMatchingOrigin } from '@/lib/csrf';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import {
  getListeningPracticeOverview, ListeningAttemptError, saveListeningAttempt,
} from '@/lib/ielts-listening/attempts';

/**
 * 雅思听力的练习记录与错题本。
 *
 * 记录页是私有的：未登录 401，响应 no-store。POST 只收作答，分数与错题号
 * 由服务端重算；写接口校验 Origin 和当前账号，账号在别的标签页切换过就返回 409，
 * 避免把 A 的练习记到 B 名下。
 */

const headers = { 'Cache-Control': 'no-store' };
const json = (data: unknown, status = 200) => NextResponse.json(data, { status, headers });
const BODY_LIMIT = 8 * 1024;

/** 有界读流：不能只看 Content-Length，分块请求也必须受限。 */
async function readBody(request: Request): Promise<unknown> {
  if (!request.body) return null;
  if (Number(request.headers.get('content-length')) > BODY_LIMIT) {
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
      if (total > BODY_LIMIT) {
        void reader.cancel().catch(() => undefined);
        return null;
      }
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown;
  } catch {
    return null;
  } finally {
    reader.releaseLock();
  }
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return json({ error: 'Unauthorized' }, 401);
  const { limited } = await rateLimit(`ielts-listening-attempts-read:${session.userId}:${getClientIp(request)}`, 60, 60_000, { fallback: 'memory' });
  if (limited) return json({ error: 'Too many requests' }, 429);
  try {
    return json({ userId: session.userId, ...await getListeningPracticeOverview(session.userId) });
  } catch (error) {
    if (error instanceof ListeningAttemptError) return json({ error: error.code }, error.status);
    return json({ error: 'Practice history unavailable' }, 503);
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return json({ error: 'Unauthorized' }, 401);
  if (assertMatchingOrigin(request)) return json({ error: 'Forbidden' }, 403);
  if (request.headers.get('x-study-user') !== session.userId) return json({ error: 'Account changed' }, 409);
  const { limited } = await rateLimit(`ielts-listening-attempts:${session.userId}:${getClientIp(request)}`, 20, 60_000, { fallback: 'memory' });
  if (limited) return json({ error: 'Too many requests' }, 429);

  try {
    const attempt = await saveListeningAttempt(session.userId, await readBody(request));
    return json({ userId: session.userId, attempt });
  } catch (error) {
    if (error instanceof ListeningAttemptError) return json({ error: error.code }, error.status);
    return json({ error: 'Could not save attempt' }, 503);
  }
}
