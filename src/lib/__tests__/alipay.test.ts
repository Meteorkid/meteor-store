import { describe, it, expect, vi, beforeEach } from 'vitest';

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

    it('should include notify_url and return_url', async () => {
      const { createAlipayOrder } = await importAlipay();
      const url = await createAlipayOrder({
        orderId: 'test-order-789',
        amount: 100,
        subject: 'Test',
        body: 'Test body',
      });

      expect(url).toContain(encodeURIComponent('https://example.com/api/payment/alipay/notify'));
      expect(url).toContain(encodeURIComponent('https://example.com/success'));
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
});
