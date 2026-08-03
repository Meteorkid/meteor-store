import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { verifyAlipayNotify } from '@/lib/alipay';
import { createOrderAccess } from '@/lib/order-access';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function successUrl(request: NextRequest, orderId?: string): URL {
  const url = new URL('/success', request.url);
  if (orderId) url.searchParams.set('orderId', orderId);
  return url;
}

/**
 * 支付宝同步回跳只负责建立短时订单查看凭证，不修改支付状态。
 * 支付结果始终以服务端异步 POST 通知为准。
 */
export async function GET(request: NextRequest) {
  const params = Object.fromEntries(new URL(request.url).searchParams.entries());
  const orderId = params.out_trade_no;

  if (
    !orderId ||
    !UUID_PATTERN.test(orderId) ||
    params.app_id !== process.env.ALIPAY_APP_ID ||
    !verifyAlipayNotify(params)
  ) {
    return NextResponse.redirect(successUrl(request));
  }

  const [order] = await db
    .select({ id: orders.id })
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);
  if (!order) return NextResponse.redirect(successUrl(request));

  await createOrderAccess(order.id);
  return NextResponse.redirect(successUrl(request, order.id));
}
