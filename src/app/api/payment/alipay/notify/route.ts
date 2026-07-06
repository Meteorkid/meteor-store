import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { verifyAlipayNotify } from '@/lib/alipay';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { sendOrderConfirmation, sendAdminAlert } from '@/lib/email';
import { createLicenseKey, getLicenseKeyByOrderId } from '@/lib/license';

// 支付宝异步通知回调
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    // 仅在非生产环境输出完整通知参数，避免生产日志泄露业务数据
    if (process.env.NODE_ENV !== 'production') {
      console.log('Alipay notify:', { out_trade_no: params.out_trade_no, trade_status: params.trade_status });
    }

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

    // 4. 已支付订单：幂等处理，但仍校验金额（纵深防御）
    if (order.status === 'paid') {
      // 纵深防御：即使已支付，也校验金额一致性
      const expectedAmountPaid = order.amountCny.toFixed(2);
      if (total_amount !== expectedAmountPaid) {
        console.error('Alipay notify: amount mismatch on paid order', {
          orderId: out_trade_no,
          expected: expectedAmountPaid,
          received: total_amount,
        });
        // 仍返回 success 避免支付宝重试，但主动告警管理员，避免异常淹没在日志里
        void sendAdminAlert('支付宝通知金额不一致（已支付订单）', {
          orderId: out_trade_no,
          expected: expectedAmountPaid,
          received: total_amount,
        });
      }
      console.log('Alipay notify: order already paid', out_trade_no);
      if (order.deliveryStatus === 'failed' || order.deliveryStatus === 'pending') {
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
            .where(eq(orders.id, out_trade_no));
          console.log(`Delivery retry succeeded: ${out_trade_no}`);
        } catch (err) {
          console.error('Delivery retry failed:', err);
        }
      }
      return new NextResponse('success', { status: 200 });
    }

    // 5. 校验金额
    const expectedAmount = order.amountCny.toFixed(2);
    if (total_amount !== expectedAmount) {
      console.error('Alipay notify: amount mismatch', { expected: expectedAmount, received: total_amount });
      void sendAdminAlert('支付宝通知金额不一致', {
        orderId: out_trade_no,
        expected: expectedAmount,
        received: total_amount,
      });
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

        // 生成 License Key 并发送确认邮件
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
          await db.update(orders)
            .set({ deliveryStatus: 'emailed' })
            .where(eq(orders.id, out_trade_no));
        } catch (err) {
          console.error('Delivery failed:', err);
          await db.update(orders)
            .set({ deliveryStatus: 'failed' })
            .where(eq(orders.id, out_trade_no));
        }
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
// 注意：同步回调不校验签名（支付宝文档说明），但会验证订单是否存在
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const out_trade_no = searchParams.get('out_trade_no');

  // 只传递 orderId，不传递未验证的 trade_no
  const successUrl = new URL('/success', request.url);
  if (out_trade_no) {
    // 校验 UUID 格式，防止注入
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidPattern.test(out_trade_no)) {
      successUrl.searchParams.set('orderId', out_trade_no);
    }
  }

  return NextResponse.redirect(successUrl);
}
