import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { verifyAlipayNotify } from '@/lib/alipay';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { sendOrderConfirmation } from '@/lib/email';

// 支付宝异步通知回调
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    console.log('Alipay notify:', { out_trade_no: params.out_trade_no, trade_status: params.trade_status });

    // 1. 验证签名
    const isValid = verifyAlipayNotify(params);
    if (!isValid) {
      console.error('Invalid alipay notify signature');
      return new NextResponse('fail', { status: 400 });
    }

    const {
      trade_status,
      out_trade_no,
      total_amount,
      app_id,
      seller_id,
    } = params;

    // 2. 业务校验：核对 app_id 和 seller_id
    if (app_id !== process.env.ALIPAY_APP_ID) {
      console.error('Alipay notify: app_id mismatch', app_id);
      return new NextResponse('fail', { status: 400 });
    }
    if (!process.env.ALIPAY_SELLER_ID) {
      console.error('Alipay notify: ALIPAY_SELLER_ID not configured');
      return new NextResponse('fail', { status: 500 });
    }
    if (seller_id !== process.env.ALIPAY_SELLER_ID) {
      console.error('Alipay notify: seller_id mismatch', seller_id);
      return new NextResponse('fail', { status: 400 });
    }

    // 3. 查询订单
    const [order] = await db.select().from(orders).where(eq(orders.id, out_trade_no)).limit(1);

    if (!order) {
      console.error('Alipay notify: order not found', out_trade_no);
      return new NextResponse('fail', { status: 400 });
    }

    // 4. 幂等处理：已支付的订单不重复处理
    if (order.status === 'paid') {
      console.log('Alipay notify: order already paid', out_trade_no);
      return new NextResponse('success', { status: 200 });
    }

    // 5. 校验金额
    const expectedAmount = order.amountCny.toFixed(2);
    if (total_amount !== expectedAmount) {
      console.error('Alipay notify: amount mismatch', { expected: expectedAmount, received: total_amount });
      return new NextResponse('fail', { status: 400 });
    }

    // 6. 只处理成功的交易
    if (trade_status === 'TRADE_SUCCESS' || trade_status === 'TRADE_FINISHED') {
      // 原子更新：仅当 status 仍为 pending 时才更新，防止 TOCTOU 竞态
      const updateResult = await db.update(orders)
        .set({
          status: 'paid',
          alipayTradeNo: params.trade_no || null,
          paidAt: new Date().toISOString(),
        })
        .where(and(
          eq(orders.id, out_trade_no),
          eq(orders.status, 'pending'),
        ));

      // 只有实际更新了记录才发邮件，避免重复发送
      // Neon HTTP 驱动返回 rowCount 属性
      const rowCount = (updateResult as { rowCount: number }).rowCount ?? 0;
      if (rowCount > 0) {
        console.log(`Payment success: ${out_trade_no}, amount: ${total_amount}`);

        sendOrderConfirmation({
          email: order.email,
          orderId: order.id,
          productId: order.productId,
          planName: order.planName,
          amount: order.amountCny,
        }).catch((err) => console.error('Failed to send confirmation email:', err));
      } else {
        console.log('Alipay notify: order already processed (concurrent)', out_trade_no);
      }
    }

    return new NextResponse('success', { status: 200 });
  } catch (error) {
    console.error('Alipay notify error:', error);
    return new NextResponse('fail', { status: 500 });
  }
}

// 支付宝同步回调（用户支付完成后跳转）
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const out_trade_no = searchParams.get('out_trade_no');
  const trade_no = searchParams.get('trade_no');

  const successUrl = new URL('/success', request.url);
  if (out_trade_no) successUrl.searchParams.set('orderId', out_trade_no);
  if (trade_no) successUrl.searchParams.set('tradeNo', trade_no);

  return NextResponse.redirect(successUrl);
}
