import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { getSession } from '@/lib/auth';
import { findProduct } from '@/lib/products';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

/**
 * 免费入库 —— 把带 ¥0 档位的产品记进当前账号。
 *
 * 免费产品以前是个死路：定价卡的「免费开始」跳到 /products/{id}#download，
 * 而多数产品根本没有下载区；站内应用又要求 entitlement 才能打开，
 * 免费用户永远拿不到 —— 等于免费档买不到也用不了。
 *
 * 实现上复用 orders：写一条 ¥0 的已支付订单，`getUserEntitlements` 照常认，
 * 「我的产品」「订单记录」也都不用改。**不发授权码、不发邮件**，
 * 所以 delivery_status 用 'not_required'：既绕开 /api/payment/delivery-retry
 * 的重试队列（它只捞 failed/pending/processing），
 * 又能通过授权判定里「未交付订单不查授权码状态」那条。
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { limited } = await rateLimit(`claim:${ip}`, 20, 60_000, { fallback: 'memory' });
  if (limited) {
    return NextResponse.json({ error: '请求过于频繁，请稍后再试' }, { status: 429 });
  }

  // 授权绑定到账号，必须先登录
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const productId = typeof body?.productId === 'string' ? body.productId : '';

  const product = findProduct(productId);
  if (!product) {
    return NextResponse.json({ error: '产品不存在' }, { status: 400 });
  }

  // 能不能免费拿只看当前价：限免产品的原价留在 originalPrice 里，不参与判断
  const freeTier = product.pricing.find((tier) => tier.price === 0);
  if (!freeTier) {
    return NextResponse.json({ error: '该产品没有免费档，请购买后使用' }, { status: 400 });
  }

  // 幂等：已经拥有就直接返回成功，重复点击不该堆出一串 ¥0 订单
  const [existing] = await db
    .select({ id: orders.id })
    .from(orders)
    .where(
      and(
        eq(orders.productId, productId),
        eq(orders.userId, session.userId),
        eq(orders.status, 'paid'),
      ),
    )
    .limit(1);

  if (existing) {
    return NextResponse.json({ success: true, alreadyOwned: true });
  }

  const now = new Date().toISOString();
  await db.insert(orders).values({
    id: crypto.randomUUID(),
    productId,
    planName: freeTier.name.zh,
    email: session.email,
    userId: session.userId,
    amountCny: 0,
    paymentMethod: 'free',
    status: 'paid',
    billingPeriod: 'lifetime',
    deliveryStatus: 'not_required',
    accessToken: crypto.randomUUID(),
    paidAt: now,
    createdAt: now,
  });

  return NextResponse.json({ success: true, alreadyOwned: false });
}
