import { createHmac } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { VocabularySnapshot } from '@/lib/study/vocabulary-types';
import { issueVocabularyReceipt, verifyVocabularyReceipt, vocabularySourceKey } from '../vocabulary-receipt';

const snapshot: VocabularySnapshot = {
  word: 'bank', lemma: 'bank', partOfSpeech: 'noun', meaningZh: '银行', usageZh: '提供金融服务的机构。',
  source: 'ai', sentence: 'The bank supports local businesses.', sentenceZh: '银行支持本地企业。',
  pairSlug: 'local-business', titleZh: '本地企业', titleEn: 'Local businesses', side: 'high', segmentIndex: 0,
};

beforeEach(() => {
  vi.stubEnv('JWT_SECRET', 'test-only-vocabulary-signing-key');
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-11-14T00:00:00Z'));
});
afterEach(() => { vi.unstubAllEnvs(); vi.useRealTimers(); });

describe('生词收藏签名凭据', () => {
  it('还原签发时的完整快照并计算同一个来源键，不携带账号身份', () => {
    const issued = issueVocabularyReceipt(snapshot)!;
    expect(issued.saveToken.split('.')).toHaveLength(2);
    expect(verifyVocabularyReceipt(issued.saveToken)).toEqual({ snapshot, sourceKey: issued.sourceKey });
    const payload = JSON.parse(Buffer.from(issued.saveToken.split('.')[0], 'base64url').toString());
    expect(payload).not.toHaveProperty('userId');
    expect(payload.expiresAt - payload.issuedAt).toBe(86_400);
  });

  it('同词大小写共享来源键，不同原句分开', () => {
    expect(vocabularySourceKey({ ...snapshot, word: ' BANK ' })).toBe(vocabularySourceKey(snapshot));
    expect(vocabularySourceKey({ ...snapshot, sentence: 'They walked along the bank.' })).not.toBe(vocabularySourceKey(snapshot));
    expect(vocabularySourceKey({ word: 'don’t', sentence: 'Do not worry.' })).toBe(vocabularySourceKey({ word: "don't", sentence: 'Do not worry.' }));
  });

  it('客户端篡改释义或来源、使用JWT原始密钥签名均失败', () => {
    const { saveToken } = issueVocabularyReceipt(snapshot)!;
    const [payload, signature] = saveToken.split('.');
    const content = JSON.parse(Buffer.from(payload, 'base64url').toString());
    content.snapshot.meaningZh = '伪造释义';
    const changed = Buffer.from(JSON.stringify(content)).toString('base64url');
    expect(verifyVocabularyReceipt(`${changed}.${signature}`)).toBeNull();
    const wrongPurpose = createHmac('sha256', process.env.JWT_SECRET!).update(changed).digest('base64url');
    expect(verifyVocabularyReceipt(`${changed}.${wrongPurpose}`)).toBeNull();
  });

  it('24小时内有效，到期一刻失效，未来签发的凭据不能提前用', () => {
    const { saveToken } = issueVocabularyReceipt(snapshot)!;
    vi.advanceTimersByTime(86_399_000);
    expect(verifyVocabularyReceipt(saveToken)).not.toBeNull();
    vi.advanceTimersByTime(1000);
    expect(verifyVocabularyReceipt(saveToken)).toBeNull();
    vi.setSystemTime(new Date('2026-11-13T23:59:59Z'));
    expect(verifyVocabularyReceipt(saveToken)).toBeNull();
  });

  it('未配密钥时不发凭据，密钥轮换后旧凭据失效', () => {
    const { saveToken } = issueVocabularyReceipt(snapshot)!;
    vi.stubEnv('JWT_SECRET', 'changed-signing-key');
    expect(verifyVocabularyReceipt(saveToken)).toBeNull();
    vi.stubEnv('JWT_SECRET', '');
    expect(issueVocabularyReceipt(snapshot)).toBeNull();
    expect(verifyVocabularyReceipt(saveToken)).toBeNull();
  });

  it.each(['', '.', 'a.b.c', 'a.a', 'a.!!!!', `${'x'.repeat(16_384)}.a`])('畸形或超长凭据返回null: %s', token => {
    expect(verifyVocabularyReceipt(token)).toBeNull();
  });

  it('签发前校验快照长度和完整词匹配', () => {
    expect(issueVocabularyReceipt({ ...snapshot, meaningZh: '' })).toBeNull();
    expect(issueVocabularyReceipt({ ...snapshot, sentence: 'The riverbank is quiet.' })).toBeNull();
    expect(issueVocabularyReceipt({ ...snapshot, sentence: 'x'.repeat(601) })).toBeNull();
  });
});
