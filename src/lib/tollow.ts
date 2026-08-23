import { and, asc, desc, eq, ilike, isNotNull, or, sql, type SQL } from 'drizzle-orm';
import { db } from './db';
import {
  tollowBookProgress,
  tollowPracticeSessions,
  tollowTextFavorites,
} from './db/schema';
import {
  tollowPracticeSessionSchema,
  tollowProgressSchema,
  type TollowBookProgress,
  type TollowFavoriteCreateInput,
  type TollowFavoritePatchInput,
  type TollowFavoritesQuery,
  type TollowPracticeSessionInput,
  type TollowSessionsQuery,
} from './tollow-contract';

export class TollowNotFoundError extends Error {}

export async function listTollowBookProgress(userId: string) {
  return db
    .select({
      bookId: tollowBookProgress.bookId,
      sectionId: tollowBookProgress.sectionId,
      segmentIndex: tollowBookProgress.segmentIndex,
      offset: tollowBookProgress.offset,
      updatedAt: tollowBookProgress.updatedAt,
    })
    .from(tollowBookProgress)
    .where(eq(tollowBookProgress.userId, userId));
}

/** 原子 upsert；只有客户端记录更近时才覆盖服务端位置。 */
export async function upsertTollowBookProgress(
  userId: string,
  progress: TollowBookProgress,
): Promise<TollowBookProgress> {
  const [updated] = await db
    .insert(tollowBookProgress)
    .values({ userId, ...progress })
    .onConflictDoUpdate({
      target: [tollowBookProgress.userId, tollowBookProgress.bookId],
      set: {
        sectionId: progress.sectionId,
        segmentIndex: progress.segmentIndex,
        offset: progress.offset,
        updatedAt: progress.updatedAt,
      },
      setWhere: sql`excluded.updated_at > ${tollowBookProgress.updatedAt}`,
    })
    .returning({
      bookId: tollowBookProgress.bookId,
      sectionId: tollowBookProgress.sectionId,
      segmentIndex: tollowBookProgress.segmentIndex,
      offset: tollowBookProgress.offset,
      updatedAt: tollowBookProgress.updatedAt,
    });

  if (updated) return updated;

  const [current] = await db
    .select({
      bookId: tollowBookProgress.bookId,
      sectionId: tollowBookProgress.sectionId,
      segmentIndex: tollowBookProgress.segmentIndex,
      offset: tollowBookProgress.offset,
      updatedAt: tollowBookProgress.updatedAt,
    })
    .from(tollowBookProgress)
    .where(and(
      eq(tollowBookProgress.userId, userId),
      eq(tollowBookProgress.bookId, progress.bookId),
    ))
    .limit(1);

  return current ?? progress;
}

export async function createTollowPracticeSession(
  userId: string,
  input: TollowPracticeSessionInput,
) {
  const createdAt = new Date().toISOString();
  const id = crypto.randomUUID();
  const [created] = await db
    .insert(tollowPracticeSessions)
    .values({ id, userId, ...input, createdAt })
    .onConflictDoNothing({
      target: [tollowPracticeSessions.userId, tollowPracticeSessions.clientRecordId],
    })
    .returning();

  if (created) return { session: created, created: true };

  const [existing] = await db
    .select()
    .from(tollowPracticeSessions)
    .where(and(
      eq(tollowPracticeSessions.userId, userId),
      eq(tollowPracticeSessions.clientRecordId, input.clientRecordId),
    ))
    .limit(1);

  if (!existing) throw new Error('Tollow session idempotency lookup failed');
  return { session: existing, created: false };
}

export async function listTollowPracticeSessions(
  userId: string,
  query: TollowSessionsQuery,
) {
  const where = eq(tollowPracticeSessions.userId, userId);
  const offset = (query.page - 1) * query.limit;
  const [items, countRows] = await Promise.all([
    db.select()
      .from(tollowPracticeSessions)
      .where(where)
      .orderBy(desc(tollowPracticeSessions.startedAt))
      .limit(query.limit)
      .offset(offset),
    db.select({ count: sql<number>`count(*)::int` })
      .from(tollowPracticeSessions)
      .where(where),
  ]);

  return { items, total: countRows[0]?.count ?? 0, page: query.page, limit: query.limit };
}

export async function createTollowFavorite(
  userId: string,
  input: TollowFavoriteCreateInput,
) {
  const now = new Date().toISOString();
  const [created] = await db
    .insert(tollowTextFavorites)
    .values({
      id: crypto.randomUUID(),
      userId,
      ...input,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoNothing({
      target: [tollowTextFavorites.userId, tollowTextFavorites.clientRecordId],
    })
    .returning();
  if (created) return { favorite: created, created: true };

  const [existing] = await db
    .select()
    .from(tollowTextFavorites)
    .where(and(
      eq(tollowTextFavorites.userId, userId),
      eq(tollowTextFavorites.clientRecordId, input.clientRecordId),
    ))
    .limit(1);
  if (!existing) throw new Error('Tollow favorite idempotency lookup failed');
  return { favorite: existing, created: false };
}

export async function listTollowFavorites(
  userId: string,
  query: TollowFavoritesQuery,
) {
  const conditions: SQL[] = [eq(tollowTextFavorites.userId, userId)];
  if (query.q) {
    const pattern = `%${query.q}%`;
    const search = or(
      ilike(tollowTextFavorites.quote, pattern),
      ilike(tollowTextFavorites.note, pattern),
    );
    if (search) conditions.push(search);
  }
  if (query.bookId) conditions.push(eq(tollowTextFavorites.bookId, query.bookId));
  if (query.tag) conditions.push(sql`${query.tag} = ANY(${tollowTextFavorites.tags})`);

  const where = and(...conditions);
  const order = query.sort === 'updated-asc'
    ? [asc(tollowTextFavorites.updatedAt)]
    : query.sort === 'position'
      ? [
          asc(tollowTextFavorites.bookTitle),
          asc(tollowTextFavorites.sectionTitle),
          asc(tollowTextFavorites.segmentIndex),
          asc(tollowTextFavorites.startOffset),
        ]
      : [desc(tollowTextFavorites.updatedAt)];
  const offset = (query.page - 1) * query.limit;

  const [items, countRows, bookRows, tagRows] = await Promise.all([
    db.select()
      .from(tollowTextFavorites)
      .where(where)
      .orderBy(...order)
      .limit(query.limit)
      .offset(offset),
    db.select({ count: sql<number>`count(*)::int` })
      .from(tollowTextFavorites)
      .where(where),
    db.selectDistinct({
      id: tollowTextFavorites.bookId,
      title: tollowTextFavorites.bookTitle,
    })
      .from(tollowTextFavorites)
      .where(and(
        eq(tollowTextFavorites.userId, userId),
        isNotNull(tollowTextFavorites.bookId),
      ))
      .orderBy(asc(tollowTextFavorites.bookTitle)),
    db.selectDistinct({
      tag: sql<string>`unnest(${tollowTextFavorites.tags})`,
    })
      .from(tollowTextFavorites)
      .where(eq(tollowTextFavorites.userId, userId))
      .orderBy(sql`1`),
  ]);

  const books = bookRows.flatMap((row) => row.id
    ? [{ id: row.id, title: row.title }]
    : []);
  return {
    items,
    total: countRows[0]?.count ?? 0,
    page: query.page,
    limit: query.limit,
    facets: { books, tags: tagRows.map((row) => row.tag) },
  };
}

export async function updateTollowFavorite(
  userId: string,
  id: string,
  input: TollowFavoritePatchInput,
) {
  const [updated] = await db
    .update(tollowTextFavorites)
    .set({ ...input, updatedAt: new Date().toISOString() })
    .where(and(
      eq(tollowTextFavorites.id, id),
      eq(tollowTextFavorites.userId, userId),
    ))
    .returning();

  if (!updated) throw new TollowNotFoundError('收藏不存在');
  return updated;
}

export async function deleteTollowFavorite(userId: string, id: string): Promise<void> {
  const [deleted] = await db
    .delete(tollowTextFavorites)
    .where(and(
      eq(tollowTextFavorites.id, id),
      eq(tollowTextFavorites.userId, userId),
    ))
    .returning({ id: tollowTextFavorites.id });

  if (!deleted) throw new TollowNotFoundError('收藏不存在');
}

export async function importTollowData(
  userId: string,
  batch: { progress: unknown[]; sessions: unknown[] },
) {
  let accepted = 0;
  let duplicate = 0;
  let rejected = 0;

  for (const raw of batch.progress) {
    const parsed = tollowProgressSchema.safeParse(raw);
    if (!parsed.success) {
      rejected += 1;
      continue;
    }
    await upsertTollowBookProgress(userId, parsed.data);
    accepted += 1;
  }

  for (const raw of batch.sessions) {
    const parsed = tollowPracticeSessionSchema.safeParse(raw);
    if (!parsed.success) {
      rejected += 1;
      continue;
    }
    const result = await createTollowPracticeSession(userId, parsed.data);
    if (result.created) accepted += 1;
    else duplicate += 1;
  }

  return { accepted, duplicate, rejected };
}
