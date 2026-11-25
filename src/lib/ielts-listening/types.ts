import { z } from 'zod';

/**
 * 雅思听力练习的内容协议。
 *
 * 一个练习单元 = 套题里的一个 Part（10 题）。每个 Part 自带逐句原文、答案与解析、
 * 词汇与词组讲解，所以它可以独立练习，也可以按套题连着做。
 *
 * 全文只有一种锚点：原文句索引（transcript 的下标）。答案的定位句、词汇卡与词组卡
 * 引用的原句、音频的逐句时间，全部指向它——原文改一句，解析和音频对不上的问题
 * 在协议层就会被拦下来，而不是上线后被读者发现。
 *
 * 考试材料（题目说明、题干、选项、原文）保持考试语言英文；讲解类内容双语。
 */

export const LISTENING_QUESTION_COUNT = 10;
export const LISTENING_PARTS = [1, 2, 3, 4] as const;
export type ListeningPart = (typeof LISTENING_PARTS)[number];

/** 每套题 40 题连续编号：Part 1 是 1–10，Part 2 是 11–20，Part 3 是 21–30，Part 4 是 31–40。 */
export function listeningFirstQuestionNumber(part: ListeningPart): number {
  return (part - 1) * LISTENING_QUESTION_COUNT + 1;
}

export const LISTENING_QUESTION_KINDS = ['completion', 'choice-single', 'choice-multiple', 'matching'] as const;
export type ListeningQuestionKind = (typeof LISTENING_QUESTION_KINDS)[number];

const QuestionNumberSchema = z.number().int().min(1).max(LISTENING_PARTS.length * LISTENING_QUESTION_COUNT);
export const ListeningSentenceIndexSchema = z.number().int().min(0).max(499);

const HAN = /\p{Script=Han}/u;
const LATIN = /[A-Za-z]/;
const zhText = (max: number) => z.string().trim().min(1).max(max).regex(HAN, '缺少中文说明');
const enText = (max: number) => z.string().trim().min(1).max(max).regex(LATIN, '缺少英文说明');

export interface ListeningBilingual { zh: string; en: string }

const bilingual = (max: number) => z.object({ zh: zhText(max), en: enText(max) }).strict();

/** 例句：英文原句 + 中文译文。 */
const example = () => z.object({
  en: z.string().trim().min(3).max(400),
  zh: zhText(400),
}).strict();

/** 说话人：原文标签、性别与离线合成用的音色。浏览器朗读只能按性别挑音色。 */
export const ListeningCastSchema = z.object({
  id: z.string().trim().regex(/^[a-z][a-z0-9-]{0,30}$/, 'Invalid speaker id'),
  label: z.string().trim().min(2).max(40).regex(/^[A-Z][A-Z '&-]*$/, '说话人标签使用大写英文'),
  gender: z.enum(['female', 'male']),
  voice: z.string().trim().min(2).max(60),
}).strict();
export type ListeningCast = z.infer<typeof ListeningCastSchema>;

/** 原文中的一句话。按句存储，句索引是全篇唯一的定位方式。 */
export const ListeningUtteranceSchema = z.object({
  speaker: z.string().trim().min(1).max(40),
  text: z.string().trim().min(2).max(400).regex(LATIN, '原文必须是英文').regex(/^[^\n\r]+$/, '一句话内不能换行'),
}).strict();
export type ListeningUtterance = z.infer<typeof ListeningUtteranceSchema>;

/** 填空题的词数限制，与雅思试卷上的写法逐字一致。 */
export const LISTENING_WORD_LIMITS = [
  'ONE WORD AND/OR A NUMBER',
  'NO MORE THAN ONE WORD AND/OR A NUMBER',
  'NO MORE THAN TWO WORDS AND/OR A NUMBER',
  'NO MORE THAN THREE WORDS AND/OR A NUMBER',
  'NO MORE THAN TWO WORDS',
  'NO MORE THAN THREE WORDS',
] as const;
export type ListeningWordLimit = (typeof LISTENING_WORD_LIMITS)[number];
export const ListeningWordLimitSchema = z.enum(LISTENING_WORD_LIMITS);

export interface ListeningWordLimitRule { maxWords: number; allowNumber: boolean }

/** 试卷规则：数字不占词数，但 "AND/OR A NUMBER" 最多额外允许一个数字。 */
export const LISTENING_WORD_LIMIT_RULES: Record<ListeningWordLimit, ListeningWordLimitRule> = {
  'ONE WORD AND/OR A NUMBER': { maxWords: 1, allowNumber: true },
  'NO MORE THAN ONE WORD AND/OR A NUMBER': { maxWords: 1, allowNumber: true },
  'NO MORE THAN TWO WORDS AND/OR A NUMBER': { maxWords: 2, allowNumber: true },
  'NO MORE THAN THREE WORDS AND/OR A NUMBER': { maxWords: 3, allowNumber: true },
  'NO MORE THAN TWO WORDS': { maxWords: 2, allowNumber: false },
  'NO MORE THAN THREE WORDS': { maxWords: 3, allowNumber: false },
};

const OptionSchema = z.object({
  key: z.string().regex(/^[A-H]$/),
  text: z.string().trim().min(1).max(300),
}).strict();
export type ListeningOption = z.infer<typeof OptionSchema>;

/**
 * 填空题的版面：行（可带行首标签，如表单字段名或表格首列）+ 单元格。
 * 单元格是「文字 or 空位」的序列，空位带题号。笔记、表单、表格、句子完成共用这一种。
 */
const CompletionSegmentSchema = z.union([
  z.object({ text: z.string().trim().min(1).max(400) }).strict(),
  z.object({ blank: QuestionNumberSchema }).strict(),
]);
export type ListeningCompletionSegment = z.infer<typeof CompletionSegmentSchema>;

/** 行首标签：表单字段名或表格首列。首列本身也可能是空位，例如 "Name of course: ___"。 */
const CompletionLeadSchema = z.union([
  z.string().trim().min(1).max(200),
  z.object({ blank: QuestionNumberSchema }).strict(),
]);
export type ListeningCompletionLead = z.infer<typeof CompletionLeadSchema>;

const CompletionRowSchema = z.object({
  lead: CompletionLeadSchema.optional(),
  cells: z.array(z.array(CompletionSegmentSchema).max(8)).min(1).max(6),
}).strict();
export type ListeningCompletionRow = z.infer<typeof CompletionRowSchema>;

export const ListeningCompletionSectionSchema = z.object({
  kind: z.literal('completion'),
  /** 试卷上的完整说明，含词数限制，例如 "Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer." */
  instruction: z.string().trim().min(3).max(300),
  wordLimit: ListeningWordLimitSchema,
  /** 表格的列标题（含首列）；给出后每行的 lead 对应首列、cells 对应其余各列。 */
  columns: z.array(z.string().trim().min(1).max(120)).min(2).max(5).optional(),
  rows: z.array(CompletionRowSchema).min(1).max(40),
}).strict();
export type ListeningCompletionSection = z.infer<typeof ListeningCompletionSectionSchema>;

export const ListeningChoiceSingleSectionSchema = z.object({
  kind: z.literal('choice-single'),
  instruction: z.string().trim().min(3).max(300),
  questions: z.array(z.object({
    number: QuestionNumberSchema,
    stem: z.string().trim().min(3).max(400),
    options: z.array(OptionSchema).min(2).max(5),
  }).strict()).min(1).max(6),
}).strict();
export type ListeningChoiceSingleSection = z.infer<typeof ListeningChoiceSingleSectionSchema>;

/** 多选题：共用一个题干，占用连续 select 个题号，每个题号填一个字母。 */
export const ListeningChoiceMultipleSectionSchema = z.object({
  kind: z.literal('choice-multiple'),
  instruction: z.string().trim().min(3).max(400),
  select: z.union([z.literal(2), z.literal(3)]),
  stem: z.string().trim().min(3).max(600),
  options: z.array(OptionSchema).min(3).max(8),
}).strict();
export type ListeningChoiceMultipleSection = z.infer<typeof ListeningChoiceMultipleSectionSchema>;

/** 配对题：左列每题从同一个选项库里选一个字母。 */
export const ListeningMatchingSectionSchema = z.object({
  kind: z.literal('matching'),
  instruction: z.string().trim().min(3).max(400),
  options: z.array(OptionSchema).min(2).max(8),
  items: z.array(z.object({
    number: QuestionNumberSchema,
    text: z.string().trim().min(1).max(300),
  }).strict()).min(2).max(6),
}).strict();
export type ListeningMatchingSection = z.infer<typeof ListeningMatchingSectionSchema>;

export const ListeningSectionSchema = z.discriminatedUnion('kind', [
  ListeningCompletionSectionSchema,
  ListeningChoiceSingleSectionSchema,
  ListeningChoiceMultipleSectionSchema,
  ListeningMatchingSectionSchema,
]);
export type ListeningSection = z.infer<typeof ListeningSectionSchema>;

export const ListeningAnswerSchema = z.object({
  number: QuestionNumberSchema,
  /** 第一个是对答案时展示的标准答案，其余是同样得分的写法（英式/美式拼写等）。 */
  accepted: z.array(z.string().trim().min(1).max(80)).min(1).max(6),
  /** 答案在原文里的书写形式；答案写成数字或符号而原文用英文数词时必须提供，例如 9.30 ↔ nine thirty。 */
  spoken: z.string().trim().min(1).max(80).optional(),
  evidence: ListeningSentenceIndexSchema,
  explanation: bilingual(900),
}).strict();
export type ListeningAnswer = z.infer<typeof ListeningAnswerSchema>;

export const ListeningVocabularySchema = z.object({
  term: z.string().trim().min(1).max(64),
  phonetic: z.string().trim().min(2).max(60).optional(),
  partOfSpeech: z.string().trim().min(1).max(20),
  meaning: bilingual(400),
  usage: bilingual(800),
  collocations: z.array(z.string().trim().min(1).max(120)).min(1).max(4),
  example: example(),
  /** 听力专属提示：重音、连读、易混词、在录音里听起来像什么。 */
  listening: bilingual(500).optional(),
  sentenceIndex: ListeningSentenceIndexSchema,
}).strict();
export type ListeningVocabulary = z.infer<typeof ListeningVocabularySchema>;

export const ListeningExpressionSchema = z.object({
  phrase: z.string().trim().min(2).max(120),
  meaning: bilingual(400),
  usage: bilingual(800),
  example: example(),
  sentenceIndex: ListeningSentenceIndexSchema,
}).strict();
export type ListeningExpression = z.infer<typeof ListeningExpressionSchema>;

export const ListeningTipSchema = z.object({
  title: bilingual(120),
  body: bilingual(800),
}).strict();
export type ListeningTip = z.infer<typeof ListeningTipSchema>;

/** 音频清单里的一条：对象 key、时长与逐句时间，由离线合成脚本写入。 */
export const ListeningAudioSchema = z.object({
  key: z.string().regex(/^ielts-listening\/test-\d{2}-part-[1-4]\/[a-f0-9]{16}\.mp3$/),
  durationSec: z.number().positive().max(60 * 60),
  /** 原文指纹；与当前原文不一致的音频视为过期，页面改用朗读而不是播放旧录音。 */
  transcriptHash: z.string().regex(/^[a-f0-9]{16}$/),
  /** 每句的 [起, 止]（秒），与 transcript 等长。 */
  cues: z.array(z.tuple([z.number().nonnegative(), z.number().positive()])).max(500),
  generatedAt: z.string().trim().min(10).max(40),
}).strict();
export type ListeningAudio = z.infer<typeof ListeningAudioSchema>;

export const ListeningLessonSlugSchema = z.string().regex(/^test-\d{2}-part-[1-4]$/, 'Invalid lesson slug');
export const ListeningTestSlugSchema = z.string().regex(/^test-\d{2}$/, 'Invalid test slug');

export const ListeningLessonSchema = z.object({
  slug: ListeningLessonSlugSchema,
  part: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  status: z.enum(['published', 'draft']),
  title: bilingual(120),
  summary: bilingual(400),
  /** 口音说明，例如 British and Australian accents。 */
  accent: bilingual(200).optional(),
  /** 离线合成的语速偏移，例如 +8%。省略时用默认语速。 */
  speechRate: z.string().regex(/^[+-]\d{1,2}%$/).optional(),
  cast: z.array(ListeningCastSchema).min(1).max(5),
  sections: z.array(ListeningSectionSchema).min(1).max(4),
  answers: z.array(ListeningAnswerSchema).length(LISTENING_QUESTION_COUNT),
  transcript: z.array(ListeningUtteranceSchema).min(10).max(500),
  vocabulary: z.array(ListeningVocabularySchema).min(4).max(16),
  expressions: z.array(ListeningExpressionSchema).min(3).max(14),
  tips: z.array(ListeningTipSchema).max(4).optional(),
}).strict().superRefine((lesson, context) => {
  const issue = (path: (string | number)[], message: string) => context.addIssue({ code: 'custom', path, message });

  if (!lesson.slug.endsWith(`part-${lesson.part}`)) issue(['slug'], 'slug 必须以 part-N 结尾且与 part 一致');

  const speakerIds = new Set<string>();
  lesson.cast.forEach((member, index) => {
    if (speakerIds.has(member.id)) issue(['cast', index, 'id'], '说话人 id 不可重复');
    speakerIds.add(member.id);
  });
  lesson.transcript.forEach((utterance, index) => {
    if (!speakerIds.has(utterance.speaker)) issue(['transcript', index, 'speaker'], `说话人 ${utterance.speaker} 不在 cast 中`);
  });

  // ---- 题号：按试卷顺序从本 Part 的起始题号连续覆盖 10 题，每个题号只出现一次 ----
  // 填空与单选/配对的题号写在内容里，多选由起点推导；无论哪种，都必须严格等于 first, first+1, …
  const first = listeningFirstQuestionNumber(lesson.part);
  const answerByNumber = new Map(lesson.answers.map(answer => [answer.number, answer] as const));
  const placed: ListeningQuestionLocation[] = [];
  let expected = first;
  lesson.sections.forEach((section, sectionIndex) => {
    sectionQuestionNumbers(section, expected).forEach(number => {
      if (number !== expected) issue(['sections', sectionIndex], `题号必须从 ${first} 连续递增：第 ${expected} 题的位置写的是 ${number}`);
      expected += 1;
      placed.push({ number, sectionIndex });
    });
  });
  if (placed.length !== LISTENING_QUESTION_COUNT) {
    issue(['sections'], `一个 Part 必须正好 ${LISTENING_QUESTION_COUNT} 题，现在是 ${placed.length} 题`);
  }

  lesson.answers.forEach((answer, index) => {
    if (answer.number !== first + index) issue(['answers', index, 'number'], `答案必须按题号 ${first}..${first + LISTENING_QUESTION_COUNT - 1} 顺序排列`);
  });

  const sentenceAt = (index: number) => lesson.transcript[index]?.text ?? '';
  lesson.answers.forEach((answer, index) => {
    const forms = new Set(answer.accepted.map(looseKey));
    if (forms.size !== answer.accepted.length) issue(['answers', index, 'accepted'], '可接受答案重复');
    const sectionIndex = placed.find(item => item.number === answer.number)?.sectionIndex;
    if (sectionIndex === undefined) return;
    const block = lesson.sections[sectionIndex];
    if (block.kind === 'completion') {
      const rule = LISTENING_WORD_LIMIT_RULES[block.wordLimit];
      answer.accepted.forEach((form, formIndex) => {
        if (!answerFitsWordLimit(form, rule)) issue(['answers', index, 'accepted', formIndex], `「${form}」超出词数限制 ${block.wordLimit}`);
      });
      const written = [answer.spoken ?? '', ...answer.accepted];
      const sentence = sentenceAt(answer.evidence);
      if (!written.some(form => form && answerInSentence(sentence, form))) {
        issue(['answers', index, 'evidence'], `答案「${answer.accepted[0]}」没有出现在第 ${answer.evidence} 句原文中`);
      }
    } else {
      const available = optionKeysFor(block);
      const letters = answer.accepted.map(letterKey);
      if (answer.accepted.length !== 1 || letters.some(letter => !available.includes(letter))) {
        issue(['answers', index, 'accepted'], `答案必须是选项字母（${available.join('')}）`);
      }
    }
    if (answer.evidence >= lesson.transcript.length) issue(['answers', index, 'evidence'], '定位句不存在');
  });

  // 选择题的答案字母在整份内容里不应与填空答案混淆，这里只约束版面本身
  lesson.sections.forEach((section, sectionIndex) => {
    const keys = optionKeysFor(section);
    if (keys.length && keys.join('') !== 'ABCDEFGHIJ'.slice(0, keys.length)) {
      issue(['sections', sectionIndex, 'options'], '选项字母必须从 A 开始连续');
    }
    if (section.kind === 'choice-single') {
      const sizes = new Set(section.questions.map(question => question.options.length));
      if (sizes.size > 1) issue(['sections', sectionIndex, 'questions'], '同一题块的选项数量必须一致');
    }
    if (section.kind === 'completion') {
      const width = section.columns ? section.columns.length - 1 : 1;
      section.rows.forEach((row, rowIndex) => {
        if (row.cells.length !== width) issue(['sections', sectionIndex, 'rows', rowIndex], `每行必须有 ${width} 个单元格`);
        if (section.columns && row.lead === undefined) issue(['sections', sectionIndex, 'rows', rowIndex, 'lead'], '表格的每一行都需要首列（文字或空位）');
      });
    }
  });

  // ---- 录音顺序：题块按出现顺序对应原文，配对题块内部允许打乱 ----
  // 以上一个题块最末的定位句为界：同一句可以同时是两道题的答案句，但不能倒回去。
  let previousEnd = 0;
  lesson.sections.forEach((section, sectionIndex) => {
    const evidences = placed.filter(item => item.sectionIndex === sectionIndex).map(item => answerByNumber.get(item.number)?.evidence ?? Number.NaN);
    const start = Math.min(...evidences);
    if (Number.isFinite(start) && start < previousEnd) {
      issue(['sections', sectionIndex], '题块的定位句早于上一个题块：题目顺序应与录音顺序一致');
    }
    if (Number.isFinite(start)) previousEnd = Math.max(previousEnd, Math.max(...evidences));
  });

  // 多选题：各题号的答案字母不能相同
  lesson.sections.forEach((section, sectionIndex) => {
    if (section.kind !== 'choice-multiple') return;
    const startNumber = placed.find(item => item.sectionIndex === sectionIndex)?.number;
    if (startNumber === undefined) return;
    const letters = Array.from({ length: section.select }, (_, offset) => letterKey(answerByNumber.get(startNumber + offset)?.accepted[0] ?? ''));
    if (new Set(letters).size !== letters.length) issue(['answers'], '多选题各题号的字母不可重复');
  });

  // ---- 词汇与词组必须原样出现在所引原句中 ----
  const terms = new Set<string>();
  lesson.vocabulary.forEach((item, index) => {
    const sentence = sentenceAt(item.sentenceIndex);
    if (item.sentenceIndex >= lesson.transcript.length || !wordInSentence(sentence, item.term)) {
      issue(['vocabulary', index, 'term'], `生词「${item.term}」没有出现在第 ${item.sentenceIndex} 句原文中`);
    }
    const key = item.term.toLowerCase();
    if (terms.has(key)) issue(['vocabulary', index, 'term'], '生词不可重复');
    terms.add(key);
  });
  const phrases = new Set<string>();
  lesson.expressions.forEach((item, index) => {
    const sentence = sentenceAt(item.sentenceIndex);
    if (item.sentenceIndex >= lesson.transcript.length || !answerInSentence(sentence, item.phrase)) {
      issue(['expressions', index, 'phrase'], `词组「${item.phrase}」没有出现在第 ${item.sentenceIndex} 句原文中`);
    }
    const key = item.phrase.toLowerCase();
    if (phrases.has(key)) issue(['expressions', index, 'phrase'], '词组不可重复');
    phrases.add(key);
  });
});
export type ListeningLesson = z.infer<typeof ListeningLessonSchema>;

export const ListeningTestSchema = z.object({
  slug: ListeningTestSlugSchema,
  title: bilingual(80),
  description: bilingual(400),
  sortOrder: z.number().int().min(0).max(9999),
}).strict();
export type ListeningTest = z.infer<typeof ListeningTestSchema>;

// ---------------------------------------------------------------------------
// 纯函数：题号遍历、答案规范化与判分。服务端入库前用同一套规则重新判分。
// ---------------------------------------------------------------------------

/** 一个题块从 first 开始依次占用哪些题号。行首空位排在该行其他空位之前。 */
export function sectionQuestionNumbers(section: ListeningSection, first: number): number[] {
  switch (section.kind) {
    case 'completion':
      return section.rows.flatMap(row => [
        ...(row.lead !== undefined && typeof row.lead !== 'string' ? [row.lead.blank] : []),
        ...row.cells.flatMap(cell => cell.flatMap(segment => 'blank' in segment ? [segment.blank] : [])),
      ]);
    case 'choice-single':
      return section.questions.map(question => question.number);
    case 'choice-multiple':
      return Array.from({ length: section.select }, (_, offset) => first + offset);
    case 'matching':
      return section.items.map(item => item.number);
  }
}

function optionKeysFor(section: ListeningSection): string[] {
  switch (section.kind) {
    case 'choice-single': return section.questions[0]?.options.map(option => option.key) ?? [];
    case 'choice-multiple':
    case 'matching': return section.options.map(option => option.key);
    default: return [];
  }
}

export interface ListeningQuestionLocation { number: number; sectionIndex: number }

/** 每个题号所在的题块，按题号升序。协议保证恰好 10 条，题号从本 Part 的起始题号开始。 */
export function listeningQuestionLocations(lesson: Pick<ListeningLesson, 'sections' | 'part'>): ListeningQuestionLocation[] {
  let cursor = listeningFirstQuestionNumber(lesson.part);
  return lesson.sections.flatMap((section, sectionIndex) => {
    const numbers = sectionQuestionNumbers(section, cursor);
    cursor = numbers.at(-1)! + 1;
    return numbers.map(number => ({ number, sectionIndex }));
  });
}

/** 题号对应的题型。 */
export function listeningQuestionKind(lesson: Pick<ListeningLesson, 'sections' | 'part'>, number: number): ListeningQuestionKind {
  const location = listeningQuestionLocations(lesson).find(item => item.number === number);
  return location ? lesson.sections[location.sectionIndex].kind : 'completion';
}

/**
 * 错题重练的范围：题目必须属于本课；多选题只勾了一部分时补齐整组，
 * 因为判分按整组算，只练其中一题没有意义。客户端按同一规则收窄题目。
 */
export function normalizeListeningScope(lesson: Pick<ListeningLesson, 'sections' | 'part'>, scope: number[]): number[] {
  const first = listeningFirstQuestionNumber(lesson.part);
  const last = first + LISTENING_QUESTION_COUNT - 1;
  const wanted = new Set(scope.filter(number => Number.isInteger(number) && number >= first && number <= last));
  const locations = listeningQuestionLocations(lesson);
  lesson.sections.forEach((section, sectionIndex) => {
    if (section.kind !== 'choice-multiple') return;
    const numbers = locations.filter(item => item.sectionIndex === sectionIndex).map(item => item.number);
    if (numbers.some(number => wanted.has(number))) numbers.forEach(number => wanted.add(number));
  });
  return [...wanted].sort((a, b) => a - b);
}

/** 统一大小写、各种撇号与破折号、空白和句末标点。 */
export function normalizeListeningAnswer(value: string): string {
  return value.normalize('NFKC').toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/[‐‑‒–—―]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.!?,;:]+$/g, '');
}

/** 再去掉空格、连字符与括号/货币符号：check in / check-in、(£)9.30 / 9.30 视为同一种写法。 */
export function looseKey(value: string): string {
  return normalizeListeningAnswer(value).replace(/[\s\-()（）$£€¥]+/g, '');
}

/** 选项字母：a、(B)、B. 都归一成 A–H。 */
export function letterKey(value: string): string {
  return value.normalize('NFKC').toUpperCase().replace(/[^A-Z]/g, '');
}

export interface ListeningWordLimitFit { tokens: number; words: number; numbers: number; fits: boolean }

/**
 * 数一数答案占了多少"词"。含字母的写法各算一个词；£15、9.30、20% 这类纯数字写法
 * 在 "AND/OR A NUMBER" 的限制里总共只能出现一个，在不带数字的限制里每个算一个词。
 */
export function measureAnswerWords(answer: string, rule: ListeningWordLimitRule): ListeningWordLimitFit {
  const tokens = answer.trim().split(/\s+/).filter(Boolean);
  const words = tokens.filter(token => /[A-Za-z]/.test(token)).length;
  const numbers = tokens.length - words;
  const fits = words <= rule.maxWords && numbers <= (rule.allowNumber ? 1 : rule.maxWords);
  return { tokens: tokens.length, words, numbers, fits };
}

export function answerFitsWordLimit(answer: string, rule: ListeningWordLimitRule): boolean {
  return answer.length > 0 && measureAnswerWords(answer, rule).fits;
}

const TOKEN = /[a-z0-9]+(?:['’-][a-z0-9]+)*/g;

function tokensOf(value: string): string[] {
  return value.normalize('NFKC').toLowerCase().match(TOKEN) ?? [];
}

/** 整个答案（可以由多个词组成）是否作为连续的词出现在句子里。 */
export function answerInSentence(sentence: string, answer: string): boolean {
  const needle = tokensOf(answer).map(looseKey).filter(Boolean);
  if (!needle.length) return false;
  const haystack = tokensOf(sentence).map(looseKey);
  return haystack.some((_, start) => needle.every((token, offset) => haystack[start + offset] === token));
}

/** 单个词是否作为完整的词出现（art 不会匹配 part）。两边都先归一再比，连字符词按一个词算。 */
export function wordInSentence(sentence: string, word: string): boolean {
  const needle = tokensOf(word).map(looseKey);
  if (needle.length !== 1) return answerInSentence(sentence, word);
  return tokensOf(sentence).map(looseKey).includes(needle[0]);
}

export interface ListeningQuestionResult {
  number: number;
  correct: boolean;
  /** 对答案时展示的写法 */
  accepted: string;
}

export interface ListeningGrade {
  score: number;
  total: number;
  results: ListeningQuestionResult[];
}

/**
 * 判分。scope 是本次实际作答的题号（错题重练时只含部分题目）；
 * 多选题按考试规则整组计分——字母全部选对才得分，否则该组每个题号都算错。
 */
export function gradeListening(
  lesson: Pick<ListeningLesson, 'sections' | 'answers' | 'part'>,
  input: Record<string, string>,
  scope?: number[],
): ListeningGrade {
  const locations = listeningQuestionLocations(lesson);
  const wanted = new Set(scope ?? locations.map(item => item.number));
  const results = new Map<number, ListeningQuestionResult>();
  const valueFor = (number: number) => input[String(number)] ?? '';
  const answerFor = (number: number) => lesson.answers.find(answer => answer.number === number) ?? lesson.answers[0];

  lesson.sections.forEach((section, sectionIndex) => {
    const numbers = locations.filter(item => item.sectionIndex === sectionIndex).map(item => item.number);
    if (!numbers.some(number => wanted.has(number))) return;
    if (section.kind === 'choice-multiple') {
      // 只重练多选题组的一部分没有意义：协议要求要么整组都在，要么整组都不在
      const complete = numbers.every(number => wanted.has(number));
      const expected = new Set(numbers.map(number => letterKey(answerFor(number).accepted[0])));
      const picked = new Set(numbers.map(number => letterKey(valueFor(number))).filter(Boolean));
      const correct = complete && picked.size === expected.size && [...picked].every(letter => expected.has(letter));
      numbers.forEach(number => {
        if (!wanted.has(number)) return;
        results.set(number, { number, correct, accepted: answerFor(number).accepted[0] });
      });
      return;
    }
    const rule = section.kind === 'completion' ? LISTENING_WORD_LIMIT_RULES[section.wordLimit] : null;
    numbers.forEach(number => {
      if (!wanted.has(number)) return;
      const answer = answerFor(number);
      // 填空按宽松书写比较（大小写、空格与连字符、括号与货币符号不计）；
      // 选择与配对只看字母。空作答永远不得分。
      const value = looseKey(valueFor(number));
      const correct = value !== '' && (rule
        ? answer.accepted.some(form => looseKey(form) === value)
        : letterKey(valueFor(number)) === letterKey(answer.accepted[0]));
      results.set(number, { number, correct, accepted: answer.accepted[0] });
    });
  });
  const ordered = [...wanted].sort((a, b) => a - b).flatMap(number => results.get(number) ?? []);
  return { score: ordered.filter(item => item.correct).length, total: ordered.length, results: ordered };
}

/** 原文词数（雅思口径：字母词，连字符与撇号算同一个词）。 */
export function countListeningWords(lesson: Pick<ListeningLesson, 'transcript'>): number {
  return lesson.transcript.reduce((sum, utterance) => sum + (utterance.text.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) ?? []).length, 0);
}

/** 一句原文的词数，用来看句子是否长到不适合逐句朗读。 */
export function countListeningSentenceWords(sentence: string): number {
  return (sentence.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) ?? []).length;
}
