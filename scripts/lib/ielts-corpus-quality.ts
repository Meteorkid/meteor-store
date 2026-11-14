import { IeltsPairSeedSchema, countWords, type IeltsPairSeed } from '../../src/lib/ielts/types.ts';

const PLACEHOLDER = /\b(?:TODO|TBD|INSERT\s+HERE|PLACEHOLDER|LOREM\s+IPSUM)\b/i;
const SHINGLE_SIZE = 5;
const DUPLICATE_THRESHOLD = 0.6;
const COMMON_SHINGLES = new Set([
  'it is widely believed that',
  'it is important to note',
  'i look forward to hearing',
  'look forward to hearing from',
  'forward to hearing from you',
  'do not hesitate to contact',
]);

function normalizeEnglish(value: string): string {
  return (value.normalize('NFKC').toLowerCase().replace(/[’‘]/g, "'").match(/[a-z0-9]+(?:['-][a-z0-9]+)*/g) ?? []).join(' ');
}

/**
 * 新增语料的离线结构与完整性验收；严格词数区间不追溯改写旧六篇。
 * 段落连续由 schema 验证，论证连贯、数据正确、译文忠实和评分仍需内容复核。
 */
export function auditIeltsCorpusPair(pair: IeltsPairSeed): string[] {
  const parsed = IeltsPairSeedSchema.safeParse(pair);
  if (!parsed.success) {
    return parsed.error.issues.map(issue => `${issue.path.join('.') || 'pair'}: ${issue.message}`);
  }

  const { task, content } = parsed.data;
  const errors: string[] = [];
  if (!content.learning) errors.push('content.learning: 新增语料必须提供完整学习笔记');

  const ranges = task === 'task2' ? { low: [250, 300], high: [250, 320] } : { low: [150, 200], high: [150, 230] };
  const wordCounts = {
    low: countWords(content.segments.map(segment => segment.low).join(' ')),
    high: countWords(content.segments.map(segment => segment.high).join(' ')),
  };
  for (const side of ['low', 'high'] as const) {
    const [min, max] = ranges[side];
    if (wordCounts[side] < min || wordCounts[side] > max) {
      errors.push(`content.segments.${side}: ${wordCounts[side]} 词，新增 ${task} 要求 ${min}–${max} 词`);
    }
  }
  // 只拦截可能的内容丢失；篇幅差异不能推出 IELTS 分数高低。
  if (wordCounts.high < wordCounts.low - 20) {
    errors.push(`content.segments.high: 高版比低版少 ${wordCounts.low - wordCounts.high} 词，超过 20 词的内容完整性保护线（非评分依据）`);
  }

  const paragraphsWithEdits = new Set<number>();
  const editCounts = new Map<number, number>();
  content.segments.forEach((segment, index) => {
    const path = `content.segments.${index}`;
    if (!segment.translationZh) errors.push(`${path}.translationZh: 两版中文译文必须完整`);
    for (const language of ['zh', 'en'] as const) {
      if (segment.note[language].length < 12) errors.push(`${path}.note.${language}: 每句说明至少 12 个字符`);
    }
    if (normalizeEnglish(segment.low) === normalizeEnglish(segment.high)) {
      errors.push(`${path}: 低高两版不能是同一个完整句子`);
    }
    if (segment.expressionEdits?.length) {
      paragraphsWithEdits.add(segment.paragraph);
      editCounts.set(segment.paragraph, (editCounts.get(segment.paragraph) ?? 0) + segment.expressionEdits.length);
      if (segment.expressionEdits.some(edit => edit.after.length >= segment.high.length)) {
        errors.push(`${path}.expressionEdits: 表达块应截取短语或分句，不能重复整句高版正文`);
      }
    }
    for (const side of ['low', 'high'] as const) {
      if (PLACEHOLDER.test(segment[side])) errors.push(`${path}.${side}: 正文含占位符`);
    }
  });
  for (const paragraph of new Set(content.segments.map(segment => segment.paragraph))) {
    if (!paragraphsWithEdits.has(paragraph)) errors.push(`content.segments.paragraph.${paragraph}: 每段至少需要一处 expressionEdits`);
    if ((editCounts.get(paragraph) ?? 0) > 3) errors.push(`content.segments.paragraph.${paragraph}: 每段最多三处表达重点`);
  }
  for (const language of ['zh', 'en'] as const) {
    if (PLACEHOLDER.test(content.title[language])) errors.push(`content.title.${language}: 标题含占位符`);
  }
  return errors;
}

function highEssayShingles(pair: IeltsPairSeed): Set<string> {
  const words = normalizeEnglish(pair.content.segments.map(segment => segment.high).join(' ')).split(' ').filter(Boolean);
  const shingles = new Set<string>();
  for (let index = 0; index <= words.length - SHINGLE_SIZE; index++) {
    const shingle = words.slice(index, index + SHINGLE_SIZE).join(' ');
    if (!COMMON_SHINGLES.has(shingle)) shingles.add(shingle);
  }
  return shingles;
}

/**
 * 仅找明显的字面重复，不判定语义重复、原创版权或外网来源。
 * score=1 也可能来自 slug/题干完全相同；其余为高版五词片段的 Jaccard。
 */
export function findCorpusDuplicates(pairs: IeltsPairSeed[]): Array<{ a: string; b: string; score: number }> {
  const entries = pairs.map(pair => ({
    slug: pair.slug.trim().toLowerCase(),
    prompt: normalizeEnglish(pair.content.prompt.en),
    shingles: highEssayShingles(pair),
  }));
  const duplicates: Array<{ a: string; b: string; score: number }> = [];
  for (let a = 0; a < entries.length; a++) {
    for (let b = a + 1; b < entries.length; b++) {
      const left = entries[a];
      const right = entries[b];
      const exactMatch = left.slug === right.slug || (left.prompt.length > 0 && left.prompt === right.prompt);
      let score = exactMatch ? 1 : 0;
      // 完整作文有足够多的片段；不把单句套语或短书信落款当作全文重复。
      if (!exactMatch && left.shingles.size >= 20 && right.shingles.size >= 20) {
        let intersection = 0;
        for (const shingle of left.shingles) if (right.shingles.has(shingle)) intersection++;
        score = intersection / (left.shingles.size + right.shingles.size - intersection);
      }
      if (score > DUPLICATE_THRESHOLD) duplicates.push({ a: pairs[a].slug, b: pairs[b].slug, score });
    }
  }
  return duplicates;
}
