import { describe, expect, it } from 'vitest';
import { listeningLessons, listeningTests } from '@/data/ielts-listening';
import {
  LISTENING_QUESTION_COUNT, ListeningLessonSchema, countListeningSentenceWords, countListeningWords, gradeListening,
  listeningQuestionLocations, sectionQuestionNumbers, type ListeningLesson,
} from '@/lib/ielts-listening/types';

/**
 * 听力题库的内容体检。协议只管“结构合法”，这里管“拿得出手”：
 * 原文能不能直接朗读、标准答案能不能判满分、解析是否言之有物、题型是否有变化。
 * 新加课时先让这个文件变绿。
 */

/** 各 Part 的原文词数区间，参照雅思真实材料的长度。 */
const WORD_RANGE: Record<number, [number, number]> = {
  1: [450, 800],
  2: [550, 900],
  3: [550, 950],
  4: [600, 1000],
};

/** 录音与页面共用同一份原文，这些符号会被读错或读不出，一律写成英文。 */
const UNSPEAKABLE = /[0-9%&/$€¥@#*_[\]{}<>\\|^~:]|"|“|”/;
// St 不能吃掉 States 之类的词，所以后面要求不是小写字母
const ABBREVIATIONS = /\b(e\.g\.|i\.e\.|etc\.|Mr|Mrs|Ms|Dr|St|No\.)(?![a-z])/;

function parse(lesson: ListeningLesson) {
  return ListeningLessonSchema.safeParse(lesson);
}

describe('雅思听力题库：内容体检', () => {
  it('每一篇都通过内容协议', () => {
    for (const lesson of listeningLessons) {
      const result = parse(lesson);
      expect(result.success ? [] : result.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`), lesson.slug).toEqual([]);
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
    const locations = listeningQuestionLocations(lesson);
    expect(locations).toHaveLength(LISTENING_QUESTION_COUNT);
    const kinds = new Set(locations.map(location => lesson.sections[location.sectionIndex].kind));
    // Part 3 在真题里以选择、配对为主；其余三个 Part 都要有填空
    if (lesson.part !== 3) expect(kinds.has('completion'), 'Part 1、2、4 需要填空题').toBe(true);
    expect(kinds.size, '至少两种题型').toBeGreaterThanOrEqual(2);
    expect(lesson.sections.length).toBeGreaterThanOrEqual(2);
    expect(lesson.sections.length).toBeLessThanOrEqual(4);
  });

  it.each(listeningLessons.map(lesson => [lesson.slug, lesson] as const))('%s：标准答案判满分，逐题核对', (_slug, lesson) => {
    const perfect: Record<string, string> = {};
    for (const answer of lesson.answers) {
      perfect[String(answer.number)] = answer.accepted[0];
      // 可接受的其它写法也必须得分
      for (const form of answer.accepted.slice(1)) {
        const single = gradeListening(lesson, { [String(answer.number)]: form }, [answer.number]);
        expect(single.results[0]?.correct, `${lesson.slug} 第 ${answer.number} 题的备选答案「${form}」`).toBe(true);
      }
    }
    const grade = gradeListening(lesson, perfect);
    expect(grade.score, lesson.slug).toBe(LISTENING_QUESTION_COUNT);
    expect(grade.total).toBe(LISTENING_QUESTION_COUNT);
    // 空白作答必须是 0 分，防止判分把“没答”当成“答对”
    expect(gradeListening(lesson, {}).score).toBe(0);
  });

  it.each(listeningLessons.map(lesson => [lesson.slug, lesson] as const))('%s：原文长度与句子长度适合听力练习', (_slug, lesson) => {
    const words = countListeningWords(lesson);
    const [min, max] = WORD_RANGE[lesson.part];
    expect(words, `词数 ${words}`).toBeGreaterThanOrEqual(min);
    expect(words, `词数 ${words}`).toBeLessThanOrEqual(max);
    for (const [index, utterance] of lesson.transcript.entries()) {
      const length = countListeningSentenceWords(utterance.text);
      expect(length, `第 ${index} 句有 ${length} 个词`).toBeLessThanOrEqual(32);
    }
    // Part 1 和 Part 3 是对话，Part 2 和 Part 4 是独白
    const speakers = new Set(lesson.transcript.map(utterance => utterance.speaker));
    if (lesson.part === 1 || lesson.part === 3) expect(speakers.size).toBeGreaterThanOrEqual(2);
    if (lesson.part === 2 || lesson.part === 4) expect(speakers.size).toBe(1);
    for (const member of lesson.cast) {
      expect(lesson.transcript.some(utterance => utterance.speaker === member.id), `说话人 ${member.id} 没有台词`).toBe(true);
    }
  });

  it.each(listeningLessons.map(lesson => [lesson.slug, lesson] as const))('%s：原文可以直接朗读，没有数字与符号', (_slug, lesson) => {
    for (const [index, utterance] of lesson.transcript.entries()) {
      const text = utterance.text;
      expect(UNSPEAKABLE.test(text), `第 ${index} 句含数字或符号：${text}`).toBe(false);
      expect(ABBREVIATIONS.test(text), `第 ${index} 句含缩写：${text}`).toBe(false);
      expect(/\s{2,}/.test(text), `第 ${index} 句有连续空白`).toBe(false);
      expect(text, `第 ${index} 句没有以句末标点结束`).toMatch(/[.?!]$/);
    }
  });

  it.each(listeningLessons.map(lesson => [lesson.slug, lesson] as const))('%s：口语数字串必须给考生标准写法', (_slug, lesson) => {
    // 只盯电话/编号式连续口语数字，避免把 "Oh, I see." 这类感叹词当成数字。
    const spokenNumberRun = /\b(?:oh|zero)\b(?=(?:\s+(?:zero|one|two|three|four|five|six|seven|eight|nine|double|treble)){2,})/i;
    for (const [index, utterance] of lesson.transcript.entries()) {
      if (!spokenNumberRun.test(utterance.text)) continue;
      expect(utterance.displayText, `第 ${index} 句「${utterance.text}」缺少考生写法`).toBeDefined();
      expect(utterance.displayText, `第 ${index} 句的展示写法`).toMatch(/\d/);
    }
  });

  it.each(listeningLessons.map(lesson => [lesson.slug, lesson] as const))('%s：词汇与词组讲解足够，且都带语境', (_slug, lesson) => {
    expect(lesson.vocabulary.length).toBeGreaterThanOrEqual(6);
    expect(lesson.expressions.length).toBeGreaterThanOrEqual(5);
    expect(lesson.tips?.length ?? 0).toBeGreaterThanOrEqual(2);
    const withPhonetic = lesson.vocabulary.filter(item => item.phonetic).length;
    expect(withPhonetic / lesson.vocabulary.length, '带音标的词汇占比').toBeGreaterThanOrEqual(0.8);
    const withListeningTip = lesson.vocabulary.filter(item => item.listening).length;
    expect(withListeningTip).toBeGreaterThanOrEqual(3);
    // 讲词与讲题要对得上：至少三条讲解引用的是答案句，读者点开解析时能在同一句里找到它们
    const evidenceSentences = new Set(lesson.answers.map(answer => answer.evidence));
    const explainedOnEvidence = [...lesson.vocabulary, ...lesson.expressions]
      .filter(item => evidenceSentences.has(item.sentenceIndex)).length;
    expect(explainedOnEvidence, '引用答案句的讲解条数').toBeGreaterThanOrEqual(3);
  });

  it.each(listeningLessons.map(lesson => [lesson.slug, lesson] as const))('%s：解析写到了定位与干扰，不是一句空话', (_slug, lesson) => {
    for (const answer of lesson.answers) {
      expect(answer.explanation.zh.length, `第 ${answer.number} 题中文解析`).toBeGreaterThanOrEqual(24);
      expect(answer.explanation.en.length, `第 ${answer.number} 题英文解析`).toBeGreaterThanOrEqual(50);
      expect(answer.explanation.zh).toMatch(/句|定位|听到|原文/);
      // 解析里引用的“定位句 N / Sentence N”必须就是 evidence：原文拆句或调整顺序后，数字不能留在过去
      const quotedZh = answer.explanation.zh.match(/定位句 (\d+)/);
      expect(quotedZh, `第 ${answer.number} 题中文解析没有写“定位句 N”`).not.toBeNull();
      expect(Number(quotedZh![1]), `第 ${answer.number} 题中文解析的定位句`).toBe(answer.evidence);
      const quotedEn = answer.explanation.en.match(/Sentences? (\d+)/);
      expect(quotedEn, `第 ${answer.number} 题英文解析没有写“Sentence N”`).not.toBeNull();
      expect(Number(quotedEn![1]), `第 ${answer.number} 题英文解析的定位句`).toBe(answer.evidence);
    }
    for (const item of lesson.vocabulary) {
      expect(item.example.en.length).toBeGreaterThanOrEqual(20);
      expect(item.usage.zh.length).toBeGreaterThanOrEqual(8);
    }
    for (const item of lesson.expressions) {
      expect(item.example.en.length).toBeGreaterThanOrEqual(20);
      expect(item.usage.zh.length).toBeGreaterThanOrEqual(8);
    }
  });

  it.each(listeningLessons.map(lesson => [lesson.slug, lesson] as const))('%s：答案与选项没有明显偏向', (_slug, lesson) => {
    const answerFor = (number: number) => lesson.answers.find(answer => answer.number === number)!;
    const locations = listeningQuestionLocations(lesson);
    const letters = locations.filter(location => lesson.sections[location.sectionIndex].kind !== 'completion')
      .map(location => answerFor(location.number).accepted[0]);
    if (letters.length >= 2) expect(new Set(letters).size, `选项字母全是 ${letters.join('')}`).toBeGreaterThanOrEqual(2);
    const completions = locations.filter(location => lesson.sections[location.sectionIndex].kind === 'completion')
      .map(location => answerFor(location.number).accepted[0].toLowerCase());
    if (completions.length >= 2) expect(new Set(completions).size).toBe(completions.length);
    // 同一题块里的选项文字不能重复
    for (const section of lesson.sections) {
      const options = section.kind === 'choice-single'
        ? section.questions.flatMap(question => question.options.map(option => option.text))
        : section.kind === 'matching' || section.kind === 'choice-multiple' ? section.options.map(option => option.text) : [];
      expect(new Set(options.map(text => text.toLowerCase())).size, '选项文字重复').toBe(options.length);
    }
    for (const section of lesson.sections) {
      if (section.kind !== 'completion') continue;
      const blanks = sectionQuestionNumbers(section, (lesson.part - 1) * 10 + 1).length;
      expect(blanks, '填空题块至少两个空').toBeGreaterThanOrEqual(2);
    }
  });

  it('题号按雅思规则连续：Part 1 是 1–10，Part 2 是 11–20，以此类推', () => {
    for (const lesson of listeningLessons) {
      const first = (lesson.part - 1) * 10 + 1;
      expect(listeningQuestionLocations(lesson).map(location => location.number), lesson.slug).toEqual(Array.from({ length: 10 }, (_, offset) => first + offset));
      expect(lesson.answers.map(answer => answer.number), lesson.slug).toEqual(Array.from({ length: 10 }, (_, offset) => first + offset));
    }
  });

  it('填空的备选写法都符合试卷上的词数限制', () => {
    for (const lesson of listeningLessons) {
      for (const section of lesson.sections) {
        if (section.kind !== 'completion') continue;
        for (const number of sectionQuestionNumbers(section, (lesson.part - 1) * 10 + 1)) {
          const answer = lesson.answers.find(item => item.number === number);
          expect(answer, `${lesson.slug} 第 ${number} 题`).toBeDefined();
          expect(answer!.accepted.length, `${lesson.slug} 第 ${number} 题`).toBeGreaterThanOrEqual(1);
        }
      }
    }
  });

  it('每套题四个 Part 齐全，共两套', () => {
    expect(listeningTests).toHaveLength(2);
    expect(listeningLessons).toHaveLength(8);
    for (const test of listeningTests) {
      const parts = listeningLessons.filter(lesson => lesson.slug.startsWith(`${test.slug}-`)).map(lesson => lesson.part).sort((a, b) => a - b);
      expect(parts, test.slug).toEqual([1, 2, 3, 4]);
    }
    for (const lesson of listeningLessons) expect(lesson.status).toBe('published');
  });
});
