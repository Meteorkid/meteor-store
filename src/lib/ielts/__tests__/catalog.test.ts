import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { SQL } from 'drizzle-orm';
import { PgDialect } from 'drizzle-orm/pg-core';
import { curatedIeltsPairs } from '@/data/ielts';
import { getIeltsPair, listIeltsPairs, mergeIeltsPairs, validCuratedPairs, type IeltsPairRow } from '../catalog';
import { IeltsPairSeedSchema, type IeltsFocus, type IeltsPairSeed } from '../types';

const queries = vi.hoisted(() => ({
  select: vi.fn(), from: vi.fn(), where: vi.fn(), limit: vi.fn(), orderBy: vi.fn(),
}));
vi.mock('@/lib/db', () => ({ db: { select: queries.select } }));

beforeEach(() => {
  vi.clearAllMocks();
  queries.select.mockReturnValue({ from: queries.from });
  queries.from.mockReturnValue({ where: queries.where, orderBy: queries.orderBy });
  queries.where.mockReturnValue({ limit: queries.limit });
  queries.limit.mockResolvedValue([]);
  queries.orderBy.mockResolvedValue([]);
});
afterEach(() => vi.restoreAllMocks());

/**
 * 合并规则是这一页最容易出错的地方：文件里的精选内容与数据库里的内容
 * 按 slug 相遇时，谁盖谁、下架怎么生效、读库失败怎么办。
 * 每一条规则都在这里钉一遍，改 mergeIeltsPairs 之前先看这个文件。
 */

function segment(index: number) {
  return {
    paragraph: 1,
    low: `Low sentence number ${index}.`,
    high: `High sentence number ${index}, written better.`,
    focus: ['lexis'] as IeltsFocus[],
    note: { zh: `第 ${index} 句的改动说明。`, en: `Note for sentence ${index}.` },
  };
}

function seed(slug: string, overrides: Partial<IeltsPairSeed> = {}): IeltsPairSeed {
  return {
    slug,
    task: 'task2',
    category: 'opinion',
    topic: 'education',
    status: 'published',
    sortOrder: 10,
    content: {
      prompt: { en: 'Some people believe that testing the merge logic is worth the effort.', zh: '测试用题目说明。' },
      title: { zh: '测试标题', en: 'Test title' },
      bandLow: 5,
      bandHigh: 8,
      segments: [1, 2, 3, 4, 5, 6].map(segment),
      criteria: [
        { key: 'TR' as const, note: { zh: '任务回应说明。', en: 'Task response note.' } },
        { key: 'CC' as const, note: { zh: '衔接说明。', en: 'Cohesion note.' } },
        { key: 'LR' as const, note: { zh: '词汇说明。', en: 'Lexis note.' } },
        { key: 'GRA' as const, note: { zh: '语法说明。', en: 'Grammar note.' } },
      ],
      takeaways: { zh: ['抄这一句', '还有这一句'], en: ['Borrow this', 'And this'] },
    },
    ...overrides,
  };
}

function row(slug: string, overrides: Partial<IeltsPairRow> = {}): IeltsPairRow {
  return {
    slug,
    task: 'task2',
    category: 'opinion',
    topic: 'education',
    status: 'published',
    sortOrder: 10,
    source: 'generated',
    content: null,
    ...overrides,
  };
}

describe('精选内容校验', () => {
  it('合法的留下，不合法的丢弃并留痕', () => {
    const broken = { ...seed('broken-one'), sortOrder: -1 } as IeltsPairSeed;
    const kept = validCuratedPairs([seed('good-one'), broken]);
    expect(kept.map(item => item.slug)).toEqual(['good-one']);
  });

  it('默认静态精选只校验一次，再次读取复用结果', () => {
    const parse = vi.spyOn(IeltsPairSeedSchema, 'safeParse');
    const first = validCuratedPairs();
    const firstCalls = parse.mock.calls.length;
    expect(first.length).toBeGreaterThanOrEqual(6);
    expect(validCuratedPairs()).toBe(first);
    expect(parse).toHaveBeenCalledTimes(firstCalls);
  });

  it('显式传入的内容始终重新校验，同一数组改坏后不会命中静态缓存', () => {
    const content = [seed('custom-one')];
    expect(validCuratedPairs(content)).toHaveLength(1);
    content[0].sortOrder = -1;
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(validCuratedPairs(content)).toEqual([]);
    expect(log).toHaveBeenCalledOnce();
  });
});

describe('合并规则', () => {
  it('只有文件内容时按 sortOrder 排序', () => {
    const merged = mergeIeltsPairs([seed('b', { sortOrder: 20 }), seed('a', { sortOrder: 10 })], []);
    expect(merged.map(item => item.slug)).toEqual(['a', 'b']);
    expect(merged[0].source).toBe('curated');
  });

  it('文件里的草稿不公开', () => {
    const merged = mergeIeltsPairs([seed('a', { status: 'draft' })], []);
    expect(merged).toEqual([]);
  });

  it('数据库里 published 且有正文时整组替换', () => {
    const replacement = seed('a').content;
    const merged = mergeIeltsPairs([seed('a')], [row('a', { content: replacement, source: 'generated', sortOrder: 5 })]);
    expect(merged).toHaveLength(1);
    expect(merged[0].source).toBe('generated');
    expect(merged[0].sortOrder).toBe(5);
  });

  it('数据库行没有正文时只覆盖状态与排序，来源仍算精选', () => {
    const merged = mergeIeltsPairs([seed('a', { sortOrder: 30 })], [row('a', { sortOrder: 1, content: null, source: 'generated' })]);
    expect(merged[0].sortOrder).toBe(1);
    expect(merged[0].source).toBe('curated');
  });

  it('hidden 把文件里那一组也一起下架', () => {
    const merged = mergeIeltsPairs([seed('a'), seed('b')], [row('a', { status: 'hidden' })]);
    expect(merged.map(item => item.slug)).toEqual(['b']);
  });

  it('数据库草稿不公开，但不会把文件版本删掉', () => {
    const merged = mergeIeltsPairs([seed('a')], [row('a', { status: 'draft', content: seed('a').content })]);
    expect(merged).toHaveLength(1);
    expect(merged[0].source).toBe('curated');
  });

  it('没有正文又不在文件里的行直接跳过', () => {
    const merged = mergeIeltsPairs([seed('a')], [row('ghost', { content: null })]);
    expect(merged.map(item => item.slug)).toEqual(['a']);
  });

  it('数据库可以新增文件里没有的对照', () => {
    const merged = mergeIeltsPairs([seed('a')], [row('generated-one', { content: seed('generated-one').content, sortOrder: 2 })]);
    expect(merged.map(item => item.slug)).toEqual(['generated-one', 'a']);
  });
});

describe('公开单篇读取', () => {
  const curated = curatedIeltsPairs[0];

  it('仅点查目标 slug，并限制一行，不读取全库列表', async () => {
    const result = await getIeltsPair(curated.slug);
    expect(result?.slug).toBe(curated.slug);
    expect(result?.source).toBe('curated');
    const query = new PgDialect().sqlToQuery(queries.where.mock.calls[0][0] as SQL);
    expect(query.sql).toBe('"ielts_pairs"."slug" = $1');
    expect(query.params).toEqual([curated.slug]);
    expect(queries.limit).toHaveBeenCalledWith(1);
    expect(queries.orderBy).not.toHaveBeenCalled();
  });

  it('空数据库下原有六组精选仍可逐篇读取', async () => {
    for (const original of curatedIeltsPairs.slice(0, 6)) {
      expect(await getIeltsPair(original.slug)).toMatchObject({ slug: original.slug, source: 'curated' });
    }
  });

  it('published 正文覆盖精选，空正文仅覆盖元数据并保留精选来源', async () => {
    const replacement = seed('replacement').content;
    queries.limit.mockResolvedValueOnce([row(curated.slug, { content: replacement, sortOrder: 2 })]);
    expect(await getIeltsPair(curated.slug)).toMatchObject({ content: replacement, source: 'generated', sortOrder: 2 });
    queries.limit.mockResolvedValueOnce([row(curated.slug, { content: null, sortOrder: 3 })]);
    expect(await getIeltsPair(curated.slug)).toMatchObject({ content: curated.content, source: 'curated', sortOrder: 3 });
  });

  it('发布后再下架与重新发布即时生效，不缓存数据库状态', async () => {
    queries.limit.mockResolvedValueOnce([])
      .mockResolvedValueOnce([row(curated.slug, { status: 'hidden' })])
      .mockResolvedValueOnce([row(curated.slug, { status: 'published', sortOrder: 7 })]);
    expect(await getIeltsPair(curated.slug)).not.toBeNull();
    expect(await getIeltsPair(curated.slug)).toBeNull();
    expect(await getIeltsPair(curated.slug)).toMatchObject({ sortOrder: 7 });
    expect(queries.select).toHaveBeenCalledTimes(3);
  });

  it('数据库草稿不会覆盖精选，也不会把仅存数据库的草稿公开', async () => {
    queries.limit.mockResolvedValueOnce([row(curated.slug, { status: 'draft', content: seed('draft').content })]);
    expect(await getIeltsPair(curated.slug)).toMatchObject({ source: 'curated', content: curated.content });
    queries.limit.mockResolvedValueOnce([row('only-draft', { status: 'draft', content: seed('draft').content })]);
    expect(await getIeltsPair('only-draft')).toBeNull();
  });

  it('数据库独有的发布内容可读，空正文或未知 slug 返回空', async () => {
    queries.limit.mockResolvedValueOnce([row('new-public', { content: seed('new-public').content })]);
    expect(await getIeltsPair('new-public')).toMatchObject({ slug: 'new-public', source: 'generated' });
    queries.limit.mockResolvedValueOnce([row('empty-public')]);
    expect(await getIeltsPair('empty-public')).toBeNull();
    expect(await getIeltsPair('unknown-slug')).toBeNull();
  });

  it('数据库异常仍回退对应精选，未知 slug 不会冒出其他精选', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    queries.limit.mockRejectedValue(new Error('offline'));
    expect(await getIeltsPair(curated.slug)).toMatchObject({ slug: curated.slug, source: 'curated' });
    expect(await getIeltsPair('unknown-slug')).toBeNull();
  });

  it('列表继续全量合并与排序，每次读取新状态，失败继续降级精选', async () => {
    queries.orderBy.mockResolvedValueOnce([row(curated.slug, { status: 'hidden' })])
      .mockResolvedValueOnce([row(curated.slug, { sortOrder: 0 })]);
    expect((await listIeltsPairs()).some(pair => pair.slug === curated.slug)).toBe(false);
    expect((await listIeltsPairs())[0]).toMatchObject({ slug: curated.slug, sortOrder: 0 });
    vi.spyOn(console, 'error').mockImplementation(() => {});
    queries.orderBy.mockRejectedValueOnce(new Error('offline'));
    expect((await listIeltsPairs()).some(pair => pair.slug === curated.slug)).toBe(true);
    expect(queries.where).not.toHaveBeenCalled();
  });
});
