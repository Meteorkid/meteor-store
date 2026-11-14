import { describe, expect, it } from 'vitest';
import { auditIeltsCorpusPair, findCorpusDuplicates } from '../../../scripts/lib/ielts-corpus-quality';
import { curatedIeltsPairs } from '../ielts';
import { batchA } from '../ielts/batch-a';
import { batchB } from '../ielts/batch-b';
import { batchC } from '../ielts/batch-c';
import { ieltsExpansionPlan } from '../ielts/expansion-plan';

const originals = [...batchA, ...batchB, ...batchC];
const originalSlugs = new Set(originals.map(pair => pair.slug));
const added = curatedIeltsPairs.filter(pair => !originalSlugs.has(pair.slug));

/**
 * 最终语料的发布门槛：不以生成过程中的部分文件或模拟摘要替代真实的 100 篇。
 * 原六篇文件是否改动由验收脚本与 Git 基线逐文件比较，测试不写死源码哈希。
 */
describe('雅思 100 篇精选语料', () => {
  it('聚合库恰好 100 篇公开内容，Task 2 / 学术 / 书信为 60 / 25 / 15', () => {
    expect(curatedIeltsPairs).toHaveLength(100);
    expect(new Set(curatedIeltsPairs.map(pair => pair.slug)).size).toBe(100);
    expect(curatedIeltsPairs.every(pair => pair.status === 'published')).toBe(true);
    expect({
      task2: curatedIeltsPairs.filter(pair => pair.task === 'task2').length,
      academic: curatedIeltsPairs.filter(pair => pair.task === 'task1-academic').length,
      general: curatedIeltsPairs.filter(pair => pair.task === 'task1-general').length,
    }).toEqual({ task2: 60, academic: 25, general: 15 });
  });

  it('保留原六篇内容，不在聚合层替换或重复旧篇', () => {
    expect(originals).toHaveLength(6);
    for (const original of originals) {
      const matches = curatedIeltsPairs.filter(pair => pair.slug === original.slug);
      expect(matches, original.slug).toHaveLength(1);
      expect(matches[0], original.slug).toEqual(original);
    }
  });

  it('新增 94 篇与已验收题目计划一一对应，没有漏题或夹入替代题', () => {
    expect(added).toHaveLength(94);
    expect(added.map(pair => pair.slug).sort()).toEqual(ieltsExpansionPlan.map(pair => pair.slug).sort());
    const bySlug = new Map(added.map(pair => [pair.slug, pair]));
    for (const planned of ieltsExpansionPlan) {
      const actual = bySlug.get(planned.slug);
      expect(actual, planned.slug).toMatchObject({
        task: planned.task,
        category: planned.category,
        topic: planned.topic,
        sortOrder: planned.sortOrder,
        content: { title: planned.title, prompt: planned.prompt },
      });
    }
  });

  it('所有新增真实语料通过词数、译文、笔记、表达块与引用完整性验收', () => {
    expect(added, '不允许空集合或部分生成结果使内容验收空转').toHaveLength(94);
    const errors = added.flatMap(pair => auditIeltsCorpusPair(pair).map(error => `${pair.slug}: ${error}`));
    expect(errors).toEqual([]);
  });

  it('对全部 100 篇检查重复 slug、重复题干和高版正文的明显字面重合', () => {
    expect(curatedIeltsPairs, '重复检测必须覆盖最终完整语料').toHaveLength(100);
    // 五词片段检测不代表语义去重、版权或外网来源审查。
    expect(findCorpusDuplicates(curatedIeltsPairs)).toEqual([]);
  });
});
