import { describe, expect, it } from 'vitest';
import {
  diversifyByOrganization,
  catalogActionScore,
  catalogStats,
  diversifyBySource,
  filterCatalogItems,
  getDeadlineState,
  isActionableTask,
  localizedTextState,
  paginateCatalog,
  parseCatalogFilters,
  latestDigestItem,
  selectPathfinderHomeFeed,
  sortByDeadline,
  sortCatalogItems,
} from '../catalog-view';
import { catalogItemFixture } from './fixtures';
import { PATHFINDER_SYNC_SOURCE_MAP } from '../ingestion/sources';

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
      taskOnly: false,
      sort: 'default',
      page: 1,
      compact: false,
    });
  });

  it('解析排序、分页与紧凑视图参数，非法值退回默认', () => {
    expect(parseCatalogFilters({ sort: 'action', page: '3', view: 'compact' }))
      .toMatchObject({ sort: 'action', page: 3, compact: true });
    expect(parseCatalogFilters({ sort: 'popularity', page: '0', view: 'grid' }))
      .toMatchObject({ sort: 'default', page: 1, compact: false });
    expect(parseCatalogFilters({ page: '-4' })).toMatchObject({ page: 1 });
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

describe('浏览排序', () => {
  const sourceItem = (id: string, overrides = {}) => catalogItemFixture({ id, ...overrides });

  it('最近新增按发现时间倒序', () => {
    const items = [
      sourceItem('old', { discoveredAt: '2026-08-01T00:00:00.000Z' }),
      sourceItem('new', { discoveredAt: '2026-08-23T00:00:00.000Z' }),
      sourceItem('mid', { discoveredAt: '2026-08-10T00:00:00.000Z' }),
    ];
    expect(sortCatalogItems(items, 'recent', NOW).map((item) => item.id))
      .toEqual(['new', 'mid', 'old']);
  });

  it('按截止时间排序时，无截止日的长期入口排在最后而不是被丢掉', () => {
    const items = [
      sourceItem('no-deadline'),
      sourceItem('far', { deadlineDate: '2026-12-01' }),
      sourceItem('near', { deadlineDate: '2026-08-28' }),
    ];
    const sorted = sortCatalogItems(items, 'deadline', NOW);
    expect(sorted.map((item) => item.id)).toEqual(['near', 'far', 'no-deadline']);
    expect(sorted).toHaveLength(items.length);
  });

  it('适合新手把入门难度排在前面，同难度下优先能进路径的条目', () => {
    const items = [
      sourceItem('advanced', { difficulty: 'advanced' }),
      sourceItem('beginner-manual', { difficulty: 'beginner', learningEligible: false }),
      sourceItem('beginner-ready', { difficulty: 'beginner', learningEligible: true }),
      sourceItem('intermediate', { difficulty: 'intermediate' }),
    ];
    expect(sortCatalogItems(items, 'beginner', NOW).map((item) => item.id))
      .toEqual(['beginner-ready', 'beginner-manual', 'intermediate', 'advanced']);
  });

  it('最值得行动把已过期的条目压到最后', () => {
    const expired = sourceItem('expired', { deadlineDate: '2026-01-01' });
    const open = sourceItem('open', { deadlineDate: '2026-09-10' });
    expect(sortCatalogItems([expired, open], 'action', NOW)[0]!.id).toBe('open');
    expect(catalogActionScore(expired, NOW)).toBeLessThan(catalogActionScore(open, NOW));
  });

  it('资格需人工核对的条目排在同等条件的可直接行动条目之后', () => {
    const ready = sourceItem('ready', { deadlineDate: '2026-09-10' });
    const manual = sourceItem('manual', {
      deadlineDate: '2026-09-10',
      requiresManualEligibilityCheck: true,
    });
    expect(sortCatalogItems([manual, ready], 'action', NOW).map((item) => item.id))
      .toEqual(['ready', 'manual']);
  });

  it('同分条目按 id 稳定排序，保证分页不漏条不重复', () => {
    const items = [sourceItem('b'), sourceItem('a'), sourceItem('c')];
    const first = sortCatalogItems(items, 'action', NOW).map((item) => item.id);
    const second = sortCatalogItems([...items].reverse(), 'action', NOW).map((item) => item.id);
    expect(first).toEqual(second);
  });
});

describe('来源多样性', () => {
  const fromSource = (id: string, sourceId: string) => catalogItemFixture({ id, sourceId });

  it('同一区块内限制单一来源的席位', () => {
    const items = [
      fromSource('a1', 'source-a'),
      fromSource('a2', 'source-a'),
      fromSource('a3', 'source-a'),
      fromSource('b1', 'source-b'),
    ];
    expect(diversifyBySource(items, 2, 4).map((item) => item.id))
      .toEqual(['a1', 'a2', 'b1', 'a3']);
  });

  it('可以改按仓库限席位，挡住同源同仓库的连发', () => {
    const issue = (id: string, repo: string) => catalogItemFixture({
      id,
      sourceId: 'curated-issues-data',
      organization: { zh: repo, en: repo },
    });
    const items = [
      issue('a1', 'apache/airflow'),
      issue('a2', 'apache/airflow'),
      issue('a3', 'apache/airflow'),
      issue('p1', 'pandas-dev/pandas'),
    ];
    const byRepo = diversifyBySource(items, 2, 3, (item) => item.organization.en);
    expect(byRepo.map((item) => item.id)).toEqual(['a1', 'a2', 'p1']);
  });

  it('来源不够时回填被跳过的条目，不让区块空着', () => {
    const items = ['a1', 'a2', 'a3', 'a4'].map((id) => fromSource(id, 'source-a'));
    expect(diversifyBySource(items, 2, 4)).toHaveLength(4);
  });
});

describe('分页', () => {
  const items = Array.from({ length: 30 }, (_, index) => index);

  it('按页切片并给出总页数', () => {
    expect(paginateCatalog(items, 1, 24)).toMatchObject({ page: 1, pageCount: 2, total: 30 });
    expect(paginateCatalog(items, 2, 24).items).toHaveLength(6);
  });

  it('越界页码钳回最后一页，不返回空白页', () => {
    expect(paginateCatalog(items, 99, 24)).toMatchObject({ page: 2 });
    expect(paginateCatalog(items, 99, 24).items).not.toHaveLength(0);
  });

  it('空结果仍然是第 1 页共 1 页', () => {
    expect(paginateCatalog([], 1, 24)).toMatchObject({ page: 1, pageCount: 1, total: 0 });
  });
});

describe('本地化回退标记', () => {
  it('中文档位实际是英文原文时标记为回退', () => {
    expect(localizedTextState({ zh: 'Gemini 3 launches', en: 'Gemini 3 launches' }, 'zh'))
      .toEqual({ text: 'Gemini 3 launches', fallback: true });
  });

  it('中文原文不标记', () => {
    expect(localizedTextState({ zh: '发布新模型', en: 'New model' }, 'zh').fallback).toBe(false);
  });

  it('英文界面永远不标记回退', () => {
    expect(localizedTextState({ zh: '发布新模型', en: 'New model' }, 'en'))
      .toEqual({ text: 'New model', fallback: false });
  });
});

describe('可直接上手的任务', () => {
  const issue = catalogItemFixture({
    id: 'issue',
    itemType: 'open-source',
    canonicalUrl: 'https://github.com/django/django/issues/12345',
  });
  const repo = catalogItemFixture({
    id: 'repo',
    itemType: 'open-source',
    canonicalUrl: 'https://github.com/django/django',
  });

  it('具体 issue 是任务，整仓库入口不是', () => {
    expect(isActionableTask(issue)).toBe(true);
    expect(isActionableTask(repo)).toBe(false);
  });

  it('不把 issue 列表页或其它类型误判成任务', () => {
    expect(isActionableTask(catalogItemFixture({
      itemType: 'open-source',
      canonicalUrl: 'https://github.com/django/django/issues',
    }))).toBe(false);
    expect(isActionableTask(catalogItemFixture({
      itemType: 'competition',
      canonicalUrl: 'https://example.com/issues/12',
    }))).toBe(false);
  });

  it('实习区分具体岗位和招聘门户', () => {
    const posting = catalogItemFixture({
      itemType: 'internship',
      canonicalUrl: 'https://databricks.com/company/careers/open-positions/job?gh_jid=1',
      tags: { topic: ['internship'], skill: [], career: [], format: [] },
    });
    const portal = catalogItemFixture({
      itemType: 'internship',
      canonicalUrl: 'https://talent.alibaba.com/',
      tags: { topic: ['technology-jobs'], skill: [], career: [], format: ['job-board'] },
    });

    expect(isActionableTask(posting)).toBe(true);
    expect(isActionableTask(portal)).toBe(false);
  });

  it('筛选开关只保留任务', () => {
    const filtered = filterCatalogItems([issue, repo], { q: '', taskOnly: true }, NOW);
    expect(filtered.map((item) => item.id)).toEqual(['issue']);
  });

  it('不开开关时两种粒度都保留', () => {
    expect(filterCatalogItems([issue, repo], { q: '' }, NOW)).toHaveLength(2);
  });
});

describe('按机构轮转', () => {
  const item = (id: string, org: string) => catalogItemFixture({
    id, organization: { zh: org, en: org },
  });

  it('不让单一来源连着占满前几位', () => {
    // 实测：OpenAI 40 条 + Google DeepMind 31 条占全部条目四成，
    // 任何排序下前两屏都是同一家
    const items = [
      item('o1', 'OpenAI'), item('o2', 'OpenAI'), item('o3', 'OpenAI'),
      item('d1', 'DeepMind'), item('d2', 'DeepMind'),
      item('h1', 'Hugging Face'),
    ];
    expect(diversifyByOrganization(items).map((i) => i.id))
      .toEqual(['o1', 'd1', 'h1', 'o2', 'd2', 'o3']);
  });

  it('是轮转不是截断：条目一条不少', () => {
    // 截断会让「某家的第 3 条以后永远看不到」，而分页与计数按完整列表算，两者会对不上
    const items = Array.from({ length: 20 }, (_, i) => item(`x${i}`, i < 15 ? 'OpenAI' : 'Other'));
    const result = diversifyByOrganization(items);

    expect(result).toHaveLength(20);
    expect(new Set(result.map((i) => i.id))).toEqual(new Set(items.map((i) => i.id)));
  });

  it('组内顺序不变，排第一的仍排第一', () => {
    const items = [item('a', 'X'), item('b', 'X'), item('c', 'Y')];
    const result = diversifyByOrganization(items).map((i) => i.id);

    expect(result[0]).toBe('a');
    expect(result.indexOf('a')).toBeLessThan(result.indexOf('b'));
  });

  it('只有一个机构或条目太少时原样返回', () => {
    const single = [item('a', 'X'), item('b', 'X'), item('c', 'X')];
    expect(diversifyByOrganization(single).map((i) => i.id)).toEqual(['a', 'b', 'c']);
    expect(diversifyByOrganization([item('a', 'X')]).map((i) => i.id)).toEqual(['a']);
  });
});

describe('资讯摘要不进机会库', () => {
  /*
   * 机会库的每张卡片都在回答「什么时候截止、我够不够资格、要花多少钱」，
   * 而日更的资讯摘要三个问题一个都答不上（CatalogItemCard 为 ai-update
   * 专门关掉了截止时间与资格两块，卡片模型本身就说明它不属于这个列表）。
   * 它仍然出现在发现页的 AI 动态区与本周——那两处本来就是按时间排的资讯位。
   */
  it('资讯摘要来源被机会库过滤掉', () => {
    const digest = catalogItemFixture({ id: 'digest', sourceId: 'agihunt-daily', itemType: 'ai-update' });
    const normal = catalogItemFixture({ id: 'normal', sourceId: 'openai-news', itemType: 'ai-update' });
    const kept = filterCatalogItems([digest, normal], parseCatalogFilters({}), NOW);
    expect(kept.map((i) => i.id)).toEqual(['normal']);
  });

  it('日报来源确实开着这个开关', () => {
    // 开关写在来源配置里；这里钉住接线，避免改来源时静默失效
    expect(PATHFINDER_SYNC_SOURCE_MAP.get('agihunt-daily')?.digest).toBe(true);
  });

  it('资讯摘要不进发现页的 AI 动态主区', () => {
    // 主区留给「一件事」（OpenAI 单条发布），摘要是「一堆事的综述」，由侧栏承载
    const digest = catalogItemFixture({ id: 'digest', sourceId: 'agihunt-daily', itemType: 'ai-update' });
    const normal = catalogItemFixture({ id: 'normal', sourceId: 'openai-news', itemType: 'ai-update' });
    const feed = selectPathfinderHomeFeed([digest, normal], NOW);
    expect(feed.updates.map((i) => i.id)).toEqual(['normal']);
  });

  it('侧栏按发布时间取最新一期，不受 verifiedAt 影响', () => {
    /*
     * 每轮同步会把所有条目的 verifiedAt 刷成同一个值——线上实测三期日报的
     * verifiedAt 一模一样。用 sortByRecency（按 verifiedAt）排的话分不出先后，
     * 取到的是数组里恰好靠前的那条，实测是昨天那期。所以这里刻意让两条的
     * verifiedAt 相同、且把旧的一期放在数组前面，钉住必须按 publishedAt 取。
     */
    const sameVerified = '2026-09-05T06:27:04.464Z';
    const older = catalogItemFixture({ id: 'old', sourceId: 'agihunt-daily', itemType: 'ai-update', verifiedAt: sameVerified, publishedAt: '2026-09-01T00:00:00.000Z' });
    const newer = catalogItemFixture({ id: 'new', sourceId: 'agihunt-daily', itemType: 'ai-update', verifiedAt: sameVerified, publishedAt: '2026-09-04T00:00:00.000Z' });
    const normal = catalogItemFixture({ id: 'normal', sourceId: 'openai-news', itemType: 'ai-update' });
    expect(latestDigestItem([older, newer, normal])?.id).toBe('new');
    // 没有摘要来源时侧栏整块不渲染，靠这里返回 null
    expect(latestDigestItem([normal])).toBeNull();
  });

  it('这个开关是少数派，不是默认行为', () => {
    const all = [...PATHFINDER_SYNC_SOURCE_MAP.values()];
    const excluded = all.filter((s) => s.digest);
    expect(excluded.length).toBeGreaterThan(0);
    expect(excluded.length).toBeLessThan(all.length / 2);
  });
});
