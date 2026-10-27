import { createCipheriv, generateKeyPairSync, sign } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { parseWechatRefundNotify, queryWechatRefund, refundWechatOrder } from '../wechat';

const keys = generateKeyPairSync('rsa', { modulusLength: 2048, publicKeyEncoding: { type: 'spki', format: 'pem' }, privateKeyEncoding: { type: 'pkcs8', format: 'pem' } });
const apiKey = '0123456789abcdef0123456789abcdef';
const snapshot = { mchid: 'fixture-merchant', out_trade_no: 'order-1', out_refund_no: 'R-1', transaction_id: 'wx-transaction', refund_id: 'wx-refund', amount: { total: 3900, refund: 3900 } };
function headers(body: string) {
  const timestamp = String(Math.floor(Date.now() / 1000)); const nonce = 'fixture-signature-nonce';
  return new Headers({ 'wechatpay-timestamp': timestamp, 'wechatpay-nonce': nonce, 'wechatpay-serial': 'PUB_KEY_ID_fixture',
    'wechatpay-signature': sign('RSA-SHA256', Buffer.from(`${timestamp}\n${nonce}\n${body}\n`), keys.privateKey).toString('base64') });
}
function callback(resource: Record<string, unknown>, event = 'REFUND.SUCCESS') {
  const nonce = '0123456789ab'; const aad = 'fixture-refund';
  const cipher = createCipheriv('aes-256-gcm', Buffer.from(apiKey), Buffer.from(nonce)); cipher.setAAD(Buffer.from(aad));
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(resource)), cipher.final(), cipher.getAuthTag()]).toString('base64');
  const body = JSON.stringify({ event_type: event, resource: { ciphertext, nonce, associated_data: aad } });
  return { body, headers: headers(body) };
}
function signedResponse(data: unknown, status = 200) { const body = JSON.stringify(data); return new Response(body, { status, headers: headers(body) }); }

beforeEach(() => {
  vi.stubEnv('WECHAT_MCHID', 'fixture-merchant'); vi.stubEnv('WECHAT_APPID', 'fixture-app');
  vi.stubEnv('WECHAT_PRIVATE_KEY', keys.privateKey); vi.stubEnv('WECHAT_SERIAL_NO', 'fixture-serial');
  vi.stubEnv('WECHAT_API_V3_KEY', apiKey); vi.stubEnv('WECHAT_PLATFORM_PUBLIC_KEY', keys.publicKey);
  vi.stubEnv('WECHAT_PLATFORM_PUBLIC_KEY_ID', 'PUB_KEY_ID_fixture'); vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://www.imagentx.top');
  vi.stubGlobal('fetch', vi.fn());
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe('微信退款协议边界（本地密钥与模拟HTTP）', () => {
  it('真实RSA验签与AES解密后保留退款号、交易号和金额', () => {
    const message = callback({ ...snapshot, refund_status: 'SUCCESS' });
    expect(parseWechatRefundNotify(message.body, message.headers)).toEqual({ outTradeNo: 'order-1', outRefundNo: 'R-1', transactionId: 'wx-transaction', refundId: 'wx-refund', refundStatus: 'SUCCESS', refundAmount: 3900, totalAmount: 3900 });
  });
  it('拒绝商户、事件状态与资源金额不匹配', () => {
    for (const resource of [{ ...snapshot, mchid: 'other', refund_status: 'SUCCESS' }, { ...snapshot, refund_status: 'CLOSED' }, { ...snapshot, refund_status: 'SUCCESS', amount: { total: 3900, refund: 0 } }]) {
      const message = callback(resource);
      expect(parseWechatRefundNotify(message.body, message.headers)).toBeNull();
    }
  });
  it('退款请求使用持久退款号和正式notify_url，不自行生成新的编号', async () => {
    vi.mocked(fetch).mockImplementation(async () => signedResponse({ ...snapshot, status: 'PROCESSING' }));
    const input = { outTradeNo: 'order-1', outRefundNo: 'R-1', transactionId: 'wx-transaction', refundAmountCny: 39 };
    await expect(refundWechatOrder(input)).resolves.toMatchObject({ success: true, refundStatus: 'PROCESSING' });
    await refundWechatOrder(input);
    for (const [, options] of vi.mocked(fetch).mock.calls) {
      const body = JSON.parse(options!.body as string);
      expect(body).toMatchObject({ out_refund_no: 'R-1', transaction_id: 'wx-transaction', notify_url: 'https://www.imagentx.top/api/payment/wechat/notify' });
      expect(body).not.toHaveProperty('out_trade_no');
    }
  });
  it('查询同一退款号可返回ABNORMAL后续SUCCESS，404明确表示未查到', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(signedResponse({ ...snapshot, status: 'ABNORMAL' }))
      .mockResolvedValueOnce(signedResponse({ ...snapshot, status: 'SUCCESS' }))
      .mockResolvedValueOnce(signedResponse({ code: 'RESOURCE_NOT_EXISTS' }, 404));
    expect(await queryWechatRefund('R-1')).toMatchObject({ found: true, refund: { refundStatus: 'ABNORMAL', outRefundNo: 'R-1' } });
    expect(await queryWechatRefund('R-1')).toMatchObject({ found: true, refund: { refundStatus: 'SUCCESS', outRefundNo: 'R-1' } });
    expect(await queryWechatRefund('R-1')).toEqual({ found: false });
    expect(vi.mocked(fetch).mock.calls.every(([url]) => url === 'https://api.mch.weixin.qq.com/v3/refund/domestic/refunds/R-1')).toBe(true);
  });
  it('响应签名无效不能作为成功证据，HTTP500仍是未知结果', async () => {
    const response = signedResponse({ ...snapshot, status: 'SUCCESS' }); response.headers.set('wechatpay-signature', 'bad');
    vi.mocked(fetch).mockResolvedValueOnce(response).mockResolvedValueOnce(signedResponse({ code: 'SYSTEM_ERROR' }, 500));
    const input = { outTradeNo: 'order-1', outRefundNo: 'R-1', transactionId: 'wx-transaction', refundAmountCny: 39 };
    await expect(refundWechatOrder(input)).rejects.toThrow('签名无效');
    await expect(refundWechatOrder(input)).rejects.toThrow('SYSTEM_ERROR');
  });
});
