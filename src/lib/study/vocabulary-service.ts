import { randomUUID } from 'node:crypto';
import { and, asc, desc, eq, lt, lte, or, sql } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { studyVocabulary } from '@/lib/db/schema';
import { dailyDate } from '@/lib/daily/types';
import { vocabularySourceKey } from '@/lib/ielts/vocabulary-receipt';
import { initialReviewSchedule, nextReviewSchedule } from './review';
import {
  VocabularyListInputSchema, VocabularySnapshotSchema,
  type VocabularyEntry, type VocabularyList, type VocabularyListInput,
  type VocabularyReviewInput, type VocabularySnapshot,
} from './vocabulary-types';

const columns = {
  id: studyVocabulary.id, sourceKey: studyVocabulary.sourceKey, snapshot: studyVocabulary.snapshot,
  reviewStage: studyVocabulary.reviewStage, reviewDueOn: studyVocabulary.reviewDueOn,
  reviewIntervalDays: studyVocabulary.reviewIntervalDays, lastReviewedOn: studyVocabulary.lastReviewedOn,
  revision: studyVocabulary.revision, createdAt: studyVocabulary.createdAt, updatedAt: studyVocabulary.updatedAt,
};
const CursorSchema = z.object({ createdAt: z.string().datetime(), id: z.string().uuid() }).strict();
export class VocabularyInputError extends Error {}
export class VocabularyConflictError extends Error {}

function decodeCursor(cursor: string) {
  try {
    if (!/^[A-Za-z0-9_-]+$/.test(cursor)) throw new Error('Invalid cursor');
    return CursorSchema.parse(JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8')));
  } catch { throw new VocabularyInputError('Invalid cursor'); }
}

export async function findVocabularyBySourceKey(userId: string, sourceKey: string): Promise<VocabularyEntry | null> {
  const [entry] = await db.select(columns).from(studyVocabulary)
    .where(and(eq(studyVocabulary.userId, userId), eq(studyVocabulary.sourceKey, sourceKey))).limit(1);
  return entry ?? null;
}

export async function saveVocabulary(userId: string, input: VocabularySnapshot): Promise<{ entry: VocabularyEntry; created: boolean }> {
  const snapshot = VocabularySnapshotSchema.parse(input);
  const sourceKey = vocabularySourceKey(snapshot);
  const schedule = initialReviewSchedule();
  const now = new Date().toISOString();
  const [created] = await db.insert(studyVocabulary).values({
    id: randomUUID(), userId, sourceKey, snapshot,
    reviewStage: schedule.stage, reviewDueOn: schedule.dueOn,
    reviewIntervalDays: schedule.intervalDays, lastReviewedOn: null,
    revision: 1, createdAt: now, updatedAt: now,
  }).onConflictDoNothing({ target: [studyVocabulary.userId, studyVocabulary.sourceKey] }).returning(columns);
  if (created) return { entry: created, created: true };
  const entry = await findVocabularyBySourceKey(userId, sourceKey);
  if (!entry) throw new Error('Vocabulary changed while saving');
  return { entry, created: false };
}

export async function countDueVocabulary(userId: string, today = dailyDate()): Promise<number> {
  const [row] = await db.select({ count: sql<number>`count(*)::int` }).from(studyVocabulary)
    .where(and(eq(studyVocabulary.userId, userId), lte(studyVocabulary.reviewDueOn, today)));
  return row?.count ?? 0;
}

export async function listDueVocabulary(userId: string, today = dailyDate(), limit = 50): Promise<VocabularyEntry[]> {
  return db.select(columns).from(studyVocabulary)
    .where(and(eq(studyVocabulary.userId, userId), lte(studyVocabulary.reviewDueOn, today)))
    .orderBy(asc(studyVocabulary.reviewDueOn), asc(studyVocabulary.id)).limit(Math.max(1, Math.min(100, limit)));
}

export async function listVocabulary(userId: string, input: VocabularyListInput = {}): Promise<VocabularyList> {
  const parsed = VocabularyListInputSchema.safeParse(input);
  if (!parsed.success) throw new VocabularyInputError('Invalid filters');
  const { query, dueOnly, cursor, limit = 50 } = parsed.data;
  const today = dailyDate();
  const after = cursor ? decodeCursor(cursor) : null;
  const search = query ? `%${query.replace(/[\\%_]/g, '\\$&')}%` : null;
  const filter = and(
    eq(studyVocabulary.userId, userId),
    dueOnly ? lte(studyVocabulary.reviewDueOn, today) : undefined,
    search ? sql`(${studyVocabulary.snapshot}->>'word' ILIKE ${search} OR ${studyVocabulary.snapshot}->>'lemma' ILIKE ${search} OR ${studyVocabulary.snapshot}->>'meaningZh' ILIKE ${search} OR ${studyVocabulary.snapshot}->>'sentence' ILIKE ${search})` : undefined,
  );
  const [rows, counts, dueCount] = await Promise.all([
    db.select(columns).from(studyVocabulary).where(and(filter, after ? or(
      lt(studyVocabulary.createdAt, after.createdAt),
      and(eq(studyVocabulary.createdAt, after.createdAt), lt(studyVocabulary.id, after.id)),
    ) : undefined)).orderBy(desc(studyVocabulary.createdAt), desc(studyVocabulary.id)).limit(limit + 1),
    db.select({ count: sql<number>`count(*)::int` }).from(studyVocabulary).where(filter),
    countDueVocabulary(userId, today),
  ]);
  const entries = rows.slice(0, limit);
  const last = entries.at(-1);
  return {
    entries, total: counts[0]?.count ?? 0, dueCount,
    nextCursor: rows.length > limit && last
      ? Buffer.from(JSON.stringify({ createdAt: last.createdAt, id: last.id })).toString('base64url') : null,
  };
}

export async function reviewVocabulary(userId: string, input: VocabularyReviewInput): Promise<VocabularyEntry | null> {
  const [existing] = await db.select(columns).from(studyVocabulary)
    .where(and(eq(studyVocabulary.userId, userId), eq(studyVocabulary.id, input.id))).limit(1);
  if (!existing) return null;
  const today = dailyDate();
  if (existing.revision !== input.expectedRevision || existing.reviewDueOn > today) throw new VocabularyConflictError();
  const schedule = nextReviewSchedule({ stage: existing.reviewStage }, input.result, today);
  const [saved] = await db.update(studyVocabulary).set({
    reviewStage: schedule.stage, reviewDueOn: schedule.dueOn,
    reviewIntervalDays: schedule.intervalDays, lastReviewedOn: schedule.lastReviewedOn,
    revision: existing.revision + 1, updatedAt: new Date().toISOString(),
  }).where(and(
    eq(studyVocabulary.userId, userId), eq(studyVocabulary.id, input.id),
    eq(studyVocabulary.revision, input.expectedRevision), eq(studyVocabulary.reviewDueOn, existing.reviewDueOn),
    lte(studyVocabulary.reviewDueOn, today),
  )).returning(columns);
  if (!saved) throw new VocabularyConflictError();
  return saved;
}

export async function deleteVocabulary(userId: string, id: string): Promise<boolean> {
  const rows = await db.delete(studyVocabulary)
    .where(and(eq(studyVocabulary.userId, userId), eq(studyVocabulary.id, id)))
    .returning({ id: studyVocabulary.id });
  return rows.length > 0;
}
