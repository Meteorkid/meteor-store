const MAX_IMAGE_BYTES = 5_000_000;
const BLOG_OBJECT_PATTERN = /^blog\/([^/]+)\/([0-9a-f]{16}|[0-9a-f]{64})\.(webp|jpg|png|gif)$/;

export function parseCliArgs(args) {
  const supported = new Set(['--apply', '--dry-run']);
  const unknown = args.find((arg) => !supported.has(arg));
  if (unknown) throw new Error(`未知参数：${unknown}`);
  if (args.includes('--apply') && args.includes('--dry-run')) {
    throw new Error('不能同时使用 --apply 与 --dry-run');
  }
  return { apply: args.includes('--apply') };
}

export function parseBlogObject(object) {
  if (
    typeof object?.Key !== 'string'
    || !Number.isSafeInteger(object.Size)
    || object.Size < 1
    || object.Size > MAX_IMAGE_BYTES
  ) {
    return null;
  }

  const match = BLOG_OBJECT_PATTERN.exec(object.Key);
  if (!match) return null;

  let userId;
  try {
    userId = decodeURIComponent(match[1]);
  } catch {
    return null;
  }
  if (!userId) return null;

  return {
    objectKey: object.Key,
    userId,
    hash: match[2],
    extension: match[3],
    sizeBytes: object.Size,
    legacy: match[2].length === 16,
  };
}

function isStale(row, cutoff) {
  const updatedAt = Date.parse(row.updatedAt);
  return Number.isFinite(updatedAt) && updatedAt <= cutoff;
}

export function buildReconciliationPlan({
  listedObjects,
  dbImages,
  userIds,
  now,
  staleAfterMs,
}) {
  const malformedObjects = [];
  const validObjects = [];
  const r2ByKey = new Map();
  const byUser = {};
  let listedBytes = 0;
  let validBytes = 0;

  for (const listed of listedObjects) {
    if (Number.isSafeInteger(listed?.Size) && listed.Size >= 0) {
      listedBytes += listed.Size;
    }
    const parsed = parseBlogObject(listed);
    if (!parsed) {
      malformedObjects.push({
        objectKey: typeof listed?.Key === 'string' ? listed.Key : null,
        sizeBytes: Number.isSafeInteger(listed?.Size) ? listed.Size : null,
      });
      continue;
    }
    if (r2ByKey.has(parsed.objectKey)) continue;
    r2ByKey.set(parsed.objectKey, parsed);
    validObjects.push(parsed);
    validBytes += parsed.sizeBytes;
    byUser[parsed.userId] = (byUser[parsed.userId] ?? 0) + parsed.sizeBytes;
  }

  const dbByKey = new Map(dbImages.map((row) => [row.objectKey, row]));
  const r2Only = validObjects.filter((object) => !dbByKey.has(object.objectKey));
  const unknownObjects = validObjects.filter((object) => !userIds.has(object.userId));
  const sizeMismatches = [];
  const ownerMismatches = [];
  const malformedDbRows = [];
  const parsedDbRows = new Map();
  const upserts = [];

  for (const object of validObjects) {
    const row = dbByKey.get(object.objectKey);
    if (row && row.sizeBytes !== object.sizeBytes) {
      sizeMismatches.push({ object, row });
    }
    if (row && row.userId !== object.userId) {
      ownerMismatches.push({ object, row });
    }
    if (
      userIds.has(object.userId)
      && (
        !row
        || (
          row.userId === object.userId
          && row.status === 'ready'
          && row.sizeBytes !== object.sizeBytes
        )
      )
    ) {
      upserts.push(object);
    }
  }

  const ownerMismatchKeys = new Set(
    ownerMismatches.map(({ object }) => object.objectKey),
  );
  for (const row of dbImages) {
    const parsed = parseBlogObject({ Key: row.objectKey, Size: Number(row.sizeBytes) });
    if (!parsed) {
      malformedDbRows.push(row);
      continue;
    }
    parsedDbRows.set(row.objectKey, parsed);
    if (!ownerMismatchKeys.has(row.objectKey) && parsed.userId !== row.userId) {
      ownerMismatches.push({ object: parsed, row });
      ownerMismatchKeys.add(row.objectKey);
    }
  }

  const cutoff = now.getTime() - staleAfterMs;
  const canRepairStaleRow = (row) => {
    const parsed = parsedDbRows.get(row.objectKey);
    return Boolean(
      parsed
      && parsed.userId === row.userId
      && userIds.has(row.userId)
      && !ownerMismatchKeys.has(row.objectKey),
    );
  };
  return {
    upserts,
    r2Only,
    unknownObjects,
    malformedObjects,
    dbOnly: dbImages.filter((row) => !r2ByKey.has(row.objectKey)),
    unknownDbUsers: dbImages.filter((row) => !userIds.has(row.userId)),
    malformedDbRows,
    sizeMismatches,
    ownerMismatches,
    staleAllocating: dbImages.filter((row) => (
      row.status === 'allocating'
      && canRepairStaleRow(row)
      && isStale(row, cutoff)
    )),
    staleReserved: dbImages.filter((row) => (
      row.status === 'reserved'
      && canRepairStaleRow(row)
      && isStale(row, cutoff)
    )),
    summary: {
      listedObjectCount: listedObjects.length,
      listedBytes,
      validObjectCount: validObjects.length,
      validBytes,
      byUser,
    },
  };
}

function mutationApplied(result) {
  if (typeof result === 'boolean') return result;
  if (typeof result === 'number') return result > 0;
  if (Array.isArray(result)) return result.length > 0;
  return Number.isFinite(result?.rowCount) && result.rowCount > 0;
}

export async function executeReconciliationPlan({ apply, plan, operations }) {
  const readyRows = [];
  const missingRows = [];
  const result = {
    dryRun: !apply,
    plannedUpserts: plan.upserts.length,
    plannedAllocatingReleases: plan.staleAllocating.length,
    reservedReady: [],
    reservedMissing: [],
    reservedSizeMismatches: [],
    appliedUpserts: 0,
    releasedAllocating: 0,
    markedReady: 0,
    releasedReserved: 0,
    failures: [],
  };

  for (const row of plan.staleReserved) {
    try {
      const head = await operations.headObject(row.objectKey);
      if (!head.exists) {
        result.reservedMissing.push(row.id);
        missingRows.push(row);
        continue;
      }

      if (!Number.isSafeInteger(head.contentLength) || head.contentLength !== row.sizeBytes) {
        const actualSizeBytes = Number.isSafeInteger(head.contentLength)
          ? head.contentLength
          : null;
        result.reservedSizeMismatches.push({
          id: row.id,
          expectedSizeBytes: row.sizeBytes,
          actualSizeBytes,
        });
        result.failures.push({
          id: row.id,
          phase: 'head_size',
          error: actualSizeBytes === null
            ? `R2 ContentLength 缺失，DB=${row.sizeBytes}`
            : `R2/DB 大小不一致：R2=${actualSizeBytes} DB=${row.sizeBytes}`,
        });
        continue;
      }

      result.reservedReady.push(row.id);
      readyRows.push(row);
    } catch (error) {
      result.failures.push({
        id: row.id,
        phase: 'head',
        error: error instanceof Error ? error.message : '未知错误',
      });
    }
  }

  if (!apply) return result;

  const applyRows = async (rows, operation, phase, resultField) => {
    for (const row of rows) {
      try {
        const operationResult = await operation(row);
        if (mutationApplied(operationResult)) result[resultField] += 1;
      } catch (error) {
        result.failures.push({
          id: row.id ?? row.objectKey,
          phase,
          error: error instanceof Error ? error.message : '未知错误',
        });
      }
    }
  };

  await applyRows(plan.upserts, operations.upsertReady, 'upsert', 'appliedUpserts');
  await applyRows(
    plan.staleAllocating,
    operations.deleteAllocating,
    'release_allocating',
    'releasedAllocating',
  );
  await applyRows(readyRows, operations.markReady, 'mark_ready', 'markedReady');
  await applyRows(
    missingRows,
    operations.releaseReserved,
    'release_reserved',
    'releasedReserved',
  );

  try {
    await operations.recalibrate();
  } catch (error) {
    result.failures.push({
      id: null,
      phase: 'recalibrate',
      error: error instanceof Error ? error.message : '未知错误',
    });
  }
  return result;
}
