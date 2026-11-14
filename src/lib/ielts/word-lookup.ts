import { z } from 'zod';
import { IeltsPairSlugSchema, type IeltsPairContent } from './types';

const WORD_PATTERN = /^\p{Script=Latin}+(?:['’-]\p{Script=Latin}+)*$/u;
export function normalizeLookupWord(word: string): string {
  return word.trim().replace(/[’]/g, "'").replace(/[‐‑]/g, '-').toLowerCase();
}

export const WordLookupRequestSchema = z.object({
  slug: IeltsPairSlugSchema,
  segmentIndex: z.number().int().min(0).max(29),
  side: z.enum(['low', 'high']),
  word: z.string().trim().min(1).max(64).transform(normalizeLookupWord)
    .refine(word => WORD_PATTERN.test(word), 'Invalid English word'),
}).strict();
export type WordLookupRequest = z.infer<typeof WordLookupRequestSchema>;

export const WordMeaningSchema = z.object({
  word: z.string().trim().min(1).max(64),
  lemma: z.string().trim().min(1).max(80),
  partOfSpeech: z.string().trim().min(1).max(80),
  meaningZh: z.string().trim().min(1).max(400).regex(/[\p{Script=Han}]/u),
  usageZh: z.string().trim().max(800),
}).strict();
export type WordMeaning = z.infer<typeof WordMeaningSchema>;
export const WordLookupResultSchema = z.object({
  entry: WordMeaningSchema,
  source: z.enum(['lesson', 'ai']),
  saveToken: z.string().max(16 * 1024).optional(),
  sourceKey: z.string().regex(/^[a-f0-9]{64}$/).optional(),
}).strict();
export type WordLookupResult = z.infer<typeof WordLookupResultSchema>;

/** 同一分词规则用于可点击文本和服务端校验；数字不查询，连字符词与缩写保持整体。 */
export function lookupWordTokens(text: string): { text: string; word: boolean }[] {
  const result: { text: string; word: boolean }[] = [];
  const pattern = /\p{Script=Latin}+(?:['’‐‑-]\p{Script=Latin}+)*/gu;
  let previous = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index!;
    if (index > previous) result.push({ text: text.slice(previous, index), word: false });
    // 不从 2020s、UTF8 等数字标识里摘出伪单词。
    const touchesNumber = /\d/.test(text[index - 1] ?? '') || /\d/.test(text[index + match[0].length] ?? '');
    result.push({ text: match[0], word: !touchesNumber && match[0].length <= 64 });
    previous = index + match[0].length;
  }
  if (previous < text.length) result.push({ text: text.slice(previous), word: false });
  return result;
}

export function sentenceContainsWord(sentence: string, word: string): boolean {
  const normalized = normalizeLookupWord(word);
  return lookupWordTokens(sentence).some(token => token.word && normalizeLookupWord(token.text) === normalized);
}

/** 教学词卡只适用于被标注的升级句，不能把一个短语的译义冒充其中某个词。 */
export function findLessonWordMeaning(content: IeltsPairContent, input: WordLookupRequest): WordLookupResult | null {
  if (input.side !== 'high') return null;
  const word = normalizeLookupWord(input.word);
  const item = content.learning?.vocabulary.find(item => item.segmentIndex === input.segmentIndex && normalizeLookupWord(item.term) === word);
  if (!item) return null;
  return { source: 'lesson', entry: {
    word, lemma: item.term, partOfSpeech: item.partOfSpeech,
    meaningZh: item.meaning.zh, usageZh: item.usage.zh,
  } };
}
