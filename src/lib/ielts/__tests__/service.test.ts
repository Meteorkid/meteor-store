import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * 学习状态的读写：点一下「已学」应该写入时间戳，再点一下清空；
 * 已经收藏过再点已学，不能把收藏一起抹掉。
 */

type Operation = {
  kind: 'select' | 'insert' | 'update' | 'delete';
  table?: unknown;
  values?: Record<string, unknown> | Record<string, unknown>[];
};
const state = vi.hoisted(() => ({ responses: [] as unknown[][], operations: [] as Operation[] }));

vi.mock('@/lib/db', () => {
  function query(kind: Operation['kind'], table?: unknown) {
    const operation: Operation = { kind, table };
    state.operations.push(operation);
    const builder = {
      from(value: unknown) { operation.table = value; return builder; },
      where() { return builder; },
      orderBy() { return builder; },
      limit() { return builder; },
      values(value: Operation['values']) { operation.values = value; return builder; },
      set(value: Record<string, unknown>) { operation.values = value; return builder; },
      onConflictDoUpdate() { return builder; },
      then(resolve: (rows: unknown[]) => unknown, reject?: (error: unknown) => unknown) {
        const response = state.responses.shift() ?? [];
        return Promise.resolve(response).then(resolve, reject);
      },
    };
    return builder;
  }
  return {
    db: {
      select: () => query('select'),
      insert: (table: unknown) => query('insert', table),
      update: (table: unknown) => query('update', table),
      delete: (table: unknown) => query('delete', table),
    },
  };
});

import { toggleIeltsProgress, upsertIeltsPairRow } from '../service';

beforeEach(() => {
  state.responses.length = 0;
  state.operations.length = 0;
});

describe('toggleIeltsProgress', () => {
  it('第一次点已学写入时间戳', async () => {
    state.responses.push([], [], [{ pairSlug: 'pair-a', studiedAt: '2026-11-14T00:00:00.000Z', bookmarkedAt: null }]);
    const entry = await toggleIeltsProgress('user-a', 'pair-a', 'studied');
    expect(entry.studiedAt).toBe('2026-11-14T00:00:00.000Z');
    expect(entry.bookmarkedAt).toBeNull();
    const insert = state.operations.find(operation => operation.kind === 'insert');
    expect(insert?.values).toMatchObject({ userId: 'user-a', pairSlug: 'pair-a', bookmarkedAt: null });
    expect((insert?.values as Record<string, unknown>).studiedAt).toEqual(expect.any(String));
  });

  it('再点一次清空已学，不动收藏', async () => {
    state.responses.push([{ pairSlug: 'pair-a', studiedAt: '2026-11-01T00:00:00.000Z', bookmarkedAt: '2026-11-02T00:00:00.000Z' }], [], [{ pairSlug: 'pair-a', studiedAt: null, bookmarkedAt: '2026-11-02T00:00:00.000Z' }]);
    const entry = await toggleIeltsProgress('user-a', 'pair-a', 'studied');
    expect(entry.studiedAt).toBeNull();
    expect(entry.bookmarkedAt).toBe('2026-11-02T00:00:00.000Z');
    const update = state.operations.find(operation => operation.kind === 'update');
    expect(update?.values).toMatchObject({ studiedAt: null });
    expect(update?.values).not.toHaveProperty('bookmarkedAt');
  });

  it('收藏是独立的字段', async () => {
    state.responses.push([{ pairSlug: 'pair-a', studiedAt: '2026-11-01T00:00:00.000Z', bookmarkedAt: null }], [], [{ pairSlug: 'pair-a', studiedAt: '2026-11-01T00:00:00.000Z', bookmarkedAt: '2026-11-14T00:00:00.000Z' }]);
    const entry = await toggleIeltsProgress('user-a', 'pair-a', 'bookmarked');
    expect(entry.bookmarkedAt).toBe('2026-11-14T00:00:00.000Z');
    const update = state.operations.find(operation => operation.kind === 'update');
    expect(update?.values).not.toHaveProperty('studiedAt');
  });

  it('slug 不合法直接拒绝，不写库', async () => {
    await expect(toggleIeltsProgress('user-a', 'Bad Slug!', 'studied')).rejects.toThrow();
    expect(state.operations).toEqual([]);
  });
});

describe('upsertIeltsPairRow', () => {
  it('写入时把正文过一遍协议', async () => {
    state.responses.push([]);
    await expect(upsertIeltsPairRow({
      slug: 'generated-one', task: 'task2', category: 'opinion', topic: 'education',
      status: 'published', sortOrder: 1, source: 'generated',
      content: { prompt: { en: 'short', zh: '短' } } as never,
    })).rejects.toThrow();
    expect(state.operations).toEqual([]);
  });
});
