import { describe, expect, it } from 'vitest';
import { curatedIeltsPairs } from '@/data/ielts';
import { IeltsPairContentSchema } from '../types';

describe('雅思笔记与生词的正文引用', () => {
  it('每篇精选含全段讲解、技巧和至少六个真实生词', () => {
    for (const pair of curatedIeltsPairs) {
      const content = IeltsPairContentSchema.parse(pair.content);
      expect(content.learning, pair.slug).toBeDefined();
      const learning = content.learning!;
      expect(learning.paragraphs.map(p => p.paragraph)).toEqual([...new Set(content.segments.map(s => s.paragraph))]);
      expect(learning.vocabulary.length).toBeGreaterThanOrEqual(6);
      expect(learning.techniques.length).toBeGreaterThanOrEqual(3);
      for (const item of learning.vocabulary) {
        expect(content.segments[item.segmentIndex].high.toLowerCase()).toContain(item.term.toLowerCase());
        expect(item.example.en).not.toBe(item.example.zh);
        expect(item.usage.zh.length).toBeGreaterThan(15);
      }
    }
  });

  it('旧版正文仍可读取，不伪造扩展笔记', () => {
    const oldContent = { ...curatedIeltsPairs[0].content };
    delete oldContent.learning;
    expect(IeltsPairContentSchema.parse(oldContent).learning).toBeUndefined();
  });

  it('错位词汇、越界句索引、缺失段落与重复单词均拒绝', () => {
    const clone = () => structuredClone(curatedIeltsPairs[0].content);
    const wrongWord = clone();
    wrongWord.learning!.vocabulary[0].term = 'not-a-word-in-this-essay';
    expect(IeltsPairContentSchema.safeParse(wrongWord).success).toBe(false);
    const substring = clone();
    substring.learning!.vocabulary[0].term = 'ublic';
    substring.learning!.vocabulary[0].segmentIndex = 0;
    expect(IeltsPairContentSchema.safeParse(substring).success).toBe(false);
    const wrongSentence = clone();
    wrongSentence.learning!.techniques[0].segmentIndex = 29;
    expect(IeltsPairContentSchema.safeParse(wrongSentence).success).toBe(false);
    const missingParagraph = clone();
    missingParagraph.learning!.paragraphs.pop();
    expect(IeltsPairContentSchema.safeParse(missingParagraph).success).toBe(false);
    const duplicate = clone();
    duplicate.learning!.vocabulary[1] = duplicate.learning!.vocabulary[0];
    expect(IeltsPairContentSchema.safeParse(duplicate).success).toBe(false);
  });
});
