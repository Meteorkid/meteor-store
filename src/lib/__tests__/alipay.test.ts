import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('alipay', () => {
  let mockSign: ReturnType<typeof vi.fn>;
  let mockVerify: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    mockSign = vi.fn().mockReturnValue('mock-signature-base64==');
    mockVerify = vi.fn().mockReturnValue(true);
    process.env.ALIPAY_APP_ID = 'test-app-id';
    process.env.ALIPAY_PRIVATE_KEY = 'test-private-key';
    process.env.ALIPAY_PUBLIC_KEY = 'test-public-key';
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';
    process.env.ALIPAY_GATEWAY = '';
  });

  async function importAlipay() {
    vi.doMock('crypto', () => ({
      default: {
        // normalizeKey 会调用 createPrivateKey 探测 PKCS#8/PKCS#1 格式，
        // 测试用的私钥本身不是真实 PEM，这里 stub 成功以隔离签名逻辑的测试
        createPrivateKey: vi.fn(() => ({})),
        createSign: vi.fn(() => ({
          update: vi.fn().mockReturnThis(),
          sign: mockSign,
        })),
        createVerify: vi.fn(() => ({
          update: vi.fn().mockReturnThis(),
          verify: mockVerify,
        })),
      },
    }));
    return await import('../alipay');
  }

  describe('createAlipayOrder', () => {
    it('should generate a valid payment URL', async () => {
      const { createAlipayOrder } = await importAlipay();
      const url = await createAlipayOrder({
        orderId: 'test-order-123',
        amount: 199,
        subject: 'Test Product - Pro',
        body: '购买 Test Product 的 Pro 方案',
      });

      expect(url).toContain('openapi.alipay.com/gateway.do');
      expect(url).toContain('app_id=test-app-id');
      expect(url).toContain('method=alipay.trade.page.pay');
      expect(url).toContain('sign=');
      expect(url).toContain('biz_content=');
    });

    it('should format amount with 2 decimal places', async () => {
      const { createAlipayOrder } = await importAlipay();
      const url = await createAlipayOrder({
        orderId: 'test-order-456',
        amount: 99.5,
        subject: 'Test',
        body: 'Test body',
      });

      expect(url).toContain('99.50');
    });

    it('should encode timestamp as Beijing time (UTC+8), not raw UTC', async () => {
      // 2024-01-01T00:00:00.000Z UTC == 2024-01-01 08:00:00 北京时间
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));

      const { createAlipayOrder } = await importAlipay();
      const url = await createAlipayOrder({
        orderId: 'test-order-tz',
        amount: 10,
        subject: 'Test',
        body: 'Test body',
      });

      expect(url).toContain(encodeURIComponent('2024-01-01 08:00:00'));
      expect(url).not.toContain(encodeURIComponent('2024-01-01 00:00:00'));

      vi.useRealTimers();
    });

    it('should include notify_url and return_url', async () => {
      const { createAlipayOrder } = await importAlipay();
      const url = await createAlipayOrder({
        orderId: 'test-order-789',
        amount: 100,
        subject: 'Test',
        body: 'Test body',
      });

      expect(url).toContain(encodeURIComponent('https://example.com/api/payment/alipay/notify'));
      expect(url).toContain(encodeURIComponent('https://example.com/api/payment/alipay/return'));
    });

    it('生产根域名会规范为 www，且同步回跳先经过验签路由', async () => {
      process.env.NEXT_PUBLIC_SITE_URL = 'https://imagentx.top';
      const { createAlipayOrder } = await importAlipay();

      const paymentUrl = new URL(await createAlipayOrder({
        orderId: 'test-order-canonical',
        amount: 100,
        subject: 'Test',
        body: 'Test body',
      }));

      expect(paymentUrl.searchParams.get('notify_url')).toBe(
        'https://www.imagentx.top/api/payment/alipay/notify',
      );
      expect(paymentUrl.searchParams.get('return_url')).toBe(
        'https://www.imagentx.top/api/payment/alipay/return',
      );
    });
  });

  describe('createAlipayMobileOrder', () => {
    it('should use QUICK_WAP_WAY product code', async () => {
      const { createAlipayMobileOrder } = await importAlipay();
      const url = await createAlipayMobileOrder({
        orderId: 'test-mobile-123',
        amount: 299,
        subject: 'Mobile Product',
        body: 'Mobile body',
      });

      expect(url).toContain('method=alipay.trade.wap.pay');
      expect(url).toContain('QUICK_WAP_WAY');
    });
  });

  describe('verifyAlipayNotify', () => {
    it('should verify signature', async () => {
      mockVerify.mockReturnValue(true);
      const { verifyAlipayNotify } = await importAlipay();
      const result = verifyAlipayNotify({
        out_trade_no: 'test-123',
        trade_status: 'TRADE_SUCCESS',
        sign: 'test-signature',
      });

      expect(result).toBe(true);
    });

    it('should return false for invalid signature', async () => {
      mockVerify.mockReturnValue(false);
      const { verifyAlipayNotify } = await importAlipay();
      const result = verifyAlipayNotify({
        out_trade_no: 'test-123',
        sign: 'bad-signature',
      });

      expect(result).toBe(false);
    });
  });

  describe('refundAlipayOrder', () => {
    function stubFetch(response: {
      ok?: boolean;
      status?: number;
      body: unknown;
    }): ReturnType<typeof vi.fn> {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: response.ok ?? true,
        status: response.status ?? 200,
        json: async () => response.body,
      });
      vi.stubGlobal('fetch', fetchMock);
      return fetchMock;
    }

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('成功退款调用 alipay.trade.refund，验签通过并返回 fundChange', async () => {
      mockVerify.mockReturnValue(true);
      const fetchMock = stubFetch({
        body: {
          alipay_trade_refund_response: { code: '10000', msg: 'Success', fund_change: 'Y' },
          sign: 'refund-signature',
        },
      });

      const { refundAlipayOrder } = await importAlipay();
      const result = await refundAlipayOrder({
        outTradeNo: 'order-1',
        tradeNo: 'alipay-trade-1',
        refundAmount: 39,
      });

      expect(result).toEqual({ success: true, fundChange: true });

      const [url, opts] = fetchMock.mock.calls[0] as [string, { body: string }];
      expect(url).toContain('gateway.do');
      expect(opts.body).toContain('method=alipay.trade.refund');
      // refund_amount / out_trade_no / trade_no 在 URL 编码的 biz_content 里
      const bizContent = new URLSearchParams(opts.body).get('biz_content') ?? '';
      expect(bizContent).toContain('"refund_amount":"39.00"');
      expect(bizContent).toContain('"out_trade_no":"order-1"');
      expect(bizContent).toContain('"trade_no":"alipay-trade-1"');
      expect(opts.body).toContain('sign=');
    });

    it('校验响应验签，验签失败抛错（防止伪造退款结果）', async () => {
      mockVerify.mockReturnValue(false);
      stubFetch({
        body: {
          alipay_trade_refund_response: { code: '10000', msg: 'Success' },
          sign: 'forged-signature',
        },
      });

      const { refundAlipayOrder } = await importAlipay();
      await expect(refundAlipayOrder({
        outTradeNo: 'order-2',
        tradeNo: 'alipay-trade-2',
        refundAmount: 39,
      })).rejects.toThrow('验签失败');
    });

    it('支付宝业务拒绝（code 非 10000）时返回失败结果', async () => {
      mockVerify.mockReturnValue(true);
      stubFetch({
        body: {
          alipay_trade_refund_response: {
            code: '40004',
            msg: 'Business Failed',
            sub_code: 'ACQ.TRADE_NOT_EXIST',
            sub_msg: '交易不存在',
          },
          sign: 'refund-signature',
        },
      });

      const { refundAlipayOrder } = await importAlipay();
      const result = await refundAlipayOrder({
        outTradeNo: 'order-3',
        tradeNo: 'alipay-trade-3',
        refundAmount: 39,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.code).toBe('40004');
        expect(result.msg).toContain('交易不存在');
      }
    });

    it('HTTP 非 2xx 时抛错', async () => {
      mockVerify.mockReturnValue(true);
      stubFetch({ ok: false, status: 500, body: {} });

      const { refundAlipayOrder } = await importAlipay();
      await expect(refundAlipayOrder({
        outTradeNo: 'order-4',
        tradeNo: 'alipay-trade-4',
        refundAmount: 39,
      })).rejects.toThrow('HTTP 500');
    });
  });
});
