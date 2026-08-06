import type { LocalizedText } from './blog-sections';

/**
 * Meteor Pass —— 全站会员：一次订阅解锁站内全部产品。
 *
 * Pass 走的是和单品购买**同一条**支付/交付链路（orders → license_keys → 邮件），
 * 只是 productId 固定为 PASS_PRODUCT_ID。它**不在** `src/data/products.ts` 的
 * products 数组里，因此不会出现在产品列表页、产品详情页、sitemap 和 /apps/{id}——
 * 那些地方消费的是 `findProduct`，只认真实产品。需要「订单里可能出现的东西」
 * （支付校验、订单页、确认邮件）时用 `findPurchasable`。
 *
 * 改价只动这个文件：价格、时长、权益文案都在这里，前端与支付接口都从这里取。
 *
 * **权益文案不要写得比实际交付更满**：站内只有一部分产品能在浏览器直接打开，
 * 其余是发放授权码。曾经写成「解锁全部站内应用 / 浏览器里直接用，无需下载」，
 * 而 12 款产品里只有 4 款真的能在浏览器打开——定价页是支付宝商户签约审核
 * 会逐页核对的地方，写不实等于给自己挖坑。
 */
export const PASS_PRODUCT_ID = 'meteor-pass';

export const PASS_NAME: LocalizedText = { zh: 'Meteor Pass', en: 'Meteor Pass' };

export type PassPlanId = 'monthly' | 'annual' | 'lifetime';

export interface PassPlan {
  id: PassPlanId;
  name: LocalizedText;
  /** 实际售价（折扣价），支付接口按这个收钱 */
  price: number;
  /** 划线原价：促销期间展示，仅在定价卡上划线，不参与支付 */
  originalPrice?: number;
  /** 逻辑字段（'月'/'年'/'买断'），与 products.pricing.period 同一套取值，不双语化 */
  period: string;
  /** 授权有效月数；null 表示永久有效 */
  durationMonths: number | null;
  features: LocalizedText[];
  popular?: boolean;
}

export const passPlans: PassPlan[] = [
  {
    id: 'monthly',
    name: { zh: '月付', en: 'Monthly' },
    price: 9,
    originalPrice: 39,
    period: '月',
    durationMonths: 1,
    features: [
      { zh: '解锁站内全部产品的使用授权', en: 'Every product in the store, licensed to you' },
      { zh: 'Web 应用在浏览器直接打开，其余发放授权码', en: 'Web apps open in the browser; the rest ship as license keys' },
      { zh: '新上架的产品自动包含', en: 'New products included automatically' },
      { zh: '邮件支持', en: 'Email support' },
    ],
  },
  {
    id: 'annual',
    name: { zh: '年付', en: 'Annual' },
    price: 19,
    originalPrice: 99,
    period: '年',
    durationMonths: 12,
    popular: true,
    features: [
      { zh: '月付的全部权益', en: 'Everything in Monthly' },
      { zh: '平均每月 ¥1.6，比月付省 82%', en: '¥1.6/month on average — 82% less than monthly' },
      { zh: '优先邮件支持', en: 'Priority email support' },
      { zh: '一次付清，全年不再扣费', en: 'One payment, covers the whole year' },
    ],
  },
  {
    id: 'lifetime',
    name: { zh: '买断', en: 'Lifetime' },
    price: 99,
    originalPrice: 199,
    period: '买断',
    durationMonths: null,
    features: [
      { zh: '年付的全部权益', en: 'Everything in Annual' },
      { zh: '永久有效，不再续费', en: 'Yours forever, no renewals' },
      { zh: '将来新增的产品同样包含', en: 'Future products included too' },
      { zh: '直接联系店主', en: 'A direct line to the maker' },
    ],
  },
];

/** 兜底档位：档位查不到时按最短的算，绝不按「永久」算 */
const FALLBACK_PLAN: PassPlan = passPlans.reduce((shortest, plan) => {
  if (plan.durationMonths === null) return shortest;
  if (shortest.durationMonths === null) return plan;
  return plan.durationMonths < shortest.durationMonths ? plan : shortest;
});

/**
 * 按 plan id 或任一语言的方案名查找，大小写不敏感。
 *
 * 兼容名字是因为下单链路里 planName 存的是给人看的方案名（'年付'），
 * 而 orders.billing_period 存的是 plan id（'annual'）——两个都要能查回来。
 */
export function findPassPlan(key: string | null | undefined): PassPlan | undefined {
  if (!key) return undefined;
  const needle = key.trim().toLowerCase();
  return passPlans.find(
    (plan) =>
      plan.id === needle ||
      plan.name.zh.toLowerCase() === needle ||
      plan.name.en.toLowerCase() === needle,
  );
}

/**
 * 在 UTC 下加若干个月，并把日期钳到目标月的最后一天。
 * 不钳的话 1/31 + 1 个月会溢出成 3/2 或 3/3，等于白送两三天。
 */
function addMonthsUtc(from: Date, months: number): Date {
  const year = from.getUTCFullYear();
  const month = from.getUTCMonth() + months;
  // 目标月的天数：下个月的第 0 天 = 目标月最后一天
  const daysInTarget = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return new Date(Date.UTC(
    year,
    month,
    Math.min(from.getUTCDate(), daysInTarget),
    from.getUTCHours(),
    from.getUTCMinutes(),
    from.getUTCSeconds(),
    from.getUTCMilliseconds(),
  ));
}

/**
 * 一条 Pass 授权覆盖到什么时候。
 *
 * 三种结果是**分开的**，不要再合并成「string | null」：
 * null 曾同时表示「永久有效」和「算不出来」，于是任何一条 billing_period 脏数据
 * （手工补单、导入脚本、将来改档位 id）都会静默兑换成永久免费的全站会员。
 * 现在档位查不到按最短档兜底并告警，起算时间缺失/非法直接判为 unknown（不放行）。
 */
export type PassCoverage =
  | { kind: 'lifetime' }
  | { kind: 'until'; expiresAt: string }
  | { kind: 'unknown' };

export function getPassCoverage(
  planKey: string | null | undefined,
  grantedAt: string | null,
): PassCoverage {
  const plan = findPassPlan(planKey);
  if (!plan) {
    console.warn(
      `[pass] 未知的 Pass 档位 ${JSON.stringify(planKey)}，按最短档 ${FALLBACK_PLAN.id} 兜底`,
    );
  }
  const effective = plan ?? FALLBACK_PLAN;

  if (effective.durationMonths === null) return { kind: 'lifetime' };

  if (!grantedAt) return { kind: 'unknown' };
  const start = new Date(grantedAt);
  if (Number.isNaN(start.getTime())) return { kind: 'unknown' };

  return {
    kind: 'until',
    expiresAt: addMonthsUtc(start, effective.durationMonths).toISOString(),
  };
}

/** Pass 授权此刻是否仍然有效。算不出覆盖范围时按无效处理 */
export function isPassActive(
  planKey: string | null | undefined,
  grantedAt: string | null,
  now: Date = new Date(),
): boolean {
  const coverage = getPassCoverage(planKey, grantedAt);
  if (coverage.kind === 'lifetime') return true;
  if (coverage.kind === 'unknown') return false;
  return new Date(coverage.expiresAt).getTime() > now.getTime();
}
