import { describe, expect, it } from 'vitest';
import { learnPrimaryForPath, learnSecondaryActive, learnSecondaryFor } from '../learn-nav';

describe('学习与机会栏目归位', () => {
  it.each([
    ['/pathfinder', 'discover'],
    ['/pathfinder/opportunities', 'discover'],
    ['/pathfinder/items/item-1', 'discover'],
    ['/pathfinder/topics', 'discover'],
    ['/pathfinder/organizations/example', 'discover'],
    ['/pathfinder/weekly', 'discover'],
    ['/study', 'workbench'],
    ['/study/courses', 'workbench'],
    ['/study/ielts', 'workbench'],
    ['/study/ielts/listening', 'listening'],
    ['/study/ielts/listening/part-1', 'listening'],
    ['/pathfinder/directions/backend', 'directions'],
    ['/pathfinder/plan', 'plan'],
    ['/pathfinder/saved', 'saved'],
    ['/masters', 'applications'],
    ['/phd', 'applications'],
    ['/zh/products', null],
  ] as const)('%s → %s', (pathname, expected) => {
    expect(learnPrimaryForPath(pathname)).toBe(expected);
  });

  it('发现下的二级分类只保留聚合信息的三项', () => {
    expect(learnSecondaryFor('discover').map(item => item.key)).toEqual(['opportunities', 'topics', 'weekly']);
  });

  it('工作台下不再重复雅思听力，写作归工作台', () => {
    expect(learnSecondaryFor('workbench').map(item => item.key)).toEqual(['courses', 'algorithms', 'writing', 'vocabulary']);
    expect(learnSecondaryActive('/study/ielts/listening/part-1', 'writing')).toBe(false);
    expect(learnSecondaryActive('/study/ielts', 'writing')).toBe(true);
  });

  it('详情页归属对应二级栏目', () => {
    expect(learnSecondaryActive('/pathfinder/items/item-1', 'opportunities')).toBe(true);
    expect(learnSecondaryActive('/pathfinder/organizations/acme', 'topics')).toBe(true);
    expect(learnSecondaryActive('/masters?year=2027', 'masters')).toBe(false);
  });

  it('申请日历有硕士与博士两级入口', () => {
    expect(learnSecondaryFor('applications').map(item => item.key)).toEqual(['masters', 'phd']);
  });
});
