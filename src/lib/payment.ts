// 支付配置
export const PAYMENT_CONFIG = {
  // 国际支付 - Lemon Squeezy
  lemonsqueezy: {
    apiKey: process.env.LEMON_SQUEEZY_API_KEY || '',
    storeId: process.env.LEMON_SQUEEZY_STORE_ID || '',
    variants: {
      'omnicrawl-starter': process.env.LEMON_SQUEEZY_OMNICRAWL_STARTER || '',
      'omnicrawl-pro': process.env.LEMON_SQUEEZY_OMNICRAWL_PRO || '',
      'omnicrawl-enterprise': process.env.LEMON_SQUEEZY_OMNICRAWL_ENTERPRISE || '',
      'ex-memory-basic': process.env.LEMON_SQUEEZY_EXMEMORY_BASIC || '',
      'ex-memory-premium': process.env.LEMON_SQUEEZY_EXMEMORY_PREMIUM || '',
      'ex-memory-ultimate': process.env.LEMON_SQUEEZY_EXMEMORY_ULTIMATE || '',
      'skeleton-student': process.env.LEMON_SQUEEZY_SKELETON_STUDENT || '',
      'skeleton-professional': process.env.LEMON_SQUEEZY_SKELETON_PROFESSIONAL || '',
      'skeleton-institution': process.env.LEMON_SQUEEZY_SKELETON_INSTITUTION || '',
      'uidesign-solo': process.env.LEMON_SQUEEZY_UIDESIGN_SOLO || '',
      'uidesign-team': process.env.LEMON_SQUEEZY_UIDESIGN_TEAM || '',
      'uidesign-enterprise': process.env.LEMON_SQUEEZY_UIDESIGN_ENTERPRISE || '',
      'statux-pro': process.env.LEMON_SQUEEZY_STATUX_PRO || '',
      'xisland-pro': process.env.LEMON_SQUEEZY_XISLAND_PRO || '',
      'tollow-pro': process.env.LEMON_SQUEEZY_TOLLOW_PRO || '',
      'xnook-pro': process.env.LEMON_SQUEEZY_XNOOK_PRO || '',
      'chakra-premium': process.env.LEMON_SQUEEZY_CHAKRA_PREMIUM || '',
    },
  },

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
export type PaymentMethod = 'lemonsqueezy' | 'alipay' | 'wechat';

// 获取产品 ID 映射
export function getProductIdMapping(productName: string, planName: string): string {
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

// 生成 Lemon Squeezy 结账链接
export function getLemonSqueezyCheckoutUrl(productId: string): string {
  const variantId = PAYMENT_CONFIG.lemonsqueezy.variants[productId as keyof typeof PAYMENT_CONFIG.lemonsqueezy.variants];
  if (!variantId) {
    console.error(`No variant ID found for product: ${productId}`);
    return '#';
  }
  return `https://store.lemonsqueezy.com/checkout/buy/${variantId}`;
}

// 检查是否配置了支付
export function isPaymentConfigured(): boolean {
  return !!(
    PAYMENT_CONFIG.lemonsqueezy.apiKey ||
    PAYMENT_CONFIG.alipay.appId ||
    PAYMENT_CONFIG.wechat.appId
  );
}
