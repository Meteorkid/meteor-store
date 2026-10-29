import { createHash, randomUUID } from 'node:crypto';
import { and, asc, desc, eq, gte, inArray, isNull, or, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { mastersNotices, mastersRounds, mastersWatches } from '@/lib/db/schema';
import { dailyDate, shiftDailyDate } from '@/lib/daily/types';
import { getMastersRoundState } from './dates';
import { withMastersOpeningEvidence } from './opening-evidence';
import { mastersSeeds } from './seeds';
import { defaultMastersYear, MastersRoundInputSchema, MastersWatchInputSchema,
  type MastersRound, type MastersRoundInput, type MastersSummary, type MastersWatch,
  type MastersWatchInput, type MastersNotice } from './types';

type QueryDb = Pick<typeof db, 'select' | 'insert' | 'update' | 'delete'>;
const roundColumns = {
  id: mastersRounds.id, intakeYear: mastersRounds.intakeYear, region: mastersRounds.region,
  details: mastersRounds.details, status: mastersRounds.status, verifiedOn: mastersRounds.verifiedOn,
  revision: mastersRounds.revision, dateVersion: mastersRounds.dateVersion,
  dateChangedAt: mastersRounds.dateChangedAt, previousDeadlineText: mastersRounds.previousDeadlineText,
  createdAt: mastersRounds.createdAt, updatedAt: mastersRounds.updatedAt,
};
const watchColumns = { roundId: mastersWatches.roundId, status: mastersWatches.status,
  reminders: mastersWatches.reminders, updatedAt: mastersWatches.updatedAt };
const hash = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const revisionAfter = (previous?: string) => new Date(Math.max(Date.now(), previous ? Date.parse(previous) + 1 : 0)).toISOString();

function identity(input: MastersRoundInput) {
  const d = input.details;
  return hash([input.intakeYear, input.region, d.university, d.programme, d.studyMode,
    d.intakeLabel, d.applicantGroup, d.roundName, d.eventType].map(value => typeof value === 'string' ? value.trim().toLowerCase().replace(/\s+/g, ' ') : value));
}
function datesFingerprint(input: Pick<MastersRoundInput, 'details' | 'region' | 'intakeYear'>) {
  const d = input.details;
  return hash([input.intakeYear, input.region, d.opensOn,
    d.openingState, d.deadlineStatus, d.deadlineOn, d.deadlineAt, d.deadlineTimeZone,
    d.rolling, d.mayCloseEarly]);
}
function deadlineDescription(round: MastersRound) {
  return round.details.deadlineText || round.details.deadlineAt || round.details.deadlineOn || round.details.deadlineStatus;
}

export async function listMastersRounds(year: number): Promise<MastersRound[]> {
  return db.select(roundColumns).from(mastersRounds)
    .where(and(eq(mastersRounds.intakeYear, year), eq(mastersRounds.status, 'published')))
    .orderBy(asc(mastersRounds.id));
}
export async function listAdminMastersRounds(year: number): Promise<MastersRound[]> {
  return db.select(roundColumns).from(mastersRounds).where(eq(mastersRounds.intakeYear, year)).orderBy(asc(mastersRounds.id));
}
export async function getMastersRoundsByIds(ids: string[]): Promise<MastersRound[]> {
  if (!ids.length) return [];
  return db.select(roundColumns).from(mastersRounds)
    .where(and(inArray(mastersRounds.id, [...new Set(ids)]), eq(mastersRounds.status, 'published')));
}
/** 仅自动同步读取暂停标记；公开列表仍使用不含内部标记的roundColumns。 */
export async function getMastersAutomationRounds(ids: string[]): Promise<Array<MastersRound & { automationPaused: boolean }>> {
  if (!ids.length) return [];
  return db.select({ ...roundColumns, automationPaused: mastersRounds.automationPaused }).from(mastersRounds)
    .where(inArray(mastersRounds.id, [...new Set(ids)]));
}
export async function getMastersSummary(year = defaultMastersYear()): Promise<MastersSummary> {
  const rounds = await listMastersRounds(year);
  const today = dailyDate();
  const recent = new Date(`${shiftDailyDate(today, -7)}T00:00:00+08:00`).toISOString();
  return { intakeYear: year, total: rounds.length,
    opening: rounds.filter(row => row.details.opensOn && row.details.opensOn >= today && row.details.opensOn <= shiftDailyDate(today, 7)).length,
    closingSoon: rounds.filter(row => getMastersRoundState(row).leadDays !== null).length,
    changed: rounds.filter(row => row.dateChangedAt && row.dateChangedAt >= recent).length };
}

/** 更新和改期提醒一同提交；日期版本与正文版本分开，修标点不会重发临期提醒。 */
export async function saveMastersRound(value: MastersRoundInput, options: { automatic?: boolean } = {}): Promise<MastersRound | null> {
  const parsed = MastersRoundInputSchema.parse(value);
  try {
    return await db.transaction(async tx => {
      const id = parsed.id ?? randomUUID();
      const [previous] = await tx.select({ ...roundColumns, automationPaused: mastersRounds.automationPaused }).from(mastersRounds).where(eq(mastersRounds.id, id)).limit(1);
      if (options.automatic && previous?.automationPaused) return null;
      if (previous && (previous.updatedAt !== parsed.expectedUpdatedAt || previous.intakeYear !== parsed.intakeYear)) return null;
      if (!previous && parsed.expectedUpdatedAt) return null;
      const input = withMastersOpeningEvidence(parsed, previous);
      const now = revisionAfter(previous?.updatedAt);
      const changed = previous ? datesFingerprint(previous) !== datesFingerprint(input) : false;
      const values = { intakeYear: input.intakeYear, region: input.region, details: input.details, automationPaused: !options.automatic,
        identityKey: identity(input), status: input.status, verifiedOn: input.verifiedOn,
        revision: (previous?.revision ?? 0) + 1,
        dateVersion: (previous?.dateVersion ?? 1) + (changed ? 1 : 0),
        dateChangedAt: changed ? now : previous?.dateChangedAt ?? null,
        previousDeadlineText: changed && previous?.status === 'published' ? deadlineDescription(previous) : previous?.previousDeadlineText ?? null,
        updatedAt: now };
      const rows = previous
        ? await tx.update(mastersRounds).set(values).where(and(eq(mastersRounds.id, id), eq(mastersRounds.updatedAt, input.expectedUpdatedAt!), options.automatic ? eq(mastersRounds.automationPaused, false) : undefined)).returning(roundColumns)
        : await tx.insert(mastersRounds).values({ id, createdAt: now, ...values }).onConflictDoNothing().returning(roundColumns);
      const saved = rows[0];
      if (!saved) return null;
      if (saved.status === 'published') await syncMastersNoticesIn(tx, { roundId: saved.id });
      return saved;
    });
  } catch (error) {
    const candidate = error as { code?: string; cause?: { code?: string } };
    if (candidate.code === '23505' || candidate.cause?.code === '23505') return null;
    throw error;
  }
}

export async function unpublishMastersRound(id: string, expectedUpdatedAt: string): Promise<boolean> {
  const rows = await db.update(mastersRounds).set({ status: 'draft', automationPaused: true, revision: sql`${mastersRounds.revision} + 1`, updatedAt: revisionAfter(expectedUpdatedAt) })
    .where(and(eq(mastersRounds.id, id), eq(mastersRounds.updatedAt, expectedUpdatedAt), eq(mastersRounds.status, 'published')))
    .returning({ id: mastersRounds.id });
  return rows.length === 1;
}

export async function importMastersSeeds(): Promise<{ created: number }> {
  const now = new Date().toISOString();
  const inputs = mastersSeeds.map(value => MastersRoundInputSchema.parse({ ...value, status: 'draft' }));
  const saved = await db.insert(mastersRounds).values(inputs.map(input => ({
    id: input.id ?? randomUUID(), identityKey: identity(input), intakeYear: input.intakeYear,
    region: input.region, details: input.details, status: 'draft' as const, verifiedOn: input.verifiedOn,
    createdAt: now, updatedAt: now,
  }))).onConflictDoNothing().returning({ id: mastersRounds.id });
  return { created: saved.length };
}

export async function getMastersWatches(userId: string): Promise<MastersWatch[]> {
  return db.select(watchColumns).from(mastersWatches).where(eq(mastersWatches.userId, userId)).orderBy(desc(mastersWatches.updatedAt));
}

export async function saveMastersWatch(userId: string, value: MastersWatchInput): Promise<MastersWatch | null> {
  const input = MastersWatchInputSchema.parse(value);
  return db.transaction(async tx => {
    const [round] = await tx.select({ id: mastersRounds.id }).from(mastersRounds)
      .where(and(eq(mastersRounds.id, input.roundId), eq(mastersRounds.status, 'published'))).limit(1);
    if (!round) return null;
    const now = new Date().toISOString();
    const [saved] = await tx.insert(mastersWatches).values({ userId, ...input, createdAt: now, updatedAt: now })
      .onConflictDoUpdate({ target: [mastersWatches.userId, mastersWatches.roundId], set: { status: input.status, reminders: input.reminders, updatedAt: now } })
      .returning(watchColumns);
    if (saved.reminders && saved.status === 'preparing') await syncMastersNoticesIn(tx, { userId, roundId: input.roundId });
    return saved;
  });
}
export async function removeMastersWatch(userId: string, roundId: string): Promise<void> {
  await db.transaction(async tx => {
    await tx.delete(mastersNotices).where(and(eq(mastersNotices.userId, userId), eq(mastersNotices.roundId, roundId)));
    await tx.delete(mastersWatches).where(and(eq(mastersWatches.userId, userId), eq(mastersWatches.roundId, roundId)));
  });
}

export interface MastersNoticeSyncOptions { now?: Date; userId?: string; roundId?: string }
async function syncMastersNoticesIn(queryDb: QueryDb, options: MastersNoticeSyncOptions): Promise<{ created: number }> {
  const now = options.now ?? new Date();
  let created = 0;
  for (let offset = 0; ; offset += 500) {
    const rows = await queryDb.select({ round: roundColumns, userId: mastersWatches.userId, followedAt: mastersWatches.createdAt })
      .from(mastersWatches).innerJoin(mastersRounds, eq(mastersRounds.id, mastersWatches.roundId))
      .where(and(eq(mastersWatches.status, 'preparing'), eq(mastersWatches.reminders, true), eq(mastersRounds.status, 'published'),
        options.userId ? eq(mastersWatches.userId, options.userId) : undefined,
        options.roundId ? eq(mastersRounds.id, options.roundId) : undefined))
      .orderBy(asc(mastersWatches.userId), asc(mastersWatches.roundId)).limit(500).offset(offset);
    const values: (typeof mastersNotices.$inferInsert)[] = [];
    for (const { round, userId, followedAt } of rows) {
      const leadDays = getMastersRoundState(round, now).leadDays;
      if (leadDays !== null) values.push({
        id: hash([userId, round.id, round.dateVersion, 'deadline', leadDays]), userId, roundId: round.id,
        dateVersion: round.dateVersion, kind: 'deadline', leadDays, createdAt: now.toISOString(),
      });
      if (round.dateVersion > 1 && round.dateChangedAt && round.dateChangedAt >= followedAt) values.push({
        id: hash([userId, round.id, round.dateVersion, 'changed']), userId, roundId: round.id,
        dateVersion: round.dateVersion, kind: 'changed', leadDays: null, createdAt: now.toISOString(),
      });
    }
    if (values.length) created += (await queryDb.insert(mastersNotices).values(values).onConflictDoNothing().returning({ id: mastersNotices.id })).length;
    if (rows.length < 500) break;
  }
  return { created };
}
export async function syncMastersNotices(options: MastersNoticeSyncOptions = {}) {
  return syncMastersNoticesIn(db, options);
}

export async function getMastersNotices(userId: string): Promise<MastersNotice[]> {
  const cutoff = new Date(`${shiftDailyDate(dailyDate(), -30)}T00:00:00+08:00`).toISOString();
  const notices: MastersNotice[] = [];
  for (let offset = 0; notices.length < 20; offset += 100) {
    const rows = await db.select({
    id: mastersNotices.id, roundId: mastersNotices.roundId, kind: mastersNotices.kind, leadDays: mastersNotices.leadDays,
    dateVersion: mastersNotices.dateVersion, createdAt: mastersNotices.createdAt, readAt: mastersNotices.readAt, round: roundColumns,
  }).from(mastersNotices)
    .innerJoin(mastersRounds, eq(mastersRounds.id, mastersNotices.roundId))
    .innerJoin(mastersWatches, and(eq(mastersWatches.roundId, mastersNotices.roundId), eq(mastersWatches.userId, mastersNotices.userId)))
    .where(and(eq(mastersNotices.userId, userId), eq(mastersRounds.status, 'published'),
      eq(mastersNotices.dateVersion, mastersRounds.dateVersion), eq(mastersWatches.status, 'preparing'), eq(mastersWatches.reminders, true),
      or(isNull(mastersNotices.readAt), gte(mastersNotices.createdAt, cutoff))))
    .orderBy(sql`${mastersNotices.readAt} is not null`, desc(mastersNotices.createdAt), asc(mastersNotices.id)).limit(100).offset(offset);
    notices.push(...rows.filter(row => row.kind === 'changed' || getMastersRoundState(row.round).leadDays === row.leadDays));
    if (rows.length < 100) break;
  }
  return notices.slice(0, 20);
}
export async function markMastersNoticesRead(userId: string, ids: string[]): Promise<void> {
  if (!ids.length) return;
  await db.update(mastersNotices).set({ readAt: new Date().toISOString() })
    .where(and(eq(mastersNotices.userId, userId), inArray(mastersNotices.id, ids)));
}
