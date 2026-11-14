import { z } from 'zod';
import { IeltsPairSlugSchema } from '@/lib/ielts/types';
import { StudyReviewResultSchema } from './types';

/** 收藏时的释义与原句快照；公开范文后续改写或下架不影响私人记录。 */
export const VocabularySnapshotSchema = z.object({
  word: z.string().trim().min(1).max(64),
  lemma: z.string().trim().min(1).max(80),
  partOfSpeech: z.string().trim().min(1).max(80),
  meaningZh: z.string().trim().min(1).max(400).regex(/[\p{Script=Han}]/u),
  usageZh: z.string().trim().max(800),
  source: z.enum(['lesson', 'ai']),
  sentence: z.string().min(1).max(600),
  sentenceZh: z.string().max(1200).nullable(),
  pairSlug: IeltsPairSlugSchema,
  titleZh: z.string().trim().min(1).max(400),
  titleEn: z.string().trim().min(1).max(400),
  side: z.enum(['low', 'high']),
  segmentIndex: z.number().int().min(0).max(29),
}).strict();
export type VocabularySnapshot = z.infer<typeof VocabularySnapshotSchema>;

export interface VocabularyEntry {
  id: string;
  sourceKey: string;
  snapshot: VocabularySnapshot;
  reviewStage: number;
  reviewDueOn: string;
  reviewIntervalDays: number;
  lastReviewedOn: string | null;
  revision: number;
  createdAt: string;
  updatedAt: string;
}

export const VOCABULARY_RECEIPT_MAX_BYTES = 16 * 1024;
export const VocabularySaveInputSchema = z.object({
  saveToken: z.string().min(1).max(VOCABULARY_RECEIPT_MAX_BYTES),
}).strict();
export const VocabularyIdSchema = z.object({ id: z.string().uuid() }).strict();
export const VocabularyReviewInputSchema = VocabularyIdSchema.extend({
  expectedRevision: z.number().int().min(1).max(2_147_483_646),
  result: StudyReviewResultSchema,
});
export type VocabularyReviewInput = z.infer<typeof VocabularyReviewInputSchema>;

export const VocabularyListInputSchema = z.object({
  query: z.string().trim().max(120).optional(),
  dueOnly: z.boolean().optional(),
  cursor: z.string().min(1).max(512).optional(),
  limit: z.number().int().min(1).max(100).optional(),
}).strict();
export type VocabularyListInput = z.infer<typeof VocabularyListInputSchema>;
export interface VocabularyList {
  entries: VocabularyEntry[];
  total: number;
  dueCount: number;
  nextCursor: string | null;
}
export type VocabularyPage = VocabularyList;
