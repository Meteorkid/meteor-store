// 支付配置
export const PAYMENT_CONFIG = {
  alipay: {
    appId: process.env.ALIPAY_APP_ID || '',
    privateKey: process.env.ALIPAY_PRIVATE_KEY || '',
    alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY || '',
    gateway: process.env.ALIPAY_GATEWAY || 'https://openapi.alipay.com/gateway.do',
  },
  wechat: {
    appId: process.env.WECHAT_APP_ID || '',
    mchId: process.env.WECHAT_MCH_ID || '',
    apiKey: process.env.WECHAT_API_KEY || '',
    apiV3Key: process.env.WECHAT_API_V3_KEY || '',
    certPath: process.env.WECHAT_CERT_PATH || '',
  },
};

export type PaymentMethod = 'alipay' | 'wechat';

export function isPaymentConfigured(): boolean {
  return !!(PAYMENT_CONFIG.alipay.appId || PAYMENT_CONFIG.wechat.appId);
}
