import { PgDialect } from 'drizzle-orm/pg-core';
import type { SQL } from 'drizzle-orm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { studyCourses, studyDeadlines, studyProblems } from '@/lib/db/schema';

type Operation = {
  kind: 'select' | 'insert' | 'update' | 'delete';
  table?: unknown;
  where?: SQL;
  values?: Record<string, unknown> | Record<string, unknown>[];
  limit?: number;
};
const state = vi.hoisted(() => ({
  responses: [] as unknown[][],
  operations: [] as Operation[],
  transactions: 0,
}));

vi.mock('@/lib/db', () => {
  function query(kind: Operation['kind'], table?: unknown) {
    const operation: Operation = { kind, table };
    state.operations.push(operation);
    const builder = {
      from(value: unknown) { operation.table = value; return builder; },
      where(value: SQL) { operation.where = value; return builder; },
      orderBy() { return builder; },
      limit(value: number) { operation.limit = value; return builder; },
      values(value: Operation['values']) { operation.values = value; return builder; },
      set(value: Record<string, unknown>) { operation.values = value; return builder; },
      returning() { return builder; },
      then(resolve: (rows: unknown[]) => unknown, reject?: (error: unknown) => unknown) {
        const response = state.responses.shift() ?? [];
        return Promise.resolve(response).then(resolve, reject);
      },
    };
    return builder;
  }
  const queries = {
    select: () => query('select'),
    insert: (table: unknown) => query('insert', table),
    update: (table: unknown) => query('update', table),
    delete: (table: unknown) => query('delete', table),
  };
  return {
    db: {
      ...queries,
      async transaction<T>(callback: (tx: typeof queries) => Promise<T>) {
        state.transactions += 1;
        return callback(queries);
      },
    },
  };
});

import {
  createStudyProblem, deleteStudyCourse, reviewStudyProblem, updateStudyCourse, updateStudyProblem,
} from '../service';

function sqlOf(value: SQL | undefined) {
  if (!value) throw new Error('Expected a guarded SQL clause');
  return new PgDialect().sqlToQuery(value);
}
function writes(table: unknown) {
  return state.operations.filter(operation => operation.table === table && operation.kind !== 'select');
}

const problem = {
  id: 'p1', title: '两数之和', topic: '数组', difficulty: 'easy' as const, url: null,
  status: 'todo' as const, notes: null, reviewStage: 0, reviewDueOn: null,
  reviewIntervalDays: 1, lastReviewedOn: null, createdAt: 'x', updatedAt: 'x',
};

beforeEach(() => {
  state.responses = [];
  state.operations = [];
  state.transactions = 0;
});

describe('学习数据的归属过滤', () => {
  it('更新课程的条件同时带 id 与 userId，不匹配即不生效', async () => {
    state.responses.push([]);
    const result = await updateStudyCourse('user-a', { id: 'c1', name: '新名字' });
    expect(result).toBeNull();
    const condition = sqlOf(writes(studyCourses)[0].where);
    expect(condition.sql).toContain('"study_courses"."id"');
    expect(condition.sql).toContain('"study_courses"."user_id"');
    expect(condition.params).toEqual(['c1', 'user-a']);
  });

  it('删除课程先删本人课程，再把本人关联截止事项的 courseId 置空', async () => {
    state.responses.push([{ id: 'c1' }], []);
    const removed = await deleteStudyCourse('user-a', 'c1');
    expect(removed).toBe(true);
    expect(state.transactions).toBe(1);
    const [courseDelete] = writes(studyCourses);
    expect(sqlOf(courseDelete.where).params).toEqual(['c1', 'user-a']);
    const [deadlineClear] = writes(studyDeadlines);
    expect(deadlineClear.values).toEqual({ courseId: null });
    const clearCondition = sqlOf(deadlineClear.where);
    expect(clearCondition.sql).toContain('"study_deadlines"."user_id"');
    expect(clearCondition.sql).toContain('"study_deadlines"."course_id"');
    expect(clearCondition.params).toEqual(['user-a', 'c1']);
  });
});

describe('复习状态机', () => {
  it('首次标记已解决时排入复习队列：明天第一次', async () => {
    state.responses.push([problem], [{ ...problem, status: 'solved', reviewDueOn: '2026-11-14' }]);
    await updateStudyProblem('user-a', { id: 'p1', status: 'solved' });
    const [update] = writes(studyProblems);
    const values = update.values as Record<string, unknown>;
    expect(values.status).toBe('solved');
    expect(values.reviewStage).toBe(0);
    expect(values.reviewIntervalDays).toBe(1);
    expect(values.reviewDueOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('重新标记已解决不清零既有复习进度', async () => {
    const advanced = { ...problem, status: 'solved' as const, reviewStage: 3, reviewDueOn: '2026-11-20' };
    state.responses.push([advanced], [advanced]);
    await updateStudyProblem('user-a', { id: 'p1', status: 'solved' });
    const values = writes(studyProblems)[0].values as Record<string, unknown>;
    expect(values.reviewStage).toBeUndefined();
    expect(values.reviewDueOn).toBeUndefined();
  });

  it('未解决的题目不能记录复习', async () => {
    state.responses.push([problem]);
    expect(await reviewStudyProblem('user-a', { id: 'p1', result: 'remembered' })).toBeNull();
    expect(writes(studyProblems)).toHaveLength(0);
  });

  it('记得则前进一档，忘了归零回一天', async () => {
    const solved = { ...problem, status: 'solved' as const, reviewStage: 1, reviewDueOn: '2026-11-14', reviewIntervalDays: 3 };
    state.responses.push([solved], [solved]);
    await reviewStudyProblem('user-a', { id: 'p1', result: 'remembered' });
    let values = writes(studyProblems)[0].values as Record<string, unknown>;
    expect(values.reviewStage).toBe(2);
    expect(values.reviewIntervalDays).toBe(7);
    expect(values.lastReviewedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    state.operations = [];
    state.responses.push([solved], [solved]);
    await reviewStudyProblem('user-a', { id: 'p1', result: 'forgot' });
    values = writes(studyProblems)[0].values as Record<string, unknown>;
    expect(values.reviewStage).toBe(0);
    expect(values.reviewIntervalDays).toBe(1);
  });

  it('新建题目只接受本人数据，未解决不进复习队列', async () => {
    state.responses.push([problem]);
    await createStudyProblem('user-a', { title: '两数之和', difficulty: 'easy' });
    const values = writes(studyProblems)[0].values as Record<string, unknown>;
    expect(values.userId).toBe('user-a');
    expect(values.reviewDueOn).toBeNull();
    expect(values.status).toBe('todo');
  });
});
