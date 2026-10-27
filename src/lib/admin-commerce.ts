import { and, desc, eq, inArray, ne } from 'drizzle-orm';
import { db } from './db';
import { licenseKeys, orders, paymentRefundAttempts } from './db/schema';
import { getPaymentRefundSummary, requestPaymentRefund } from './payment-refunds';

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
      paymentMethod: orders.paymentMethod,
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
  const attempts = orderRows.length ? await db.select().from(paymentRefundAttempts)
    .where(inArray(paymentRefundAttempts.orderId, orderRows.map(order => order.id))) : [];
  return { orders: orderRows.map(order => ({ ...order, ...getPaymentRefundSummary(order, attempts.filter(attempt => attempt.orderId === order.id)) })), licenses: licenseRows };
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

/** 两种支付渠道都以持久尝试和确认结果收回权益，受理/超时不等于已退款。 */
export async function refundOrder(orderId: string): Promise<'refunded' | 'processing' | 'skipped' | 'not-found'> {
  return requestPaymentRefund(orderId);
}
