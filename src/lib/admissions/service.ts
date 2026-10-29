import { createHash, randomUUID } from 'node:crypto';
import { and, asc, desc, eq, gte, inArray, isNull, or, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { mastersNotices, mastersRounds, mastersWatches, phdNotices, phdRounds, phdWatches } from '@/lib/db/schema';
import { dailyDate, shiftDailyDate } from '@/lib/daily/types';
import { getMastersRoundState } from '@/lib/masters/dates';
import { withMastersOpeningEvidence } from '@/lib/masters/opening-evidence';
import { PhdRoundInputSchema } from '@/lib/phd/types';
import type { AdmissionsKind } from './config';
import { defaultMastersYear, MastersRoundInputSchema, MastersWatchInputSchema,
  type MastersRound, type MastersRoundInput, type MastersSummary, type MastersWatch,
  type MastersWatchInput, type MastersNotice } from '@/lib/masters/types';

type QueryDb = Pick<typeof db, 'select' | 'insert' | 'update' | 'delete'>;
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

export interface AdmissionsNoticeSyncOptions { now?: Date; userId?: string; roundId?: string }

const admissionsTables = {
  masters: { roundsTable: mastersRounds, watchesTable: mastersWatches, noticesTable: mastersNotices },
  phd: { roundsTable: phdRounds, watchesTable: phdWatches, noticesTable: phdNotices },
} as const;

/** 表组只能由服务端包装模块固定选择，所有查询与事务共享同一组表。 */
export function createAdmissionsService(kind: AdmissionsKind, seeds: readonly MastersRoundInput[]) {
  const { roundsTable, watchesTable, noticesTable } = admissionsTables[kind];
  const roundColumns = {
    id: roundsTable.id, intakeYear: roundsTable.intakeYear, region: roundsTable.region,
    details: roundsTable.details, status: roundsTable.status, verifiedOn: roundsTable.verifiedOn,
    revision: roundsTable.revision, dateVersion: roundsTable.dateVersion,
    dateChangedAt: roundsTable.dateChangedAt, previousDeadlineText: roundsTable.previousDeadlineText,
    createdAt: roundsTable.createdAt, updatedAt: roundsTable.updatedAt,
  };
  const watchColumns = { roundId: watchesTable.roundId, status: watchesTable.status,
    reminders: watchesTable.reminders, updatedAt: watchesTable.updatedAt };
  const roundInputSchema = kind === 'phd' ? PhdRoundInputSchema : MastersRoundInputSchema;
  const newRoundId = () => kind === 'phd' ? `phd-${randomUUID()}` : randomUUID();

  async function listRounds(year: number): Promise<MastersRound[]> {
    return db.select(roundColumns).from(roundsTable)
      .where(and(eq(roundsTable.intakeYear, year), eq(roundsTable.status, 'published')))
      .orderBy(asc(roundsTable.id));
  }
  async function listAdminRounds(year: number): Promise<MastersRound[]> {
    return db.select(roundColumns).from(roundsTable).where(eq(roundsTable.intakeYear, year)).orderBy(asc(roundsTable.id));
  }
  async function getRoundsByIds(ids: string[]): Promise<MastersRound[]> {
    if (!ids.length) return [];
    return db.select(roundColumns).from(roundsTable)
      .where(and(inArray(roundsTable.id, [...new Set(ids)]), eq(roundsTable.status, 'published')));
  }
  /** 仅自动同步读取暂停标记；公开列表仍使用不含内部标记的roundColumns。 */
  async function getAutomationRounds(ids: string[]): Promise<Array<MastersRound & { automationPaused: boolean }>> {
    if (!ids.length) return [];
    return db.select({ ...roundColumns, automationPaused: roundsTable.automationPaused }).from(roundsTable)
      .where(inArray(roundsTable.id, [...new Set(ids)]));
  }
  async function getSummary(year = defaultMastersYear()): Promise<MastersSummary> {
    const rounds = await listRounds(year);
    const today = dailyDate();
    const recent = new Date(`${shiftDailyDate(today, -7)}T00:00:00+08:00`).toISOString();
    return { intakeYear: year, total: rounds.length,
      opening: rounds.filter(row => row.details.opensOn && row.details.opensOn >= today && row.details.opensOn <= shiftDailyDate(today, 7)).length,
      closingSoon: rounds.filter(row => getMastersRoundState(row).leadDays !== null).length,
      changed: rounds.filter(row => row.dateChangedAt && row.dateChangedAt >= recent).length };
  }

  /** 更新和改期提醒一同提交；日期版本与正文版本分开，修标点不会重发临期提醒。 */
  async function saveRound(value: MastersRoundInput, options: { automatic?: boolean } = {}): Promise<MastersRound | null> {
    const parsed = roundInputSchema.parse(value);
    try {
      return await db.transaction(async tx => {
        const id = parsed.id ?? newRoundId();
        const [previous] = await tx.select({ ...roundColumns, automationPaused: roundsTable.automationPaused }).from(roundsTable).where(eq(roundsTable.id, id)).limit(1);
        if (options.automatic && previous?.automationPaused) return null;
        if (previous && (previous.updatedAt !== parsed.expectedUpdatedAt || previous.intakeYear !== parsed.intakeYear)) return null;
        if (!previous && parsed.expectedUpdatedAt) return null;
        const input = withMastersOpeningEvidence(parsed, previous);
        const now = revisionAfter(previous?.updatedAt);
        // 博士种子不携带核验日期，首次自动发布是在建立日期基线，不是修改已知日期。
        const initialPhdPublication = kind === 'phd' && options.automatic === true && input.status === 'published'
          && previous?.status === 'draft' && previous.revision === 1 && previous.dateVersion === 1
          && previous.verifiedOn === null && previous.dateChangedAt === null && previous.details.deadlineStatus !== 'confirmed';
        const changed = previous && !initialPhdPublication ? datesFingerprint(previous) !== datesFingerprint(input) : false;
        const values = { intakeYear: input.intakeYear, region: input.region, details: input.details, automationPaused: !options.automatic,
          identityKey: identity(input), status: input.status, verifiedOn: input.verifiedOn,
          revision: (previous?.revision ?? 0) + 1,
          dateVersion: (previous?.dateVersion ?? 1) + (changed ? 1 : 0),
          dateChangedAt: changed ? now : previous?.dateChangedAt ?? null,
          previousDeadlineText: changed && previous?.status === 'published' ? deadlineDescription(previous) : previous?.previousDeadlineText ?? null,
          updatedAt: now };
        const rows = previous
          ? await tx.update(roundsTable).set(values).where(and(eq(roundsTable.id, id), eq(roundsTable.updatedAt, input.expectedUpdatedAt!), options.automatic ? eq(roundsTable.automationPaused, false) : undefined)).returning(roundColumns)
          : await tx.insert(roundsTable).values({ id, createdAt: now, ...values }).onConflictDoNothing().returning(roundColumns);
        const saved = rows[0];
        if (!saved) return null;
        if (saved.status === 'published') await syncNoticesIn(tx, { roundId: saved.id });
        return saved;
      });
    } catch (error) {
      const candidate = error as { code?: string; cause?: { code?: string } };
      if (candidate.code === '23505' || candidate.cause?.code === '23505') return null;
      throw error;
    }
  }

  async function unpublishRound(id: string, expectedUpdatedAt: string): Promise<boolean> {
    const rows = await db.update(roundsTable).set({ status: 'draft', automationPaused: true, revision: sql`${roundsTable.revision} + 1`, updatedAt: revisionAfter(expectedUpdatedAt) })
      .where(and(eq(roundsTable.id, id), eq(roundsTable.updatedAt, expectedUpdatedAt), eq(roundsTable.status, 'published')))
      .returning({ id: roundsTable.id });
    return rows.length === 1;
  }

  async function importSeeds(): Promise<{ created: number }> {
    const now = new Date().toISOString();
    const inputs = seeds.map(value => roundInputSchema.parse({ ...value, status: 'draft' }));
    const saved = await db.insert(roundsTable).values(inputs.map(input => ({
      id: input.id ?? newRoundId(), identityKey: identity(input), intakeYear: input.intakeYear,
      region: input.region, details: input.details, status: 'draft' as const, verifiedOn: input.verifiedOn,
      createdAt: now, updatedAt: now,
    }))).onConflictDoNothing().returning({ id: roundsTable.id });
    return { created: saved.length };
  }

  async function getWatches(userId: string): Promise<MastersWatch[]> {
    return db.select(watchColumns).from(watchesTable).where(eq(watchesTable.userId, userId)).orderBy(desc(watchesTable.updatedAt));
  }

  async function saveWatch(userId: string, value: MastersWatchInput): Promise<MastersWatch | null> {
    const input = MastersWatchInputSchema.parse(value);
    return db.transaction(async tx => {
      const [round] = await tx.select({ id: roundsTable.id }).from(roundsTable)
        .where(and(eq(roundsTable.id, input.roundId), eq(roundsTable.status, 'published'))).limit(1);
      if (!round) return null;
      const now = new Date().toISOString();
      const [saved] = await tx.insert(watchesTable).values({ userId, ...input, createdAt: now, updatedAt: now })
        .onConflictDoUpdate({ target: [watchesTable.userId, watchesTable.roundId], set: { status: input.status, reminders: input.reminders, updatedAt: now } })
        .returning(watchColumns);
      if (saved.reminders && saved.status === 'preparing') await syncNoticesIn(tx, { userId, roundId: input.roundId });
      return saved;
    });
  }
  async function removeWatch(userId: string, roundId: string): Promise<void> {
    await db.transaction(async tx => {
      await tx.delete(noticesTable).where(and(eq(noticesTable.userId, userId), eq(noticesTable.roundId, roundId)));
      await tx.delete(watchesTable).where(and(eq(watchesTable.userId, userId), eq(watchesTable.roundId, roundId)));
    });
  }

  async function syncNoticesIn(queryDb: QueryDb, options: AdmissionsNoticeSyncOptions): Promise<{ created: number }> {
    const now = options.now ?? new Date();
    let created = 0;
    for (let offset = 0; ; offset += 500) {
      const rows = await queryDb.select({ round: roundColumns, userId: watchesTable.userId, followedAt: watchesTable.createdAt })
        .from(watchesTable).innerJoin(roundsTable, eq(roundsTable.id, watchesTable.roundId))
        .where(and(eq(watchesTable.status, 'preparing'), eq(watchesTable.reminders, true), eq(roundsTable.status, 'published'),
          options.userId ? eq(watchesTable.userId, options.userId) : undefined,
          options.roundId ? eq(roundsTable.id, options.roundId) : undefined))
        .orderBy(asc(watchesTable.userId), asc(watchesTable.roundId)).limit(500).offset(offset);
      const values: (typeof noticesTable.$inferInsert)[] = [];
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
      if (values.length) created += (await queryDb.insert(noticesTable).values(values).onConflictDoNothing().returning({ id: noticesTable.id })).length;
      if (rows.length < 500) break;
    }
    return { created };
  }
  async function syncNotices(options: AdmissionsNoticeSyncOptions = {}) {
    return syncNoticesIn(db, options);
  }

  async function getNotices(userId: string): Promise<MastersNotice[]> {
    const cutoff = new Date(`${shiftDailyDate(dailyDate(), -30)}T00:00:00+08:00`).toISOString();
    const notices: MastersNotice[] = [];
    for (let offset = 0; notices.length < 20; offset += 100) {
      const rows = await db.select({
      id: noticesTable.id, roundId: noticesTable.roundId, kind: noticesTable.kind, leadDays: noticesTable.leadDays,
      dateVersion: noticesTable.dateVersion, createdAt: noticesTable.createdAt, readAt: noticesTable.readAt, round: roundColumns,
    }).from(noticesTable)
      .innerJoin(roundsTable, eq(roundsTable.id, noticesTable.roundId))
      .innerJoin(watchesTable, and(eq(watchesTable.roundId, noticesTable.roundId), eq(watchesTable.userId, noticesTable.userId)))
      .where(and(eq(noticesTable.userId, userId), eq(roundsTable.status, 'published'),
        eq(noticesTable.dateVersion, roundsTable.dateVersion), eq(watchesTable.status, 'preparing'), eq(watchesTable.reminders, true),
        or(isNull(noticesTable.readAt), gte(noticesTable.createdAt, cutoff))))
      .orderBy(sql`${noticesTable.readAt} is not null`, desc(noticesTable.createdAt), asc(noticesTable.id)).limit(100).offset(offset);
      notices.push(...rows.filter(row => row.kind === 'changed' || getMastersRoundState(row.round).leadDays === row.leadDays));
      if (rows.length < 100) break;
    }
    return notices.slice(0, 20);
  }
  async function markNoticesRead(userId: string, ids: string[]): Promise<void> {
    if (!ids.length) return;
    await db.update(noticesTable).set({ readAt: new Date().toISOString() })
      .where(and(eq(noticesTable.userId, userId), inArray(noticesTable.id, ids)));
  }

  return {
    listRounds, listAdminRounds, getRoundsByIds,
    getAutomationRounds, getSummary, saveRound,
    unpublishRound, importSeeds, getWatches,
    saveWatch, removeWatch, syncNotices,
    getNotices, markNoticesRead,
  };
}
