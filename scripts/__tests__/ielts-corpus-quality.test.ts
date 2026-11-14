import { describe, expect, it } from 'vitest';
import { IeltsPairSeedSchema, countWords, type IeltsPairSeed, type IeltsTask } from '../../src/lib/ielts/types';
import { auditIeltsCorpusPair, findCorpusDuplicates } from '../lib/ielts-corpus-quality';

const terms = ['accessible', 'reliable', 'affordable', 'sustainable', 'effective', 'practical'];
const explanation = { zh: '具体说明句子表达与衔接方式的修改。', en: 'Explain the precise change to the expression and its connection.' };

// 仅用于测量结构边界的合成夹具，不是可发布范文。
function makePair(lowWords = 270, highWords = 285, task: IeltsTask = 'task2'): IeltsPairSeed {
  const sentence = (first: string, total: number, index: number) => {
    const length = Math.floor(total / 6) + (index < total % 6 ? 1 : 0);
    return [first, ...Array<string>(length - 1).fill('practice')].join(' ') + '.';
  };
  return {
    slug: 'corpus-quality-fixture', task, category: 'opinion', topic: 'education', status: 'draft', sortOrder: 0,
    content: {
      title: { zh: '结构验收测试夹具', en: 'Structural audit fixture' },
      prompt: { zh: '请讨论如何改进公共服务。', en: 'How can local public services be improved for residents?' },
      bandLow: 5, bandHigh: 8,
      segments: terms.map((term, index) => ({
        paragraph: Math.floor(index / 2) + 1,
        low: sentence('simple', lowWords, index), high: sentence(term, highWords, index),
        focus: ['lexis'], note: { ...explanation },
        translationZh: { low: '这是低版句子的完整中文译文。', high: '这是高版句子的完整中文译文。' },
        expressionEdits: [{ before: 'simple', after: term, focus: 'lexis', explanation: { ...explanation } }],
      })),
      criteria: (['TR', 'CC', 'LR', 'GRA'] as const).map(key => ({ key, note: { ...explanation } })),
      takeaways: { zh: ['保留论点。', '说明衔接。'], en: ['Retain the point.', 'Explain the connection.'] },
      learning: {
        taskAnalysis: { ...explanation },
        paragraphs: [1, 2, 3].map(paragraph => ({ paragraph, role: { zh: '展开', en: 'Development' }, analysis: { ...explanation } })),
        techniques: [0, 2, 4].map(segmentIndex => ({ segmentIndex, title: { zh: '词汇', en: 'Vocabulary' }, explanation: { ...explanation } })),
        mistakes: [{ ...explanation }, { ...explanation }],
        vocabulary: terms.map((term, segmentIndex) => ({
          term, segmentIndex, partOfSpeech: 'adjective', meaning: { zh: '表达含义', en: 'meaning' },
          usage: { ...explanation }, collocations: [`${term} services`], example: { zh: '服务需要改进。', en: `Services should be ${term}.` },
        })),
      },
    },
  };
}

describe('新增 IELTS 语料的离线完整性验收', () => {
  it.each([
    ['task2', 250, 250], ['task2', 300, 320], ['task2', 270, 250],
    ['task1-academic', 150, 150], ['task1-academic', 200, 230], ['task1-academic', 170, 150],
    ['task1-general', 150, 150], ['task1-general', 200, 230], ['task1-general', 170, 150],
  ] as const)('允许 %s 的合法边界 %i / %i', (task, low, high) => {
    const pair = makePair(low, high, task);
    expect(IeltsPairSeedSchema.safeParse(pair).success).toBe(true);
    expect(auditIeltsCorpusPair(pair)).toEqual([]);
  });

  it.each([
    ['task2', 249, 250, 'low'], ['task2', 301, 300, 'low'],
    ['task2', 250, 249, 'high'], ['task2', 300, 321, 'high'],
    ['task1-academic', 149, 150, 'low'], ['task1-academic', 201, 200, 'low'],
    ['task1-general', 150, 149, 'high'], ['task1-general', 200, 231, 'high'],
  ] as const)('拒绝 %s 的越界词数 %i / %i', (task, low, high, side) => {
    expect(auditIeltsCorpusPair(makePair(low, high, task)).some(error => error.startsWith(`content.segments.${side}:`))).toBe(true);
  });

  it('复用项目对连字符、撇号和数字的计数口径', () => {
    const pair = makePair(250, 250);
    pair.content.segments[0].low = pair.content.segments[0].low.replace('practice practice', "school-leavers don't") + ' 2026 10%';
    expect(countWords(pair.content.segments.map(segment => segment.low).join(' '))).toBe(250);
    expect(auditIeltsCorpusPair(pair)).toEqual([]);
  });

  it('保留最多短 20 词的完整性保护并明确非评分依据', () => {
    expect(auditIeltsCorpusPair(makePair(271, 250))).toEqual([expect.stringContaining('21 词，超过 20 词的内容完整性保护线（非评分依据）')]);
  });

  it('要求学习笔记、每句两版译文以及至少 12 字符的中英文说明', () => {
    const pair = makePair();
    delete pair.content.learning;
    delete pair.content.segments[0].translationZh;
    pair.content.segments[0].note = { zh: '太短', en: 'too short' };
    expect(auditIeltsCorpusPair(pair)).toEqual([
      expect.stringContaining('content.learning:'), expect.stringContaining('.0.translationZh:'),
      expect.stringContaining('.0.note.zh:'), expect.stringContaining('.0.note.en:'),
    ]);
  });

  it('要求每段至少一处真实表达块，但不要求每句都添加', () => {
    const pair = makePair();
    delete pair.content.segments[1].expressionEdits;
    expect(auditIeltsCorpusPair(pair)).toEqual([]);
    delete pair.content.segments[0].expressionEdits;
    expect(auditIeltsCorpusPair(pair)).toEqual([expect.stringContaining('paragraph.1:')]);
  });

  it('沿用阅读界面的重点数量与短语范围限制', () => {
    const pair = makePair();
    for (const segment of pair.content.segments.slice(0, 2)) {
      segment.expressionEdits!.push({ before: 'practice', after: 'practice practice', focus: 'lexis', explanation });
    }
    expect(auditIeltsCorpusPair(pair)).toEqual([expect.stringContaining('每段最多三处')]);
    const fullSentence = makePair(170, 180, 'task1-academic');
    fullSentence.content.segments[0].expressionEdits![0].after = fullSentence.content.segments[0].high;
    expect(auditIeltsCorpusPair(fullSentence)).toEqual([expect.stringContaining('不能重复整句')]);
  });

  it.each(['paragraphs', 'techniques', 'vocabulary', 'expressionEdits', 'translationZh', 'paragraphOrder'] as const)('沿用 schema 检查 %s', field => {
    const pair = makePair();
    if (field === 'paragraphs') pair.content.learning!.paragraphs.pop();
    if (field === 'techniques') pair.content.learning!.techniques[0].segmentIndex = 29;
    if (field === 'vocabulary') pair.content.learning!.vocabulary[0].term = 'unmentioned';
    if (field === 'expressionEdits') pair.content.segments[0].expressionEdits![0].before = 'unmentioned';
    if (field === 'translationZh') pair.content.segments[0].translationZh!.high = '   ';
    if (field === 'paragraphOrder') pair.content.segments[0].paragraph = 2;
    expect(IeltsPairSeedSchema.safeParse(pair).success).toBe(false);
    expect(auditIeltsCorpusPair(pair).length).toBeGreaterThan(0);
  });

  it('不能只改大小写和标点使整句看起来不同', () => {
    const pair = makePair();
    pair.content.segments[0].low = pair.content.segments[0].high.toUpperCase().replace('.', '!');
    delete pair.content.segments[0].expressionEdits;
    expect(auditIeltsCorpusPair(pair)).toEqual([expect.stringContaining('低高两版不能是同一个完整句子')]);
  });

  it('识别明确占位符，同时允许书信称呼和教学数字', () => {
    const pair = makePair(170, 180, 'task1-general');
    pair.content.segments[0].low = 'Dear Sir/Madam, ' + pair.content.segments[0].low + ' 2026 20%';
    expect(auditIeltsCorpusPair(pair)).toEqual([]);
    pair.content.title.en = 'TODO: final title';
    pair.content.segments[0].high += ' INSERT HERE';
    expect(auditIeltsCorpusPair(pair)).toEqual([expect.stringContaining('正文含占位符'), expect.stringContaining('标题含占位符')]);
  });

  it('验收不修改输入数据', () => {
    const pair = makePair();
    const before = structuredClone(pair);
    auditIeltsCorpusPair(pair);
    findCorpusDuplicates([pair]);
    expect(pair).toEqual(before);
  });
});

function withBody(slug: string, words: string[]): IeltsPairSeed {
  const pair = makePair(180, 200, 'task1-general');
  pair.slug = slug;
  pair.content.prompt.en = `Discuss the distinct issue identified as ${slug}.`;
  pair.content.segments.forEach((segment, index) => { segment.high = words.slice(index * 30, index === 5 ? undefined : (index + 1) * 30).join(' '); });
  return pair;
}

describe('IELTS 语料明显字面重复检测', () => {
  const words = Array.from({ length: 200 }, (_, index) => `word${index}`);

  it('规范化题干大小写、标点、空白和弯撇号后检测完全相同', () => {
    const first = makePair();
    const second = makePair();
    second.slug = 'another-fixture';
    first.content.prompt.en = "Should students' fees be reduced?";
    second.content.prompt.en = '  SHOULD students’ fees be reduced!  ';
    expect(findCorpusDuplicates([first, second])).toEqual([{ a: first.slug, b: second.slug, score: 1 }]);
  });

  it('重复 slug 即使题干正文不同也报告', () => {
    const first = withBody('same-slug', words);
    const second = withBody('same-slug', words.map(word => `other${word}`));
    second.content.prompt.en = 'Describe another completely different task.';
    expect(findCorpusDuplicates([first, second])).toEqual([{ a: 'same-slug', b: 'same-slug', score: 1 }]);
  });

  it('检测换题干但保留高版正文的复制稿，每对只报告一次', () => {
    expect(findCorpusDuplicates([withBody('body-one', words), withBody('body-two', words)])).toEqual([{ a: 'body-one', b: 'body-two', score: 1 }]);
  });

  it('只报告 Jaccard 严格大于 0.6 的五词连续片段重合', () => {
    const first = withBody('threshold-one', words);
    const changed = (sharedPrefix: number) => withBody('threshold-two', words.map((word, index) => index < sharedPrefix ? word : `other${word}`));
    expect(findCorpusDuplicates([first, changed(151)])).toEqual([]); // 147 / 245 = 0.6
    const duplicates = findCorpusDuplicates([first, changed(152)]);
    expect(duplicates).toHaveLength(1);
    expect(duplicates[0].score).toBeCloseTo(148 / 244);
  });

  it('不把共同主题词、短套语和空输入判作正文重复', () => {
    const first = withBody('theme-one', words);
    const second = withBody('theme-two', [...words].reverse());
    first.content.segments[0].high += ' I look forward to hearing from you.';
    second.content.segments[0].high += ' I look forward to hearing from you.';
    expect(findCorpusDuplicates([first, second])).toEqual([]);
    const closing = 'I look forward to hearing from you'.split(' ');
    expect(findCorpusDuplicates([withBody('letter-one', closing), withBody('letter-two', closing)])).toEqual([]);
    expect(findCorpusDuplicates([])).toEqual([]);
  });
});
