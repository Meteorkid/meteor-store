import { describe, expect, it } from 'vitest';
import { STATIC_PATHFINDER_ITEMS } from '@/data/pathfinder/catalog-seeds';

import { catalogItemViolations, isCatalogItemFeasible } from '../contract';
import { catalogItemFixture, profileFixture } from './fixtures';

const now = new Date('2026-08-24T00:00:00.000Z');

describe('Pathfinder 现实约束', () => {
  it('剔除未发布、不可学习与 AI 动态', () => {
    expect(catalogItemViolations(catalogItemFixture({ status: 'pending' }), profileFixture, now))
      .toContainEqual(expect.objectContaining({ rule: 'publication' }));
    expect(catalogItemViolations(catalogItemFixture({ learningEligible: false }), profileFixture, now))
      .toContainEqual(expect.objectContaining({ rule: 'learning-eligibility' }));
    expect(catalogItemViolations(catalogItemFixture({ itemType: 'ai-update' }), profileFixture, now))
      .toContainEqual(expect.objectContaining({ rule: 'content-type' }));
  });

  it('剔除过期、设备、网络与预算不符条目', () => {
    const item = catalogItemFixture({
      deadlineAt: '2026-08-23T00:00:00.000Z',
      device: 'computer',
      network: 'high',
      costCny: 30,
    });
    const profile = {
      ...profileFixture,
      device: 'phone-only' as const,
      network: 'limited-data' as const,
      budgetCny: 0,
    };
    const rules = catalogItemViolations(item, profile, now).map(({ rule }) => rule);

    expect(rules).toEqual(expect.arrayContaining(['deadline', 'device', 'network', 'budget']));
  });

  it('只按明确阶段标签判断资格，不把未知费用猜成超预算', () => {
    const item = catalogItemFixture({
      costCny: null,
      tags: { topic: [], skill: [], career: ['postgraduate'], format: [] },
    });
    const violations = catalogItemViolations(item, profileFixture, now);

    expect(violations).toContainEqual(expect.objectContaining({ rule: 'stage' }));
    expect(violations).not.toContainEqual(expect.objectContaining({ rule: 'budget' }));
  });

  it('已知非零外币费用需要用户显式接受，不能用任意人民币预算静默放行', () => {
    const item = catalogItemFixture({
      costCny: null,
      cost: { amount: 5000, currency: 'JPY', label: null },
    });
    const unaccepted = { ...profileFixture, budgetCny: 1 };

    expect(catalogItemViolations(item, unaccepted, now))
      .toContainEqual(expect.objectContaining({ rule: 'budget' }));
    expect(catalogItemViolations(item, { ...unaccepted, acceptForeignCurrencyCosts: true }, now))
      .not.toContainEqual(expect.objectContaining({ rule: 'budget' }));
  });

  it('满足现实条件的条目可进入排序', () => {
    expect(isCatalogItemFeasible(catalogItemFixture(), profileFixture, now)).toBe(true);
  });

  it('具体科研实习使用受控阶段标签，低年级不会收到不符合资格的投递任务', () => {
    const byId = new Map(STATIC_PATHFINDER_ITEMS.map((item) => [item.id, item]));
    const cases = [
      { id: 'static-mitacs-gri-2027', direction: 'data' as const, allowed: ['junior', 'senior'] as const },
      { id: 'static-oist-spring-2027', direction: 'ai' as const, allowed: ['junior', 'senior', 'postgraduate'] as const },
      { id: 'static-max-planck-cs-internship-2027', direction: 'backend' as const, allowed: ['junior', 'senior', 'postgraduate'] as const },
    ];

    for (const current of cases) {
      const item = byId.get(current.id)!;
      const freshman = {
        ...profileFixture,
        direction: current.direction,
        stage: 'freshman' as const,
        budgetCny: 1_000,
      };
      expect(catalogItemViolations(item, freshman, now))
        .toContainEqual(expect.objectContaining({ rule: 'stage' }));
      for (const allowedStage of current.allowed) {
        expect(catalogItemViolations(item, { ...freshman, stage: allowedStage }, now))
          .not.toContainEqual(expect.objectContaining({ rule: 'stage' }));
      }
    }
  });
});
