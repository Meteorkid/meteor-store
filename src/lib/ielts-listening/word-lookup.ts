import { z } from 'zod';
import {
  lookupWordTokens, normalizeLookupWord,
  LookupWordSchema, type WordLookupResult,
} from '@/lib/ielts/word-lookup';
import {
  ListeningLessonSlugSchema, ListeningSentenceIndexSchema, type ListeningLesson,
} from './types';

/**
 * 听力原文点词查词的请求与课内讲解卡。
 *
 * 锚点只有「原文句索引 + 单词」。词卡只在被点的词确实出自这一句时才给——
 * 同一个词在别句可能是另一个意思，把别句的词卡搬过来就是错的释义。
 */

export const ListeningWordLookupRequestSchema = z.object({
  slug: ListeningLessonSlugSchema,
  sentenceIndex: ListeningSentenceIndexSchema,
  word: LookupWordSchema,
}).strict();
export type ListeningWordLookupRequest = z.infer<typeof ListeningWordLookupRequestSchema>;

/** 点到的词正好是本句标注的生词：直接用课内词卡。 */
export function findListeningLessonWordMeaning(
  lesson: Pick<ListeningLesson, 'vocabulary' | 'expressions'>,
  input: Pick<ListeningWordLookupRequest, 'sentenceIndex' | 'word'>,
): WordLookupResult | null {
  const word = normalizeLookupWord(input.word);
  const item = lesson.vocabulary.find(entry => entry.sentenceIndex === input.sentenceIndex
    && normalizeLookupWord(entry.term) === word);
  if (item) {
    return { source: 'lesson', entry: {
      word, lemma: item.term, partOfSpeech: item.partOfSpeech,
      meaningZh: item.meaning.zh, usageZh: item.usage.zh,
    } };
  }
  // 词落在本句的词组里：给出词组的释义，并明说这是词组（lemma 是整个短语）。
  // 点 in hindsight 里的 hindsight，按单词直译反而是错的。
  const expression = lesson.expressions.find(entry => entry.sentenceIndex === input.sentenceIndex
    && lookupWordTokens(entry.phrase).some(token => token.word && normalizeLookupWord(token.text) === word));
  if (!expression) return null;
  return { source: 'lesson', entry: {
    word, lemma: expression.phrase, partOfSpeech: 'phrase',
    meaningZh: expression.meaning.zh, usageZh: expression.usage.zh,
  } };
}
