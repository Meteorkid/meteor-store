import { describe, expect, it } from 'vitest';
import { IeltsSegmentSchema, type IeltsPairSeed, type IeltsSegment } from '../types';
import { expressionEditsForParagraph } from '../expression-edits';

const segment: IeltsSegment = {
  paragraph: 1, low: 'It is good for people.', high: 'It brings clear social benefits.', focus: ['lexis'],
  note: { zh: '具体写出好处。', en: 'Name the benefit.' },
  expressionEdits: [{ before: 'is good for people', after: 'brings clear social benefits', focus: 'lexis',
    explanation: { zh: '把模糊评价写成具体的社会效益。', en: 'Replace a vague judgement with a precise benefit.' } }],
};
const modules = import.meta.glob('../../../data/ielts/batch-*.ts', { eager: true }) as Record<string, Record<string, unknown>>;
const seeds = Object.values(modules).flatMap(module => Object.values(module).filter(Array.isArray).flat()) as IeltsPairSeed[];

describe('IELTS 表达块内容契约', () => {
  it('只接受各自原句中精确连续的表达，并允许旧内容不含表达块', () => {
    expect(IeltsSegmentSchema.safeParse(segment).success).toBe(true);
    expect(IeltsSegmentSchema.safeParse({ ...segment, expressionEdits: undefined }).success).toBe(true);
    for (const patch of [{ before: 'good people' }, { after: 'Brings clear social benefits' }]) {
      const result = IeltsSegmentSchema.safeParse({ ...segment, expressionEdits: [{ ...segment.expressionEdits![0], ...patch }] });
      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path.slice(0, 2)).toEqual(['expressionEdits', 0]);
    }
  });

  it('拒绝无变化、空数组和超过两条的句内配对', () => {
    const unchanged = { ...segment, high: segment.low, expressionEdits: [{ ...segment.expressionEdits![0], after: segment.expressionEdits![0].before }] };
    expect(IeltsSegmentSchema.safeParse(unchanged).success).toBe(false);
    expect(IeltsSegmentSchema.safeParse({ ...segment, expressionEdits: [] }).success).toBe(false);
    expect(IeltsSegmentSchema.safeParse({ ...segment, expressionEdits: Array(3).fill(segment.expressionEdits![0]) }).success).toBe(false);
  });

  it('汇总按原句顺序保留精确定位，不从无标注的正文猜测表达块', () => {
    const items = [{ ...segment, expressionEdits: undefined }, segment, { ...segment, paragraph: 2 }];
    expect(expressionEditsForParagraph(items, 1)).toEqual([{ ...segment.expressionEdits![0], segmentIndex: 1, editIndex: 0 }]);
    expect(expressionEditsForParagraph(items, 2)[0].segmentIndex).toBe(2);
    expect(expressionEditsForParagraph(items, 3)).toEqual([]);
  });

  it('六篇精选的每个段落都有真实配对，且主展示保持短语或分句长度', () => {
    expect(seeds.length).toBeGreaterThanOrEqual(6);
    for (const seed of seeds) {
      for (const paragraph of new Set(seed.content.segments.map(item => item.paragraph))) {
        const edits = expressionEditsForParagraph(seed.content.segments, paragraph);
        expect(edits.length, `${seed.slug} 第 ${paragraph} 段`).toBeGreaterThanOrEqual(1);
        expect(edits.length, `${seed.slug} 第 ${paragraph} 段`).toBeLessThanOrEqual(3);
        for (const edit of edits) {
          const source = seed.content.segments[edit.segmentIndex];
          expect(source.low).toContain(edit.before);
          expect(source.high).toContain(edit.after);
          expect(edit.after.length).toBeLessThan(source.high.length);
        }
      }
    }
  });
});
