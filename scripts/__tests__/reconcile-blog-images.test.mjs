import { describe, expect, it, vi } from 'vitest';
import {
  buildReconciliationPlan,
  executeReconciliationPlan,
  parseBlogObject,
  parseCliArgs,
} from '../reconcile-blog-images-lib.mjs';

describe('reconcile-blog-images 参数与对象解析', () => {
  it('默认 dry-run，只有显式 --apply 才允许写入', () => {
    expect(parseCliArgs([])).toEqual({ apply: false });
    expect(parseCliArgs(['--dry-run'])).toEqual({ apply: false });
    expect(parseCliArgs(['--apply'])).toEqual({ apply: true });
    expect(() => parseCliArgs(['--apply', '--dry-run'])).toThrow('不能同时');
    expect(() => parseCliArgs(['--unknown'])).toThrow('未知参数');
  });

  it('只接受 blog/ 下 URL 编码用户与 16/64 位小写哈希对象', () => {
    expect(parseBlogObject({
      Key: 'blog/user%2Fone/0123456789abcdef.webp',
      Size: 123,
    })).toEqual({
      objectKey: 'blog/user%2Fone/0123456789abcdef.webp',
      userId: 'user/one',
      hash: '0123456789abcdef',
      extension: 'webp',
      sizeBytes: 123,
      legacy: true,
    });
    expect(parseBlogObject({
      Key: `blog/U1/${'a'.repeat(64)}.jpg`,
      Size: 5_000_000,
    })).toMatchObject({ userId: 'U1', legacy: false, sizeBytes: 5_000_000 });

    for (const object of [
      { Key: 'avatars/U1/0123456789abcdef.webp', Size: 10 },
      { Key: 'blog/U1/not-a-hash.webp', Size: 10 },
      { Key: 'blog/%ZZ/0123456789abcdef.webp', Size: 10 },
      { Key: 'blog/U1/0123456789abcdef.svg', Size: 10 },
      { Key: 'blog/U1/0123456789abcdef.webp', Size: 0 },
      { Key: 'blog/U1/0123456789abcdef.webp', Size: 5_000_001 },
    ]) {
      expect(parseBlogObject(object)).toBeNull();
    }
  });
});

describe('reconcile-blog-images 对账计划', () => {
  it('区分回填、未知用户、异常对象和 DB/R2 差异，重复计划不再写匹配行', () => {
    const legacyKey = 'blog/U1/0123456789abcdef.webp';
    const readyKey = `blog/U1/${'a'.repeat(64)}.png`;
    const mismatchKey = `blog/U1/${'b'.repeat(64)}.gif`;
    const ownerMismatchKey = `blog/U1/${'c'.repeat(64)}.jpg`;
    const unknownKey = `blog/U2/${'d'.repeat(64)}.webp`;
    const dbOnlyKey = `blog/U1/${'e'.repeat(64)}.webp`;
    const listedObjects = [
      { Key: legacyKey, Size: 100 },
      { Key: readyKey, Size: 200 },
      { Key: mismatchKey, Size: 301 },
      { Key: ownerMismatchKey, Size: 400 },
      { Key: unknownKey, Size: 500 },
      { Key: 'blog/U1/not-a-hash.webp', Size: 600 },
    ];
    const dbImages = [
      { id: 'ready', userId: 'U1', objectKey: readyKey, sizeBytes: 200, status: 'ready', updatedAt: '2026-08-10T00:00:00.000Z' },
      { id: 'size', userId: 'U1', objectKey: mismatchKey, sizeBytes: 300, status: 'ready', updatedAt: '2026-08-10T00:00:00.000Z' },
      { id: 'owner', userId: 'U2', objectKey: ownerMismatchKey, sizeBytes: 400, status: 'ready', updatedAt: '2026-08-10T00:00:00.000Z' },
      { id: 'db-only', userId: 'U1', objectKey: dbOnlyKey, sizeBytes: 700, status: 'ready', updatedAt: '2026-08-10T00:00:00.000Z' },
    ];

    const plan = buildReconciliationPlan({
      listedObjects,
      dbImages,
      userIds: new Set(['U1']),
      now: new Date('2026-08-10T01:00:00.000Z'),
      staleAfterMs: 15 * 60_000,
    });

    expect(plan.upserts.map((object) => object.objectKey)).toEqual([
      legacyKey,
      mismatchKey,
    ]);
    expect(plan.r2Only.map((object) => object.objectKey)).toEqual([legacyKey, unknownKey]);
    expect(plan.unknownObjects.map((object) => object.objectKey)).toEqual([unknownKey]);
    expect(plan.malformedObjects).toEqual([
      { objectKey: 'blog/U1/not-a-hash.webp', sizeBytes: 600 },
    ]);
    expect(plan.dbOnly.map((row) => row.objectKey)).toEqual([dbOnlyKey]);
    expect(plan.sizeMismatches).toHaveLength(1);
    expect(plan.ownerMismatches).toHaveLength(1);
    expect(plan.summary).toMatchObject({
      listedObjectCount: 6,
      listedBytes: 2101,
      validObjectCount: 5,
      validBytes: 1501,
      byUser: { U1: 1001, U2: 500 },
    });

    const afterApply = buildReconciliationPlan({
      listedObjects,
      dbImages: [
        ...dbImages.filter((row) => row.objectKey !== mismatchKey),
        { id: 'legacy', userId: 'U1', objectKey: legacyKey, sizeBytes: 100, status: 'ready', updatedAt: '2026-08-10T01:00:00.000Z' },
        { id: 'size', userId: 'U1', objectKey: mismatchKey, sizeBytes: 301, status: 'ready', updatedAt: '2026-08-10T01:00:00.000Z' },
      ],
      userIds: new Set(['U1']),
      now: new Date('2026-08-10T01:01:00.000Z'),
      staleAfterMs: 15 * 60_000,
    });
    expect(afterApply.upserts).toEqual([]);
  });

  it('只修复超过阈值且 key 合法、owner 匹配的 allocating 和 reserved', () => {
    const ownerMismatchKey = `blog/U1/${'f'.repeat(64)}.webp`;
    const dbOnlyOwnerMismatchKey = `blog/U2/${'e'.repeat(64)}.webp`;
    const plan = buildReconciliationPlan({
      listedObjects: [{ Key: ownerMismatchKey, Size: 50 }],
      dbImages: [
        { id: 'A-old', userId: 'U1', objectKey: `blog/U1/${'a'.repeat(64)}.webp`, sizeBytes: 10, status: 'allocating', updatedAt: '2026-08-10T00:00:00.000Z' },
        { id: 'R-old', userId: 'U1', objectKey: `blog/U1/${'b'.repeat(64)}.webp`, sizeBytes: 20, status: 'reserved', updatedAt: '2026-08-10T00:00:00.000Z' },
        { id: 'R-new', userId: 'U1', objectKey: `blog/U1/${'c'.repeat(64)}.webp`, sizeBytes: 30, status: 'reserved', updatedAt: '2026-08-10T00:55:00.000Z' },
        { id: 'R-invalid-time', userId: 'U1', objectKey: `blog/U1/${'d'.repeat(64)}.webp`, sizeBytes: 30, status: 'reserved', updatedAt: 'not-a-date' },
        { id: 'ready', userId: 'U1', objectKey: `blog/U1/${'0'.repeat(64)}.webp`, sizeBytes: 40, status: 'ready', updatedAt: '2026-08-09T00:00:00.000Z' },
        { id: 'A-malformed', userId: 'U1', objectKey: 'a', sizeBytes: 10, status: 'allocating', updatedAt: '2026-08-09T00:00:00.000Z' },
        { id: 'R-malformed', userId: 'U1', objectKey: 'r', sizeBytes: 20, status: 'reserved', updatedAt: '2026-08-09T00:00:00.000Z' },
        { id: 'A-unknown', userId: 'U2', objectKey: `blog/U2/${'1'.repeat(64)}.webp`, sizeBytes: 40, status: 'allocating', updatedAt: '2026-08-09T00:00:00.000Z' },
        { id: 'A-owner-db-only', userId: 'U1', objectKey: dbOnlyOwnerMismatchKey, sizeBytes: 40, status: 'allocating', updatedAt: '2026-08-09T00:00:00.000Z' },
        { id: 'R-unknown', userId: 'U2', objectKey: `blog/U2/${'2'.repeat(64)}.webp`, sizeBytes: 40, status: 'reserved', updatedAt: '2026-08-09T00:00:00.000Z' },
        { id: 'R-owner-mismatch', userId: 'U2', objectKey: ownerMismatchKey, sizeBytes: 50, status: 'reserved', updatedAt: '2026-08-09T00:00:00.000Z' },
      ],
      userIds: new Set(['U1']),
      now: new Date('2026-08-10T01:00:00.000Z'),
      staleAfterMs: 15 * 60_000,
    });

    expect(plan.staleAllocating.map((row) => row.id)).toEqual(['A-old']);
    expect(plan.staleReserved.map((row) => row.id)).toEqual(['R-old']);
    expect(plan.malformedDbRows.map((row) => row.id)).toEqual([
      'A-malformed',
      'R-malformed',
    ]);
    expect(plan.unknownDbUsers.map((row) => row.id)).toEqual([
      'A-unknown',
      'R-unknown',
      'R-owner-mismatch',
    ]);
    expect(plan.ownerMismatches.map(({ row }) => row.id)).toEqual([
      'R-owner-mismatch',
      'A-owner-db-only',
    ]);
  });

  it('dry-run 可以 HEAD 判断 reserved，但绝不执行数据库写入', async () => {
    const writes = {
      upsertReady: vi.fn(),
      deleteAllocating: vi.fn(),
      markReady: vi.fn(),
      releaseReserved: vi.fn(),
      recalibrate: vi.fn(),
    };
    const headObject = vi.fn().mockResolvedValue({ exists: true, contentLength: 20 });
    const result = await executeReconciliationPlan({
      apply: false,
      plan: {
        upserts: [{ objectKey: 'backfill' }],
        staleAllocating: [{ id: 'A1' }],
        staleReserved: [{ id: 'R1', objectKey: 'reserved', sizeBytes: 20 }],
      },
      operations: { ...writes, headObject },
    });

    expect(headObject).toHaveBeenCalledWith('reserved');
    expect(Object.values(writes).every((operation) => operation.mock.calls.length === 0)).toBe(true);
    expect(result).toMatchObject({
      dryRun: true,
      plannedUpserts: 1,
      plannedAllocatingReleases: 1,
      reservedReady: ['R1'],
      reservedMissing: [],
      failures: [],
    });
  });

  it('已有 reservation 不走普通 upsert，reserved 的 HEAD 异常时保留原状态', async () => {
    const key = `blog/U1/${'9'.repeat(64)}.webp`;
    const allocatingKey = `blog/U1/${'8'.repeat(64)}.webp`;
    const row = {
      id: 'R-listed',
      userId: 'U1',
      objectKey: key,
      sizeBytes: 128,
      status: 'reserved',
      updatedAt: '2026-08-10T00:00:00.000Z',
    };
    const allocatingRow = {
      id: 'A-listed',
      userId: 'U1',
      objectKey: allocatingKey,
      sizeBytes: 64,
      status: 'allocating',
      updatedAt: '2026-08-10T00:00:00.000Z',
    };
    const plan = buildReconciliationPlan({
      listedObjects: [
        { Key: key, Size: 128 },
        { Key: allocatingKey, Size: 64 },
      ],
      dbImages: [row, allocatingRow],
      userIds: new Set(['U1']),
      now: new Date('2026-08-10T01:00:00.000Z'),
      staleAfterMs: 15 * 60_000,
    });
    expect(plan.upserts).toEqual([]);

    const operations = {
      upsertReady: vi.fn(),
      deleteAllocating: vi.fn().mockResolvedValue(true),
      headObject: vi.fn().mockRejectedValue(new Error('HEAD 网络异常')),
      markReady: vi.fn(),
      releaseReserved: vi.fn(),
      recalibrate: vi.fn().mockResolvedValue(undefined),
    };
    const result = await executeReconciliationPlan({ apply: true, plan, operations });

    expect(operations.headObject).toHaveBeenCalledWith(key);
    expect(operations.upsertReady).not.toHaveBeenCalled();
    expect(operations.deleteAllocating).toHaveBeenCalledWith(allocatingRow);
    expect(operations.markReady).not.toHaveBeenCalled();
    expect(operations.releaseReserved).not.toHaveBeenCalled();
    expect(result.failures).toEqual([
      { id: 'R-listed', phase: 'head', error: 'HEAD 网络异常' },
    ]);
    expect(result.releasedAllocating).toBe(1);
  });

  it('apply 幂等回填并按 HEAD 结果修复超时状态，最后统一校准计数', async () => {
    const operations = {
      upsertReady: vi.fn().mockResolvedValue(true),
      deleteAllocating: vi.fn().mockResolvedValue(true),
      headObject: vi.fn(async (key) => {
        if (key === 'exists') return { exists: true, contentLength: 128 };
        if (key === 'missing') return { exists: false };
        throw new Error('HEAD 暂时失败');
      }),
      markReady: vi.fn().mockResolvedValue(true),
      releaseReserved: vi.fn().mockResolvedValue(true),
      recalibrate: vi.fn().mockResolvedValue(undefined),
    };
    const upserts = [{ objectKey: 'one' }, { objectKey: 'two' }];
    const allocating = [{ id: 'A1' }];
    const reserved = [
      { id: 'R-ready', objectKey: 'exists', sizeBytes: 128 },
      { id: 'R-release', objectKey: 'missing', sizeBytes: 64 },
      { id: 'R-failed', objectKey: 'failed', sizeBytes: 32 },
    ];

    const result = await executeReconciliationPlan({
      apply: true,
      plan: {
        upserts,
        staleAllocating: allocating,
        staleReserved: reserved,
      },
      operations,
    });

    expect(operations.upsertReady.mock.calls).toEqual([[upserts[0]], [upserts[1]]]);
    expect(operations.deleteAllocating).toHaveBeenCalledWith(allocating[0]);
    expect(operations.markReady).toHaveBeenCalledWith(reserved[0]);
    expect(operations.releaseReserved).toHaveBeenCalledWith(reserved[1]);
    expect(operations.recalibrate).toHaveBeenCalledOnce();
    expect(result).toMatchObject({
      dryRun: false,
      appliedUpserts: 2,
      releasedAllocating: 1,
      markedReady: 1,
      releasedReserved: 1,
      failures: [{ id: 'R-failed', phase: 'head', error: 'HEAD 暂时失败' }],
    });
  });

  it('HEAD 长度缺失或与账本不一致时保留 reserved 并报告', async () => {
    const reserved = [
      { id: 'R-ready', objectKey: 'match', sizeBytes: 128 },
      { id: 'R-mismatch', objectKey: 'mismatch', sizeBytes: 64 },
      { id: 'R-no-length', objectKey: 'no-length', sizeBytes: 32 },
      { id: 'R-missing', objectKey: 'missing', sizeBytes: 16 },
    ];
    const operations = {
      upsertReady: vi.fn(),
      deleteAllocating: vi.fn(),
      headObject: vi.fn(async (key) => {
        if (key === 'match') return { exists: true, contentLength: 128 };
        if (key === 'mismatch') return { exists: true, contentLength: 65 };
        if (key === 'no-length') return { exists: true };
        return { exists: false };
      }),
      markReady: vi.fn().mockResolvedValue(true),
      releaseReserved: vi.fn().mockResolvedValue(true),
      recalibrate: vi.fn().mockResolvedValue(undefined),
    };

    const result = await executeReconciliationPlan({
      apply: true,
      plan: { upserts: [], staleAllocating: [], staleReserved: reserved },
      operations,
    });

    expect(operations.markReady).toHaveBeenCalledTimes(1);
    expect(operations.markReady).toHaveBeenCalledWith(reserved[0]);
    expect(operations.releaseReserved).toHaveBeenCalledTimes(1);
    expect(operations.releaseReserved).toHaveBeenCalledWith(reserved[3]);
    expect(result.reservedSizeMismatches).toEqual([
      { id: 'R-mismatch', expectedSizeBytes: 64, actualSizeBytes: 65 },
      { id: 'R-no-length', expectedSizeBytes: 32, actualSizeBytes: null },
    ]);
    expect(result.failures).toEqual([
      {
        id: 'R-mismatch',
        phase: 'head_size',
        error: 'R2/DB 大小不一致：R2=65 DB=64',
      },
      {
        id: 'R-no-length',
        phase: 'head_size',
        error: 'R2 ContentLength 缺失，DB=32',
      },
    ]);
    expect(result).toMatchObject({
      reservedReady: ['R-ready'],
      reservedMissing: ['R-missing'],
      markedReady: 1,
      releasedReserved: 1,
    });
  });

  it('CAS 未命中时不虚报为已修复', async () => {
    const result = await executeReconciliationPlan({
      apply: true,
      plan: {
        upserts: [{ objectKey: 'upsert-race' }],
        staleAllocating: [{ id: 'A-race' }],
        staleReserved: [
          { id: 'R-ready-race', objectKey: 'exists', sizeBytes: 100 },
          { id: 'R-missing-race', objectKey: 'missing', sizeBytes: 200 },
        ],
      },
      operations: {
        upsertReady: vi.fn().mockResolvedValue(false),
        deleteAllocating: vi.fn().mockResolvedValue({ rowCount: 0 }),
        headObject: vi.fn(async (key) => (
          key === 'exists'
            ? { exists: true, contentLength: 100 }
            : { exists: false }
        )),
        markReady: vi.fn().mockResolvedValue([]),
        releaseReserved: vi.fn().mockResolvedValue(0),
        recalibrate: vi.fn().mockResolvedValue(undefined),
      },
    });

    expect(result).toMatchObject({
      appliedUpserts: 0,
      releasedAllocating: 0,
      markedReady: 0,
      releasedReserved: 0,
      failures: [],
    });
  });
});
