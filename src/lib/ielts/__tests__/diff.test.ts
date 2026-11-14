import { describe, expect, it } from 'vitest';
import { diffIeltsSentence } from '../diff';
import { curatedIeltsPairs } from '@/data/ielts';

describe('雅思字词改动标记', () => {
  it('只标替换部分，保留共有前后文', () => {
    const result = diffIeltsSentence('It is good for students.', 'It is beneficial for students.');
    expect(result.low.filter(part => part.changed).map(part => part.text)).toEqual(['good']);
    expect(result.high.filter(part => part.changed).map(part => part.text)).toEqual(['beneficial']);
  });

  it('分别处理纯新增和纯删除', () => {
    const added = diffIeltsSentence('Students learn.', 'Students can learn independently.');
    expect(added.low.every(part => !part.changed)).toBe(true);
    expect(added.high.filter(part => part.changed).map(part => part.text)).toEqual(['can', 'independently']);
    const removed = diffIeltsSentence('It is very very useful.', 'It is very useful.');
    expect(removed.low.filter(part => part.changed).map(part => part.text)).toEqual(['very']);
    expect(removed.high.every(part => !part.changed)).toBe(true);
  });

  it('大小写、标点与词形变化不会被漏掉', () => {
    const result = diffIeltsSentence('health,', 'Healthy.');
    expect(result.low).toEqual([{ text: 'health,', changed: true }]);
    expect(result.high).toEqual([{ text: 'Healthy.', changed: true }]);
  });

  it.each([
    ['', ''], ['one', ''], ['', 'one'],
    ["It's 15% in 2000.\n", 'It’s 65% in 2020.'],
    ['  state-funded\tplaces  ', '  state-funded places  '],
    ['Café — déjà vu!', 'Café: déjà vu?'],
  ])('保留全部原始字符：%s → %s', (low, high) => {
    const diff = diffIeltsSentence(low, high);
    expect(diff.low.map(part => part.text).join('')).toBe(low);
    expect(diff.high.map(part => part.text).join('')).toBe(high);
  });

  it('所有精选原文经标记后逐字不变', () => {
    for (const pair of curatedIeltsPairs) for (const segment of pair.content.segments) {
      const diff = diffIeltsSentence(segment.low, segment.high);
      expect(diff.low.map(part => part.text).join('')).toBe(segment.low);
      expect(diff.high.map(part => part.text).join('')).toBe(segment.high);
    }
  });
});
