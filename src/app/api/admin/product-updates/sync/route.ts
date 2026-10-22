import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { isAdminSession } from '@/lib/admin';
import { logAdminAction } from '@/lib/admin-audit';
import { assertMatchingOrigin } from '@/lib/csrf';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { startProductUpdateSync, ProductUpdateError } from '@/lib/product-updates/service';

export const dynamic = 'force-dynamic';
const SyncSchema = z.object({ checkId: z.string().uuid() }).strict();

function privateJson(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

async function readBody(request: Request): Promise<unknown> {
  if (!request.body) return null;
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 1024) {
        await reader.cancel();
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

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || !isAdminSession(session)) return privateJson({ error: 'Not found' }, 404);
  if (assertMatchingOrigin(request)) return privateJson({ error: 'Forbidden' }, 403);
  const ip = getClientIp(request);
  const { limited } = await rateLimit(`admin-product-updates:sync:${session.userId}:${ip}`, 5, 60_000, { fallback: 'memory' });
  if (limited) return privateJson({ error: '操作过于频繁，请稍后再试' }, 429);
  const parsed = SyncSchema.safeParse(await readBody(request));
  if (!parsed.success) return privateJson({ error: '请提供有效的检查 ID' }, 400);
  try {
    const job = await startProductUpdateSync(parsed.data.checkId);
    await logAdminAction(session, {
      action: 'product-updates.sync', targetType: 'product-update-job', targetId: job.id,
      detail: { checkId: job.checkId, products: job.rows.length }, ip,
    });
    return privateJson({ userId: session.userId, job }, 202);
  } catch (error) {
    if (error instanceof ProductUpdateError) return privateJson({ error: error.message }, error.status);
    return privateJson({ error: '产品同步暂时无法启动' }, 503);
  }
}
