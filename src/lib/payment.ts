// 支付配置
export const PAYMENT_CONFIG = {
  // 国内支付 - 支付宝
  alipay: {
    appId: process.env.ALIPAY_APP_ID || '',
    privateKey: process.env.ALIPAY_PRIVATE_KEY || '',
    alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY || '',
    gateway: process.env.ALIPAY_GATEWAY || 'https://openapi.alipay.com/gateway.do',
  },

  // 国内支付 - 微信支付
  wechat: {
    appId: process.env.WECHAT_APP_ID || '',
    mchId: process.env.WECHAT_MCH_ID || '',
    apiKey: process.env.WECHAT_API_KEY || '',
    apiV3Key: process.env.WECHAT_API_V3_KEY || '',
    certPath: process.env.WECHAT_CERT_PATH || '',
  },
};

// 支付方式类型
export type PaymentMethod = 'alipay' | 'wechat';

// 人民币价格映射（基于美元价格，汇率 1:7）
export const PRICE_CNY_MAP: Record<string, number> = {
  // OmniCrawl
  'omnicrawl-starter': 199,
  'omnicrawl-pro': 549,
  'omnicrawl-enterprise': 1399,
  // Ex-Memory
  'ex-memory-basic': 59,
  'ex-memory-premium': 129,
  'ex-memory-ultimate': 269,
  // Skeleton Anatomy
  'skeleton-student': 129,
  'skeleton-professional': 349,
  'skeleton-institution': 1399,
  // UI Design System
  'uidesign-solo': 59,
  'uidesign-team': 199,
  'uidesign-enterprise': 689,
  // Statux
  'statux-pro': 59,
  // XIsland
  'xisland-pro': 79,
  // Tollow
  'tollow-pro': 99,
  // XNook
  'xnook-pro': 59,
  // Chakra Visualizer
  'chakra-premium': 35,
};

// 获取人民币价格
export function getPriceCNY(productId: string): number {
  return PRICE_CNY_MAP[productId] || 0;
}

// 生成产品 ID
export function generateProductId(productName: string, planName: string): string {
  const mapping: Record<string, Record<string, string>> = {
    'omnicrawl': {
      'starter': 'omnicrawl-starter',
      'pro': 'omnicrawl-pro',
      'enterprise': 'omnicrawl-enterprise',
    },
    'ex-memory': {
      'basic': 'ex-memory-basic',
      'premium': 'ex-memory-premium',
      'ultimate': 'ex-memory-ultimate',
    },
    'skeleton-anatomy': {
      'student': 'skeleton-student',
      'professional': 'skeleton-professional',
      'institution': 'skeleton-institution',
    },
    'ui-design-system': {
      'solo': 'uidesign-solo',
      'team': 'uidesign-team',
      'enterprise': 'uidesign-enterprise',
    },
    'statux': {
      'pro': 'statux-pro',
    },
    'xisland': {
      'pro': 'xisland-pro',
    },
    'tollow': {
      'pro': 'tollow-pro',
    },
    'xnook': {
      'pro': 'xnook-pro',
    },
    'chakra-visualizer': {
      'premium': 'chakra-premium',
    },
  };

  return mapping[productName]?.[planName.toLowerCase()] || '';
}

// 检查是否配置了支付
export function isPaymentConfigured(): boolean {
  return !!(
    PAYMENT_CONFIG.alipay.appId ||
    PAYMENT_CONFIG.wechat.appId
  );
}
