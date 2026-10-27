import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { parseWechatNotify, parseWechatRefundNotify } from '@/lib/wechat';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { sendAdminAlert } from '@/lib/email';
import { fulfillOrder } from '@/lib/order-fulfillment';
import { applyWechatRefundSnapshot } from '@/lib/payment-refunds';

/** 微信退款结果回调事件：成功 / 异常（渠道侧需人工介入）/ 已关闭（退款失败终态）。 */
const REFUND_EVENT_TYPES = ['REFUND.SUCCESS', 'REFUND.ABNORMAL', 'REFUND.CLOSED'];

/** 从回调包体里读 event_type，只用于分流；验签在各自解析函数内部完成。 */
function readEventType(rawBody: string): string {
  try {
    const payload = JSON.parse(rawBody) as { event_type?: unknown };
    return String(payload.event_type ?? '');
  } catch {
    return '';
  }
}

// 微信支付异步通知回调（API v3）。
// 回调包体是 AES-256-GCM 加密的，需用 API v3 密钥解密；请求头带 Wechatpay-Signature，
// 用平台公钥验签。返回纯文本，微信要求 2xx 之外的响应会重试。
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const headers = request.headers;

    // 0. 退款结果回调分流：终态事件直接走退款回写，其余走支付流程。
    const eventType = readEventType(rawBody);
    if (REFUND_EVENT_TYPES.includes(eventType)) {
      return await handleRefundNotify(rawBody, headers, eventType);
    }

    // 1. 验签 + 解密。验签失败返回 500，让微信稍后重试（避免误判拒绝导致丢单）。
    const paid = parseWechatNotify(rawBody, headers);
    if (!paid) {
      console.error('Invalid wechat notify signature');
      return new NextResponse('FAIL', { status: 500 });
    }

    const { outTradeNo, transactionId, total, tradeState } = paid;

    if (process.env.NODE_ENV !== 'production') {
      console.log('Wechat notify:', { out_trade_no: outTradeNo, trade_state: tradeState });
    }

    // 2. 只处理支付成功的交易
    if (tradeState !== 'SUCCESS') {
      console.log('Wechat notify: non-success trade state', { outTradeNo, tradeState });
      return new NextResponse('SUCCESS', { status: 200 });
    }

    // 3. 查询订单
    const [order] = await db.select().from(orders).where(eq(orders.id, outTradeNo)).limit(1);
    if (!order) {
      console.error('Wechat notify: order not found', outTradeNo);
      return new NextResponse('FAIL', { status: 500 });
    }

    // 4. 已支付订单：幂等处理，但仍校验金额（纵深防御）
    if (order.status === 'paid') {
      const expectedAmount = order.amountCny * 100;
      if (total !== expectedAmount) {
        console.error('Wechat notify: amount mismatch on paid order', {
          orderId: outTradeNo,
          expected: expectedAmount,
          received: total,
        });
        void sendAdminAlert('微信通知金额不一致（已支付订单）', {
          orderId: outTradeNo,
          expected: String(expectedAmount),
          received: String(total),
        });
      }
      if (order.deliveryStatus !== 'emailed') {
        await fulfillOrder(order.id);
      }
      return new NextResponse('SUCCESS', { status: 200 });
    }

    // 5. 校验金额
    const expectedAmount = order.amountCny * 100;
    if (total !== expectedAmount) {
      console.error('Wechat notify: amount mismatch', { expected: expectedAmount, received: total });
      void sendAdminAlert('微信通知金额不一致', {
        orderId: outTradeNo,
        expected: String(expectedAmount),
        received: String(total),
      });
      return new NextResponse('FAIL', { status: 500 });
    }

    // 6. 原子更新：仅当 status 仍为 pending 时才更新，防止 TOCTOU 竞态。
    //    alipayTradeNo 列复用为通用外部交易号，同时承接支付宝 trade_no 与微信 transaction_id。
    const updateResult = await db.update(orders)
      .set({
        status: 'paid',
        alipayTradeNo: transactionId || null,
        paidAt: new Date().toISOString(),
      })
      .where(and(
        eq(orders.id, outTradeNo),
        eq(orders.status, 'pending'),
      ));

    const rowCount = (updateResult as { rowCount: number }).rowCount ?? 0;
    if (rowCount > 0) {
      console.log(`Payment success (wechat): ${outTradeNo}, amount: ${total}`);
      await fulfillOrder(order.id);
    } else {
      console.log('Wechat notify: order already processed (concurrent)', outTradeNo);
    }

    return new NextResponse('SUCCESS', { status: 200 });
  } catch (error) {
    console.error('Wechat notify error:', error);
    return new NextResponse('FAIL', { status: 500 });
  }
}

/** 退款号、金额、交易号与终态由共享状态机校验并持久化，不做失败回调“复活”。 */
async function handleRefundNotify(rawBody: string, headers: Headers, eventType: string): Promise<NextResponse> {
  const refund = parseWechatRefundNotify(rawBody, headers);
  if (!refund || eventType !== `REFUND.${refund.refundStatus}`) {
    return new NextResponse('FAIL', { status: 500 });
  }
  const { attempt, changed } = await applyWechatRefundSnapshot(refund);
  if (changed && (attempt.needsReview || attempt.status === 'CLOSED')) {
    void sendAdminAlert('微信退款状态需核验', {
      orderId: attempt.orderId,
      outRefundNo: attempt.requestNo,
      status: attempt.status,
      note: attempt.needsReview ? '部分退款、退款异常或历史状态不明，请在商户平台人工核验；未自动恢复授权' : '退款已关闭，原付费权益保持不变',
    });
  }
  return new NextResponse('SUCCESS', { status: 200 });
}
