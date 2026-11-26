import { describe, expect, it } from 'vitest';
import { listeningLessons, listeningTests } from '@/data/ielts-listening';
import {
  auditListeningLesson, type ListeningAuditTag,
} from '@/lib/ielts-listening/quality';
import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * 听力题库的内容体检。协议只管“结构合法”，这里管“拿得出手”：
 * 原文能不能直接朗读、标准答案能不能判满分、解析是否言之有物、题型是否有变化。
 * 具体规则集中在 `src/lib/ielts-listening/quality.ts` 的 `auditListeningLesson`，
 * 本文件只按类别分组断言：原来会红的输入，改后仍必须红。新加课时先让这个文件变绿。
 */

/**
 * 随批次交付逐步上调，最终 52/208，不得为了变绿改小或改成 ≥。
 *（52 套题 × 4 个 Part = 208 篇课时。）
 */
const EXPECTED_TEST_COUNT = 52;
const EXPECTED_LESSON_COUNT = 208;

/** 只取某一类别的违规说明，类别标签与 quality.ts 里的 ListeningAuditTag 对应。 */
function violationsFor(lesson: ListeningLesson, tag: ListeningAuditTag): string[] {
  return auditListeningLesson(lesson).filter(issue => issue.startsWith(`${tag}:`));
}

describe('雅思听力题库：内容体检', () => {
  it('每一篇都通过内容协议', () => {
    for (const lesson of listeningLessons) {
      expect(violationsFor(lesson, 'schema'), lesson.slug).toEqual([]);
    }
  });

  it('slug 与 (套题, Part) 都不重复', () => {
    expect(new Set(listeningLessons.map(lesson => lesson.slug)).size).toBe(listeningLessons.length);
    const keys = listeningLessons.map(lesson => `${lesson.slug.slice(0, 7)}-${lesson.part}`);
    expect(new Set(keys).size, keys.join(', ')).toBe(listeningLessons.length);
  });

  it('两套题的场景互不重复', () => {
    const titles = listeningLessons.map(lesson => lesson.title.en.toLowerCase());
    expect(new Set(titles).size, titles.join(' / ')).toBe(listeningLessons.length);
    const slugs = new Set(listeningTests.map(test => test.slug));
    expect(slugs.size).toBe(listeningTests.length);
    for (const lesson of listeningLessons) expect(slugs.has(lesson.slug.slice(0, 7)), lesson.slug).toBe(true);
  });

  it.each(listeningLessons.map(lesson => [lesson.slug, lesson] as const))('%s：10 题、题型有变化、至少一半是填空或选择', (_slug, lesson) => {
    expect(violationsFor(lesson, 'structure'), lesson.slug).toEqual([]);
  });

  it.each(listeningLessons.map(lesson => [lesson.slug, lesson] as const))('%s：标准答案判满分，逐题核对', (_slug, lesson) => {
    expect(violationsFor(lesson, 'grading'), lesson.slug).toEqual([]);
  });

  it.each(listeningLessons.map(lesson => [lesson.slug, lesson] as const))('%s：原文长度与句子长度适合听力练习', (_slug, lesson) => {
    expect(violationsFor(lesson, 'length'), lesson.slug).toEqual([]);
  });

  it.each(listeningLessons.map(lesson => [lesson.slug, lesson] as const))('%s：原文可以直接朗读，没有数字与符号', (_slug, lesson) => {
    expect(violationsFor(lesson, 'speakable'), lesson.slug).toEqual([]);
  });

  it.each(listeningLessons.map(lesson => [lesson.slug, lesson] as const))('%s：口语数字串必须给考生标准写法', (_slug, lesson) => {
    expect(violationsFor(lesson, 'spoken-number'), lesson.slug).toEqual([]);
  });

  it.each(listeningLessons.map(lesson => [lesson.slug, lesson] as const))('%s：词汇与词组讲解足够，且都带语境', (_slug, lesson) => {
    expect(violationsFor(lesson, 'notes'), lesson.slug).toEqual([]);
  });

  it.each(listeningLessons.map(lesson => [lesson.slug, lesson] as const))('%s：解析写到了定位与干扰，不是一句空话', (_slug, lesson) => {
    expect(violationsFor(lesson, 'explanation'), lesson.slug).toEqual([]);
  });

  it.each(listeningLessons.map(lesson => [lesson.slug, lesson] as const))('%s：答案与选项没有明显偏向', (_slug, lesson) => {
    expect(violationsFor(lesson, 'answer-bias'), lesson.slug).toEqual([]);
  });

  it('题号按雅思规则连续：Part 1 是 1–10，Part 2 是 11–20，以此类推', () => {
    for (const lesson of listeningLessons) {
      expect(violationsFor(lesson, 'numbering'), lesson.slug).toEqual([]);
    }
  });

  it('填空的备选写法都符合试卷上的词数限制', () => {
    for (const lesson of listeningLessons) {
      expect(violationsFor(lesson, 'completion'), lesson.slug).toEqual([]);
    }
  });

  it('每套题四个 Part 齐全，数量随批次上调', () => {
    expect(listeningTests, '套题数量').toHaveLength(EXPECTED_TEST_COUNT);
    expect(listeningLessons, '课时数量').toHaveLength(EXPECTED_LESSON_COUNT);
    for (const test of listeningTests) {
      const parts = listeningLessons.filter(lesson => lesson.slug.startsWith(`${test.slug}-`)).map(lesson => lesson.part).sort((a, b) => a - b);
      expect(parts, test.slug).toEqual([1, 2, 3, 4]);
    }
    for (const lesson of listeningLessons) expect(lesson.status).toBe('published');
  });

  it('audit 能对一份故意写坏的副本同时报出至少 5 类不同问题', () => {
    const broken = structuredClone(listeningLessons[0]);

    // 1. 词汇砍到 5 条（notes：≥6）
    broken.vocabulary = broken.vocabulary.slice(0, 5);
    // 2. 第一题中文解析压到 24 字以下，也不再写“定位句 N”（explanation）
    broken.answers[0].explanation.zh = '太短。';
    // 3. 电话句删掉考生写法（spoken-number）
    const phoneUtterance = broken.transcript.find(utterance => utterance.displayText);
    if (phoneUtterance) delete phoneUtterance.displayText;
    // 4. 选择题答案全部改成同一个字母（answer-bias）
    for (const answer of broken.answers) {
      if (/^[A-H]$/.test(answer.accepted[0])) answer.accepted = ['A'];
    }
    // 5. 第一句写成 33 个词的长句（length：单句 ≤32 词）
    broken.transcript[0].text = 'We should remember that every student who joins this course needs to bring their own apron and a notebook to record the different steps that the teacher demonstrates each week in the studio.';

    const report = auditListeningLesson(broken);
    const categories = new Set(report.map(issue => issue.split(':')[0]));
    expect(report.length, report.join('\n')).toBeGreaterThan(0);
    expect(categories.size, report.join('\n')).toBeGreaterThanOrEqual(5);
  });
});
