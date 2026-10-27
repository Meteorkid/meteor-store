import { generateKeyPairSync, sign } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { queryAlipayRefund, refundAlipayOrder } from '../alipay';

const keys = generateKeyPairSync('rsa', { modulusLength: 2048, publicKeyEncoding: { type: 'spki', format: 'pem' }, privateKeyEncoding: { type: 'pkcs8', format: 'pem' } });
const input = { outTradeNo: 'order-1', tradeNo: 'trade-1', outRequestNo: 'request-1', refundAmount: 39 };
function response(method: 'refund' | 'query', body: Record<string, unknown> | string) {
  const source = typeof body === 'string' ? body : JSON.stringify(body);
  const signature = sign('RSA-SHA256', Buffer.from(source), keys.privateKey).toString('base64');
  const key = method === 'refund' ? 'alipay_trade_refund_response' : 'alipay_trade_fastpay_refund_query_response';
  return new Response(`{"${key}":${source},"sign":${JSON.stringify(signature)}}`, { status: 200 });
}
const successFields = { code: '10000', out_trade_no: 'order-1', trade_no: 'trade-1', out_request_no: 'request-1' };

beforeEach(() => {
  vi.stubEnv('ALIPAY_APP_ID', 'fixture-app'); vi.stubEnv('ALIPAY_PRIVATE_KEY', keys.privateKey); vi.stubEnv('ALIPAY_PUBLIC_KEY', keys.publicKey);
  vi.stubEnv('ALIPAY_SELLER_ID', 'fixture-seller'); vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://www.imagentx.top');
  vi.stubEnv('ALIPAY_GATEWAY', 'https://openapi.alipay.com/gateway.do'); vi.stubGlobal('fetch', vi.fn());
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe('支付宝退款协议（本地RSA与模拟HTTP）', () => {
  it('按原始JSON串验签，fund_change=Y且交易和金额匹配才确认', async () => {
    const raw = '{ "code": "10000", "out_trade_no": "order-1", "trade_no": "trade-1", "fund_change": "Y", "refund_fee": "39.00" }';
    vi.mocked(fetch).mockResolvedValue(response('refund', raw));
    expect(await refundAlipayOrder(input)).toEqual({ success: true, fundChange: true });
    const request = new URLSearchParams(vi.mocked(fetch).mock.calls[0][1]!.body as string);
    expect(request.get('method')).toBe('alipay.trade.refund');
    expect(JSON.parse(request.get('biz_content')!)).toMatchObject({ out_request_no: 'request-1', refund_amount: '39.00' });
  });

  it.each(['N', undefined])('fund_change=%s仅是未确认结果', async fundChange => {
    vi.mocked(fetch).mockResolvedValue(response('refund', { ...successFields, fund_change: fundChange }));
    expect(await refundAlipayOrder(input)).toEqual({ success: true, fundChange: false });
  });

  it('签名正确但交易号、请求号或金额不匹配也不能确认', async () => {
    for (const mismatch of [{ trade_no: 'other' }, { out_request_no: 'other' }, { refund_fee: '1.00' }, { refund_fee: undefined }]) {
      vi.mocked(fetch).mockResolvedValue(response('refund', { ...successFields, fund_change: 'Y', refund_fee: '39.00', ...mismatch }));
      await expect(refundAlipayOrder(input)).rejects.toThrow();
    }
  });

  it('系统异常不当成明确拒绝或成功', async () => {
    vi.mocked(fetch).mockResolvedValue(response('refund', { code: '20000', sub_code: 'ACQ.SYSTEM_ERROR', msg: 'unknown' }));
    await expect(refundAlipayOrder(input)).rejects.toThrow('暂不可确认');
  });

  it('查询code10000但没有REFUND_SUCCESS仍未确认，成功时返回已核对的金额', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(response('query', successFields))
      .mockResolvedValueOnce(response('query', { ...successFields, refund_status: 'REFUND_SUCCESS', refund_amount: '39.00', total_amount: '39.00' }));
    expect(await queryAlipayRefund(input)).toEqual({ found: false });
    expect(await queryAlipayRefund(input)).toEqual({ found: true, refundAmount: 3900, totalAmount: 3900 });
  });

  it('历史未显式设置请求号时按orderId查询，且验证响应请求号', async () => {
    const legacy = { outTradeNo: 'order-1', tradeNo: 'trade-1' };
    vi.mocked(fetch).mockResolvedValueOnce(response('query', { ...successFields, out_request_no: 'order-1', refund_status: 'REFUND_SUCCESS', refund_amount: '39.00', total_amount: '39.00' }))
      .mockResolvedValueOnce(response('query', { ...successFields, out_request_no: 'wrong', refund_status: 'REFUND_SUCCESS', refund_amount: '39.00', total_amount: '39.00' }));
    expect(await queryAlipayRefund(legacy)).toMatchObject({ found: true });
    const request = new URLSearchParams(vi.mocked(fetch).mock.calls[0][1]!.body as string);
    expect(request.get('method')).toBe('alipay.trade.fastpay.refund.query');
    expect(JSON.parse(request.get('biz_content')!)).toMatchObject({ out_request_no: 'order-1' });
    await expect(queryAlipayRefund(legacy)).rejects.toThrow('请求号不匹配');
  });
});
