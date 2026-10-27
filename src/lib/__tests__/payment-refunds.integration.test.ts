import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { mkdtempSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Pool } from 'pg';
import { NextRequest } from 'next/server';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ parse: vi.fn(), refund: vi.fn(), query: vi.fn(), alert: vi.fn(), alipayRefund: vi.fn(), alipayQuery: vi.fn() }));
const testPools = vi.hoisted(() => [] as Array<{ end(): Promise<void> }>);
vi.mock('pg', async () => {
  const actual = await vi.importActual<typeof import('pg')>('pg');
  return { ...actual, Pool: class extends actual.Pool {
    constructor(...args: ConstructorParameters<typeof actual.Pool>) { super(...args); testPools.push(this); }
  } };
});
vi.mock('@/lib/wechat', () => ({ parseWechatNotify: () => null, parseWechatRefundNotify: mocks.parse, refundWechatOrder: mocks.refund, queryWechatRefund: mocks.query }));
vi.mock('@/lib/alipay', () => ({ refundAlipayOrder: mocks.alipayRefund, queryAlipayRefund: mocks.alipayQuery }));
vi.mock('@/lib/email', () => ({ sendAdminAlert: mocks.alert }));
vi.mock('@/lib/order-fulfillment', () => ({ fulfillOrder: vi.fn() }));
import { POST } from '@/app/api/payment/wechat/notify/route';
import { refundOrder } from '@/lib/admin-commerce';

describe.skipIf(process.env.SOFTWARE_LICENSE_INTEGRATION !== '1')('支付退款真实 PostgreSQL 状态机', () => {
  let root: string;
  let pool: Pool;
  let started = false;
  beforeAll(async () => {
    root = mkdtempSync(join(tmpdir(), 'meteor-refund-test-'));
    const data = join(root, 'data'); const sockets = join(root, 'sockets'); mkdirSync(sockets);
    execFileSync('initdb', ['-D', data, '-A', 'trust', '-U', 'refund_test', '--no-locale'], { stdio: 'pipe' });
    execFileSync('pg_ctl', ['-D', data, '-l', join(root, 'postgres.log'), '-o', `-F -h '' -k ${sockets}`, '-w', 'start'], { stdio: 'pipe' });
    started = true;
    const url = `postgresql://refund_test@localhost/postgres?host=${encodeURIComponent(sockets)}`;
    pool = new Pool({ connectionString: url }); vi.stubEnv('DATABASE_URL', url);
    await pool.query(`CREATE TABLE license_keys (id text PRIMARY KEY,order_id text NOT NULL UNIQUE,product_id text NOT NULL,plan_name text NOT NULL,email text NOT NULL,key text NOT NULL UNIQUE,status text NOT NULL,created_at text NOT NULL);
      CREATE TABLE orders (id text PRIMARY KEY,product_id text NOT NULL,plan_name text NOT NULL,plan_id text,email text NOT NULL,user_id text,amount_cny integer NOT NULL,payment_method text NOT NULL,status text NOT NULL,alipay_trade_no text,paid_at text,billing_period text NOT NULL,delivery_status text NOT NULL,delivery_claimed_at text,access_token text NOT NULL,created_at text NOT NULL);`);
    const migration = join(process.cwd(), 'drizzle/0052_payment_refund_attempts.sql');
    await pool.query(readFileSync(migration, 'utf8'));
  }, 30000);
  beforeEach(async () => {
    vi.clearAllMocks();
    mocks.alert.mockResolvedValue(undefined);
    mocks.refund.mockResolvedValue({ success: true, refundStatus: 'PROCESSING' });
    mocks.query.mockResolvedValue({ found: false });
    mocks.alipayRefund.mockResolvedValue({ success: true, fundChange: false });
    mocks.alipayQuery.mockResolvedValue({ found: false });
    await pool.query('TRUNCATE license_keys,orders CASCADE');
  });
  afterAll(async () => {
    await Promise.all(testPools.map(connectionPool => connectionPool.end()));
    if (started) execFileSync('pg_ctl', ['-D', join(root, 'data'), '-m', 'immediate', '-w', 'stop'], { stdio: 'pipe' });
    if (root) rmSync(root, { recursive: true, force: true });
    vi.unstubAllEnvs();
  });
  async function fixture(licenseStatus = 'active', paymentMethod = 'wechat') {
    const id = randomUUID(); const now = new Date().toISOString();
    await pool.query("INSERT INTO orders(id,product_id,plan_name,email,amount_cny,payment_method,status,alipay_trade_no,paid_at,billing_period,delivery_status,access_token,created_at) VALUES($1,'xnook','Pro','fixture@example.invalid',39,$4,'paid',$2,$3,'lifetime','emailed','fixture',$3)", [id, `wx-${id}`, now, paymentMethod]);
    await pool.query("INSERT INTO license_keys VALUES($1,$2,'xnook','Pro','fixture@example.invalid',$3,$4,$5)", [randomUUID(), id, `MC-${randomUUID()}`, licenseStatus, now]);
    return id;
  }
  async function notification(orderId: string, outRefundNo: string, status: string, refundAmount = 3900) {
    mocks.parse.mockReturnValue({ outTradeNo: orderId, outRefundNo, refundStatus: status, refundAmount, totalAmount: 3900, transactionId: `wx-${orderId}`, refundId: `wxrefund-${outRefundNo}` });
    return POST(new NextRequest('https://www.imagentx.top/api/payment/wechat/notify', { method: 'POST', body: JSON.stringify({ event_type: `REFUND.${status}` }) }));
  }
  async function allowNextCheck() {
    const past = new Date(Date.now() - 61000).toISOString();
    await pool.query('UPDATE payment_refund_attempts SET last_requested_at=$1,last_queried_at=NULL,created_at=$1', [past]);
  }
  async function state(orderId: string) {
    return (await pool.query('SELECT o.status,l.status license_status FROM orders o JOIN license_keys l ON l.order_id=o.id WHERE o.id=$1', [orderId])).rows[0];
  }

  it('R2 SUCCESS之后迟到的R1 CLOSED不能复活订单或授权', async () => {
    const id = await fixture();
    expect((await notification(id, 'R2', 'SUCCESS')).status).toBe(200);
    expect(await state(id)).toEqual({ status: 'refunded', license_status: 'revoked' });
    expect((await notification(id, 'R1', 'CLOSED')).status).toBe(200);
    expect(await state(id)).toEqual({ status: 'refunded', license_status: 'revoked' });
  });

  it('受理中的退款保留原权益，回调SUCCESS后才撤销', async () => {
    const id = await fixture();
    expect(await refundOrder(id)).toBe('processing');
    expect(await state(id)).toEqual({ status: 'paid', license_status: 'active' });
    const outRefundNo = mocks.refund.mock.calls[0][0].outRefundNo;
    expect((await notification(id, outRefundNo, 'SUCCESS')).status).toBe(200);
    expect(await state(id)).toEqual({ status: 'refunded', license_status: 'revoked' });
  });

  it('SUCCESS回调先到、退款请求随后网络异常，不得补偿恢复paid', async () => {
    const id = await fixture();
    mocks.refund.mockImplementationOnce(async (input) => {
      await notification(id, input.outRefundNo ?? 'legacy-attempt', 'SUCCESS');
      throw new Error('socket timeout after accepted request');
    });
    await refundOrder(id).catch(() => undefined);
    expect(await state(id)).toEqual({ status: 'refunded', license_status: 'revoked' });
    expect(mocks.query).not.toHaveBeenCalled();
  });

  it('CLOSED后可新建R2，R2成功后任何R1迟到事件均不能倒退', async () => {
    const id = await fixture();
    await refundOrder(id);
    const r1 = mocks.refund.mock.calls[0][0].outRefundNo;
    await notification(id, r1, 'CLOSED');
    expect(await state(id)).toEqual({ status: 'paid', license_status: 'active' });
    await refundOrder(id);
    const r2 = mocks.refund.mock.calls[1][0].outRefundNo;
    expect(r2).not.toBe(r1);
    await notification(id, r2, 'SUCCESS');
    await notification(id, r1, 'ABNORMAL');
    await notification(id, r1, 'CLOSED');
    expect(await state(id)).toEqual({ status: 'refunded', license_status: 'revoked' });
  });

  it('ABNORMAL不是失败终态，人工处理后同一attempt可SUCCESS', async () => {
    const id = await fixture();
    await refundOrder(id);
    const outRefundNo = mocks.refund.mock.calls[0][0].outRefundNo;
    await notification(id, outRefundNo, 'ABNORMAL');
    expect(await state(id)).toEqual({ status: 'paid', license_status: 'active' });
    mocks.query.mockResolvedValue({ found: true, refund: { outTradeNo: id, outRefundNo, transactionId: `wx-${id}`, refundId: 'wx-refund', refundStatus: 'ABNORMAL', refundAmount: 3900, totalAmount: 3900 } });
    expect(await refundOrder(id)).toBe('processing');
    expect(mocks.refund).toHaveBeenCalledTimes(1);
    await notification(id, outRefundNo, 'SUCCESS');
    expect(await state(id)).toEqual({ status: 'refunded', license_status: 'revoked' });
    expect((await pool.query('SELECT status,needs_review FROM payment_refund_attempts WHERE request_no=$1', [outRefundNo])).rows[0]).toEqual({ status: 'SUCCESS', needs_review: false });
  });

  it('ABNORMAL回调先到时，较早申请响应PROCESSING不能清掉人工核验状态', async () => {
    const id = await fixture();
    mocks.refund.mockImplementationOnce(async input => {
      await notification(id, input.outRefundNo, 'ABNORMAL');
      return { success: true, refundStatus: 'PROCESSING' };
    });
    expect(await refundOrder(id)).toBe('processing');
    expect((await pool.query('SELECT status,needs_review FROM payment_refund_attempts')).rows[0]).toEqual({ status: 'ABNORMAL', needs_review: true });
  });

  it('部分退款SUCCESS终态也不能被迟到CLOSED覆盖', async () => {
    const id = await fixture();
    await notification(id, 'partial-terminal', 'SUCCESS', 1000);
    await notification(id, 'partial-terminal', 'CLOSED', 1000);
    expect((await pool.query('SELECT status,needs_review FROM payment_refund_attempts')).rows[0]).toEqual({ status: 'SUCCESS', needs_review: true });
    expect(await state(id)).toEqual({ status: 'paid', license_status: 'active' });
  });

  it('两个管理员并发只创建一个未决attempt', async () => {
    const id = await fixture();
    expect(await Promise.all([refundOrder(id), refundOrder(id)])).toEqual(['processing', 'processing']);
    expect(mocks.refund).toHaveBeenCalledTimes(1);
    expect((await pool.query('SELECT count(*) FROM payment_refund_attempts')).rows[0].count).toBe('1');
    expect(await state(id)).toEqual({ status: 'paid', license_status: 'active' });
  });

  it('网络状态不明保留权益，查不到后重试沿用同一outRefundNo', async () => {
    const id = await fixture();
    mocks.refund.mockRejectedValueOnce(new Error('network timeout'));
    expect(await refundOrder(id)).toBe('processing');
    expect(await state(id)).toEqual({ status: 'paid', license_status: 'active' });
    const outRefundNo = mocks.refund.mock.calls[0][0].outRefundNo;
    await allowNextCheck();
    expect(await refundOrder(id)).toBe('processing');
    expect(mocks.query).toHaveBeenLastCalledWith(outRefundNo);
    expect(mocks.refund.mock.calls[1][0].outRefundNo).toBe(outRefundNo);
    expect((await pool.query('SELECT count(*) FROM payment_refund_attempts')).rows[0].count).toBe('1');
  });

  it('申请明确被拒后重试也保留退款号，只有渠道CLOSED才另起申请', async () => {
    const id = await fixture();
    mocks.refund.mockResolvedValueOnce({ success: false, code: 'PARAM_ERROR', msg: 'rejected' });
    await expect(refundOrder(id)).rejects.toThrow('未受理');
    const outRefundNo = mocks.refund.mock.calls[0][0].outRefundNo;
    await allowNextCheck();
    expect(await refundOrder(id)).toBe('processing');
    expect(mocks.refund.mock.calls[1][0].outRefundNo).toBe(outRefundNo);
    expect((await pool.query('SELECT count(*) FROM payment_refund_attempts')).rows[0].count).toBe('1');
  });

  it('退款关闭或明确拒绝都不能复活管理员已撤销许可证', async () => {
    const id = await fixture('revoked');
    await refundOrder(id);
    await notification(id, mocks.refund.mock.calls[0][0].outRefundNo, 'CLOSED');
    expect(await state(id)).toEqual({ status: 'paid', license_status: 'revoked' });
    mocks.refund.mockResolvedValueOnce({ success: false, code: 'PARAM_ERROR', msg: 'rejected' });
    await expect(refundOrder(id)).rejects.toThrow('未受理');
    expect(await state(id)).toEqual({ status: 'paid', license_status: 'revoked' });
  });

  it('商户平台直接全额退款被持久化，部分退款只进入人工核验', async () => {
    const full = await fixture();
    await notification(full, 'merchant-full', 'SUCCESS');
    expect(await state(full)).toEqual({ status: 'refunded', license_status: 'revoked' });
    expect((await pool.query('SELECT source,status FROM payment_refund_attempts WHERE request_no=$1', ['merchant-full'])).rows[0]).toEqual({ source: 'merchant', status: 'SUCCESS' });
    const partial = await fixture();
    await notification(partial, 'merchant-partial', 'SUCCESS', 1000);
    expect(await state(partial)).toEqual({ status: 'paid', license_status: 'active' });
    expect(await refundOrder(partial)).toBe('processing');
    expect(mocks.refund).not.toHaveBeenCalled();
    expect((await pool.query('SELECT needs_review FROM payment_refund_attempts WHERE request_no=$1', ['merchant-partial'])).rows[0].needs_review).toBe(true);
  });

  it('旧refunded无attempt的失败回调只标记人工核验，不猜测恢复', async () => {
    const id = await fixture('revoked');
    await pool.query("UPDATE orders SET status='refunded' WHERE id=$1", [id]);
    await notification(id, 'legacy-unverified', 'CLOSED');
    expect(await state(id)).toEqual({ status: 'refunded', license_status: 'revoked' });
    expect((await pool.query('SELECT needs_review FROM payment_refund_attempts')).rows[0].needs_review).toBe(true);
    expect(mocks.alert).toHaveBeenCalled();
    expect(await refundOrder(id)).toBe('processing');
    expect(mocks.refund).not.toHaveBeenCalled();
  });

  it('已refunded订单的部分退款通知也不能跳过金额检查撤销其他授权', async () => {
    const id = await fixture();
    await pool.query("UPDATE orders SET status='refunded' WHERE id=$1", [id]);
    await notification(id, 'partial-on-legacy', 'SUCCESS', 1000);
    expect(await state(id)).toEqual({ status: 'refunded', license_status: 'active' });
  });

  it('支付宝fund_change=N保持paid，不把code10000视为退款成功', async () => {
    const id = await fixture('active', 'alipay');
    expect(await refundOrder(id)).toBe('processing');
    expect(await state(id)).toEqual({ status: 'paid', license_status: 'active' });
    expect(mocks.alipayQuery).not.toHaveBeenCalled();
  });

  it('支付宝请求超时不立刻重发或提前查询，保留原权益', async () => {
    const id = await fixture('active', 'alipay');
    mocks.alipayRefund.mockRejectedValueOnce(new Error('network timeout'));
    expect(await refundOrder(id)).toBe('processing');
    expect(await refundOrder(id)).toBe('processing');
    expect(mocks.alipayRefund).toHaveBeenCalledTimes(1);
    expect(mocks.alipayQuery).not.toHaveBeenCalled();
    expect(await state(id)).toEqual({ status: 'paid', license_status: 'active' });
  });

  it('支付宝10秒后查询REFUND_SUCCESS才确认，全程保留原请求号', async () => {
    const id = await fixture('active', 'alipay');
    await refundOrder(id);
    expect(mocks.alipayRefund.mock.calls[0][0].outRequestNo).toBe(id);
    await allowNextCheck();
    mocks.alipayQuery.mockResolvedValue({ found: true, refundAmount: 3900, totalAmount: 3900 });
    expect(await refundOrder(id)).toBe('refunded');
    expect(mocks.alipayQuery).toHaveBeenCalledWith({ outTradeNo: id, tradeNo: `wx-${id}`, outRequestNo: id });
    expect(mocks.alipayRefund).toHaveBeenCalledTimes(1);
    expect(await state(id)).toEqual({ status: 'refunded', license_status: 'revoked' });
  });

  it('支付宝查询仍未成功时可同号重试，连点不会重复查询或重发', async () => {
    const id = await fixture('active', 'alipay');
    await refundOrder(id);
    await allowNextCheck();
    expect(await refundOrder(id)).toBe('processing');
    expect(mocks.alipayRefund).toHaveBeenCalledTimes(2);
    expect(mocks.alipayRefund.mock.calls.every(([input]) => input.outRequestNo === id)).toBe(true);
    expect(await refundOrder(id)).toBe('processing');
    expect(mocks.alipayRefund).toHaveBeenCalledTimes(2);
    expect(mocks.alipayQuery).toHaveBeenCalledTimes(1);
    expect(await state(id)).toEqual({ status: 'paid', license_status: 'active' });
  });

  it('支付宝查询已确认后较晚的请求异常不能回滚成功', async () => {
    const id = await fixture('active', 'alipay');
    mocks.alipayRefund.mockImplementationOnce(async () => {
      await allowNextCheck();
      mocks.alipayQuery.mockResolvedValue({ found: true, refundAmount: 3900, totalAmount: 3900 });
      expect(await refundOrder(id)).toBe('refunded');
      throw new Error('late request timeout');
    });
    expect(await refundOrder(id)).toBe('refunded');
    expect(await state(id)).toEqual({ status: 'refunded', license_status: 'revoked' });
    expect(mocks.alipayRefund).toHaveBeenCalledTimes(1);
  });

  it('支付宝并发核对只发一次查询，人工撤销状态不会被未知结果恢复', async () => {
    const id = await fixture('revoked', 'alipay');
    await refundOrder(id);
    await allowNextCheck();
    const results = await Promise.all([refundOrder(id), refundOrder(id)]);
    expect(results).toEqual(['processing', 'processing']);
    expect(mocks.alipayQuery).toHaveBeenCalledTimes(1);
    expect(mocks.alipayRefund).toHaveBeenCalledTimes(2);
    expect(await state(id)).toEqual({ status: 'paid', license_status: 'revoked' });
  });

  it('旧已refunded的支付宝订单只按orderId查单，不重发也不自动恢复paid', async () => {
    const id = await fixture('revoked', 'alipay');
    await pool.query("UPDATE orders SET status='refunded' WHERE id=$1", [id]);
    expect(await refundOrder(id)).toBe('processing');
    expect(mocks.alipayRefund).not.toHaveBeenCalled();
    await allowNextCheck();
    expect(await refundOrder(id)).toBe('processing');
    expect(mocks.alipayQuery).toHaveBeenLastCalledWith({ outTradeNo: id, tradeNo: `wx-${id}`, outRequestNo: id });
    expect(mocks.alipayRefund).not.toHaveBeenCalled();
    expect(await state(id)).toEqual({ status: 'refunded', license_status: 'revoked' });
    await allowNextCheck();
    mocks.alipayQuery.mockResolvedValue({ found: true, refundAmount: 3900, totalAmount: 3900 });
    expect(await refundOrder(id)).toBe('refunded');
    expect(mocks.alipayRefund).not.toHaveBeenCalled();
  });

  it('支付宝查询只确认部分退款时保留paid并转人工核验', async () => {
    const id = await fixture('active', 'alipay');
    await refundOrder(id);
    await allowNextCheck();
    mocks.alipayQuery.mockResolvedValue({ found: true, refundAmount: 1000, totalAmount: 3900 });
    expect(await refundOrder(id)).toBe('processing');
    expect(await state(id)).toEqual({ status: 'paid', license_status: 'active' });
    expect((await pool.query('SELECT needs_review FROM payment_refund_attempts')).rows[0].needs_review).toBe(true);
  });
});
