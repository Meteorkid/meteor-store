import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { isAdminSession } from '@/lib/admin';
import { createInviteCode, listInviteCodes, revokeInviteCode } from '@/lib/invite';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { products } from '@/data/products';

function forbidden() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function GET() {
  const session = await getSession();
  if (!session || !isAdminSession(session)) return forbidden();

  const codes = await listInviteCodes();
  return NextResponse.json({ codes });
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { limited } = await rateLimit(`admin-invite:ip:${ip}`, 30, 60_000, { fallback: 'memory' });
  if (limited) {
    return NextResponse.json({ error: '请求过于频繁' }, { status: 429 });
  }

  const session = await getSession();
  if (!session || !isAdminSession(session)) return forbidden();

  const body = await req.json().catch(() => null);
  const productId = typeof body?.productId === 'string' ? body.productId : '';
  const planName = typeof body?.planName === 'string' ? body.planName : '';
  const maxUses = typeof body?.maxUses === 'number' ? Math.max(1, Math.floor(body.maxUses)) : 1;
  const memo = typeof body?.memo === 'string' ? body.memo.trim() : undefined;
  const expiresAt = typeof body?.expiresAt === 'string' ? body.expiresAt : undefined;

  const product = products.find((p) => p.id === productId);
  if (!product) {
    return NextResponse.json({ error: '产品不存在' }, { status: 400 });
  }
  const plan = product.pricing.find((p) => p.name === planName);
  if (!plan) {
    return NextResponse.json({ error: '套餐不存在' }, { status: 400 });
  }

  const result = await createInviteCode({
    productId,
    planName,
    maxUses,
    memo,
    expiresAt,
    createdBy: session.email,
  });

  return NextResponse.json(result, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const ip = getClientIp(req);
  const { limited } = await rateLimit(`admin-invite:ip:${ip}`, 30, 60_000, { fallback: 'memory' });
  if (limited) {
    return NextResponse.json({ error: '请求过于频繁' }, { status: 429 });
  }

  const session = await getSession();
  if (!session || !isAdminSession(session)) return forbidden();

  const body = await req.json().catch(() => null);
  const id = typeof body?.id === 'string' ? body.id : '';
  const action = typeof body?.action === 'string' ? body.action : '';

  if (action !== 'revoke' || !id) {
    return NextResponse.json({ error: '参数无效' }, { status: 400 });
  }

  const ok = await revokeInviteCode(id);
  if (!ok) {
    return NextResponse.json({ error: '操作失败，邀请码可能已被撤销' }, { status: 409 });
  }

  return NextResponse.json({ success: true });
}
