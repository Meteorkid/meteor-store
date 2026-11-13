import { describe, expect, it } from 'vitest';
import { mergeIeltsPairs, validCuratedPairs, type IeltsPairRow } from '../catalog';
import type { IeltsFocus, IeltsPairSeed } from '../types';

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
