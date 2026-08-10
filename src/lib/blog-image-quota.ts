import { sql } from 'drizzle-orm';
import { db } from './db';

export const BLOG_IMAGE_USER_LIMIT_BYTES = 200 * 1024 * 1024;
export const BLOG_IMAGE_ADMIN_LIMIT_BYTES = 1024 * 1024 * 1024;
export const BLOG_IMAGE_MAX_BYTES = 5_000_000;
export const BLOG_IMAGE_RESERVATION_STALE_MS = 15 * 60_000;

export interface BlogImageQuotaSnapshot {
  usedBytes: number;
  limitBytes: number;
  remainingBytes: number;
}

interface PrepareBlogImageReservationInput {
  userId: string;
  objectKey: string;
  legacyObjectKey: string;
  sizeBytes: number;
  limitBytes: number;
  now?: Date;
}

export type PrepareBlogImageReservationResult =
  | { kind: 'ready'; key: string; quota: BlogImageQuotaSnapshot }
  | {
      kind: 'reserved';
      reservation: BlogImageReservation;
      quota: BlogImageQuotaSnapshot;
    }
  | {
      kind: 'quota_exceeded';
      quota: BlogImageQuotaSnapshot;
      requestedBytes: number;
    }
  | {
      kind: 'in_progress';
      retryAfter: number;
      reservation: BlogImagePendingReservation;
    };

export interface BlogImageReservation {
  id: string;
  key: string;
  sizeBytes: number;
  updatedAt: string;
}

export interface BlogImagePendingReservation extends BlogImageReservation {
  status: 'allocating' | 'reserved';
}

interface ClaimedImageRow {
  source: 'existing' | 'allocated';
  id: string;
  object_key: string;
  size_bytes: number | string;
  status: 'allocating' | 'reserved' | 'ready';
  updated_at: string;
  used_bytes: number | string;
}

interface ReservedImageRow {
  reservation_found: boolean;
  reserved: boolean;
  object_key: string | null;
  size_bytes: number | string | null;
  used_bytes: number | string | null;
  updated_at: string | null;
}

interface RemovedAllocationRow {
  removed: boolean;
  used_bytes: number | string;
}

interface ConfirmedImageRow {
  confirmed: boolean;
  used_bytes: number | string;
}

interface ReleasedImageRow {
  released: boolean;
  used_bytes: number | string | null;
}

export function getBlogImageLimitBytes(isAdmin: boolean): number {
  return isAdmin ? BLOG_IMAGE_ADMIN_LIMIT_BYTES : BLOG_IMAGE_USER_LIMIT_BYTES;
}

function quotaSnapshot(usedBytes: number, limitBytes: number): BlogImageQuotaSnapshot {
  return {
    usedBytes,
    limitBytes,
    remainingBytes: Math.max(0, limitBytes - usedBytes),
  };
}

export async function prepareBlogImageReservation(
  input: PrepareBlogImageReservationInput,
): Promise<PrepareBlogImageReservationResult> {
  const now = (input.now ?? new Date()).toISOString();
  const reservationId = crypto.randomUUID();
  const claimOrFind = () => db.execute(sql`
    WITH existing AS MATERIALIZED (
      SELECT
        image.id,
        image.object_key,
        image.size_bytes,
        image.status,
        image.updated_at,
        owner.blog_image_bytes AS used_bytes
      FROM blog_images AS image
      INNER JOIN users AS owner ON owner.id = image.user_id
      WHERE image.user_id = ${input.userId}
        AND image.object_key IN (${input.objectKey}, ${input.legacyObjectKey})
      ORDER BY
        CASE WHEN image.status = 'ready' THEN 0 ELSE 1 END,
        CASE WHEN image.object_key = ${input.objectKey} THEN 0 ELSE 1 END
      LIMIT 1
    ), allocated AS (
      INSERT INTO blog_images (
        id, user_id, object_key, size_bytes, status, created_at, updated_at, uploaded_at
      )
      SELECT
        ${reservationId}, owner.id, ${input.objectKey}, ${input.sizeBytes},
        'allocating', ${now}, ${now}, NULL
      FROM users AS owner
      WHERE owner.id = ${input.userId}
        AND NOT EXISTS (SELECT 1 FROM existing)
      ON CONFLICT (object_key) DO NOTHING
      RETURNING id, object_key, size_bytes, status, updated_at
    )
    SELECT
      'existing' AS source,
      existing.id,
      existing.object_key,
      existing.size_bytes,
      existing.status,
      existing.updated_at,
      existing.used_bytes
    FROM existing
    UNION ALL
    SELECT
      'allocated' AS source,
      allocated.id,
      allocated.object_key,
      allocated.size_bytes,
      allocated.status,
      allocated.updated_at,
      owner.blog_image_bytes AS used_bytes
    FROM allocated
    INNER JOIN users AS owner ON owner.id = ${input.userId}
    LIMIT 1
  `);
  let result = await claimOrFind();
  let row = (result.rows as unknown as ClaimedImageRow[])[0];
  if (!row) {
    // ON CONFLICT 可能由另一个尚未在本语句快照中可见的请求获胜；新语句读取最新状态。
    result = await claimOrFind();
    row = (result.rows as unknown as ClaimedImageRow[])[0];
  }
  if (row?.source === 'existing' && row.status === 'ready') {
    const usedBytes = Number(row.used_bytes);
    return {
      kind: 'ready',
      key: row.object_key,
      quota: quotaSnapshot(usedBytes, input.limitBytes),
    };
  }
  if (
    row?.source === 'existing'
    && (row.status === 'allocating' || row.status === 'reserved')
  ) {
    return {
      kind: 'in_progress',
      retryAfter: 2,
      reservation: {
        id: row.id,
        key: row.object_key,
        sizeBytes: Number(row.size_bytes),
        status: row.status,
        updatedAt: row.updated_at,
      },
    };
  }
  if (row?.source === 'allocated') {
    const reservedResult = await db.execute(sql`
      WITH reservation AS MATERIALIZED (
        SELECT id, object_key, size_bytes
        FROM blog_images
        WHERE id = ${row.id}
          AND user_id = ${input.userId}
          AND status = 'allocating'
        FOR UPDATE
      ), charged AS (
        UPDATE users
        SET blog_image_bytes = blog_image_bytes + (
          SELECT size_bytes FROM reservation
        )
        WHERE id = ${input.userId}
          AND EXISTS (SELECT 1 FROM reservation)
          AND blog_image_bytes + (
            SELECT size_bytes FROM reservation
          ) <= ${input.limitBytes}
        RETURNING blog_image_bytes
      ), reserved AS (
        UPDATE blog_images
        SET status = 'reserved', updated_at = ${now}
        WHERE id = (SELECT id FROM reservation)
          AND user_id = ${input.userId}
          AND status = 'allocating'
          AND EXISTS (SELECT 1 FROM charged)
        RETURNING object_key, size_bytes, updated_at
      )
      SELECT
        EXISTS (SELECT 1 FROM reservation) AS reservation_found,
        EXISTS (SELECT 1 FROM reserved) AS reserved,
        (SELECT object_key FROM reserved) AS object_key,
        (SELECT size_bytes FROM reserved) AS size_bytes,
        (SELECT blog_image_bytes FROM charged) AS used_bytes,
        (SELECT updated_at FROM reserved) AS updated_at
    `);
    const reserved = (reservedResult.rows as unknown as ReservedImageRow[])[0];
    if (reserved?.reservation_found && reserved.reserved) {
      const usedBytes = Number(reserved.used_bytes);
      return {
        kind: 'reserved',
        reservation: {
          id: row.id,
          key: String(reserved.object_key),
          sizeBytes: Number(reserved.size_bytes),
          updatedAt: String(reserved.updated_at),
        },
        quota: quotaSnapshot(usedBytes, input.limitBytes),
      };
    }
    if (reserved?.reservation_found) {
      const cleanupResult = await db.execute(sql`
        WITH removed AS (
          DELETE FROM blog_images
          WHERE id = ${row.id}
            AND user_id = ${input.userId}
            AND status = 'allocating'
          RETURNING id
        )
        SELECT
          EXISTS (SELECT 1 FROM removed) AS removed,
          blog_image_bytes AS used_bytes
        FROM users
        WHERE id = ${input.userId}
      `);
      const cleanup = (cleanupResult.rows as unknown as RemovedAllocationRow[])[0];
      if (!cleanup?.removed) {
        throw new Error('Blog image allocation cleanup failed');
      }
      const usedBytes = Number(cleanup.used_bytes);
      return {
        kind: 'quota_exceeded',
        quota: quotaSnapshot(usedBytes, input.limitBytes),
        requestedBytes: input.sizeBytes,
      };
    }
  }
  throw new Error('Blog image reservation is not ready');
}

export async function confirmBlogImageReservation(input: {
  reservationId: string;
  userId: string;
  limitBytes: number;
  now?: Date;
}): Promise<BlogImageQuotaSnapshot | null> {
  const confirmedAt = (input.now ?? new Date()).toISOString();
  const result = await db.execute(sql`
    WITH confirmed AS (
      UPDATE blog_images
      SET
        status = 'ready',
        updated_at = ${confirmedAt},
        uploaded_at = ${confirmedAt}
      WHERE id = ${input.reservationId}
        AND user_id = ${input.userId}
        AND status IN ('reserved', 'ready')
      RETURNING id
    )
    SELECT
      EXISTS (SELECT 1 FROM confirmed) AS confirmed,
      blog_image_bytes AS used_bytes
    FROM users
    WHERE id = ${input.userId}
  `);
  const row = (result.rows as unknown as ConfirmedImageRow[])[0];
  if (!row?.confirmed) return null;
  return quotaSnapshot(Number(row.used_bytes), input.limitBytes);
}

export async function releaseBlogImageReservation(input: {
  reservationId: string;
  userId: string;
  limitBytes: number;
}): Promise<BlogImageQuotaSnapshot | null> {
  // counter 小于 reservation 表示账本已漂移；此时保留 reserved 供对账，不能归零掩盖异常。
  const result = await db.execute(sql`
    WITH reservation AS MATERIALIZED (
      SELECT id, size_bytes
      FROM blog_images
      WHERE id = ${input.reservationId}
        AND user_id = ${input.userId}
        AND status = 'reserved'
      FOR UPDATE
    ), adjusted AS (
      UPDATE users AS owner
      SET blog_image_bytes = owner.blog_image_bytes - reservation.size_bytes
      FROM reservation
      WHERE owner.id = ${input.userId}
        AND owner.blog_image_bytes >= reservation.size_bytes
      RETURNING owner.blog_image_bytes
    ), released AS (
      DELETE FROM blog_images AS image
      USING reservation
      WHERE image.id = reservation.id
        AND image.user_id = ${input.userId}
        AND image.status = 'reserved'
        AND EXISTS (SELECT 1 FROM adjusted)
      RETURNING image.size_bytes
    )
    SELECT
      EXISTS (SELECT 1 FROM released) AS released,
      COALESCE(
        (SELECT blog_image_bytes FROM adjusted),
        (SELECT blog_image_bytes FROM users WHERE id = ${input.userId})
      ) AS used_bytes
  `);
  const row = (result.rows as unknown as ReleasedImageRow[])[0];
  if (!row?.released || row.used_bytes === null) return null;
  return quotaSnapshot(Number(row.used_bytes), input.limitBytes);
}

export async function discardBlogImageAllocation(input: {
  reservationId: string;
  userId: string;
  expectedUpdatedAt: string;
}): Promise<boolean> {
  const result = await db.execute(sql`
    WITH discarded AS (
      DELETE FROM blog_images
      WHERE id = ${input.reservationId}
        AND user_id = ${input.userId}
        AND status = 'allocating'
        AND updated_at = ${input.expectedUpdatedAt}
      RETURNING id
    )
    SELECT EXISTS (SELECT 1 FROM discarded) AS discarded
  `);
  return Boolean((result.rows as unknown as Array<{ discarded: boolean }>)[0]?.discarded);
}
