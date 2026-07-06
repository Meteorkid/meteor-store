import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { eq, and, or } from 'drizzle-orm';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { sendOrderConfirmation } from '@/lib/email';
import { createLicenseKey, getLicenseKeyByOrderId } from '@/lib/license';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

// 批量重试涉及多个邮件发送 IO，显式延长 Vercel 函数超时时间
export const maxDuration = 60;

/**
 * 手动重试邮件交付
 * 用法：POST /api/payment/delivery-retry
 * Header: Authorization: Bearer <DELIVERY_RETRY_SECRET>
 * Body: { orderId?: string } — 指定单个订单；不传则批量重试所有失败订单
 */
export async function POST(request: NextRequest) {
  // token 鉴权（常数时间比较，防时序侧信道）
  const authHeader = request.headers.get('authorization') || '';
  const secret = process.env.DELIVERY_RETRY_SECRET;
  const expected = `Bearer ${secret}`;
  const a = Buffer.from(authHeader);
  const b = Buffer.from(expected);
  if (!secret || a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  // 限流：每 IP 每分钟最多 5 次（涉及批量发信成本，Redis 异常时 fail-closed）
  const ip = getClientIp(request);
  const { limited } = await rateLimit(`delivery-retry:${ip}`, 5, 60_000, { failClosed: true });
  if (limited) {
    return NextResponse.json({ error: '请求过于频繁' }, { status: 429 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { orderId } = body as { orderId?: string };

    // 查询需要重试的订单
    let failedOrders;
    if (orderId) {
      const [order] = await db.select().from(orders)
        .where(and(
          eq(orders.id, orderId),
          eq(orders.status, 'paid'),
          or(
            eq(orders.deliveryStatus, 'failed'),
            eq(orders.deliveryStatus, 'pending'),
          ),
        ))
        .limit(1);
      failedOrders = order ? [order] : [];
    } else {
      // 批量重试时限制最多 50 个订单，避免超时
      failedOrders = await db.select().from(orders)
        .where(and(
          eq(orders.status, 'paid'),
          or(
            eq(orders.deliveryStatus, 'failed'),
            eq(orders.deliveryStatus, 'pending'),
          ),
        ))
        .limit(50);
    }

    if (failedOrders.length === 0) {
      return NextResponse.json({ success: true, retried: 0, message: '没有需要重试的订单' });
    }

    const results = await Promise.allSettled(
      failedOrders.map(async (order) => {
        try {
          let licenseKey = (await getLicenseKeyByOrderId(order.id))?.key;
          if (!licenseKey) {
            licenseKey = await createLicenseKey({
              orderId: order.id,
              productId: order.productId,
              planName: order.planName,
              email: order.email,
            });
          }
          await sendOrderConfirmation({
            email: order.email,
            orderId: order.id,
            productId: order.productId,
            planName: order.planName,
            amount: order.amountCny,
            licenseKey,
            accessToken: order.accessToken,
          });
          await db.update(orders)
            .set({ deliveryStatus: 'emailed' })
            .where(eq(orders.id, order.id));
          return { orderId: order.id, status: 'emailed' as const };
        } catch (err) {
          console.error(`Delivery retry failed for ${order.id}:`, err);
          await db.update(orders)
            .set({ deliveryStatus: 'failed' })
            .where(eq(orders.id, order.id));
          return { orderId: order.id, status: 'failed' as const };
        }
      })
    );

    const succeeded = results.filter(r => r.status === 'fulfilled' && r.value.status === 'emailed').length;
    const failed = results.length - succeeded;

    return NextResponse.json({
      success: true,
      retried: failedOrders.length,
      succeeded,
      failed,
    });
  } catch (error) {
    console.error('Delivery retry error:', error);
    return NextResponse.json({ error: '重试失败' }, { status: 500 });
  }
}
