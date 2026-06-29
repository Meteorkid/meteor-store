// 全局业务常量

/** 年付折扣率（月价 × 0.8 × 12 = 年价） */
export const ANNUAL_DISCOUNT = 0.8;

/**
 * 是否显示价格/购买/支付相关内容
 * ICP 个人备案期间设为 false，备案通过后改为 true
 */
export const SHOW_PRICING = process.env.NEXT_PUBLIC_SHOW_PRICING === 'true';
