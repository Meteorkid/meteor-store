import { describe, expect, it } from 'vitest';
import { curatedIeltsPairs } from '@/data/ielts';
import { IeltsPairContentSchema, IeltsSegmentSchema } from '../types';

describe('雅思逐句中文译文', () => {
  it('全部精选句对的两版译文非空且含中文', () => {
    for (const pair of curatedIeltsPairs) {
      const content = IeltsPairContentSchema.parse(pair.content);
      for (const [index, segment] of content.segments.entries()) {
        expect(segment.translationZh, `${pair.slug} sentence ${index + 1}`).toBeDefined();
        expect(segment.translationZh!.low).toMatch(/[\p{Script=Han}]/u);
        expect(segment.translationZh!.high).toMatch(/[\p{Script=Han}]/u);
      }
    }
  });

  it('旧记录可以无翻译，但有字段时不接受缺一边或空白', () => {
    const old = { ...curatedIeltsPairs[0].content.segments[0] };
    delete old.translationZh;
    expect(IeltsSegmentSchema.parse(old).translationZh).toBeUndefined();
    expect(IeltsSegmentSchema.safeParse({ ...old, translationZh: { low: '原文翻译' } }).success).toBe(false);
    expect(IeltsSegmentSchema.safeParse({ ...old, translationZh: { low: ' ', high: '升级译文' } }).success).toBe(false);
  });

  it('数据表两版译文分别保留原句的年份和百分比', () => {
    const pair = curatedIeltsPairs.find(item => item.slug === 'task1-academic-table-energy')!;
    const numbers = (text: string) => [...text.matchAll(/\d+(?:\.\d+)?%?/g)].map(match => match[0]).sort();
    for (const segment of pair.content.segments) {
      expect(numbers(segment.translationZh!.low)).toEqual(numbers(segment.low));
      expect(numbers(segment.translationZh!.high)).toEqual(numbers(segment.high));
    }
  });
});
