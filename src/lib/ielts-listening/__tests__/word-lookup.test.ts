import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listeningLessons } from '@/data/ielts-listening';
import { verifyVocabularyReceipt } from '@/lib/ielts/vocabulary-receipt';
import { WordLookupError } from '@/lib/ielts/word-lookup-service';
import { findListeningLessonWordMeaning } from '../word-lookup';
import { lookupListeningWord } from '../word-lookup-service';

/**
 * 点词查词的边界：只解释这一句里的完整单词，词卡与词组卡必须在同一句，
 * 凭据绑定「本课 + 本句」，AI 释义走的是与写作库共用的缓存入口。
 */

const mock = vi.hoisted(() => ({ lesson: vi.fn(), meaning: vi.fn() }));

vi.mock('@/lib/ielts-listening/catalog', () => ({ getListeningLesson: mock.lesson }));
vi.mock('@/lib/ielts/word-lookup-service', async importOriginal => ({
  ...await importOriginal<typeof import('@/lib/ielts/word-lookup-service')>(), requestMeaningCached: mock.meaning,
}));

const part1 = listeningLessons.find(lesson => lesson.slug === 'test-01-part-1')!;
const clay = part1.vocabulary.find(item => item.term === 'clay')!;
const holdThePlace = part1.expressions.find(item => item.phrase === 'hold the place')!;

beforeEach(() => {
  vi.unstubAllEnvs();
  vi.stubEnv('JWT_SECRET', 'test-only-listening-signing-key');
  mock.lesson.mockReset();
  mock.lesson.mockReturnValue(part1);
  mock.meaning.mockReset();
});

describe('findListeningLessonWordMeaning', () => {
  it('被点的词正好是本句生词时给词卡，大小写与规范化不影响匹配', () => {
    const card = findListeningLessonWordMeaning(part1, { sentenceIndex: clay.sentenceIndex, word: ' Clay ' });
    expect(card).toEqual({ source: 'lesson', entry: {
      word: 'clay', lemma: 'clay', partOfSpeech: clay.partOfSpeech,
      meaningZh: clay.meaning.zh, usageZh: clay.usage.zh,
    } });
  });

  it('词卡只在原句生效：同一个词换到别的句子就不认', () => {
    expect(findListeningLessonWordMeaning(part1, { sentenceIndex: clay.sentenceIndex + 1, word: 'clay' })).toBeNull();
    expect(findListeningLessonWordMeaning(part1, { sentenceIndex: 0, word: 'pottery' })).toBeNull();
  });

  it('词落在本句词组里时给出整个词组的释义，并标明这是词组', () => {
    const card = findListeningLessonWordMeaning(part1, { sentenceIndex: holdThePlace.sentenceIndex, word: 'place' });
    expect(card).toEqual({ source: 'lesson', entry: {
      word: 'place', lemma: 'hold the place', partOfSpeech: 'phrase',
      meaningZh: holdThePlace.meaning.zh, usageZh: holdThePlace.usage.zh,
    } });
  });

  it('既是本句生词又落在词组里时，生词卡优先', () => {
    const card = findListeningLessonWordMeaning(part1, { sentenceIndex: 32, word: 'deposit' });
    expect(card?.entry).toMatchObject({ lemma: 'deposit', partOfSpeech: 'n.' });
  });
});

describe('lookupListeningWord', () => {
  it('课内词卡不调用模型，凭据绑定本课与句索引', async () => {
    const result = await lookupListeningWord({ slug: 'test-01-part-1', sentenceIndex: clay.sentenceIndex, word: 'clay' });
    expect(result).toMatchObject({ source: 'lesson', entry: { word: 'clay', lemma: 'clay' } });
    expect(mock.meaning).not.toHaveBeenCalled();
    expect(verifyVocabularyReceipt(result.saveToken!)?.snapshot).toMatchObject({
      word: 'clay', listeningSlug: 'test-01-part-1', sentenceIndex: clay.sentenceIndex, sentenceZh: null,
    });
  });

  it('没有词卡时交给共用缓存入口，键里带 listening 前缀与原句', async () => {
    mock.meaning.mockResolvedValue({ source: 'ai', entry: { word: 'popular', lemma: 'popular', partOfSpeech: 'adj.', meaningZh: '受欢迎的', usageZh: '' } });
    const result = await lookupListeningWord({ slug: 'test-01-part-1', sentenceIndex: 2, word: 'Popular' });
    expect(result).toMatchObject({ source: 'ai', entry: { word: 'popular', meaningZh: '受欢迎的' } });
    expect(mock.meaning).toHaveBeenCalledWith(JSON.stringify(['listening', 'popular', part1.transcript[2].text]), 'popular', part1.transcript[2].text);
    expect(verifyVocabularyReceipt(result.saveToken!)?.snapshot).toMatchObject({ word: 'popular', listeningSlug: 'test-01-part-1', sentenceIndex: 2 });
  });

  it('未配置签名密钥时照常查词，只是没有可收藏的凭据', async () => {
    vi.stubEnv('JWT_SECRET', '');
    mock.meaning.mockResolvedValue({ source: 'ai', entry: { word: 'popular', lemma: 'popular', partOfSpeech: 'adj.', meaningZh: '受欢迎的', usageZh: '' } });
    const result = await lookupListeningWord({ slug: 'test-01-part-1', sentenceIndex: 2, word: 'popular' });
    expect(result).not.toHaveProperty('saveToken');
    expect(result).not.toHaveProperty('sourceKey');
  });

  it('词不在这一句里、句索引越界或请求多余字段都按非法请求拒绝', async () => {
    for (const body of [
      { slug: 'test-01-part-1', sentenceIndex: 6, word: 'clay' },
      { slug: 'test-01-part-1', sentenceIndex: 500, word: 'clay' },
      { slug: 'test-01-part-1', sentenceIndex: 2, word: 'popular', sentence: 'client supplied' },
      { slug: 'test-01-part-1', sentenceIndex: 2, word: '2020' },
      { slug: '../secret', sentenceIndex: 2, word: 'popular' },
    ]) {
      await expect(lookupListeningWord(body)).rejects.toMatchObject({ code: 'invalid', status: 400 });
    }
    expect(mock.meaning).not.toHaveBeenCalled();
  });

  it('课时不存在404、目录故障503，模型错误原样上抛', async () => {
    mock.lesson.mockReturnValue(null);
    await expect(lookupListeningWord({ slug: 'test-02-part-4', sentenceIndex: 2, word: 'popular' }))
      .rejects.toBeInstanceOf(WordLookupError);
    mock.lesson.mockImplementation(() => { throw new Error('catalog exploded'); });
    await expect(lookupListeningWord({ slug: 'test-01-part-1', sentenceIndex: 2, word: 'popular' }))
      .rejects.toMatchObject({ code: 'unavailable', status: 503 });
    mock.lesson.mockReturnValue(part1);
    mock.meaning.mockRejectedValue(new WordLookupError('timeout'));
    await expect(lookupListeningWord({ slug: 'test-01-part-1', sentenceIndex: 2, word: 'popular' }))
      .rejects.toMatchObject({ code: 'timeout', status: 504 });
  });
});
