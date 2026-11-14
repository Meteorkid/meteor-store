import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import { normalizeLookupWord, sentenceContainsWord } from './word-lookup';
import {
  VOCABULARY_RECEIPT_MAX_BYTES, VocabularySnapshotSchema, type VocabularySnapshot,
} from '@/lib/study/vocabulary-types';

const RECEIPT_TTL_SECONDS = 24 * 60 * 60;
const PURPOSE = 'meteor-store:study-vocabulary:v1';
const ReceiptSchema = z.object({
  version: z.literal(1),
  issuedAt: z.number().int().nonnegative(),
  expiresAt: z.number().int().nonnegative(),
  snapshot: VocabularySnapshotSchema,
}).strict();

export function vocabularySourceKey(snapshot: Pick<VocabularySnapshot, 'word' | 'sentence'>): string {
  return createHash('sha256').update(`${normalizeLookupWord(snapshot.word)}\0${snapshot.sentence}`).digest('hex');
}

function signingKey(): Buffer | null {
  const secret = process.env.JWT_SECRET;
  return secret ? createHmac('sha256', secret).update(PURPOSE).digest() : null;
}

/** 两段自定义凭据，不是登录 JWT；用途隔离，且不携带账号身份。 */
export function issueVocabularyReceipt(snapshot: VocabularySnapshot): { saveToken: string; sourceKey: string } | null {
  const key = signingKey();
  const parsed = VocabularySnapshotSchema.safeParse(snapshot);
  if (!key || !parsed.success || !sentenceContainsWord(parsed.data.sentence, parsed.data.word)) return null;
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({
    version: 1, issuedAt, expiresAt: issuedAt + RECEIPT_TTL_SECONDS, snapshot: parsed.data,
  })).toString('base64url');
  const signature = createHmac('sha256', key).update(payload).digest('base64url');
  const saveToken = `${payload}.${signature}`;
  if (Buffer.byteLength(saveToken) > VOCABULARY_RECEIPT_MAX_BYTES) return null;
  return { saveToken, sourceKey: vocabularySourceKey(parsed.data) };
}

export function verifyVocabularyReceipt(token: string): { snapshot: VocabularySnapshot; sourceKey: string } | null {
  const key = signingKey();
  if (!key || Buffer.byteLength(token) > VOCABULARY_RECEIPT_MAX_BYTES) return null;
  const parts = token.split('.');
  if (parts.length !== 2 || !parts.every(part => /^[A-Za-z0-9_-]+$/.test(part))) return null;
  const [payload, signature] = parts;
  const actual = Buffer.from(signature, 'base64url');
  const expected = createHmac('sha256', key).update(payload).digest();
  if (actual.length !== expected.length || actual.toString('base64url') !== signature || !timingSafeEqual(actual, expected)) return null;
  try {
    const decoded = Buffer.from(payload, 'base64url');
    if (decoded.toString('base64url') !== payload) return null;
    const parsed = ReceiptSchema.safeParse(JSON.parse(decoded.toString('utf8')));
    if (!parsed.success) return null;
    const { issuedAt, expiresAt, snapshot } = parsed.data;
    const now = Math.floor(Date.now() / 1000);
    if (issuedAt > now || expiresAt <= now || expiresAt - issuedAt !== RECEIPT_TTL_SECONDS) return null;
    if (!sentenceContainsWord(snapshot.sentence, snapshot.word)) return null;
    return { snapshot, sourceKey: vocabularySourceKey(snapshot) };
  } catch { return null; }
}
