import { issueVocabularyReceipt } from '@/lib/ielts/vocabulary-receipt';
import {
  sentenceContainsWord, WordLookupResultSchema, type WordLookupResult,
} from '@/lib/ielts/word-lookup';
import { WordLookupError, requestMeaningCached } from '@/lib/ielts/word-lookup-service';
import { getListeningLesson } from './catalog';
import { findListeningLessonWordMeaning, ListeningWordLookupRequestSchema } from './word-lookup';

/**
 * 听力原文点词查词：课内词卡优先，其余交给模型；可收藏的释义带一张来源凭据。
 *
 * 与写作库同口径——先确认课时公开、这个词确实是这一句里的完整单词，
 * 之后才查缓存。缓存里只有释义，凭据绑定「本课 + 本句」现签，不能串用。
 */
export async function lookupListeningWord(input: unknown): Promise<WordLookupResult> {
  const parsed = ListeningWordLookupRequestSchema.safeParse(input);
  if (!parsed.success) throw new WordLookupError('invalid');
  const request = parsed.data;

  let lesson: ReturnType<typeof getListeningLesson>;
  try { lesson = getListeningLesson(request.slug); } catch { throw new WordLookupError('unavailable'); }
  if (!lesson) throw new WordLookupError('not_found');
  const sentence = lesson.transcript[request.sentenceIndex]?.text;
  if (!sentence || !sentenceContainsWord(sentence, request.word)) throw new WordLookupError('invalid');

  const addSaveReceipt = (result: WordLookupResult): WordLookupResult => {
    const signed = issueVocabularyReceipt({
      ...result.entry, source: result.source, sentence,
      // 听力原文是纯英文的考试材料，没有中文对照句。
      sentenceZh: null,
      listeningSlug: lesson.slug, titleZh: lesson.title.zh, titleEn: lesson.title.en,
      sentenceIndex: request.sentenceIndex,
    });
    return signed ? { ...result, ...signed } : result;
  };

  const card = findListeningLessonWordMeaning(lesson, request);
  if (card) {
    const result = WordLookupResultSchema.safeParse(card);
    if (result.success) return addSaveReceipt(result.data);
  }
  return addSaveReceipt(await requestMeaningCached(
    JSON.stringify(['listening', request.word, sentence]), request.word, sentence,
  ));
}
