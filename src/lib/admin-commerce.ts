import { and, desc, eq, ne } from 'drizzle-orm';
import { db } from './db';
import { licenseKeys, orders } from './db/schema';

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
 * 退款：订单状态 paid → refunded，并撤销关联授权码。
 *
 * 用条件更新（WHERE status='paid'）避免重复退款：订单一旦不是 paid，
 * 后续调用直接命中不到。订单来源的 entitlement 靠 `orders.status='paid'`
 * 判定，所以状态一翻成 refunded，访问权即收回；授权码来源的 entitlement
 * 要求 `licenseKeys.status='active'`，这里一并撤销，两条来源都闭环。
 *
 * 返回 'refunded'（成功）/ 'skipped'（订单存在但已不是 paid）/ 'not-found'。
 */
export async function refundOrder(
  orderId: string,
): Promise<'refunded' | 'skipped' | 'not-found'> {
  const [order] = await db
    .update(orders)
    .set({ status: 'refunded' })
    .where(and(eq(orders.id, orderId), eq(orders.status, 'paid')))
    .returning({ id: orders.id });

  if (!order) {
    const existing = await db
      .select({ id: orders.id })
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);
    return existing.length ? 'skipped' : 'not-found';
  }

  // 撤销已交付的授权码。即使这步失败，订单已 refunded，订单来源的授权也已失效；
  // 但为避免已发出的 key 仍被拿去用，这里尽力撤销。
  await db
    .update(licenseKeys)
    .set({ status: 'revoked' })
    .where(and(eq(licenseKeys.orderId, orderId), ne(licenseKeys.status, 'revoked')));

  return 'refunded';
}
