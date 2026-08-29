import { describe, expect, it } from 'vitest';
import {
  buildPathfinderWeekly,
  collectDirectory,
  directorySlug,
  filterByDirectory,
} from '../directory';
import { normalizeFollowValue } from '../saves';
import { catalogItemFixture } from './fixtures';

const NOW = new Date('2026-08-24T00:00:00.000Z');

const org = (id: string, zh: string, en: string, overrides = {}) => catalogItemFixture({
  id,
  organization: { zh, en },
  ...overrides,
});

describe('主题与机构入口', () => {
  it('入口 slug 与关注值用同一套归一化规则', () => {
    // 两者不一致的话，关注按钮写进去的键和页面地址里的键对不上，页面永远显示未关注
    for (const value of ['  OpenAI ', 'Google  DeepMind', '阿里巴巴']) {
      expect(directorySlug(value)).toBe(normalizeFollowValue(value));
    }
  });

  it('按机构汇总并取出现最多的写法作为展示名', () => {
    const entries = collectDirectory([
      org('a', 'OpenAI', 'OpenAI'),
      org('b', 'OpenAI', 'OpenAI'),
      org('c', 'openai', 'openai'),
    ], 'organization');

    expect(entries).toEqual([{ slug: 'openai', label: 'OpenAI', count: 3 }]);
  });

  it('只出现一次的长尾不生成入口', () => {
    const entries = collectDirectory([
      org('a', 'OpenAI', 'OpenAI'),
      org('b', '独家机构', 'Solo Org'),
      org('c', 'OpenAI', 'OpenAI'),
    ], 'organization');

    expect(entries.map((entry) => entry.slug)).toEqual(['openai']);
  });

  it('按主题标签汇总，未发布的条目不计入', () => {
    const entries = collectDirectory([
      catalogItemFixture({ id: 'a', tags: { topic: ['agent', 'rag'], skill: [], career: [], format: [] } }),
      catalogItemFixture({ id: 'b', tags: { topic: ['Agent'], skill: [], career: [], format: [] } }),
      catalogItemFixture({ id: 'c', status: 'pending', tags: { topic: ['agent'], skill: [], career: [], format: [] } }),
    ], 'topic');

    expect(entries).toEqual([{ slug: 'agent', label: 'agent', count: 2 }]);
  });

  it('机构名不会以主题身份出现在主题页里', () => {
    // RSS 摄取把来源机构写进了标签，机构已经有自己的入口，主题页不该重复收录
    const entries = collectDirectory([
      catalogItemFixture({
        id: 'a',
        organization: { zh: 'Google DeepMind', en: 'Google DeepMind' },
        tags: { topic: ['Google DeepMind', 'ai-research'], skill: [], career: [], format: [] },
      }),
      catalogItemFixture({
        id: 'b',
        organization: { zh: 'Google DeepMind', en: 'Google DeepMind' },
        tags: { topic: ['google deepmind', 'ai-research'], skill: [], career: [], format: [] },
      }),
    ], 'topic');

    expect(entries.map((entry) => entry.slug)).toEqual(['ai-research']);
  });

  it('机构页同时匹配中英文写法', () => {
    // 同一家机构在中文条目里是「阿里巴巴」、英文条目里是 Alibaba Group，
    // 只比一种语言会让另一半条目从页面上消失
    const items = [
      org('zh-item', '阿里巴巴', 'Alibaba Group'),
      org('en-item', 'Alibaba Group', 'Alibaba Group'),
      org('other', 'OpenAI', 'OpenAI'),
    ];

    expect(filterByDirectory(items, 'organization', '阿里巴巴').map((item) => item.id))
      .toEqual(['zh-item']);
    expect(filterByDirectory(items, 'organization', 'alibaba group').map((item) => item.id))
      .toEqual(['zh-item', 'en-item']);
  });

  it('未知入口返回空列表而不是全部条目', () => {
    expect(filterByDirectory([org('a', 'OpenAI', 'OpenAI')], 'topic', '  ')).toEqual([]);
    expect(filterByDirectory([org('a', 'OpenAI', 'OpenAI')], 'organization', 'nobody')).toEqual([]);
  });
});

describe('学生周报', () => {
  it('只收录窗口内新增的条目', () => {
    // 新旧看的是来源发布时间，两个字段都写出来免得读者以为看的是 discoveredAt
    // origin 显式写出来：静态种子是常驻目录、一律不算新增，见 weeklyNoveltyTimestamp
    const fresh = catalogItemFixture({
      id: 'fresh', origin: 'database',
      discoveredAt: '2026-08-22T00:00:00.000Z', publishedAt: '2026-08-22T00:00:00.000Z',
    });
    const stale = catalogItemFixture({
      id: 'stale', origin: 'database',
      discoveredAt: '2026-07-01T00:00:00.000Z', publishedAt: '2026-07-01T00:00:00.000Z',
    });

    expect(buildPathfinderWeekly([fresh, stale], NOW).added.map((item) => item.id))
      .toEqual(['fresh']);
  });

  it('新旧以来源发布时间为准，不用我们的抓取时间', () => {
    // 这是首次导入造成的基线失真：全部存量在同一天被抓到，周报于是显示
    // 「本周新增 178 条」，而真正这一周才发布的只有 17 条
    const backfilled = catalogItemFixture({
      id: 'backfilled', origin: 'database',
      discoveredAt: '2026-08-25T00:00:00.000Z',
      publishedAt: '2024-03-01T00:00:00.000Z',
    });
    const genuinelyNew = catalogItemFixture({
      id: 'genuinely-new', origin: 'database',
      discoveredAt: '2026-08-25T00:00:00.000Z',
      publishedAt: '2026-08-24T00:00:00.000Z',
    });

    expect(buildPathfinderWeekly([backfilled, genuinelyNew], NOW).added.map((item) => item.id))
      .toEqual(['genuinely-new']);
  });

  it('来源没给发布时间时才退回抓取时间', () => {
    const noPublishDate = catalogItemFixture({
      id: 'no-date', origin: 'database',
      discoveredAt: '2026-08-24T00:00:00.000Z',
      publishedAt: null,
    });

    expect(buildPathfinderWeekly([noPublishDate], NOW).added.map((item) => item.id))
      .toEqual(['no-date']);
  });

  it('本周截止里不含已经过期的条目', () => {
    const closing = catalogItemFixture({ id: 'closing', deadlineDate: '2026-08-27' });
    const expired = catalogItemFixture({ id: 'expired', deadlineDate: '2026-08-01' });
    const later = catalogItemFixture({ id: 'later', deadlineDate: '2026-11-01' });

    expect(buildPathfinderWeekly([closing, expired, later], NOW).closing.map((item) => item.id))
      .toEqual(['closing']);
  });

  it('精选从本周新增里挑，最多三条', () => {
    const items = Array.from({ length: 6 }, (_, index) => catalogItemFixture({
      id: `item-${index}`, origin: 'database',
      discoveredAt: '2026-08-23T00:00:00.000Z',
      publishedAt: '2026-08-23T00:00:00.000Z',
    }));
    const weekly = buildPathfinderWeekly(items, NOW);

    expect(weekly.highlights).toHaveLength(3);
    for (const highlight of weekly.highlights) {
      expect(weekly.added.map((item) => item.id)).toContain(highlight.id);
    }
  });

  it('窗口为空时给出空列表而不是报错', () => {
    const weekly = buildPathfinderWeekly([], NOW);
    expect(weekly).toMatchObject({ added: [], closing: [], highlights: [] });
    expect(weekly.until).toBe(NOW.toISOString());
  });
});
