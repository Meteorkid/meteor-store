import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('wechat', () => {
  let mockSign: ReturnType<typeof vi.fn>;
  let mockVerify: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal('fetch', vi.fn());
    mockSign = vi.fn().mockReturnValue('mock-signature-base64==');
    mockVerify = vi.fn().mockReturnValue(true);
    process.env.WECHAT_MCHID = 'test-mchid';
    process.env.WECHAT_APPID = 'test-appid';
    process.env.WECHAT_PRIVATE_KEY = 'test-private-key';
    process.env.WECHAT_SERIAL_NO = 'test-serial';
    process.env.WECHAT_API_V3_KEY = '0123456789abcdef0123456789abcdef'; // 32 chars
    process.env.WECHAT_PLATFORM_PUBLIC_KEY = 'test-public-key';
    process.env.WECHAT_PLATFORM_PUBLIC_KEY_ID = 'PUB_KEY_ID_test123';
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  async function importWechat() {
    vi.doMock('crypto', () => ({
      default: {
        randomBytes: (n: number) => Buffer.alloc(n, 0x61),
        createPrivateKey: vi.fn(() => ({})),
        createSign: vi.fn(() => ({
          update: vi.fn().mockReturnThis(),
          sign: mockSign,
        })),
        createVerify: vi.fn(() => ({
          update: vi.fn().mockReturnThis(),
          verify: mockVerify,
        })),
        createDecipheriv: () => {
          throw new Error('not used in these cases');
        },
      },
    }));
    return await import('../wechat');
  }

  it('isWechatConfigured 在完整配置时为真', async () => {
    const { isWechatConfigured } = await importWechat();
    expect(isWechatConfigured()).toBe(true);
  });

  it('Native 下单 POST code_url，金额换算为分', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ code_url: 'weixin://wxpay/bizpayurl?pr=abc' }) });
    vi.stubGlobal('fetch', fetchMock);

    const { createWechatOrder } = await importWechat();
    const result = await createWechatOrder({
      orderId: 'order-1',
      amountCny: 39,
      description: 'Test',
      clientIp: '127.0.0.1',
      channel: 'native',
    });

    expect(result).toEqual({ codeUrl: 'weixin://wxpay/bizpayurl?pr=abc' });
    const [url, opts] = fetchMock.mock.calls[0] as [string, { method: string; body: string; headers: Record<string, string> }];
    expect(url).toContain('/v3/pay/transactions/native');
    expect(opts.method).toBe('POST');
    expect(opts.headers.Authorization).toContain('WECHATPAY2-SHA256-RSA2048');
    const body = JSON.parse(opts.body) as { amount: { total: number }; out_trade_no: string };
    expect(body.amount.total).toBe(3900);
    expect(body.out_trade_no).toBe('order-1');
  });

  it('H5 下单返回 h5_url', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ h5_url: 'https://wx.tenpay.com/h5' }) });
    vi.stubGlobal('fetch', fetchMock);

    const { createWechatOrder } = await importWechat();
    const result = await createWechatOrder({
      orderId: 'order-2',
      amountCny: 299,
      description: 'Test',
      clientIp: '127.0.0.1',
      channel: 'h5',
    });

    expect(result).toEqual({ h5Url: 'https://wx.tenpay.com/h5' });
    const [, opts] = fetchMock.mock.calls[0] as [string, { body: string }];
    const body = JSON.parse(opts.body) as { amount: { total: number }; scene_info: Record<string, unknown> };
    expect(body.amount.total).toBe(29900);
    expect(body.scene_info.h5_info).toBeDefined();
  });

  it('HTTP 非 2xx 抛错', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, text: async () => 'error' }));

    const { createWechatOrder } = await importWechat();
    await expect(createWechatOrder({
      orderId: 'order-3',
      amountCny: 39,
      description: 'Test',
      clientIp: '127.0.0.1',
      channel: 'native',
    })).rejects.toThrow('HTTP 500');
  });

  it('parseWechatNotify 验签失败返回 null', async () => {
    mockVerify.mockReturnValue(false);
    const { parseWechatNotify } = await importWechat();
    const headers = new Headers({
      'wechatpay-timestamp': String(Math.floor(Date.now() / 1000)),
      'wechatpay-nonce': 'nonce',
      'wechatpay-signature': 'bad',
    });
    expect(parseWechatNotify('{}', headers)).toBeNull();
  });

  it('parseWechatNotify 平台公钥模式下公钥 ID 不匹配返回 null', async () => {
    mockVerify.mockReturnValue(true);
    const { parseWechatNotify } = await importWechat();
    const headers = new Headers({
      'wechatpay-timestamp': String(Math.floor(Date.now() / 1000)),
      'wechatpay-nonce': 'nonce',
      'wechatpay-signature': 'sig',
      'wechatpay-serial': 'PUB_KEY_ID_other', // 与配置的 PUB_KEY_ID_test123 不一致
    });
    expect(parseWechatNotify('{"resource":{}}', headers)).toBeNull();
  });
});