import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { isAdminSession } from '@/lib/admin';
import { logAdminAction } from '@/lib/admin-audit';
import { assertMatchingOrigin } from '@/lib/csrf';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { checkProductUpdates, ProductUpdateError } from '@/lib/product-updates/service';

export const dynamic = 'force-dynamic';

function privateJson(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

async function hasRequestBody(request: Request) {
  if (!request.body) return false;
  const reader = request.body.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return false;
      if (value.byteLength > 0) {
        await reader.cancel();
        return true;
      }
    }
  } catch {
    return true;
  } finally {
    reader.releaseLock();
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || !isAdminSession(session)) return privateJson({ error: 'Not found' }, 404);
  if (assertMatchingOrigin(request)) return privateJson({ error: 'Forbidden' }, 403);
  const ip = getClientIp(request);
  const { limited } = await rateLimit(`admin-product-updates:check:${session.userId}:${ip}`, 5, 60_000, { fallback: 'memory' });
  if (limited) return privateJson({ error: '操作过于频繁，请稍后再试' }, 429);
  if (await hasRequestBody(request)) return privateJson({ error: '检查操作不接受自定义来源或参数' }, 400);
  try {
    const check = await checkProductUpdates();
    await logAdminAction(session, {
      action: 'product-updates.check', targetType: 'product-update-check', targetId: check.id,
      detail: { products: check.rows.length, updates: check.rows.filter(row => row.status === 'update').length }, ip,
    });
    return privateJson({ userId: session.userId, check });
  } catch (error) {
    if (error instanceof ProductUpdateError) return privateJson({ error: error.message }, error.status);
    return privateJson({ error: '产品更新检查失败，请稍后重试' }, 503);
  }
}
