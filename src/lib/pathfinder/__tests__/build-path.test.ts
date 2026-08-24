import { describe, expect, it } from 'vitest';

import { buildPath } from '../build-path';
import { STATIC_PATHFINDER_ITEMS } from '@/data/pathfinder/catalog-seeds';
import { PathfinderPlanSchema } from '../schema';
import { catalogItemFixture, profileFixture } from './fixtures';

const now = new Date('2026-08-24T00:00:00.000Z');

describe('buildPath', () => {
  it('生成与画像周数一致的路径，每周任务都绑定可信目录条目和证据', () => {
    const items = [
      catalogItemFixture({ id: 'project-a' }),
      catalogItemFixture({ id: 'project-b', difficulty: 'intermediate' }),
    ];
    const result = buildPath(profileFixture, items, { now, locale: 'zh' });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(PathfinderPlanSchema.safeParse(result.plan).success).toBe(true);
    expect(result.plan.weeks).toHaveLength(6);
    for (const week of result.plan.weeks) {
      expect(week.tasks).not.toHaveLength(0);
      expect(week.estimatedMinutes).toBeLessThanOrEqual(profileFixture.weeklyHours * 60);
      expect(week.tasks[0].itemId).toMatch(/^project-/);
      expect(week.tasks[0].evidence.length).toBeGreaterThan(0);
      expect(week.tasks[0].alternative.length).toBeGreaterThan(0);
    }
  });

  it('四周紧凑路径仍包含真实行动与复盘，交付落在真实行动证据中', () => {
    const result = buildPath(
      { ...profileFixture, durationWeeks: 4 },
      [catalogItemFixture()],
      { now },
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.plan.weeks.map(({ phase }) => phase)).toEqual([
      'prepare',
      'practice',
      'real-action',
      'review',
    ]);
    expect(result.plan.weeks[2].tasks[0].evidence).toMatch(/提交|贡献|申请|报名/);
  });

  it('相同画像、目录和时间得到完全相同的确定性计划', () => {
    const items = [catalogItemFixture({ id: 'b' }), catalogItemFixture({ id: 'a' })];
    expect(buildPath(profileFixture, items, { now }))
      .toEqual(buildPath(profileFixture, [...items].reverse(), { now }));
  });

  it('从机会条目进入规划时，把指定机会放到合适的真实行动阶段', () => {
    const preferred = catalogItemFixture({ id: 'preferred-competition', itemType: 'competition' });
    const fallback = catalogItemFixture({ id: 'fallback-project' });
    const result = buildPath(profileFixture, [fallback, preferred], {
      now,
      preferredItemId: preferred.id,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const preferredWeek = result.plan.weeks.find((week) => week.tasks[0].itemId === preferred.id);
    expect(preferredWeek?.phase).toBe('real-action');
  });

  it('复杂资格机会即使年级表面匹配也不直接判定可行', () => {
    const mitacs = STATIC_PATHFINDER_ITEMS.find((item) => item.id === 'static-mitacs-gri-2027');
    expect(mitacs).toBeDefined();
    const result = buildPath({
      ...profileFixture,
      goal: '申请 Mitacs 2027 科研实习',
      goalType: 'internship',
      direction: 'data',
      stage: 'senior',
      foundation: 'advanced',
    }, STATIC_PATHFINDER_ITEMS, {
      now,
      preferredItemId: mitacs?.id,
    });

    if (!result.ok) return;
    expect(result.plan.weeks.flatMap((week) => week.tasks).map((task) => task.itemId))
      .not.toContain(mitacs?.id);
    expect(result.plan.warnings.join('')).toContain('不满足当前条件');
  });

  it('项目路径围绕最高相关资源推进，复盘不会漂移到无关招聘入口', () => {
    const relevant = catalogItemFixture({ id: 'rag-project' });
    const unrelated = catalogItemFixture({ id: 'internship-portal', itemType: 'internship' });
    const result = buildPath(profileFixture, [unrelated, relevant], { now });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.plan.weeks.at(-1)?.tasks[0].itemId).toBe(relevant.id);
  });

  it('重复阶段会递进任务与证据，不生成逐字重复周', () => {
    const result = buildPath(profileFixture, [catalogItemFixture()], { now });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const practiceWeeks = result.plan.weeks.filter((week) => week.phase === 'practice');
    expect(practiceWeeks).toHaveLength(2);
    expect(practiceWeeks[0].tasks[0].action).not.toBe(practiceWeeks[1].tasks[0].action);
    expect(practiceWeeks[0].tasks[0].evidence).not.toBe(practiceWeeks[1].tasks[0].evidence);
  });

  it('竞赛截止过近时不破坏准备依赖，也不把过期机会排进后续周', () => {
    const profile = { ...profileFixture, goalType: 'competition' as const };
    const competition = catalogItemFixture({
      id: 'competition-soon',
      itemType: 'competition',
      deadlineAt: '2026-08-28T00:00:00.000Z',
      deadlineText: { zh: '2026-08-28', en: '2026-08-28' },
    });
    const preparation = catalogItemFixture({ id: 'preparation-project' });
    const result = buildPath(profile, [competition, preparation], { now });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.plan.weeks[0].phase).toBe('prepare');
    expect(result.plan.warnings.join('')).toContain('不承诺');
    expect(result.plan.weeks.flatMap((week) => week.tasks).every((task) => task.itemId !== competition.id)).toBe(true);
  });

  it('截止时间允许时按准备→真实行动顺序前置，截止后切回能力项目', () => {
    const profile = { ...profileFixture, goalType: 'competition' as const };
    const competition = catalogItemFixture({
      id: 'competition-in-three-weeks',
      itemType: 'competition',
      deadlineAt: '2026-09-12T00:00:00.000Z',
    });
    const preparation = catalogItemFixture({ id: 'preparation-project' });
    const result = buildPath(profile, [competition, preparation], { now });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.plan.weeks.slice(0, 2).map((week) => week.phase)).toEqual(['prepare', 'real-action']);
    expect(result.plan.weeks[1].tasks[0].itemId).toBe(competition.id);
    expect(result.plan.weeks.slice(3).flatMap((week) => week.tasks).every((task) => task.itemId !== competition.id)).toBe(true);
  });

  it('日期级截止同样会前置真实行动且不伪造绝对时刻', () => {
    const profile = { ...profileFixture, goalType: 'competition' as const };
    const competition = catalogItemFixture({
      id: 'date-only-competition',
      itemType: 'competition',
      deadlineAt: null,
      deadlineDate: '2026-09-12',
    });
    const result = buildPath(profile, [competition, catalogItemFixture({ id: 'preparation' })], { now });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.plan.weeks.slice(0, 2).map((week) => week.phase)).toEqual(['prepare', 'real-action']);
    expect(result.plan.weeks[1].tasks[0]).toMatchObject({
      itemId: competition.id,
      deadlineDate: '2026-09-12',
    });
    expect(result.plan.weeks[1].tasks[0].deadlineAt).toBeUndefined();
  });

  it('没有合格目录条目时明确失败，不编造任务', () => {
    const result = buildPath(profileFixture, [
      catalogItemFixture({ status: 'expired' }),
      catalogItemFixture({ itemType: 'ai-update' }),
    ], { now });

    expect(result).toEqual(expect.objectContaining({ ok: false, code: 'NO_ELIGIBLE_ITEMS' }));
  });

  it('真实静态目录无法承接零基础 AI 时明确失败，不虚构 Python 前置任务', () => {
    const result = buildPath({
      ...profileFixture,
      goal: '完全没有基础，想从零学习 AI 和 Python',
      goalType: 'foundation',
      foundation: 'none',
      constraints: ['weak-foundation'],
    }, STATIC_PATHFINDER_ITEMS, { now, locale: 'zh' });

    expect(result).toEqual(expect.objectContaining({
      ok: false,
      code: 'NO_ELIGIBLE_ITEMS',
      message: expect.stringMatching(/零基础|前置/),
    }));
  });

  it('低流量条件暂无资源时给出可行动的校园网或 Wi-Fi 重试建议', () => {
    const result = buildPath(
      { ...profileFixture, network: 'limited-data' },
      [catalogItemFixture({ network: 'normal' })],
      { now },
    );

    expect(result).toEqual(expect.objectContaining({
      ok: false,
      message: expect.stringMatching(/校园网|Wi-Fi/),
    }));
  });

  it('手机只能浏览机会入口时不虚构多周编码实践，并提示借用机房或电脑', () => {
    const result = buildPath(
      {
        ...profileFixture,
        goalType: 'competition',
        device: 'phone-only',
      },
      [catalogItemFixture({
        id: 'mobile-registration-only',
        itemType: 'competition',
        device: 'either',
      })],
      { now },
    );

    expect(result).toEqual(expect.objectContaining({
      ok: false,
      code: 'NO_ELIGIBLE_ITEMS',
      message: expect.stringMatching(/机房|电脑/),
    }));
  });
});
