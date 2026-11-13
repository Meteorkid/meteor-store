import { describe, expect, it } from 'vitest';
import { IeltsPairSeedSchema, countWords, essayParagraphs, type IeltsPairSeed } from '../types';

/**
 * 精选对照的内容体检。
 *
 * 这些是给读者看的范文，格式错误不会让页面崩，却会让人「照着学错」：
 * 左右两栏句子数不一致、5 分版写成了 4 分或 6 分、字数离题太远。
 * 所以内容也进 CI——加一组新对照，先让这个测试说话。
 */

const modules = import.meta.glob('../../../data/ielts/batch-*.ts', { eager: true }) as Record<string, { [key: string]: unknown }>;

const seeds: IeltsPairSeed[] = Object.entries(modules).flatMap(([path, module]) => {
  const values = Object.values(module).filter((value): value is IeltsPairSeed[] => Array.isArray(value));
  if (values.length !== 1) throw new Error(`${path} 应当只导出一个对照数组`);
  return values[0];
});

describe('雅思对照精选内容', () => {
  it('至少有一组对照，且每个文件都被收集到', () => {
    expect(Object.keys(modules).length).toBeGreaterThanOrEqual(3);
    expect(seeds.length).toBeGreaterThanOrEqual(6);
  });

  it('每组都能通过内容协议', () => {
    for (const seed of seeds) {
      const parsed = IeltsPairSeedSchema.safeParse(seed);
      if (!parsed.success) {
        throw new Error(`${seed?.slug ?? '未知'} 不合法：${parsed.error.issues.map(issue => `${issue.path.join('.')} ${issue.message}`).join('; ')}`);
      }
    }
  });

  it('slug 唯一', () => {
    const slugs = seeds.map(seed => seed.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('左右两栏段落数与每段句子数一致，且两版句子逐条对应', () => {
    for (const seed of seeds) {
      const low = essayParagraphs(seed.content.segments, 'low');
      const high = essayParagraphs(seed.content.segments, 'high');
      expect(high.length, seed.slug).toBe(low.length);
      low.forEach((paragraph, index) => {
        expect(high[index].length, `${seed.slug} 第 ${index + 1} 段`).toBe(paragraph.length);
      });
    }
  });

  it('两版词数落在各自档位区间', () => {
    const ranges: Record<string, { low: [number, number]; high: [number, number] }> = {
      task2: { low: [230, 300], high: [250, 320] },
      'task1-academic': { low: [130, 200], high: [140, 230] },
      'task1-general': { low: [130, 200], high: [140, 230] },
    };
    for (const seed of seeds) {
      const range = ranges[seed.task];
      const low = countWords(seed.content.segments.map(segment => segment.low).join(' '));
      const high = countWords(seed.content.segments.map(segment => segment.high).join(' '));
      expect(low, `${seed.slug} 5 分版 ${low} 词`).toBeGreaterThanOrEqual(range.low[0]);
      expect(low, `${seed.slug} 5 分版 ${low} 词`).toBeLessThanOrEqual(range.low[1]);
      expect(high, `${seed.slug} 8 分版 ${high} 词`).toBeGreaterThanOrEqual(range.high[0]);
      expect(high, `${seed.slug} 8 分版 ${high} 词`).toBeLessThanOrEqual(range.high[1]);
      // 8 分版可以比 5 分版短一点（把啰嗦的句子写紧），但不能明显更短——
      // 那意味着升级时丢了内容，而不是写得更好
      expect(high, `${seed.slug} 8 分版比 5 分版少了 ${low - high} 词`).toBeGreaterThanOrEqual(low - 20);
    }
  });

  it('每条升级说明都写清了改了什么', () => {
    for (const seed of seeds) {
      for (const segment of seed.content.segments) {
        expect(segment.note.zh.length, `${seed.slug} 的中文说明过短`).toBeGreaterThanOrEqual(12);
        expect(segment.note.en.length, `${seed.slug} 的英文说明过短`).toBeGreaterThanOrEqual(12);
        expect(segment.low).not.toBe(segment.high);
      }
    }
  });
});
