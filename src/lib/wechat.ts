import crypto from 'crypto';

const BASE_URL = 'https://api.mch.weixin.qq.com';

// 微信支付 API v3 客户端。
//
// 与支付宝不同，微信支付走 JSON over HTTPS，请求头部用商户 API 私钥做
// RSA-SHA256 签名（WECHATPAY2-SHA256-RSA2048），回调与响应用平台公钥验签，
// 回调内容用 API v3 密钥做 AES-256-GCM 解密。所有调用都在服务端发起，
// 浏览器从不直连微信，因此无需放宽站点 CSP 的 connect-src。

/** 将密钥/证书公钥规范化为 PEM 格式（兼容裸 base64 / 已带 PEM 头）。 */
function normalizePem(key: string, type: 'PRIVATE' | 'PUBLIC' | 'CERT'): string {
  if (!key) return '';
  const k = key.trim().replace(/\\n/g, '\n');
  if (k.includes('-----BEGIN')) return k;
  const body = k.replace(/\s+/g, '').match(/.{1,64}/g)?.join('\n') ?? '';
  if (type === 'PRIVATE') {
    // 商户 API 私钥官方只发 PKCS#8，但兼容 PKCS#1 以防复制格式差异
    for (const header of ['PRIVATE KEY', 'RSA PRIVATE KEY']) {
      const pem = `-----BEGIN ${header}-----\n${body}\n-----END ${header}-----`;
      try {
        crypto.createPrivateKey(pem);
        return pem;
      } catch {
        // 尝试下一种格式
      }
    }
    throw new Error('WECHAT_PRIVATE_KEY 无法解析：既不是 PKCS#8 也不是 PKCS#1 格式');
  }
  const header = type === 'CERT' ? 'CERTIFICATE' : 'PUBLIC KEY';
  return `-----BEGIN ${header}-----\n${body}\n-----END ${header}-----`;
}

function getWechatConfig() {
  return {
    mchid: process.env.WECHAT_MCHID || '',
    appid: process.env.WECHAT_APPID || '',
    privateKey: normalizePem(process.env.WECHAT_PRIVATE_KEY || '', 'PRIVATE'),
    serialNo: process.env.WECHAT_SERIAL_NO || '',
    apiV3Key: process.env.WECHAT_API_V3_KEY || '',
    platformPublicKey: normalizePem(process.env.WECHAT_PLATFORM_PUBLIC_KEY || '', 'PUBLIC'),
    // 平台公钥模式下的公钥 ID（PUB_KEY_ID_xxx）。配置后校验响应头 Wechatpay-Serial 一致。
    platformPublicKeyId: process.env.WECHAT_PLATFORM_PUBLIC_KEY_ID || '',
    notifyUrl: `${getSiteUrl()}/api/payment/wechat/notify`,
  };
}

function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (!raw) throw new Error('NEXT_PUBLIC_SITE_URL is not set');
  const site = new URL(raw);
  if (site.hostname === 'imagentx.top') site.hostname = 'www.imagentx.top';
  return site.origin;
}

/** 下单或退款前确认微信支付所需配置全部可用。 */
export function isWechatConfigured(): boolean {
  try {
    const config = getWechatConfig();
    return Boolean(
      config.mchid &&
      config.appid &&
      config.privateKey &&
      config.serialNo &&
      config.apiV3Key &&
      config.platformPublicKey &&
      config.notifyUrl,
    );
  } catch {
    return false;
  }
}

/**
 * 构造请求头里的 Authorization 签名。
 * 签名串：`METHOD\nURL(含查询串)\nTIMESTAMP\nNONCE\nBODY\n`，用商户 API 私钥 RSA-SHA256 签名。
 */
function buildAuthHeader(
  method: string,
  url: string,
  body: string,
): { authorization: string; nonce: string; timestamp: string } {
  const config = getWechatConfig();
  const nonce = crypto.randomBytes(16).toString('hex');
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const message = `${method}\n${url}\n${timestamp}\n${nonce}\n${body}\n`;
  const signature = crypto.createSign('RSA-SHA256').update(message).sign(config.privateKey, 'base64');
  return {
    authorization:
      `WECHATPAY2-SHA256-RSA2048 mchid="${config.mchid}",` +
      `nonce_str="${nonce}",timestamp="${timestamp}",serial_no="${config.serialNo}",` +
      `signature="${signature}"`,
    nonce,
    timestamp,
  };
}

/** 用平台公钥校验微信响应/回调的 Wechatpay-Signature。 */
function verifyPlatformSignature(rawBody: string, headers: Headers): boolean {
  const config = getWechatConfig();
  const timestamp = headers.get('wechatpay-timestamp') || '';
  const nonce = headers.get('wechatpay-nonce') || '';
  const signature = headers.get('wechatpay-signature') || '';
  if (!timestamp || !nonce || !signature) return false;
  // 防重放：超过 5 分钟的签名直接拒绝
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  // 平台公钥模式：响应头 Wechatpay-Serial 携带公钥 ID，配置后必须与之一致
  const serial = headers.get('wechatpay-serial') || '';
  if (config.platformPublicKeyId && serial !== config.platformPublicKeyId) {
    return false;
  }
  try {
    const message = `${timestamp}\n${nonce}\n${rawBody}\n`;
    return crypto
      .createVerify('RSA-SHA256')
      .update(message)
      .verify(config.platformPublicKey, signature, 'base64');
  } catch {
    return false;
  }
}

/** 用 API v3 密钥对回调的 AES-256-GCM 密文解密。 */
function decryptResource(resource: {
  ciphertext: string;
  nonce: string;
  associated_data?: string;
}): Record<string, unknown> {
  const config = getWechatConfig();
  const key = Buffer.from(config.apiV3Key, 'utf8');
  if (key.length !== 32) throw new Error('WECHAT_API_V3_KEY 必须是 32 字节（32 位字符）');
  const ciphertext = Buffer.from(resource.ciphertext, 'base64');
  const authTag = ciphertext.subarray(ciphertext.length - 16);
  const data = ciphertext.subarray(0, ciphertext.length - 16);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(resource.nonce, 'utf8'));
  decipher.setAuthTag(authTag);
  if (resource.associated_data) decipher.setAAD(Buffer.from(resource.associated_data, 'utf8'));
  const plaintext = Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
  return JSON.parse(plaintext) as Record<string, unknown>;
}

async function postJson(path: string, payload: Record<string, unknown>): Promise<{
  data: Record<string, unknown>;
  rawBody: string;
  headers: Headers;
}> {
  const url = `${BASE_URL}${path}`;
  const body = JSON.stringify(payload);
  const { authorization } = buildAuthHeader('POST', path, body);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: authorization,
      'User-Agent': 'meteor-store',
    },
    body,
    signal: AbortSignal.timeout(10_000),
  });
  const rawBody = await response.text();
  if (!response.ok) {
    throw new Error(`微信支付请求失败：HTTP ${response.status} ${rawBody}`);
  }
  return { data: JSON.parse(rawBody) as Record<string, unknown>, rawBody, headers: response.headers };
}

export type WechatOrderResult = { codeUrl: string } | { h5Url: string };

/**
 * 创建微信支付下单（Native 扫码 或 H5 拉起）。
 * - native：返回 { codeUrl }，前端渲染成二维码让用户扫码
 * - h5：返回 { h5Url }，前端跳转拉起微信
 * 金额单位是分（微信最小单位），从 CNY 元换算。
 */
export async function createWechatOrder(params: {
  orderId: string;
  amountCny: number;
  description: string;
  clientIp: string;
  channel: 'native' | 'h5';
}): Promise<WechatOrderResult> {
  const config = getWechatConfig();
  if (!isWechatConfigured()) {
    throw new Error('Wechat Pay configuration missing');
  }
  const { orderId, amountCny, description, clientIp, channel } = params;
  const total = Math.round(amountCny * 100);

  if (channel === 'native') {
    const { data } = await postJson('/v3/pay/transactions/native', {
      appid: config.appid,
      mchid: config.mchid,
      description,
      out_trade_no: orderId,
      notify_url: config.notifyUrl,
      amount: { total, currency: 'CNY' },
      scene_info: { payer_client_ip: clientIp },
    });
    const codeUrl = String(data.code_url ?? '');
    if (!codeUrl) throw new Error('微信 Native 下单未返回 code_url');
    return { codeUrl };
  }

  const { data } = await postJson('/v3/pay/transactions/h5', {
    appid: config.appid,
    mchid: config.mchid,
    description,
    out_trade_no: orderId,
    notify_url: config.notifyUrl,
    amount: { total, currency: 'CNY' },
    scene_info: {
      payer_client_ip: clientIp,
      h5_info: { type: 'Wap' },
    },
  });
  const h5Url = String(data.h5_url ?? '');
  if (!h5Url) throw new Error('微信 H5 下单未返回 h5_url');
  return { h5Url };
}

/** 微信支付成功的回调里，resource 解密后的交易状态。 */
export type WechatPaidResult = {
  outTradeNo: string;
  transactionId: string;
  /** 支付金额（分） */
  total: number;
  tradeState: string;
};

/**
 * 校验并解密微信支付回调。返回 null 表示验签不通过（调用方应返回失败让微信重试）；
 * 否则返回解密后的交易信息。
 */
export function parseWechatNotify(
  rawBody: string,
  headers: Headers,
): WechatPaidResult | null {
  if (!verifyPlatformSignature(rawBody, headers)) return null;

  let payload: {
    resource?: { ciphertext: string; nonce: string; associated_data?: string };
  };
  try {
    payload = JSON.parse(rawBody) as typeof payload;
  } catch {
    return null;
  }
  if (!payload.resource?.ciphertext) return null;

  const resource = decryptResource(payload.resource);
  const amount = resource.amount as { total?: number } | undefined;
  return {
    outTradeNo: String(resource.out_trade_no ?? ''),
    transactionId: String(resource.transaction_id ?? ''),
    total: amount?.total ?? 0,
    tradeState: String(resource.trade_state ?? ''),
  };
}

/** 微信退款结果回调（REFUND.SUCCESS / REFUND.ABNORMAL / REFUND.CLOSED）解密后的退款信息。 */
export type WechatRefundNotify = {
  outTradeNo: string;
  outRefundNo: string;
  refundStatus: string;
  /** 本次退款金额（分） */
  refundAmount: number;
  /** 原订单总金额（分） */
  totalAmount: number;
};

const REFUND_EVENT_TYPES = ['REFUND.SUCCESS', 'REFUND.ABNORMAL', 'REFUND.CLOSED'];

/**
 * 校验并解密微信退款结果回调。
 * 验签失败返回 null（调用方返回失败让微信重试）；非退款事件也返回 null，由调用方自行分流。
 */
export function parseWechatRefundNotify(
  rawBody: string,
  headers: Headers,
): WechatRefundNotify | null {
  if (!verifyPlatformSignature(rawBody, headers)) return null;

  let payload: {
    event_type?: unknown;
    resource?: { ciphertext: string; nonce: string; associated_data?: string };
  };
  try {
    payload = JSON.parse(rawBody) as typeof payload;
  } catch {
    return null;
  }
  if (!REFUND_EVENT_TYPES.includes(String(payload.event_type ?? ''))) return null;
  if (!payload.resource?.ciphertext) return null;

  const resource = decryptResource(payload.resource);
  const amount = resource.amount as { refund?: number; total?: number } | undefined;
  return {
    outTradeNo: String(resource.out_trade_no ?? ''),
    outRefundNo: String(resource.out_refund_no ?? ''),
    refundStatus: String(resource.refund_status ?? ''),
    refundAmount: amount?.refund ?? 0,
    totalAmount: amount?.total ?? 0,
  };
}

export type WechatRefundResult =
  | { success: true; refundStatus: string }
  | { success: false; code: string; msg: string };

/**
 * 主动发起微信退款（POST /v3/refund/domestic/refunds）。
 * 微信退款通常异步受理，返回的 status 为 PROCESSING / SUCCESS 等即时快照；
 * 这里只确认「退款指令已被受理」，不阻塞等待终态。
 */
export async function refundWechatOrder(params: {
  outTradeNo: string;
  transactionId: string;
  refundAmountCny: number;
}): Promise<WechatRefundResult> {
  if (!isWechatConfigured()) {
    throw new Error('Wechat Pay configuration missing');
  }
  const { outTradeNo, transactionId, refundAmountCny } = params;
  const outRefundNo = `${outTradeNo}-R${Date.now()}`;

  const { data } = await postJson('/v3/refund/domestic/refunds', {
    out_trade_no: outTradeNo,
    out_refund_no: outRefundNo,
    transaction_id: transactionId,
    reason: '用户退款',
    amount: {
      refund: Math.round(refundAmountCny * 100),
      total: Math.round(refundAmountCny * 100),
      currency: 'CNY',
    },
  });

  const code = String(data.code ?? '');
  if (code !== '') {
    const msg = String(data.message ?? '未知错误');
    return { success: false, code, msg };
  }
  return { success: true, refundStatus: String(data.status ?? 'PROCESSING') };
}