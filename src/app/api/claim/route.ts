import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { getSession } from '@/lib/auth';
import { findProduct } from '@/lib/products';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { assertMatchingOrigin } from '@/lib/csrf';
import { isSoftwareLicensingEnabled } from '@/lib/software-licenses/config';
import { SOFTWARE_PRODUCT_IDS } from '@/lib/software-licenses/types';

/**
 * 免费入库 —— 把带 ¥0 档位的产品记进当前账号。
 *
 * 免费产品以前是个死路：定价卡的「免费开始」跳到 /products/{id}#download，
 * 而多数产品根本没有下载区；站内应用又要求 entitlement 才能打开，
 * 免费用户永远拿不到 —— 等于免费档买不到也用不了。
 *
 * 实现上复用 orders：写一条 ¥0 的已支付订单，`getUserEntitlements` 照常认，
 * 「我的产品」「订单记录」也都不用改。
 *
 * 站内应用不需要交付物，deliveryStatus 用 'not_required'：既绕开
 * /api/payment/delivery-retry 的重试队列（它只捞 failed/pending/processing），
 * 又能通过授权判定里「未交付订单不查授权码状态」那条。
 *
 * 桌面软件（XIsland / XNook）不同：它们在限时免费期间也要发**永久激活码**，
 * 否则用户装完只能试用 14 天。这类订单写成 'pending' 并立即走 fulfillOrder ——
 * 与付费订单同一条履约路径：建 MC- 主授权 → 生成软件子码 → 发确认邮件 →
 * 标记 'emailed'。失败时订单留在 pending，由 delivery-retry 继续重试，不会丢单。
 */
export async function POST(request: NextRequest) {
  // CSRF 纵深防御：写接口必须来自本站 Origin
  const forbidden = assertMatchingOrigin(request);
  if (forbidden) return forbidden;

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

  // 即将上架的产品暂不出售，任何档位都不能领取
  if (product.status === 'coming_soon') {
    return NextResponse.json({ error: '该产品即将上架，暂未开放' }, { status: 400 });
  }

  // 能不能免费拿只看当前价：限免产品的原价留在 originalPrice 里，不参与判断
  const freeTier = product.pricing.find((tier) => tier.price === 0);
  if (!freeTier) {
    return NextResponse.json({ error: '该产品没有免费档，请购买后使用' }, { status: 400 });
  }

  // 桌面软件：需要发激活码，走完整履约；其余站内应用不需要交付物
  const needsDelivery = isSoftwareLicensingEnabled() && SOFTWARE_PRODUCT_IDS.some(id => id === productId);

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
  const orderId = crypto.randomUUID();
  await db.insert(orders).values({
    id: orderId,
    productId,
    planName: freeTier.name.zh,
    planId: freeTier.id,
    email: session.email,
    userId: session.userId,
    amountCny: 0,
    paymentMethod: 'free',
    status: 'paid',
    billingPeriod: 'lifetime',
    deliveryStatus: needsDelivery ? 'pending' : 'not_required',
    accessToken: crypto.randomUUID(),
    paidAt: now,
    createdAt: now,
  });

  // 桌面软件立即履约：建主授权 → 生成永久子码 → 发确认邮件。
  // 失败不撤销订单：它留在 pending，由 /api/payment/delivery-retry 继续重试，
  // 用户稍后在账户页仍能看到激活码，不会出现「钱没花、权益也没到」的空洞。
  let delivered = false;
  if (needsDelivery) {
    try {
      // 懒加载：履约链会带上邮件、授权等一整套依赖，站内应用的免费入库不该为它付冷启动成本。
      const { fulfillOrder } = await import('@/lib/order-fulfillment');
      delivered = (await fulfillOrder(orderId)).status === 'emailed';
    } catch (error) {
      console.error('Free claim fulfillment failed:', { orderId, productId, error });
    }
  }

  return NextResponse.json({ success: true, alreadyOwned: false, delivered });
}
