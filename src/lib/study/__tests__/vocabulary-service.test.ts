import { PgDialect } from 'drizzle-orm/pg-core';
import type { SQL } from 'drizzle-orm';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { studyVocabulary } from '@/lib/db/schema';
import type { VocabularyEntry } from '../vocabulary-types';

type Operation = {
  kind: 'select' | 'insert' | 'update' | 'delete';
  table?: unknown; columns?: Record<string, unknown>; where?: SQL;
  values?: Record<string, unknown>; limit?: number; conflict?: unknown;
};
const state = vi.hoisted(() => ({ responses: [] as unknown[][], operations: [] as Operation[], count: 9 }));
vi.mock('@/lib/db', () => {
  function query(kind: Operation['kind'], table?: unknown, columns?: Record<string, unknown>) {
    const operation: Operation = { kind, table, columns };
    state.operations.push(operation);
    const builder = {
      from(value: unknown) { operation.table = value; return builder; },
      where(value: SQL) { operation.where = value; return builder; },
      orderBy() { return builder; },
      limit(value: number) { operation.limit = value; return builder; },
      values(value: Record<string, unknown>) { operation.values = value; return builder; },
      set(value: Record<string, unknown>) { operation.values = value; return builder; },
      onConflictDoNothing(value: unknown) { operation.conflict = value; return builder; },
      returning(value: Record<string, unknown>) { operation.columns = value; return builder; },
      then(resolve: (rows: unknown[]) => unknown, reject?: (error: unknown) => unknown) {
        const response = operation.columns?.count ? [{ count: state.count }] : state.responses.shift() ?? [];
        return Promise.resolve(response).then(resolve, reject);
      },
    };
    return builder;
  }
  return { db: {
    select: (columns: Record<string, unknown>) => query('select', undefined, columns),
    insert: (table: unknown) => query('insert', table),
    update: (table: unknown) => query('update', table),
    delete: (table: unknown) => query('delete', table),
  } };
});

import {
  countDueVocabulary, deleteVocabulary, findVocabularyBySourceKey, listDueVocabulary, listVocabulary,
  reviewVocabulary, saveVocabulary, VocabularyConflictError, VocabularyInputError,
} from '../vocabulary-service';

const entry: VocabularyEntry = {
  id: '11111111-1111-4111-8111-111111111111', sourceKey: 'a'.repeat(64),
  snapshot: {
    word: 'bank', lemma: 'bank', partOfSpeech: 'noun', meaningZh: '银行', usageZh: '', source: 'lesson',
    sentence: 'The bank is open.', sentenceZh: null, pairSlug: 'local-banks', titleZh: '本地银行',
    titleEn: 'Local banks', side: 'high', segmentIndex: 0,
  },
  reviewStage: 0, reviewDueOn: '2026-11-14', reviewIntervalDays: 1,
  lastReviewedOn: null, revision: 1, createdAt: '2026-11-13T00:00:00.000Z', updatedAt: '2026-11-13T00:00:00.000Z',
};
function sqlOf(value: SQL | undefined) {
  if (!value) throw new Error('Expected a guarded SQL clause');
  return new PgDialect().sqlToQuery(value);
}
function writes() { return state.operations.filter(operation => operation.kind !== 'select'); }

beforeEach(() => {
  state.responses = []; state.operations = []; state.count = 9;
  vi.useFakeTimers(); vi.setSystemTime(new Date('2026-11-13T16:01:00Z'));
});
afterEach(() => vi.useRealTimers());

describe('生词收藏的账号归属与幂等性', () => {
  it('新收藏排期北京时间明天，唯一约束冲突不更新任何已有字段', async () => {
    state.responses.push([entry]);
    expect(await saveVocabulary('user-a', entry.snapshot)).toEqual({ entry, created: true });
    const [insert] = writes();
    expect(insert.table).toBe(studyVocabulary);
    expect(insert.values).toMatchObject({ userId: 'user-a', snapshot: entry.snapshot, reviewDueOn: '2026-11-15', revision: 1, reviewStage: 0 });
    expect(insert.conflict).toEqual({ target: [studyVocabulary.userId, studyVocabulary.sourceKey] });
    expect(insert.columns).not.toHaveProperty('userId');
  });

  it('重复收藏回读原有快照与进度，不重置复习', async () => {
    const advanced = { ...entry, reviewStage: 3, revision: 4 };
    state.responses.push([], [advanced]);
    expect(await saveVocabulary('user-a', { ...entry.snapshot, meaningZh: '新版释义' })).toEqual({ entry: advanced, created: false });
    expect(writes().map(operation => operation.kind)).toEqual(['insert']);
    const select = state.operations[1];
    expect(sqlOf(select.where).params[0]).toBe('user-a');
    expect(select.columns).not.toHaveProperty('userId');
  });

  it('按来源查询、到期列表、计数及删除都限定账号', async () => {
    await findVocabularyBySourceKey('user-a', entry.sourceKey);
    await listDueVocabulary('user-a');
    expect(await countDueVocabulary('user-a')).toBe(9);
    expect(await deleteVocabulary('user-a', entry.id)).toBe(false);
    for (const operation of state.operations) {
      const clause = sqlOf(operation.where);
      expect(clause.sql).toContain('"study_vocabulary"."user_id"');
      expect(clause.params[0]).toBe('user-a');
    }
    expect(sqlOf(state.operations[1].where).sql).toContain('<=');
    expect(sqlOf(state.operations[1].where).params).toContain('2026-11-14');
  });
});

describe('生词列表服务端筛选与游标', () => {
  it('多取一条产生游标，下一页用createdAt和id稳定定位', async () => {
    const second = { ...entry, id: '22222222-2222-4222-8222-222222222222' };
    state.responses.push([entry, second]);
    const first = await listVocabulary('user-a', { limit: 1, query: 'bank', dueOnly: true });
    expect(first).toMatchObject({ entries: [entry], total: 9, dueCount: 9 });
    expect(first.nextCursor).not.toBeNull();
    expect(state.operations[0].limit).toBe(2);
    const filtered = sqlOf(state.operations[0].where);
    expect(filtered.sql).toContain('ILIKE');
    expect(filtered.params).toContain('%bank%');
    expect(filtered.params).toContain('2026-11-14');
    const unfilteredCount = sqlOf(state.operations[2].where);
    expect(unfilteredCount.sql).not.toContain('ILIKE');

    state.operations = []; state.responses.push([second]);
    const next = await listVocabulary('user-a', { limit: 1, cursor: first.nextCursor! });
    expect(next.nextCursor).toBeNull();
    const condition = sqlOf(state.operations[0].where);
    expect(condition.sql).toContain('"study_vocabulary"."created_at" <');
    expect(condition.sql).toContain('"study_vocabulary"."id" <');
    expect(condition.params).toContain(entry.id);
  });

  it('搜索中的SQL通配符按文字匹配，非法游标不静默回第一页', async () => {
    await listVocabulary('user-a', { query: '%_\\' });
    expect(sqlOf(state.operations[0].where).params).toContain('%\\%\\_\\\\%');
    await expect(listVocabulary('user-a', { cursor: 'invalid' })).rejects.toBeInstanceOf(VocabularyInputError);
    await expect(listVocabulary('user-a', { limit: 101 })).rejects.toBeInstanceOf(VocabularyInputError);
  });
});

describe('复习到期与并发条件更新', () => {
  it('记得推进一档，并用owner、revision、原到期日和今天限制更新', async () => {
    state.responses.push([entry], [{ ...entry, revision: 2 }]);
    await reviewVocabulary('user-a', { id: entry.id, expectedRevision: 1, result: 'remembered' });
    const update = writes()[0];
    expect(update.values).toMatchObject({ reviewStage: 1, reviewIntervalDays: 3, reviewDueOn: '2026-11-17', lastReviewedOn: '2026-11-14', revision: 2 });
    const clause = sqlOf(update.where);
    expect(clause.sql).toContain('"study_vocabulary"."revision" =');
    expect(clause.sql).toContain('"study_vocabulary"."review_due_on" =');
    expect(clause.sql).toContain('"study_vocabulary"."review_due_on" <=');
    expect(clause.params).toEqual(['user-a', entry.id, 1, entry.reviewDueOn, '2026-11-14']);
  });

  it('忘了回一天，最高档记得保持60天', async () => {
    state.responses.push([{ ...entry, reviewStage: 5 }], [entry]);
    await reviewVocabulary('user-a', { id: entry.id, expectedRevision: 1, result: 'forgot' });
    expect(writes()[0].values).toMatchObject({ reviewStage: 0, reviewIntervalDays: 1, reviewDueOn: '2026-11-15' });
    state.operations = []; state.responses.push([{ ...entry, reviewStage: 5 }], [entry]);
    await reviewVocabulary('user-a', { id: entry.id, expectedRevision: 1, result: 'remembered' });
    expect(writes()[0].values).toMatchObject({ reviewStage: 5, reviewIntervalDays: 60 });
  });

  it.each([
    { ...entry, revision: 2 }, { ...entry, reviewDueOn: '2026-11-15' },
  ])('版本陈旧或尚未到期时拒绝写入', async existing => {
    state.responses.push([existing]);
    await expect(reviewVocabulary('user-a', { id: entry.id, expectedRevision: 1, result: 'remembered' })).rejects.toBeInstanceOf(VocabularyConflictError);
    expect(writes()).toHaveLength(0);
  });

  it('读取之后被另一标签页抢先推进，CAS未命中返回冲突', async () => {
    state.responses.push([entry], []);
    await expect(reviewVocabulary('user-a', { id: entry.id, expectedRevision: 1, result: 'remembered' })).rejects.toBeInstanceOf(VocabularyConflictError);
  });

  it('未找到本人记录时返回null', async () => {
    expect(await reviewVocabulary('other-user', { id: entry.id, expectedRevision: 1, result: 'forgot' })).toBeNull();
    expect(writes()).toHaveLength(0);
    expect(sqlOf(state.operations[0].where).params).toEqual(['other-user', entry.id]);
  });
});
