import crypto from 'crypto';

// 支付宝配置
const ALIPAY_CONFIG = {
  appId: process.env.ALIPAY_APP_ID || '',
  privateKey: process.env.ALIPAY_PRIVATE_KEY || '',
  alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY || '',
  gateway: process.env.ALIPAY_GATEWAY || 'https://openapi.alipay.com/gateway.do',
  notifyUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/alipay/notify`,
  returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
};

// 生成签名
function sign(params: Record<string, string>): string {
  // 1. 按照 key 的 ASCII 码从小到大排序
  const sortedKeys = Object.keys(params).sort();

  // 2. 拼接字符串
  const signStr = sortedKeys
    .filter(key => key !== 'sign' && key !== 'sign_type' && params[key])
    .map(key => `${key}=${params[key]}`)
    .join('&');

  // 3. 使用 RSA2 (SHA256) 签名
  const signature = crypto
    .createSign('RSA-SHA256')
    .update(signStr)
    .sign(ALIPAY_CONFIG.privateKey, 'base64');

  return signature;
}

// 验证签名
function verify(params: Record<string, string>, signature: string): boolean {
  const sortedKeys = Object.keys(params).sort();

  const signStr = sortedKeys
    .filter(key => key !== 'sign' && key !== 'sign_type' && params[key])
    .map(key => `${key}=${params[key]}`)
    .join('&');

  const verifier = crypto
    .createVerify('RSA-SHA256')
    .update(signStr);

  return verifier.verify(ALIPAY_CONFIG.alipayPublicKey, signature, 'base64');
}

// 创建电脑网站支付订单
export async function createAlipayOrder(params: {
  orderId: string;
  amount: number;
  subject: string;
  body: string;
}) {
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
    app_id: ALIPAY_CONFIG.appId,
    method: 'alipay.trade.page.pay',
    charset: 'utf-8',
    sign_type: 'RSA2',
    timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
    version: '1.0',
    notify_url: ALIPAY_CONFIG.notifyUrl,
    return_url: ALIPAY_CONFIG.returnUrl,
    biz_content: JSON.stringify(bizContent),
  };

  // 生成签名
  const signature = sign(requestParams);
  requestParams.sign = signature;

  // 构建支付 URL
  const queryString = Object.entries(requestParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  return `${ALIPAY_CONFIG.gateway}?${queryString}`;
}

// 创建手机网站支付订单
export async function createAlipayMobileOrder(params: {
  orderId: string;
  amount: number;
  subject: string;
  body: string;
}) {
  const { orderId, amount, subject, body } = params;

  const bizContent = {
    out_trade_no: orderId,
    total_amount: amount.toFixed(2),
    subject,
    body,
    product_code: 'QUICK_WAP_WAY',
  };

  const requestParams: Record<string, string> = {
    app_id: ALIPAY_CONFIG.appId,
    method: 'alipay.trade.wap.pay',
    charset: 'utf-8',
    sign_type: 'RSA2',
    timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
    version: '1.0',
    notify_url: ALIPAY_CONFIG.notifyUrl,
    return_url: ALIPAY_CONFIG.returnUrl,
    biz_content: JSON.stringify(bizContent),
  };

  const signature = sign(requestParams);
  requestParams.sign = signature;

  const queryString = Object.entries(requestParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  return `${ALIPAY_CONFIG.gateway}?${queryString}`;
}

// 验证回调通知
export function verifyAlipayNotify(params: Record<string, string>): boolean {
  const { sign, ...rest } = params;
  return verify(rest, sign || '');
}

// 查询订单状态
export async function queryAlipayOrder(orderId: string) {
  const bizContent = {
    out_trade_no: orderId,
  };

  const requestParams: Record<string, string> = {
    app_id: ALIPAY_CONFIG.appId,
    method: 'alipay.trade.query',
    charset: 'utf-8',
    sign_type: 'RSA2',
    timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
    version: '1.0',
    biz_content: JSON.stringify(bizContent),
  };

  const signature = sign(requestParams);
  requestParams.sign = signature;

  const response = await fetch(ALIPAY_CONFIG.gateway, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: Object.entries(requestParams)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&'),
  });

  return await response.json();
}
