/** 价格讨论本身很常见；付款指令和交易线索同时出现时转交编辑复核。
 * 正则也用于 PostgreSQL 的历史记录筛查，保持两端语法一致。
 */
export const paymentInstruction = /buy[ (]+(live|now|here|our |this |for |at )|buy:|purchase (here|now|via|at|our |this |for )|subscribe (here|now|at|for )|pay (here|via|with|[0-9$€£¥])|\/buy([/?#` )]|$)|立即购买|购买[（(：:]|购买会员|支付[ ]*[$€£¥0-9]|付款[ ]*[0-9]|付款链接/i;
export const paymentDestination = /[0-9][0-9., ]*(usdc|usdt|usd|eur|cny|元)|[$€£¥][ ]*[0-9]|paypal\.me\/|buy\.stripe\.com\/|checkout\.stripe\.com\/|x402/i;

// 旧记录的人工资格审核无法证明复核过付款指引。前缀表示按当前付款规则处理的内容版本。
export const PAYMENT_REVIEW_PREFIX = 'payment-v1:';

export function requestsPayment(text: string): boolean {
  return paymentInstruction.test(text) && paymentDestination.test(text);
}
