import { z } from 'zod';

/**
 * 雅思写作对照学习的内容协议。
 *
 * 一组对照 = 同一篇作文的两个版本：低分版（5 分档）与高分版（8 分档）。
 * **高分版是低分版的升级，不是另写一篇**：论点、顺序、例子必须一一对应，
 * 变的只有词汇、句式、衔接与任务回应的完整度。
 *
 * 为了让「左右对照」永远不会错位，正文不单独存两份，只存按段落编号的
 * 对齐句子（segments）；两版全文都由 segments 推导。改一句只改一处，
 * 不存在「左边改了右边没改」的中间状态。
 */

export const IELTS_TASKS = ['task2', 'task1-academic', 'task1-general'] as const;
export const IeltsTaskSchema = z.enum(IELTS_TASKS);
export type IeltsTask = z.infer<typeof IeltsTaskSchema>;

/** 升级维度：任务回应、衔接、词汇、语法、准确性。 */
export const IeltsFocusSchema = z.enum(['task', 'cohesion', 'lexis', 'grammar', 'accuracy']);
export type IeltsFocus = z.infer<typeof IeltsFocusSchema>;

/** 四项评分维度，与雅思写作评分标准同名（Task Response / Coherence / Lexical / Grammar）。 */
export const IeltsCriterionKeySchema = z.enum(['TR', 'CC', 'LR', 'GRA']);
export type IeltsCriterionKey = z.infer<typeof IeltsCriterionKeySchema>;

const bilingual = (max: number) => z.object({
  zh: z.string().trim().min(1).max(max),
  en: z.string().trim().min(1).max(max),
}).strict();

const BilingualTextSchema = bilingual(400);
const BilingualLongTextSchema = bilingual(1200);

/** 人工或生成阶段明确配对的表达块，不由字面差异算法推测语义关系。 */
export const IeltsExpressionEditSchema = z.object({
  before: z.string().trim().min(1).max(300),
  after: z.string().trim().min(1).max(300),
  focus: IeltsFocusSchema,
  explanation: BilingualTextSchema,
}).strict();
export type IeltsExpressionEdit = z.infer<typeof IeltsExpressionEditSchema>;

/** 讲解绑定到正文中的具体段落/句子，避免范文更新后仍显示另一篇的笔记。 */
export const IeltsLearningSchema = z.object({
  taskAnalysis: bilingual(1800),
  paragraphs: z.array(z.object({
    paragraph: z.number().int().min(1).max(8),
    role: bilingual(200),
    analysis: BilingualLongTextSchema,
  }).strict()).min(1).max(8),
  techniques: z.array(z.object({
    title: bilingual(200),
    explanation: BilingualLongTextSchema,
    segmentIndex: z.number().int().min(0).max(29),
  }).strict()).min(3).max(6),
  mistakes: z.array(BilingualLongTextSchema).min(2).max(5),
  vocabulary: z.array(z.object({
    term: z.string().trim().min(1).max(100),
    partOfSpeech: z.string().trim().min(1).max(60),
    meaning: bilingual(400),
    usage: bilingual(800),
    collocations: z.array(z.string().trim().min(1).max(120)).min(1).max(3),
    example: bilingual(600),
    segmentIndex: z.number().int().min(0).max(29),
  }).strict()).min(6).max(12),
}).strict();
export type IeltsLearning = z.infer<typeof IeltsLearningSchema>;

/**
 * 一个对齐句对：同一句话的两个版本 + 为什么这样改。
 * paragraph 从 1 开始，两版段落数必须一致（同一段里同一位置）。
 */
export const IeltsSegmentSchema = z.object({
  paragraph: z.number().int().min(1).max(8),
  low: z.string().trim().min(1).max(600),
  high: z.string().trim().min(1).max(600),
  focus: z.array(IeltsFocusSchema).min(1).max(3),
  note: BilingualTextSchema,
  expressionEdits: z.array(IeltsExpressionEditSchema).min(1).max(2).optional(),
  /** 两版分别翻译，保留原句立场、数量与限定；旧版正文允许尚无译文。 */
  translationZh: z.object({
    low: z.string().trim().min(1).max(1200),
    high: z.string().trim().min(1).max(1200),
  }).strict().optional(),
}).strict().superRefine((segment, context) => {
  segment.expressionEdits?.forEach((edit, index) => {
    if (!segment.low.includes(edit.before)) {
      context.addIssue({ code: 'custom', path: ['expressionEdits', index, 'before'], message: '原表达必须原样出现在本句低分版中' });
    }
    if (!segment.high.includes(edit.after)) {
      context.addIssue({ code: 'custom', path: ['expressionEdits', index, 'after'], message: '升级表达必须原样出现在本句高分版中' });
    }
    if (edit.before === edit.after) {
      context.addIssue({ code: 'custom', path: ['expressionEdits', index], message: '表达块必须包含实际改写' });
    }
  });
});
export type IeltsSegment = z.infer<typeof IeltsSegmentSchema>;

export const IeltsPairContentSchema = z.object({
  /** 题目：英文题干 + 中文说明（中文说明讲清题目要写什么） */
  prompt: z.object({ en: z.string().trim().min(10).max(1200), zh: z.string().trim().min(2).max(1200) }).strict(),
  title: BilingualTextSchema,
  bandLow: z.literal(5),
  bandHigh: z.literal(8),
  segments: z.array(IeltsSegmentSchema).min(6).max(30),
  /** 四条评分维度的整体对比说明，key 固定 TR/CC/LR/GRA，各一条 */
  criteria: z.array(z.object({ key: IeltsCriterionKeySchema, note: BilingualLongTextSchema }).strict()).length(4),
  /** 可以直接抄走的表达或写法，2–5 条 */
  takeaways: z.object({ zh: z.array(z.string().trim().min(2).max(200)).min(2).max(5), en: z.array(z.string().trim().min(2).max(200)).min(2).max(5) }).strict(),
  // 兼容已发布的旧 JSON；新生成内容和文件精选必须提供完整学习笔记。
  learning: IeltsLearningSchema.optional(),
}).strict().superRefine((value, context) => {
  const keys = value.criteria.map(item => item.key);
  if (new Set(keys).size !== keys.length) {
    context.addIssue({ code: 'custom', path: ['criteria'], message: '每条评分维度只能出现一次' });
  }
  // 段落编号必须从 1 开始连续递增：跳号会让左右两栏在渲染时对不齐
  const expected = [1, 2, 3, 4, 5, 6, 7, 8];
  const used = [...new Set(value.segments.map(segment => segment.paragraph))].sort((a, b) => a - b);
  if (used.some((paragraph, index) => paragraph !== expected[index])) {
    context.addIssue({ code: 'custom', path: ['segments'], message: '段落编号必须从 1 开始连续' });
  }
  const contiguous = value.segments.every((segment, index) => index === 0 || segment.paragraph >= value.segments[index - 1].paragraph);
  if (!contiguous) {
    context.addIssue({ code: 'custom', path: ['segments'], message: '段落编号必须按顺序排列' });
  }
  if (value.learning) {
    const annotated = value.learning.paragraphs.map(item => item.paragraph);
    if (annotated.length !== used.length || annotated.some((paragraph, index) => paragraph !== used[index])) {
      context.addIssue({ code: 'custom', path: ['learning', 'paragraphs'], message: '每个正文段落须按顺序有一条讲解' });
    }
    value.learning.techniques.forEach((item, index) => {
      if (!value.segments[item.segmentIndex]) {
        context.addIssue({ code: 'custom', path: ['learning', 'techniques', index, 'segmentIndex'], message: '讲解引用的句子不存在' });
      }
    });
    const terms = new Set<string>();
    value.learning.vocabulary.forEach((item, index) => {
      const term = item.term.toLowerCase();
      const sentence = value.segments[item.segmentIndex]?.high.toLowerCase();
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const wholeTerm = new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, 'u');
      if (!sentence || !wholeTerm.test(sentence)) {
        context.addIssue({ code: 'custom', path: ['learning', 'vocabulary', index], message: '生词必须原样出现在对应升级句中' });
      }
      if (terms.has(term)) context.addIssue({ code: 'custom', path: ['learning', 'vocabulary', index], message: '生词不可重复' });
      terms.add(term);
    });
  }
});
export type IeltsPairContent = z.infer<typeof IeltsPairContentSchema>;

/**
 * 数据库行的状态：draft = 后台草稿；published = 公开；hidden = 下架
 * （文件里那一组也会被一起藏掉，这就是「下架」的实现方式）。
 */
export const IeltsPairStatusSchema = z.enum(['draft', 'published', 'hidden']);
export type IeltsPairStatus = z.infer<typeof IeltsPairStatusSchema>;

/** 精选内容文件里只允许这两种：随代码上线的对照不存在「下架」状态。 */
export const IeltsPairSeedStatusSchema = z.enum(['draft', 'published']);

/**
 * 内容来源：curated = 仓库文件里的精选对照；generated = 后台生成的对照。
 * 只用于后台标注与统计，页面渲染一视同仁。
 */
export const IeltsPairSourceSchema = z.enum(['curated', 'generated']);
export type IeltsPairSource = z.infer<typeof IeltsPairSourceSchema>;

export const IeltsPairSlugSchema = z.string().trim().regex(/^[a-z0-9-]{3,60}$/, 'Invalid slug');

/** 仓库文件里一组精选对照的完整协议（含 slug 与状态，正文在 content 里）。 */
export const IeltsPairSeedSchema = z.object({
  slug: IeltsPairSlugSchema,
  task: IeltsTaskSchema,
  /** 题型：观点 / 讨论 / 问题解决 / 利弊；Task 1 用图表类型 */
  category: z.string().trim().min(1).max(40),
  topic: z.string().trim().min(1).max(40),
  status: IeltsPairSeedStatusSchema,
  sortOrder: z.number().int().min(0).max(9999),
  content: IeltsPairContentSchema,
}).strict();
export type IeltsPairSeed = z.infer<typeof IeltsPairSeedSchema>;

/** 一篇作文的段落数组（由对齐句对推导，两版一一对应）。 */
export function essayParagraphs(segments: IeltsSegment[], side: 'low' | 'high'): string[][] {
  const paragraphs: string[][] = [];
  for (const segment of segments) {
    const index = segment.paragraph - 1;
    while (paragraphs.length <= index) paragraphs.push([]);
    paragraphs[index].push(segment[side]);
  }
  return paragraphs;
}

export function essayText(segments: IeltsSegment[], side: 'low' | 'high'): string {
  return essayParagraphs(segments, side).map(paragraph => paragraph.join(' ')).join('\n\n');
}

/** 词数按雅思口径统计（字母词，连字符与撇号算同一个词）。 */
export function countWords(text: string): number {
  return (text.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) ?? []).length;
}

export const IELTS_FOCUS_LABELS: Record<IeltsFocus, { zh: string; en: string }> = {
  task: { zh: '任务回应', en: 'Task response' },
  cohesion: { zh: '衔接', en: 'Cohesion' },
  lexis: { zh: '词汇', en: 'Vocabulary' },
  grammar: { zh: '句式', en: 'Grammar' },
  accuracy: { zh: '准确性', en: 'Accuracy' },
};

export const IELTS_CRITERION_LABELS: Record<IeltsCriterionKey, { zh: string; en: string; short: { zh: string; en: string } }> = {
  TR: { zh: '任务回应', en: 'Task Response', short: { zh: 'TR', en: 'TR' } },
  CC: { zh: '连贯与衔接', en: 'Coherence & Cohesion', short: { zh: 'CC', en: 'CC' } },
  LR: { zh: '词汇资源', en: 'Lexical Resource', short: { zh: 'LR', en: 'LR' } },
  GRA: { zh: '语法多样性与准确性', en: 'Grammatical Range & Accuracy', short: { zh: 'GRA', en: 'GRA' } },
};
