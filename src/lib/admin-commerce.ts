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
