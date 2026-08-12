import { NextRequest, NextResponse } from 'next/server';
import { eq, and, ne } from 'drizzle-orm';
import { parseWechatNotify, parseWechatRefundNotify } from '@/lib/wechat';
import { db } from '@/lib/db';
import { orders, licenseKeys } from '@/lib/db/schema';
import { sendAdminAlert } from '@/lib/email';
import { fulfillOrder } from '@/lib/order-fulfillment';

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
      return handleRefundNotify(rawBody, headers, eventType);
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

/**
 * 微信退款终态回写：
 * - REFUND.SUCCESS          钱已原路退回：确保订单 refunded、授权码 revoked（幂等）。
 *                           站内发起退款时订单已翻 refunded，这里兜底商户平台手动退款、以及
 *                           refundOrder 撤销授权码前进程崩溃的窗口。
 * - REFUND.ABNORMAL/CLOSED  钱没退成：站内受理退款时订单已翻 refunded 并撤销授权码，
 *                           回滚 paid 并恢复授权码，用户「钱没退、访问权不能丢」；
 *                           仅订单仍是 refunded 时才恢复授权码，避免复活管理员手动撤销的 key。
 */
async function handleRefundNotify(
  rawBody: string,
  headers: Headers,
  eventType: string,
): Promise<NextResponse> {
  const refund = parseWechatRefundNotify(rawBody, headers);
  if (!refund) {
    console.error('Invalid wechat refund notify signature');
    return new NextResponse('FAIL', { status: 500 });
  }

  const { outTradeNo, refundStatus, refundAmount, totalAmount } = refund;
  if (process.env.NODE_ENV !== 'production') {
    console.log('Wechat refund notify:', { outTradeNo, eventType, refundStatus, refundAmount });
  }

  const [order] = await db.select().from(orders).where(eq(orders.id, outTradeNo)).limit(1);
  if (!order) {
    console.error('Wechat refund notify: order not found', outTradeNo);
    return new NextResponse('FAIL', { status: 500 });
  }

  if (eventType === 'REFUND.SUCCESS') {
    return handleRefundSuccess(order, outTradeNo, refundAmount, totalAmount);
  }
  return handleRefundFailed(order, outTradeNo, eventType);
}

async function handleRefundSuccess(
  order: typeof orders.$inferSelect,
  outTradeNo: string,
  refundAmount: number,
  totalAmount: number,
): Promise<NextResponse> {
  // 站内只支持全额退款。商户平台手动发起部分退款时不做自动回写，转人工处理。
  if (order.status === 'paid') {
    const expectedAmount = order.amountCny * 100;
    if (refundAmount !== expectedAmount || totalAmount !== expectedAmount) {
      console.error('Wechat refund notify: partial refund needs manual review', {
        orderId: outTradeNo,
        expected: expectedAmount,
        refund: refundAmount,
        total: totalAmount,
      });
      void sendAdminAlert('微信部分退款需人工处理', {
        orderId: outTradeNo,
        expected: String(expectedAmount),
        refund: String(refundAmount),
        total: String(totalAmount),
      });
      return new NextResponse('SUCCESS', { status: 200 });
    }

    const updateResult = await db.update(orders)
      .set({ status: 'refunded' })
      .where(and(eq(orders.id, outTradeNo), eq(orders.status, 'paid')));
    const rowCount = (updateResult as { rowCount: number }).rowCount ?? 0;
    if (rowCount > 0) {
      console.log(`Refund success (wechat): ${outTradeNo}, amount: ${refundAmount}`);
    } else {
      console.log('Wechat refund notify: order not in paid state (concurrent)', outTradeNo);
    }
  }

  // 无论订单此前是什么状态，退款成功后都确保授权码已撤销（幂等），收回 key 来源的访问权。
  await db.update(licenseKeys)
    .set({ status: 'revoked' })
    .where(and(eq(licenseKeys.orderId, outTradeNo), ne(licenseKeys.status, 'revoked')));

  return new NextResponse('SUCCESS', { status: 200 });
}

async function handleRefundFailed(
  order: typeof orders.$inferSelect,
  outTradeNo: string,
  eventType: string,
): Promise<NextResponse> {
  let rolledBack = false;
  if (order.status === 'refunded') {
    const updateResult = await db.update(orders)
      .set({ status: 'paid' })
      .where(and(eq(orders.id, outTradeNo), eq(orders.status, 'refunded')));
    const rowCount = (updateResult as { rowCount: number }).rowCount ?? 0;
    rolledBack = rowCount > 0;
    if (rolledBack) {
      // 恢复站内退款时撤销的授权码：key 是同一订单发出的，钱没退成用户应保有权益。
      await db.update(licenseKeys)
        .set({ status: 'active' })
        .where(and(eq(licenseKeys.orderId, outTradeNo), eq(licenseKeys.status, 'revoked')));
      console.log(`Wechat refund ${eventType}: order rolled back to paid`, outTradeNo);
    }
  }

  void sendAdminAlert(`微信退款${eventType === 'REFUND.CLOSED' ? '已关闭' : '异常'}`, {
    orderId: outTradeNo,
    eventType,
    note: rolledBack ? '订单已回滚为 paid 并恢复授权码，请复核退款状态' : '订单未变更，请人工复核',
  });
  return new NextResponse('SUCCESS', { status: 200 });
}

