import { describe, expect, it } from 'vitest';
import { ieltsExpansionPlan } from '../ielts/expansion-plan';
import { batchA } from '../ielts/batch-a';
import { batchB } from '../ielts/batch-b';
import { batchC } from '../ielts/batch-c';

describe('雅思100题扩充计划', () => {
  const existing = [...batchA, ...batchB, ...batchC];
  const all = [...existing, ...ieltsExpansionPlan];
  it('保留六篇并规划94篇不同题目', () => {
    expect(existing).toHaveLength(6);
    expect(ieltsExpansionPlan).toHaveLength(94);
    expect(new Set(all.map(item => item.slug)).size).toBe(100);
    const prompts = ieltsExpansionPlan.map(item => item.prompt.en.toLowerCase().replace(/\s+/g, ' ').trim());
    expect(new Set(prompts).size).toBe(94);
    expect(ieltsExpansionPlan.map(item => item.sortOrder)).toEqual(Array.from({length:94}, (_,index) => (index+7)*10));
  });
  it('题型数量完整，非以重复旧题充数', () => {
    const counts: Record<string, number> = {};
    for (const item of all) counts[`${item.task}/${item.category}`] = (counts[`${item.task}/${item.category}`] ?? 0) + 1;
    expect(counts).toEqual({
      'task2/opinion':12,'task2/discussion':12,'task2/problem-solution':12,'task2/advantage-disadvantage':12,'task2/two-part':12,
      'task1-academic/table':5,'task1-academic/line-graph':5,'task1-academic/bar-chart':5,'task1-academic/pie-chart':4,'task1-academic/process':3,'task1-academic/map':3,
      'task1-general/letter-formal':5,'task1-general/letter-semi-formal':5,'task1-general/letter-informal':5,
    });
  });
  it('题干在内容协议长度内，学术数据明确是假设练习资料', () => {
    for (const item of ieltsExpansionPlan) {
      expect(item.prompt.en.length).toBeLessThanOrEqual(1200);
      expect(item.prompt.zh.length).toBeLessThanOrEqual(1200);
      expect(item.authoringBrief.length).toBeGreaterThan(20);
      if (item.task === 'task1-academic') expect(item.prompt.en).toMatch(/hypothetical/i);
    }
  });
});
