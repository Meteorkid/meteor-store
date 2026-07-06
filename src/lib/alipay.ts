import crypto from 'crypto';

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
  return `-----BEGIN ${type} KEY-----\n${body}\n-----END ${type} KEY-----`;
}

// 惰性加载支付宝配置，避免模块加载时环境变量未注入导致静默失败
function getAlipayConfig() {
  return {
    appId: process.env.ALIPAY_APP_ID || '',
    privateKey: normalizeKey(process.env.ALIPAY_PRIVATE_KEY || '', 'PRIVATE'),
    alipayPublicKey: normalizeKey(process.env.ALIPAY_PUBLIC_KEY || '', 'PUBLIC'),
    gateway: process.env.ALIPAY_GATEWAY || 'https://openapi.alipay.com/gateway.do',
    notifyUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/alipay/notify`,
    returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
  };
}

// 生成签名
function sign(params: Record<string, string>): string {
  const config = getAlipayConfig();
  // 1. 按照 key 的 ASCII 码从小到大排序
  const sortedKeys = Object.keys(params).sort();

  // 2. 拼接字符串
  const signStr = sortedKeys
    .filter(key => key !== 'sign' && key !== 'sign_type' && params[key] !== undefined && params[key] !== '')
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
    quit_url: `${process.env.NEXT_PUBLIC_SITE_URL}/products`,
  };

  const requestParams: Record<string, string> = {
    app_id: config.appId,
    method: 'alipay.trade.page.pay',
    charset: 'utf-8',
    sign_type: 'RSA2',
    timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
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
    timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
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
