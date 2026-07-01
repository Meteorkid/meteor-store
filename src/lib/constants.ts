// 全局业务常量

/** 年付折扣率（月价 × 0.8 × 12 = 年价） */
export const ANNUAL_DISCOUNT = 0.8;

/**
 * 是否显示价格/购买/支付相关内容
 * ICP 个人备案期间设为 false，备案通过后改为 true
 */
export const SHOW_PRICING = process.env.NEXT_PUBLIC_SHOW_PRICING === 'true';

/** 产品分类颜色映射 */
export const categoryColors: Record<string, string> = {
  developer: 'text-blue-400 bg-blue-400/10',
  ai: 'text-purple-400 bg-purple-400/10',
  design: 'text-pink-400 bg-pink-400/10',
  utility: 'text-emerald-400 bg-emerald-400/10',
};

/** 产品分类中文标签 */
export const categoryLabels: Record<string, string> = {
  developer: '开发者工具',
  ai: 'AI 工具',
  design: '设计工具',
  utility: '实用工具',
};
