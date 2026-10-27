import { randomUUID } from 'node:crypto';
import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from './db';
import { licenseKeys, orders, paymentRefundAttempts } from './db/schema';
import { queryWechatRefund, refundWechatOrder, type WechatRefundNotify } from './wechat';
import { queryAlipayRefund, refundAlipayOrder } from './alipay';

type Attempt = typeof paymentRefundAttempts.$inferSelect;
type Order = typeof orders.$inferSelect;
type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
type Method = 'alipay' | 'wechat';
type Snapshot = Omit<WechatRefundNotify, 'outRefundNo'> & { requestNo: string; paymentMethod: Method };
const PENDING = new Set(['REQUESTING', 'PROCESSING', 'ABNORMAL', 'UNKNOWN']);
const timestamp = () => new Date().toISOString();
const interval = (method: string) => method === 'alipay' ? 10_000 : 60_000;

function confirmedFullRefund(attempt: Attempt, order: Pick<Order, 'amountCny'>): boolean {
  return attempt.status === 'SUCCESS' && !attempt.needsReview && attempt.refundAmount === order.amountCny * 100 && attempt.totalAmount === order.amountCny * 100;
}

export function getPaymentRefundSummary(order: Pick<Order, 'id' | 'amountCny' | 'paymentMethod' | 'status'>, attempts: Attempt[]) {
  const sorted = [...attempts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const current = sorted.find(item => confirmedFullRefund(item, order)) ?? sorted.find(item => item.needsReview)
    ?? sorted.find(item => PENDING.has(item.status)) ?? sorted[0];
  if (current) return { refundStatus: current.needsReview ? 'MANUAL_REVIEW' : current.status, outRefundNo: current.requestNo };
  return order.status === 'refunded' ? { refundStatus: 'MANUAL_REVIEW', outRefundNo: order.paymentMethod === 'alipay' ? order.id : null }
    : { refundStatus: null, outRefundNo: null };
}

async function lockOrder(tx: Tx, orderId: string) {
  await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtextextended(${`payment-refund:${orderId}`},0))`);
  const [order] = await tx.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  return order;
}

async function finalize(tx: Tx, orderId: string) {
  await tx.update(orders).set({ status: 'refunded' }).where(and(eq(orders.id, orderId), eq(orders.status, 'paid')));
  await tx.update(licenseKeys).set({ status: 'revoked' }).where(eq(licenseKeys.orderId, orderId));
}

async function applySnapshot(refund: Snapshot) {
  if (!refund.outTradeNo || !refund.requestNo || refund.requestNo.length > 64 ||
      !['SUCCESS', 'CLOSED', 'PROCESSING', 'ABNORMAL'].includes(refund.refundStatus) ||
      !Number.isSafeInteger(refund.refundAmount) || !Number.isSafeInteger(refund.totalAmount) ||
      refund.refundAmount <= 0 || refund.refundAmount > refund.totalAmount) throw new Error('invalid-refund-snapshot');
  return db.transaction(async tx => {
    const order = await lockOrder(tx, refund.outTradeNo);
    if (!order) throw new Error('refund-order-not-found');
    if (order.paymentMethod !== refund.paymentMethod || !order.alipayTradeNo || refund.transactionId !== order.alipayTradeNo) throw new Error('refund-transaction-mismatch');
    const [existing] = await tx.select().from(paymentRefundAttempts).where(eq(paymentRefundAttempts.requestNo, refund.requestNo)).limit(1);
    if (existing && (existing.orderId !== order.id || existing.paymentMethod !== refund.paymentMethod)) throw new Error('refund-attempt-order-mismatch');
    if (existing?.status === 'SUCCESS') {
      if (confirmedFullRefund(existing, order)) await finalize(tx, order.id);
      return { attempt: existing, changed: false };
    }
    if (existing?.status === 'CLOSED' && refund.refundStatus !== 'SUCCESS') return { attempt: existing, changed: false };
    if (existing?.status === 'ABNORMAL' && refund.refundStatus === 'PROCESSING') return { attempt: existing, changed: false };
    const attempts = await tx.select().from(paymentRefundAttempts).where(eq(paymentRefundAttempts.orderId, order.id));
    const full = refund.refundAmount === order.amountCny * 100 && refund.totalAmount === order.amountCny * 100;
    const needsReview = !full || refund.refundStatus === 'ABNORMAL' || (!existing && !attempts.some(item => confirmedFullRefund(item, order)) && order.status === 'refunded' && refund.refundStatus !== 'SUCCESS');
    const values = { status: refund.refundStatus, refundAmount: refund.refundAmount, totalAmount: refund.totalAmount,
      refundId: refund.refundId || existing?.refundId || null, needsReview, updatedAt: timestamp() };
    const changed = !existing || existing.status !== values.status || existing.needsReview !== needsReview;
    const [attempt] = existing
      ? await tx.update(paymentRefundAttempts).set(values).where(eq(paymentRefundAttempts.requestNo, refund.requestNo)).returning()
      : await tx.insert(paymentRefundAttempts).values({ requestNo: refund.requestNo, paymentMethod: refund.paymentMethod, orderId: order.id, source: 'merchant', createdAt: timestamp(), ...values }).returning();
    if (confirmedFullRefund(attempt, order)) await finalize(tx, order.id);
    return { attempt, changed };
  });
}

export async function applyWechatRefundSnapshot(refund: WechatRefundNotify) {
  return applySnapshot({ ...refund, requestNo: refund.outRefundNo, paymentMethod: 'wechat' });
}

async function markRequestFailure(attempt: Attempt, status: 'UNKNOWN' | 'REJECTED') {
  return db.transaction(async tx => {
    await lockOrder(tx, attempt.orderId);
    const [current] = await tx.select().from(paymentRefundAttempts).where(eq(paymentRefundAttempts.requestNo, attempt.requestNo)).limit(1);
    if (!current) throw new Error('refund-attempt-not-found');
    if (!['REQUESTING', 'UNKNOWN', 'REJECTED'].includes(current.status)) return current;
    const [updated] = await tx.update(paymentRefundAttempts).set({ status, updatedAt: timestamp() }).where(eq(paymentRefundAttempts.requestNo, attempt.requestNo)).returning();
    return updated;
  });
}

function outcome(attempt: Attempt): 'refunded' | 'processing' {
  if (attempt.status === 'SUCCESS' && !attempt.needsReview) return 'refunded';
  if (attempt.needsReview) return 'processing';
  if (attempt.status === 'CLOSED') throw new Error('退款已关闭，原付费权益未收回；核验后可重新申请退款');
  if (attempt.status === 'REJECTED') throw new Error('支付渠道未受理退款，原付费权益未收回；请核验后使用同一申请重试');
  return 'processing';
}

async function queryAttempt(order: Order, attempt: Attempt): Promise<Attempt | null> {
  if (attempt.paymentMethod === 'wechat') {
    const result = await queryWechatRefund(attempt.requestNo);
    if (!result.found) return null;
    if (result.refund.outTradeNo !== attempt.orderId || result.refund.outRefundNo !== attempt.requestNo) throw new Error('refund-query-attempt-mismatch');
    return (await applyWechatRefundSnapshot(result.refund)).attempt;
  }
  const result = await queryAlipayRefund({ outTradeNo: order.id, tradeNo: order.alipayTradeNo!, outRequestNo: attempt.requestNo });
  if (!result.found) return null;
  return (await applySnapshot({ paymentMethod: 'alipay', outTradeNo: order.id, transactionId: order.alipayTradeNo!, requestNo: attempt.requestNo,
    refundId: '', refundStatus: 'SUCCESS', refundAmount: result.refundAmount, totalAmount: result.totalAmount })).attempt;
}

async function sendAttempt(order: Order, attempt: Attempt): Promise<'refunded' | 'processing'> {
  let snapshot: Snapshot;
  try {
    if (attempt.paymentMethod === 'wechat') {
      const result = await refundWechatOrder({ outTradeNo: order.id, transactionId: order.alipayTradeNo!, outRefundNo: attempt.requestNo, refundAmountCny: order.amountCny });
      if (!result.success) return outcome(await markRequestFailure(attempt, 'REJECTED'));
      snapshot = { paymentMethod: 'wechat', outTradeNo: order.id, transactionId: order.alipayTradeNo!, requestNo: attempt.requestNo,
        refundStatus: result.refundStatus, refundAmount: attempt.refundAmount, totalAmount: attempt.totalAmount, refundId: result.refundId ?? '' };
    } else {
      const result = await refundAlipayOrder({ outTradeNo: order.id, tradeNo: order.alipayTradeNo!, outRequestNo: attempt.requestNo, refundAmount: order.amountCny });
      if (!result.success) return outcome(await markRequestFailure(attempt, 'REJECTED'));
      if (!result.fundChange) return outcome(await markRequestFailure(attempt, 'UNKNOWN'));
      snapshot = { paymentMethod: 'alipay', outTradeNo: order.id, transactionId: order.alipayTradeNo!, requestNo: attempt.requestNo,
        refundStatus: 'SUCCESS', refundAmount: attempt.refundAmount, totalAmount: attempt.totalAmount, refundId: '' };
    }
  } catch (error) {
    // 受理失败抛出的业务提示仍是明确拒绝；网络/签名/系统错误只能记作未知。
    const [current] = await db.select().from(paymentRefundAttempts).where(eq(paymentRefundAttempts.requestNo, attempt.requestNo)).limit(1);
    if (current?.status === 'REJECTED') throw error;
    return outcome(await markRequestFailure(attempt, 'UNKNOWN'));
  }
  return outcome((await applySnapshot(snapshot)).attempt);
}

export async function requestPaymentRefund(orderId: string): Promise<'refunded' | 'processing' | 'skipped' | 'not-found'> {
  const prepared = await db.transaction(async tx => {
    const order = await lockOrder(tx, orderId);
    if (!order) return { result: 'not-found' as const };
    if (!['wechat', 'alipay'].includes(order.paymentMethod)) throw new Error('不支持的支付渠道');
    const attempts = await tx.select().from(paymentRefundAttempts).where(eq(paymentRefundAttempts.orderId, order.id)).orderBy(desc(paymentRefundAttempts.createdAt));
    if (attempts.some(item => confirmedFullRefund(item, order))) { await finalize(tx, order.id); return { result: 'refunded' as const }; }
    let attempt = attempts.find(item => item.needsReview || PENDING.has(item.status) || item.status === 'REJECTED');
    const now = timestamp();
    if (!attempt) {
      if (order.status === 'refunded') {
        if (order.paymentMethod !== 'alipay') return { result: 'processing' as const };
        // 老接口未传out_request_no，渠道默认使用orderId；此记录永远只查不重发。
        [attempt] = await tx.insert(paymentRefundAttempts).values({ requestNo: order.id, orderId: order.id, paymentMethod: 'alipay', source: 'legacy', status: 'UNKNOWN',
          refundAmount: order.amountCny * 100, totalAmount: order.amountCny * 100, needsReview: true, createdAt: now, updatedAt: now }).returning();
        return { result: 'processing' as const };
      }
      if (order.status !== 'paid') return { result: 'skipped' as const };
      if (!order.alipayTradeNo) throw new Error('订单缺少支付交易号，无法原路退款');
      // 全额Alipay沿用旧接口省略请求号时的orderId，兼容旧超时但渠道可能已退款的记录。
      [attempt] = await tx.insert(paymentRefundAttempts).values({ requestNo: order.paymentMethod === 'alipay' ? order.id : `MSR-${randomUUID()}`, orderId: order.id, paymentMethod: order.paymentMethod, status: 'REQUESTING', source: 'api',
        refundAmount: order.amountCny * 100, totalAmount: order.amountCny * 100, needsReview: false, lastRequestedAt: now, createdAt: now, updatedAt: now }).returning();
      return { order, attempt, action: 'send' as const };
    }
    if (attempt.needsReview && attempt.status !== 'ABNORMAL' && attempt.source !== 'legacy') return { result: 'processing' as const };
    const lastActivity = Math.max(Date.parse(attempt.lastRequestedAt ?? attempt.createdAt), attempt.lastQueriedAt ? Date.parse(attempt.lastQueriedAt) : 0);
    if (Date.now() - lastActivity < interval(order.paymentMethod)) return { result: 'processing' as const };
    const [claimed] = await tx.update(paymentRefundAttempts).set({ lastQueriedAt: now, updatedAt: now }).where(eq(paymentRefundAttempts.requestNo, attempt.requestNo)).returning();
    return { order, attempt: claimed, action: 'query' as const };
  });
  if ('result' in prepared) return prepared.result!;
  if (prepared.action === 'send') return sendAttempt(prepared.order, prepared.attempt);
  let queried: Attempt | null;
  try { queried = await queryAttempt(prepared.order, prepared.attempt); } catch { return 'processing'; }
  if (queried) return outcome(queried);
  // 只有已确认未执行的本站申请可重试；历史标记、部分退款和渠道已受理记录不自动重发。
  const retry = await db.transaction(async tx => {
    const order = await lockOrder(tx, orderId);
    const [current] = await tx.select().from(paymentRefundAttempts).where(eq(paymentRefundAttempts.requestNo, prepared.attempt.requestNo)).limit(1);
    if (!order || !current) throw new Error('refund-attempt-not-found');
    if (confirmedFullRefund(current, order)) return { result: 'refunded' as const };
    if (current.source !== 'api' || order.status !== 'paid' || !['UNKNOWN', 'REQUESTING', 'REJECTED'].includes(current.status)
        || current.lastQueriedAt !== prepared.attempt.lastQueriedAt || Date.now() - Date.parse(current.lastRequestedAt ?? current.createdAt) < interval(order.paymentMethod)) {
      return { result: 'processing' as const };
    }
    const now = timestamp();
    const [claimed] = await tx.update(paymentRefundAttempts).set({ status: 'REQUESTING', lastRequestedAt: now, updatedAt: now }).where(eq(paymentRefundAttempts.requestNo, current.requestNo)).returning();
    return { order, attempt: claimed };
  });
  return 'result' in retry ? retry.result! : sendAttempt(retry.order, retry.attempt);
}
