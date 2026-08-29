import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { STATIC_PATHFINDER_ITEMS } from '@/data/pathfinder/catalog-seeds';
import { allTopicNames } from '../ingestion/topics';
import { buildPathfinderWeekly, WEEKLY_FEATURED_LIMIT } from '../directory';
import { catalogActionScore, isLongOpenPosting } from '../catalog-view';
import { catalogItemFixture } from './fixtures';

describe('静态种子的主题', () => {
  it('全部落在词表内，没有原始 slug 残留', () => {
    // 手写的 `web-framework`、`technology-jobs`、`ai` 与抓取来的 GitHub 标签
    // 是同一类东西：对读者没有含义，混进主题页就是一堆看不懂的短横线词
    const vocabulary = new Set(allTopicNames());
    for (const item of STATIC_PATHFINDER_ITEMS) {
      for (const topic of item.tags.topic) {
        expect(vocabulary.has(topic), `${item.id} 的主题 ${topic} 不在词表内`).toBe(true);
      }
    }
  });

  it('方向推断不受归一化影响', () => {
    /*
     * 原始 slug 里的 ai / frontend / backend / data 同时兼着推断方向的职责。
     * 归一化若发生在方向推断之前，它们会被换成中文展示名，方向就再也匹配不上。
     */
    const directions = new Set(STATIC_PATHFINDER_ITEMS.flatMap((item) => item.directions));
    expect([...directions].sort()).toEqual(['ai', 'backend', 'data', 'frontend']);
  });
});

describe('周报不把常驻目录当成本周新增', () => {
  const NOW = new Date('2026-08-29T00:00:00.000Z');

  it('静态种子一律不算新增', () => {
    /*
     * 它们 publishedAt 为空而 discoveredAt 是同一个常量，于是每次改动那个常量，
     * 66 条种子就集体涌进周报——实测「本周新增」曾显示 91 条，其中 66 条
     * 是几个月前就在目录里的仓库。
     */
    const staticItem = catalogItemFixture({
      id: 's', origin: 'static', publishedAt: null, discoveredAt: '2026-08-28T00:00:00.000Z',
    });
    const feedItem = catalogItemFixture({
      id: 'f', origin: 'sync', publishedAt: '2026-08-28T00:00:00.000Z', discoveredAt: '2026-08-28T00:00:00.000Z',
    });

    expect(buildPathfinderWeekly([staticItem, feedItem], NOW).added.map((i) => i.id))
      .toEqual(['f']);
  });

  it('展开条数有上限', () => {
    // 周报的价值在「这周该看什么」，不在「这周一共来了多少」
    expect(WEEKLY_FEATURED_LIMIT).toBeGreaterThan(0);
    expect(WEEKLY_FEATURED_LIMIT).toBeLessThanOrEqual(20);
  });

  it('页面把「展开几条 / 其余几条」说清楚', () => {
    /*
     * 历史教训：标题写着 91 条而页面只渲染 20 条，中间没有任何交代，
     * 读者会以为漏了。
     */
    const page = readFileSync(
      path.join(__dirname, '..', '..', '..', 'app', '[locale]', 'pathfinder', 'weekly', 'page.tsx'),
      'utf-8',
    );
    expect(page).toContain('addedFeaturedNote');
    expect(page).toContain('addedMore');
    expect(page).toContain('<details');
  });
});

describe('久挂岗位', () => {
  const NOW = new Date('2026-08-29T00:00:00.000Z');
  const posting = (published: string, verified: string) => catalogItemFixture({
    id: 'j', itemType: 'internship', publishedAt: published, verifiedAt: verified,
  });

  it('发布很久但最近核验过：标为仍然开放', () => {
    // 真实案例：Databricks 的 2027 Summer PM Intern 发布于 2023-08，核验于 2026-08
    expect(isLongOpenPosting(posting('2023-08-17T00:00:00.000Z', '2026-08-29T00:00:00.000Z'), NOW))
      .toBe(true);
  });

  it('没有近期核验就不给「仍然开放」的保证', () => {
    expect(isLongOpenPosting(posting('2023-08-17T00:00:00.000Z', '2026-01-01T00:00:00.000Z'), NOW))
      .toBe(false);
  });

  it('新发布的岗位不需要这个标注', () => {
    expect(isLongOpenPosting(posting('2026-08-20T00:00:00.000Z', '2026-08-29T00:00:00.000Z'), NOW))
      .toBe(false);
  });

  it('久挂岗位降权但不被过滤', () => {
    // 它毕竟还开着，愿意投的人应该能找到它
    const old = posting('2023-08-17T00:00:00.000Z', '2026-08-29T00:00:00.000Z');
    const fresh = posting('2026-08-20T00:00:00.000Z', '2026-08-29T00:00:00.000Z');
    expect(catalogActionScore(old, NOW)).toBeLessThan(catalogActionScore(fresh, NOW));
    expect(catalogActionScore(old, NOW)).toBeGreaterThan(-100);
  });
});
