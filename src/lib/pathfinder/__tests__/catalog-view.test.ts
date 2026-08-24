import { describe, expect, it } from 'vitest';
import {
  catalogStats,
  filterCatalogItems,
  getDeadlineState,
  parseCatalogFilters,
  selectPathfinderHomeFeed,
  sortByDeadline,
} from '../catalog-view';
import { catalogItemFixture } from './fixtures';

const NOW = new Date('2026-08-24T00:00:00.000Z');

describe('Pathfinder catalog view helpers', () => {
  it('规范化 URL 筛选参数并忽略未知枚举值', () => {
    const filters = parseCatalogFilters({
      q: `  ${'a'.repeat(120)}  `,
      type: 'competition',
      direction: 'unknown',
      difficulty: ['beginner', 'advanced'],
      remote: 'remote',
      deadline: 'soon',
    });

    expect(filters).toEqual({
      q: 'a'.repeat(100),
      type: 'competition',
      direction: undefined,
      difficulty: 'beginner',
      remoteStatus: 'remote',
      deadline: undefined,
    });
  });

  it('同时应用关键词、方向、参与形式与截止时间筛选', () => {
    const matching = catalogItemFixture({
      id: 'matching',
      direction: 'data',
      remoteStatus: 'hybrid',
      deadlineAt: '2026-09-10T00:00:00.000Z',
      tags: { topic: ['analytics'], skill: ['SQL'], career: [], format: [] },
    });
    const wrongDirection = catalogItemFixture({ id: 'wrong-direction', direction: 'ai' });
    const expired = catalogItemFixture({
      id: 'expired',
      direction: 'data',
      remoteStatus: 'hybrid',
      deadlineAt: '2026-08-01T00:00:00.000Z',
      tags: { topic: [], skill: ['SQL'], career: [], format: [] },
    });

    expect(filterCatalogItems(
      [matching, wrongDirection, expired],
      { q: 'sql', direction: 'data', remoteStatus: 'hybrid', deadline: '30d' },
      NOW,
    )).toEqual([matching]);
  });

  it('截止状态与排序只保留仍可报名的条目', () => {
    const urgent = catalogItemFixture({ id: 'urgent', deadlineAt: '2026-08-27T00:00:00.000Z' });
    const later = catalogItemFixture({ id: 'later', deadlineAt: '2026-10-01T00:00:00.000Z' });
    const expired = catalogItemFixture({ id: 'expired', deadlineAt: '2026-08-20T00:00:00.000Z' });

    expect(getDeadlineState(urgent, NOW)).toEqual({ state: 'urgent', daysLeft: 3 });
    expect(getDeadlineState(catalogItemFixture(), NOW)).toEqual({ state: 'unknown', daysLeft: null });
    expect(sortByDeadline([later, expired, urgent], NOW).map((item) => item.id))
      .toEqual(['urgent', 'later']);
  });

  it('只有官方日期、没有时区的截止日仍可筛选和排序', () => {
    const dateOnly = catalogItemFixture({
      id: 'date-only',
      deadlineAt: null,
      deadlineDate: '2026-09-10',
    });
    const unknown = catalogItemFixture({ id: 'unknown' });

    expect(filterCatalogItems([unknown, dateOnly], { q: '', deadline: '30d' }, NOW))
      .toEqual([dateOnly]);
    expect(sortByDeadline([unknown, dateOnly], NOW).map((item) => item.id))
      .toEqual(['date-only']);
    expect(filterCatalogItems(
      [dateOnly],
      { q: '', deadline: '30d' },
      new Date('2026-09-10T01:00:00.000Z'),
    )).toEqual([dateOnly]);
  });

  it('目录统计区分可学习与官方来源', () => {
    const items = [
      catalogItemFixture({ id: 'official-ai' }),
      catalogItemFixture({
        id: 'verified-data',
        direction: 'data',
        learningEligible: false,
        source: {
          ...catalogItemFixture().source,
          id: 'verified-source',
          trustLevel: 'verified',
        },
      }),
    ];

    expect(catalogStats(items)).toEqual({ total: 2, learning: 1, official: 1, directions: 2 });
  });

  it('首页为竞赛、实习、开源设置独立席位，不被高频开源条目淹没', () => {
    const noisyOpenSource = Array.from({ length: 10 }, (_, index) => catalogItemFixture({
      id: `open-source-${index}`,
      itemType: 'open-source',
      verifiedAt: `2026-08-24T${String(index).padStart(2, '0')}:00:00.000Z`,
    }));
    const items = [
      ...noisyOpenSource,
      catalogItemFixture({
        id: 'competition-soon',
        itemType: 'competition',
        deadlineDate: '2026-09-01',
        verifiedAt: '2026-08-01T00:00:00.000Z',
      }),
      catalogItemFixture({
        id: 'competition-later',
        itemType: 'competition',
        deadlineDate: '2026-10-01',
      }),
      catalogItemFixture({
        id: 'competition-third',
        itemType: 'competition',
        deadlineDate: '2026-11-01',
      }),
      catalogItemFixture({
        id: 'competition-fourth',
        itemType: 'competition',
        deadlineDate: '2026-12-01',
      }),
      catalogItemFixture({
        id: 'competition-expired',
        itemType: 'competition',
        deadlineDate: '2026-08-01',
      }),
      catalogItemFixture({
        id: 'internship-soon',
        itemType: 'internship',
        deadlineDate: '2026-09-03',
        verifiedAt: '2026-08-01T00:00:00.000Z',
      }),
      catalogItemFixture({
        id: 'internship-rolling',
        itemType: 'internship',
      }),
      catalogItemFixture({
        id: 'internship-later',
        itemType: 'internship',
        deadlineDate: '2026-10-03',
      }),
      catalogItemFixture({
        id: 'internship-third',
        itemType: 'internship',
        deadlineDate: '2026-11-03',
      }),
      catalogItemFixture({ id: 'ai-update', itemType: 'ai-update', learningEligible: false }),
    ];

    const feed = selectPathfinderHomeFeed(items, NOW);

    expect(feed.featured.map((item) => item.itemType)).toEqual([
      'competition',
      'internship',
      'open-source',
    ]);
    expect(feed.featured.map((item) => item.id)).toContain('competition-soon');
    expect(feed.featured.map((item) => item.id)).toContain('internship-soon');
    expect(feed.opportunities.map((item) => item.itemType)).toEqual([
      'competition',
      'internship',
      'competition',
      'internship',
      'competition',
      'internship',
    ]);
    expect(feed.opportunities.map((item) => item.id)).not.toContain('competition-expired');
    expect(feed.openSource).toHaveLength(4);
    expect(feed.updates.map((item) => item.id)).toEqual(['ai-update']);
  });
});
