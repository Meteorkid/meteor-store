import { and, desc, eq, ne } from 'drizzle-orm';
import { db } from './db';
import { licenseKeys, orders } from './db/schema';
import { refundAlipayOrder } from './alipay';
import { refundWechatOrder } from './wechat';

export async function listCommerceOperations() {
  const [orderRows, licenseRows] = await Promise.all([
    db.select({
      id: orders.id,
      productId: orders.productId,
      planName: orders.planName,
      email: orders.email,
      amountCny: orders.amountCny,
      status: orders.status,
      deliveryStatus: orders.deliveryStatus,
      alipayTradeNo: orders.alipayTradeNo,
      paidAt: orders.paidAt,
      createdAt: orders.createdAt,
    }).from(orders).orderBy(desc(orders.createdAt)).limit(100),
    db.select({
      id: licenseKeys.id,
      orderId: licenseKeys.orderId,
      productId: licenseKeys.productId,
      planName: licenseKeys.planName,
      email: licenseKeys.email,
      key: licenseKeys.key,
      status: licenseKeys.status,
      createdAt: licenseKeys.createdAt,
    }).from(licenseKeys).orderBy(desc(licenseKeys.createdAt)).limit(100),
  ]);
  return { orders: orderRows, licenses: licenseRows };
}

export async function setLicenseStatus(
  licenseId: string,
  status: 'active' | 'revoked',
): Promise<boolean> {
  const result = await db
    .update(licenseKeys)
    .set({ status })
    .where(and(eq(licenseKeys.id, licenseId), ne(licenseKeys.status, status)));
  return (result.rowCount ?? 0) > 0;
}

/**
 * 退款：先原子抢占订单（paid → refunded），再调支付宝原路退款，最后撤销关联授权码。
 *
 * 并发安全：用条件更新（WHERE status='paid'）抢占，两个管理员同时点只有一人能成功，
 * 另一人命中不到返回 'skipped'。若支付宝退款失败则回滚 refunded → paid 并抛错，
 * 避免「钱没退但订单已标退款」。
 *
 * 订单来源的 entitlement 靠 `orders.status='paid'` 判定，状态翻成 refunded 即收回访问权；
 * 授权码来源的 entitlement 要求 `licenseKeys.status='active'`，这里一并撤销，两条来源都闭环。
 *
 * 返回 'refunded'（成功）/ 'skipped'（订单存在但已不是 paid）/ 'not-found'。
 */
export async function refundOrder(
  orderId: string,
): Promise<'refunded' | 'skipped' | 'not-found'> {
  // 1. 原子抢占：仅当订单仍是 paid 时翻成 refunded。未命中分两种情况区分。
  const [order] = await db
    .update(orders)
    .set({ status: 'refunded' })
    .where(and(eq(orders.id, orderId), eq(orders.status, 'paid')))
    .returning({
      id: orders.id,
      paymentMethod: orders.paymentMethod,
      alipayTradeNo: orders.alipayTradeNo,
      amountCny: orders.amountCny,
    });

  if (!order) {
    const existing = await db
      .select({ id: orders.id })
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);
    return existing.length ? 'skipped' : 'not-found';
  }

  // 2. 按支付渠道原路退款。若渠道拒绝，回滚状态并抛错。
  try {
    if (order.paymentMethod === 'alipay') {
      if (!order.alipayTradeNo) throw new Error('订单缺少支付宝交易号，无法原路退款');
      const result = await refundAlipayOrder({
        outTradeNo: order.id,
        tradeNo: order.alipayTradeNo,
        refundAmount: order.amountCny,
      });
      if (!result.success) {
        throw new Error(`支付宝拒绝退款（${result.code}）：${result.msg}`);
      }
    } else if (order.paymentMethod === 'wechat') {
      if (!order.alipayTradeNo) throw new Error('订单缺少微信交易号，无法原路退款');
      const result = await refundWechatOrder({
        outTradeNo: order.id,
        transactionId: order.alipayTradeNo,
        refundAmountCny: order.amountCny,
      });
      if (!result.success) {
        throw new Error(`微信拒绝退款（${result.code}）：${result.msg}`);
      }
    } else {
      throw new Error(`不支持的支付渠道：${order.paymentMethod}`);
    }
  } catch (error) {
    await rollbackToPaid(order.id);
    throw error;
  }

  // 3. 撤销已交付的授权码。即使这步失败，订单已 refunded，订单来源的授权也已失效；
  //    但为避免已发出的 key 仍被拿去用，这里尽力撤销。
  await db
    .update(licenseKeys)
    .set({ status: 'revoked' })
    .where(and(eq(licenseKeys.orderId, orderId), ne(licenseKeys.status, 'revoked')));

  return 'refunded';
}

/** 退款中途失败时把订单状态回滚回 paid，避免「钱没退但状态已退款」。 */
async function rollbackToPaid(orderId: string): Promise<void> {
  await db
    .update(orders)
    .set({ status: 'paid' })
    .where(and(eq(orders.id, orderId), eq(orders.status, 'refunded')));
}
