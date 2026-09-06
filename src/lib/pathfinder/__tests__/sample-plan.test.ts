import { describe, expect, it } from 'vitest';
import { STATIC_PATHFINDER_ITEMS } from '@/data/pathfinder/catalog-seeds';
import { buildSamplePlan, SAMPLE_PLAN_PROFILE } from '../sample-plan';
import { catalogItemFixture } from './fixtures';

const NOW = new Date('2026-09-05T00:00:00.000Z');

describe('首屏示例路径', () => {
  it('用真实目录能生成出一条完整路径', () => {
    // 首屏拿它证明「路径」这件事是真的，生成不出来就等于承诺落空
    const plan = buildSamplePlan(STATIC_PATHFINDER_ITEMS, 'zh', NOW);
    expect(plan).not.toBeNull();
    expect(plan!.weeks).toHaveLength(SAMPLE_PLAN_PROFILE.durationWeeks);
  });

  it('每周都有可展示的任务描述', () => {
    /*
     * 首屏渲染的是每周任务的 action，不是 objective——后者是
     * 「围绕「X」完成本周{阶段}产出」这样的模板，六周几乎一模一样；
     * action 才有层次（阅读 → 最小可复现练习 → 只改一个变量做对比 →
     * 提交最小贡献 → 整理成果 → 复盘）。
     */
    const plan = buildSamplePlan(STATIC_PATHFINDER_ITEMS, 'zh', NOW)!;
    const actions = plan.weeks.map((w) => w.tasks[0]?.action ?? '');
    for (const action of actions) expect(action.length).toBeGreaterThan(10);
    // 六周的任务不能是同一句话，否则首屏展示的是「重复」而不是「路径」
    expect(new Set(actions).size).toBe(actions.length);
  });

  it('示例档案不花钱', () => {
    /*
     * 这是公益站点，示例必须证明不花钱也走得通。设成非零会让路径里
     * 混进要交钱的机会，等于用付费条目招徕免费用户。
     */
    expect(SAMPLE_PLAN_PROFILE.budgetCny).toBe(0);
    expect(SAMPLE_PLAN_PROFILE.acceptForeignCurrencyCosts).toBe(false);
  });

  it('示例档案面向零基础、低设备与低时间投入', () => {
    // 挑选依据是「让示例对最多的人成立」，不是挑能生成最好看路径的参数
    expect(SAMPLE_PLAN_PROFILE.foundation).toBe('beginner');
    expect(SAMPLE_PLAN_PROFILE.weeklyHours).toBeLessThanOrEqual(4);
    expect(SAMPLE_PLAN_PROFILE.device).toBe('phone-and-pc');
  });

  it('目录里没有可用条目时返回 null，而不是编一条出来', () => {
    // 宁可整块不渲染，也不要在目录空了之后还摆着一条生成不出来的路径
    const unusable = [catalogItemFixture({ learningEligible: false })];
    expect(buildSamplePlan(unusable, 'zh', NOW)).toBeNull();
  });
});
