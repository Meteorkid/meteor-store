import { and, eq, inArray, isNull, lt, or } from 'drizzle-orm';
import { db } from './db';
import { orders } from './db/schema';
import { sendOrderConfirmation } from './email';
import { createLicenseKey } from './license';

const CLAIM_TIMEOUT_MS = 10 * 60_000;

export type FulfillmentResult = {
  status: 'emailed' | 'failed' | 'skipped';
};

/**
 * 原子认领并交付一笔已支付订单。
 * 同一时刻只有一个调用能进入发信阶段；进程崩溃后，十分钟以前的认领可被安全接管。
 */
export async function fulfillOrder(orderId: string): Promise<FulfillmentResult> {
  const claimedAt = new Date().toISOString();
  const staleBefore = new Date(Date.now() - CLAIM_TIMEOUT_MS).toISOString();

  const [order] = await db
    .update(orders)
    .set({ deliveryStatus: 'processing', deliveryClaimedAt: claimedAt })
    .where(
      and(
        eq(orders.id, orderId),
        eq(orders.status, 'paid'),
        or(
          inArray(orders.deliveryStatus, ['pending', 'failed']),
          and(
            eq(orders.deliveryStatus, 'processing'),
            or(
              isNull(orders.deliveryClaimedAt),
              lt(orders.deliveryClaimedAt, staleBefore),
            ),
          ),
        ),
      ),
    )
    .returning();

  if (!order) return { status: 'skipped' };

  try {
    const licenseKey = await createLicenseKey({
      orderId: order.id,
      productId: order.productId,
      planName: order.planName,
      email: order.email,
    });
    await sendOrderConfirmation({
      email: order.email,
      orderId: order.id,
      productId: order.productId,
      planName: order.planName,
      amount: order.amountCny,
      licenseKey,
      accessToken: order.accessToken,
    });
    await db
      .update(orders)
      .set({ deliveryStatus: 'emailed', deliveryClaimedAt: null })
      .where(
        and(
          eq(orders.id, order.id),
          eq(orders.deliveryStatus, 'processing'),
          eq(orders.deliveryClaimedAt, claimedAt),
        ),
      );
    return { status: 'emailed' };
  } catch (error) {
    console.error('Order fulfillment failed:', { orderId: order.id, error });
    await db
      .update(orders)
      .set({ deliveryStatus: 'failed', deliveryClaimedAt: null })
      .where(
        and(
          eq(orders.id, order.id),
          eq(orders.deliveryStatus, 'processing'),
          eq(orders.deliveryClaimedAt, claimedAt),
        ),
      );
    return { status: 'failed' };
  }
}
