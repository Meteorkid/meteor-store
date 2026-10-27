import crypto from 'crypto';
import { getSiteUrl } from './constants';

/**
 * 将密钥规范化为 PEM 格式。
 * 环境变量中的密钥可能是：完整 PEM（含 \n 转义或真实换行）、或裸 base64（支付宝控制台复制的格式）。
 * Node crypto 只接受 PEM，裸 base64 会报 "DECODER routines::unsupported"。
 */
function normalizeKey(key: string, type: 'PRIVATE' | 'PUBLIC'): string {
  if (!key) return '';
  const k = key.trim().replace(/\\n/g, '\n');
  if (k.includes('-----BEGIN')) return k;
  const body = k.replace(/\s+/g, '').match(/.{1,64}/g)?.join('\n') ?? '';
  if (type === 'PUBLIC') {
    return `-----BEGIN PUBLIC KEY-----\n${body}\n-----END PUBLIC KEY-----`;
  }
  // 私钥可能是 PKCS#8（PRIVATE KEY）或 PKCS#1（RSA PRIVATE KEY，支付宝密钥工具默认格式），逐一尝试
  for (const header of ['PRIVATE KEY', 'RSA PRIVATE KEY']) {
    const pem = `-----BEGIN ${header}-----\n${body}\n-----END ${header}-----`;
    try {
      crypto.createPrivateKey(pem);
      return pem;
    } catch {
      // 尝试下一种格式
    }
  }
  throw new Error('ALIPAY_PRIVATE_KEY 无法解析：既不是有效的 PKCS#8 也不是 PKCS#1 格式');
}

// 支付宝要求 timestamp 为北京时间（UTC+8），而非服务器本地/UTC 时间
function getAlipayTimestamp(): string {
  const beijingMs = Date.now() + 8 * 60 * 60 * 1000;
  return new Date(beijingMs).toISOString().slice(0, 19).replace('T', ' ');
}

function getCanonicalSiteUrl(): string {
  const site = new URL(getSiteUrl());
  if (site.protocol !== 'https:' && site.protocol !== 'http:') {
    throw new Error('NEXT_PUBLIC_SITE_URL must use http or https');
  }
  // 生产主域名由 Vercel 规范到 www。回调地址本身不能依赖 308 跳转，
  // 否则支付宝收不到 route 返回的纯文本 success。
  const canonicalHost = `www.${site.hostname.replace(/^www\./, '')}`;
  if (site.hostname !== canonicalHost) {
    site.hostname = canonicalHost;
  }
  return site.origin;
}

// 惰性加载支付宝配置，避免模块加载时环境变量未注入导致静默失败
function getAlipayConfig() {
  const siteUrl = getCanonicalSiteUrl();
  return {
    appId: process.env.ALIPAY_APP_ID || '',
    privateKey: normalizeKey(process.env.ALIPAY_PRIVATE_KEY || '', 'PRIVATE'),
    alipayPublicKey: normalizeKey(process.env.ALIPAY_PUBLIC_KEY || '', 'PUBLIC'),
    sellerId: process.env.ALIPAY_SELLER_ID || '',
    gateway: process.env.ALIPAY_GATEWAY || 'https://openapi.alipay.com/gateway.do',
    siteUrl,
    notifyUrl: `${siteUrl}/api/payment/alipay/notify`,
    returnUrl: `${siteUrl}/api/payment/alipay/return`,
  };
}

/** 下单前确认创建支付和异步回调所需配置全部可用。 */
export function isAlipayConfigured(): boolean {
  try {
    const config = getAlipayConfig();
    return Boolean(
      config.appId &&
      config.privateKey &&
      config.alipayPublicKey &&
      config.sellerId &&
      config.siteUrl,
    );
  } catch {
    return false;
  }
}

// 生成签名
function sign(params: Record<string, string>): string {
  const config = getAlipayConfig();
  // 1. 按照 key 的 ASCII 码从小到大排序
  const sortedKeys = Object.keys(params).sort();

  // 2. 拼接字符串
  // 注意：请求签名只排除 sign，sign_type 必须参与签名（与回调验签不同）
  const signStr = sortedKeys
    .filter(key => key !== 'sign' && params[key] !== undefined && params[key] !== '')
    .map(key => `${key}=${params[key]}`)
    .join('&');

  // 3. 使用 RSA2 (SHA256) 签名
  const signature = crypto
    .createSign('RSA-SHA256')
    .update(signStr)
    .sign(config.privateKey, 'base64');

  return signature;
}

// 验证签名
function verify(params: Record<string, string>, signature: string): boolean {
  const config = getAlipayConfig();
  const sortedKeys = Object.keys(params).sort();

  const signStr = sortedKeys
    .filter(key => key !== 'sign' && key !== 'sign_type' && params[key] !== undefined && params[key] !== '')
    .map(key => `${key}=${params[key]}`)
    .join('&');

  const verifier = crypto
    .createVerify('RSA-SHA256')
    .update(signStr);

  return verifier.verify(config.alipayPublicKey, signature, 'base64');
}

// 创建电脑网站支付订单
export async function createAlipayOrder(params: {
  orderId: string;
  amount: number;
  subject: string;
  body: string;
}) {
  const config = getAlipayConfig();
  if (!config.appId || !config.privateKey) {
    throw new Error('Alipay configuration missing: APP_ID or PRIVATE_KEY not set');
  }
  const { orderId, amount, subject, body } = params;

  // 构建请求参数
  const bizContent = {
    out_trade_no: orderId,
    total_amount: amount.toFixed(2),
    subject,
    body,
    product_code: 'FAST_INSTANT_TRADE_PAY',
    quit_url: `${config.siteUrl}/products`,
  };

  const requestParams: Record<string, string> = {
    app_id: config.appId,
    method: 'alipay.trade.page.pay',
    charset: 'utf-8',
    sign_type: 'RSA2',
    timestamp: getAlipayTimestamp(),
    version: '1.0',
    notify_url: config.notifyUrl,
    return_url: config.returnUrl,
    biz_content: JSON.stringify(bizContent),
  };

  // 生成签名
  const signature = sign(requestParams);
  requestParams.sign = signature;

  // 构建支付 URL
  const queryString = Object.entries(requestParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  return `${config.gateway}?${queryString}`;
}

// 创建手机网站支付订单
export async function createAlipayMobileOrder(params: {
  orderId: string;
  amount: number;
  subject: string;
  body: string;
}) {
  const config = getAlipayConfig();
  if (!config.appId || !config.privateKey) {
    throw new Error('Alipay configuration missing: APP_ID or PRIVATE_KEY not set');
  }
  const { orderId, amount, subject, body } = params;

  const bizContent = {
    out_trade_no: orderId,
    total_amount: amount.toFixed(2),
    subject,
    body,
    product_code: 'QUICK_WAP_WAY',
  };

  const requestParams: Record<string, string> = {
    app_id: config.appId,
    method: 'alipay.trade.wap.pay',
    charset: 'utf-8',
    sign_type: 'RSA2',
    timestamp: getAlipayTimestamp(),
    version: '1.0',
    notify_url: config.notifyUrl,
    return_url: config.returnUrl,
    biz_content: JSON.stringify(bizContent),
  };

  const signature = sign(requestParams);
  requestParams.sign = signature;

  const queryString = Object.entries(requestParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  return `${config.gateway}?${queryString}`;
}

// 验证回调通知
export function verifyAlipayNotify(params: Record<string, string>): boolean {
  const { sign, ...rest } = params;
  if (!sign) return false;
  return verify(rest, sign);
}

/**
 * 对支付宝接口响应的原始 JSON 字符串验签。
 * 退款等主动查询类接口的响应签名，是用 `alipay_xxx_response` 的完整 JSON 字符串
 * 作为待签名内容（而非 notify 通知那种逐 k=v 拼接），因此不能复用 verify()。
 */
function verifyRaw(source: string, signature: string): boolean {
  if (!source || !signature) return false;
  try {
    const verifier = crypto.createVerify('RSA-SHA256').update(source);
    return verifier.verify(getAlipayConfig().alipayPublicKey, signature, 'base64');
  } catch {
    return false;
  }
}

export type RefundAlipayResult =
  | { success: true; fundChange: boolean }
  | { success: false; code: string; msg: string };

type AlipayRefundInput = { outTradeNo: string; tradeNo: string; outRequestNo?: string; refundAmount: number };

/** 价格字段按分解析，避免浮点比较或把缺失金额当成零。 */
function priceInCents(value: unknown): number {
  const text = typeof value === 'string' || typeof value === 'number' ? String(value) : '';
  if (!/^\d+(?:\.\d{1,2})?$/.test(text)) throw new Error('支付宝退款金额格式无效');
  const [whole, decimals = ''] = text.split('.');
  const cents = Number(whole) * 100 + Number(decimals.padEnd(2, '0'));
  if (!Number.isSafeInteger(cents) || cents <= 0) throw new Error('支付宝退款金额无效');
  return cents;
}

/** 保留响应对象的原始字节序列验签，不用JSON.stringify改写空白或转义。 */
function signedResponseSource(raw: string, key: string, parsed: unknown): string {
  const pattern = new RegExp('"' + key + '"\\s*:\\s*', 'g');
  const matches = [...raw.matchAll(pattern)];
  if (matches.length !== 1) throw new Error('支付宝退款响应结构无效');
  const start = matches[0].index! + matches[0][0].length;
  if (raw[start] !== '{') throw new Error('支付宝退款响应结构无效');
  let depth = 0; let quoted = false; let escaped = false;
  for (let index = start; index < raw.length; index++) {
    const character = raw[index];
    if (quoted) {
      if (escaped) escaped = false;
      else if (character === '\\') escaped = true;
      else if (character === '"') quoted = false;
    } else if (character === '"') quoted = true;
    else if (character === '{') depth++;
    else if (character === '}' && --depth === 0) {
      const source = raw.slice(start, index + 1);
      if (JSON.stringify(JSON.parse(source)) !== JSON.stringify(parsed)) throw new Error('支付宝退款响应不一致');
      return source;
    }
  }
  throw new Error('支付宝退款响应结构无效');
}

async function requestAlipayRefundApi(method: 'alipay.trade.refund' | 'alipay.trade.fastpay.refund.query', bizContent: Record<string, string>) {
  const config = getAlipayConfig();
  if (!config.appId || !config.privateKey || !config.alipayPublicKey) throw new Error('Alipay configuration missing: APP_ID / PRIVATE_KEY / PUBLIC_KEY not set');
  const params: Record<string, string> = { app_id: config.appId, method, charset: 'utf-8', sign_type: 'RSA2', timestamp: getAlipayTimestamp(), version: '1.0', biz_content: JSON.stringify(bizContent) };
  params.sign = sign(params);
  const response = await fetch(config.gateway, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(params).toString(), signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`支付宝退款请求失败：HTTP ${response.status}`);
  const raw = await response.text();
  const data = JSON.parse(raw) as Record<string, unknown>;
  const key = method.replaceAll('.', '_') + '_response';
  const result = data[key];
  if (!result || typeof result !== 'object') throw new Error('支付宝退款响应结构无效');
  if (!verifyRaw(signedResponseSource(raw, key, result), typeof data.sign === 'string' ? data.sign : '')) throw new Error('支付宝退款响应验签失败');
  return result as Record<string, unknown>;
}

function checkAlipayRefundIdentity(result: Record<string, unknown>, input: { outTradeNo: string; tradeNo: string; outRequestNo?: string }, required: boolean) {
  for (const [field, expected] of [['out_trade_no', input.outTradeNo], ['trade_no', input.tradeNo]] as const) {
    if ((required || result[field] !== undefined) && result[field] !== expected) throw new Error('支付宝退款交易信息不匹配');
  }
  const requestNo = input.outRequestNo ?? input.outTradeNo;
  if (result.out_request_no !== undefined && result.out_request_no !== requestNo) throw new Error('支付宝退款请求号不匹配');
}

/** success只代表请求成功；只有fundChange=true且身份/金额通过校验才可确认资金已退。 */
export async function refundAlipayOrder(input: AlipayRefundInput): Promise<RefundAlipayResult> {
  const result = await requestAlipayRefundApi('alipay.trade.refund', { out_trade_no: input.outTradeNo, trade_no: input.tradeNo,
    out_request_no: input.outRequestNo ?? input.outTradeNo, refund_amount: input.refundAmount.toFixed(2), refund_reason: '用户退款' });
  const code = String(result.code ?? '');
  if (code === '20000' || String(result.sub_code ?? '').includes('SYSTEM_ERROR')) throw new Error('支付宝退款结果暂不可确认');
  if (code !== '10000') return { success: false, code, msg: String(result.sub_msg ?? result.msg ?? '支付宝未受理退款') };
  const changed = result.fund_change === 'Y';
  checkAlipayRefundIdentity(result, input, changed);
  if (changed && priceInCents(result.refund_fee) !== Math.round(input.refundAmount * 100)) throw new Error('支付宝退款金额不匹配');
  return { success: true, fundChange: changed };
}

/** 只有REFUND_SUCCESS是退款成功；历史未传请求号的记录按原orderId查询。 */
export async function queryAlipayRefund(input: { outTradeNo: string; tradeNo: string; outRequestNo?: string }): Promise<{ found: false } | { found: true; refundAmount: number; totalAmount: number }> {
  const result = await requestAlipayRefundApi('alipay.trade.fastpay.refund.query', { out_trade_no: input.outTradeNo, trade_no: input.tradeNo, out_request_no: input.outRequestNo ?? input.outTradeNo });
  if (String(result.code ?? '') !== '10000') throw new Error('支付宝退款查询暂不可确认');
  const succeeded = result.refund_status === 'REFUND_SUCCESS';
  checkAlipayRefundIdentity(result, input, succeeded);
  if (!succeeded) return { found: false };
  if (result.out_request_no !== (input.outRequestNo ?? input.outTradeNo)) throw new Error('支付宝退款查询请求号不匹配');
  const refundAmount = priceInCents(result.refund_amount); const totalAmount = priceInCents(result.total_amount);
  if (refundAmount > totalAmount) throw new Error('支付宝退款查询金额不匹配');
  return { found: true, refundAmount, totalAmount };
}
