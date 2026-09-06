import { buildPath } from './build-path';
import type { PathfinderCatalogItem } from './catalog-types';
import type { PathfinderGeneratedPlanView } from './plan-view';
import type { PathfinderProfile } from './schema';

/**
 * 发现页首屏的示例路径。
 *
 * **为什么要有**：站点的承诺是「把分散的信息，变成下一步行动」，但「制定我的路径」
 * 要先填基础、设备、时间与预算才有结果——访客在掏出这些信息之前，完全不知道
 * 产出长什么样。这是首屏最大的转化断点：价值全藏在表单后面。
 *
 * **用真实目录生成，不写死示例**。`buildPath` 是纯函数、实测 0.2ms，所以每次
 * 渲染现算即可。好处是它永远和目录同步：目录里没有合适条目时它会失败，
 * 那时首屏就不该吹嘘「能生成路径」——见 `buildSamplePlan` 返回 null 的处理。
 * 写死一份漂亮的示例则会在目录变空时继续骗人。
 */

/**
 * 示例用的档案。
 *
 * 挑选依据是「让示例对最多的人成立」，不是挑能生成最好看路径的参数：
 *
 * - `foundation: 'beginner'` + `stage: 'sophomore'`：站点的目标读者
 * - `budgetCny: 0`：这是公益站点，示例必须证明**不花钱也走得通**。
 *   设成非零会让路径里混进要交钱的机会，等于用付费条目招徕免费用户
 * - `weeklyHours: 4`：一周四小时是有课业的人挤得出来的量
 * - `device: 'phone-and-pc'` + `network: 'normal'`：不预设人手里有好设备
 * - `durationWeeks: 6`：4–8 周区间的中位数
 */
export const SAMPLE_PLAN_PROFILE: PathfinderProfile = {
  goal: '完成一个可验证的 AI 入门成果',
  goalType: 'project',
  direction: 'ai',
  stage: 'sophomore',
  foundation: 'beginner',
  weeklyHours: 4,
  durationWeeks: 6,
  device: 'phone-and-pc',
  budgetCny: 0,
  acceptForeignCurrencyCosts: false,
  network: 'normal',
  constraints: [],
};

/**
 * 生成首屏示例路径；目录里凑不出可行路径时返回 null。
 *
 * 返回 null 时首屏整块不渲染——宁可不展示，也不要在目录空了之后还摆着
 * 一条其实生成不出来的路径。
 */
export function buildSamplePlan(
  items: readonly PathfinderCatalogItem[],
  locale: 'zh' | 'en',
  now: Date,
): PathfinderGeneratedPlanView | null {
  const result = buildPath(SAMPLE_PLAN_PROFILE, items, { locale, now });
  return result.ok ? result.plan : null;
}
