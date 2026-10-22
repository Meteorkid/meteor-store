import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { isAdminSession } from '@/lib/admin';
import { getProductUpdateState, ProductUpdateError } from '@/lib/product-updates/service';

export const dynamic = 'force-dynamic';

function privateJson(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function GET() {
  const session = await getSession();
  if (!session || !isAdminSession(session)) return privateJson({ error: 'Not found' }, 404);
  try {
    return privateJson({ userId: session.userId, state: await getProductUpdateState() });
  } catch (error) {
    if (error instanceof ProductUpdateError) return privateJson({ error: error.message }, error.status);
    return privateJson({ error: '产品更新状态暂时无法读取' }, 503);
  }
}
