import { PgDialect } from 'drizzle-orm/pg-core';
import type { SQL } from 'drizzle-orm';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mastersNotices, mastersRounds, mastersWatches } from '@/lib/db/schema';
import type { MastersRound, MastersRoundInput, MastersWatchInput } from '../types';

type Operation = {
  kind: 'select' | 'insert' | 'update' | 'delete';
  table?: unknown;
  where?: SQL;
  joins: SQL[];
  orderBy?: SQL[];
  values?: Record<string, unknown> | Record<string, unknown>[];
  conflict?: 'nothing' | 'update';
  conflictTarget?: unknown;
  conflictSet?: Record<string, unknown>;
  transactionId: number | null;
  limit?: number;
  offset?: number;
};
const state = vi.hoisted(() => ({
  responses: [] as (unknown[] | Error)[],
  operations: [] as Operation[],
  transactions: 0,
  activeTransaction: null as number | null,
}));

vi.mock('@/lib/db', () => {
  function query(kind: Operation['kind'], table?: unknown) {
    const operation: Operation = { kind, table, joins: [], transactionId: state.activeTransaction };
    state.operations.push(operation);
    const builder = {
      from(value: unknown) { operation.table = value; return builder; },
      where(value: SQL) { operation.where = value; return builder; },
      innerJoin(_table: unknown, condition: SQL) { operation.joins.push(condition); return builder; },
      orderBy(...values: SQL[]) { operation.orderBy = values; return builder; },
      limit(value: number) { operation.limit = value; return builder; },
      offset(value: number) { operation.offset = value; return builder; },
      values(value: Operation['values']) { operation.values = value; return builder; },
      set(value: Record<string, unknown>) { operation.values = value; return builder; },
      returning() { return builder; },
      onConflictDoNothing() { operation.conflict = 'nothing'; return builder; },
      onConflictDoUpdate(input: { target: unknown; set: Record<string, unknown> }) {
        operation.conflict = 'update'; operation.conflictTarget = input.target; operation.conflictSet = input.set; return builder;
      },
      then(resolve: (rows: unknown[]) => unknown, reject?: (error: unknown) => unknown) {
        const response = state.responses.shift() ?? [];
        return (response instanceof Error ? Promise.reject(response) : Promise.resolve(response)).then(resolve, reject);
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
  return { db: {
    ...queries,
    async transaction<T>(callback: (tx: typeof queries) => Promise<T>) {
      state.transactions += 1;
      state.activeTransaction = state.transactions;
      try { return await callback(queries); } finally { state.activeTransaction = null; }
    },
  } };
});

import {
  getMastersNotices, getMastersRoundsByIds, getMastersWatches, importMastersSeeds,
  listAdminMastersRounds, listMastersRounds, markMastersNoticesRead, removeMastersWatch,
  saveMastersRound, saveMastersWatch, syncMastersNotices, unpublishMastersRound,
} from '../service';

const now = '2027-01-01T01:30:00.000Z';
const previousTime = '2026-10-14T01:00:00.000Z';

function round(overrides: Partial<MastersRound> = {}, details: Partial<MastersRound['details']> = {}): MastersRound {
  return {
    id: 'programme-2027-main', intakeYear: 2027, region: 'singapore', status: 'published',
    verifiedOn: '2026-10-14', revision: 3, dateVersion: 1, dateChangedAt: null, previousDeadlineText: null,
    createdAt: previousTime, updatedAt: previousTime, ...overrides,
    details: {
      university: 'Example University', programme: 'MSc Computer Science', subject: '计算机科学',
      studyType: 'taught', studyMode: '全日制', intakeLabel: '2027年8月', applicantGroup: '国际申请者',
      roundName: '主轮', eventType: 'application', opensOn: '2026-10-01', openingNote: '官方开放日期', openingState: 'scheduled',
      deadlineStatus: 'confirmed', deadlineOn: '2027-01-31', deadlineAt: null, deadlineTimeZone: null,
      deadlineText: '31 January 2027', rolling: false, mayCloseEarly: false,
      officialUrl: 'https://example.edu/masters/computing', sourceNote: '该项目国际申请者截止；仅日期。', ...details,
    },
  };
}

function input(value = round()): MastersRoundInput {
  return {
    id: value.id, intakeYear: value.intakeYear, region: value.region, details: value.details,
    status: value.status, verifiedOn: value.verifiedOn, expectedUpdatedAt: value.updatedAt,
  };
}

function sqlOf(value: SQL | undefined) {
  if (!value) throw new Error('Expected a guarded SQL clause');
  return new PgDialect().sqlToQuery(value);
}
function valuesOf(operation: Operation): Record<string, unknown>[] {
  return Array.isArray(operation.values) ? operation.values : operation.values ? [operation.values] : [];
}
function writes(table: unknown) {
  return state.operations.filter((operation) => operation.table === table && operation.kind !== 'select');
}
function watched(value = round(), userId = 'user-1', followedAt = previousTime) {
  return { round: value, userId, followedAt };
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(now));
  state.responses = [];
  state.operations = [];
  state.transactions = 0;
  state.activeTransaction = null;
});
afterEach(() => vi.useRealTimers());

describe('申请轮次公开边界与身份', () => {
  it('公开年列表和按ID查询均在SQL要求published，后台才可读取草稿', async () => {
    state.responses.push([], [], []);
    await listMastersRounds(2027);
    await getMastersRoundsByIds(['programme-2027-main', 'programme-2027-main']);
    await listAdminMastersRounds(2027);
    expect(sqlOf(state.operations[0].where).params).toEqual([2027, 'published']);
    expect(sqlOf(state.operations[1].where).params).toEqual(['programme-2027-main', 'published']);
    expect(sqlOf(state.operations[2].where).params).toEqual([2027]);
    expect(sqlOf(state.operations[0].where).sql).toContain('"masters_rounds"."status"');
  });

  it('空ID列表不查询全表', async () => {
    expect(await getMastersRoundsByIds([])).toEqual([]);
    expect(state.operations).toHaveLength(0);
  });

  it('即使版本正确，也不能把同一条记录从2027覆盖为2028入学', async () => {
    state.responses.push([round()]);
    expect(await saveMastersRound({ ...input(), intakeYear: 2028 })).toBeNull();
    expect(writes(mastersRounds)).toHaveLength(0);
    expect(writes(mastersNotices)).toHaveLength(0);
  });

  it('已存在记录必须带正确版本；缺失记录不能带旧版本重新插入', async () => {
    state.responses.push([round()], []);
    expect(await saveMastersRound({ ...input(), expectedUpdatedAt: '2026-10-13T01:00:00Z' })).toBeNull();
    expect(await saveMastersRound(input())).toBeNull();
    expect(writes(mastersRounds)).toHaveLength(0);
  });

  it('并发更新再次由ID和updatedAt条件兜底，失败后不写通知', async () => {
    state.responses.push([round()], []);
    expect(await saveMastersRound(input())).toBeNull();
    const write = writes(mastersRounds)[0];
    expect(write.kind).toBe('update');
    expect(sqlOf(write.where).params).toEqual([round().id, previousTime]);
    expect(writes(mastersNotices)).toHaveLength(0);
  });

  it('第一次插入冲突时不覆盖另一条同身份记录', async () => {
    const fresh = { ...input(), expectedUpdatedAt: undefined };
    state.responses.push([], []);
    expect(await saveMastersRound(fresh)).toBeNull();
    expect(writes(mastersRounds)[0]).toMatchObject({ kind: 'insert', conflict: 'nothing' });
    expect(valuesOf(writes(mastersRounds)[0])[0]).toMatchObject({ revision: 1, dateVersion: 1 });
  });

  it('同一身份忽略大小写及多余空格，不同轮次仍有不同identityKey', async () => {
    const base = { ...input(round({ status: 'draft' })), expectedUpdatedAt: undefined };
    for (const value of [
      base,
      { ...base, id: 'another-id', details: { ...base.details, university: '  EXAMPLE   UNIVERSITY  ' } },
      { ...base, id: 'round-2', details: { ...base.details, roundName: '第二轮' } },
    ]) {
      state.responses.push([], []);
      await saveMastersRound(value);
    }
    const identities = writes(mastersRounds).map((operation) => valuesOf(operation)[0].identityKey);
    expect(identities[0]).toBe(identities[1]);
    expect(identities[2]).not.toBe(identities[0]);
  });

  it.each([
    { code: '23505' }, { cause: { code: '23505' } },
  ])('唯一约束竞争转换为冲突结果 %j', async (properties) => {
    state.responses.push([], Object.assign(new Error('unique violation'), properties));
    expect(await saveMastersRound({ ...input(), expectedUpdatedAt: undefined })).toBeNull();
  });

  it('非唯一约束数据库异常必须继续抛出', async () => {
    state.responses.push(new Error('database unavailable'));
    await expect(saveMastersRound(input())).rejects.toThrow('database unavailable');
  });
});

describe('正文版本与日期版本', () => {
  it('只更新来源说明时增加revision，保留dateVersion及原日期变更记录', async () => {
    const previous = round({ dateVersion: 2, dateChangedAt: previousTime, previousDeadlineText: '15 January 2027' });
    state.responses.push([previous], [previous], []);
    await saveMastersRound({ ...input(previous), details: { ...previous.details, sourceNote: '补充一条核验说明。' } });
    expect(valuesOf(writes(mastersRounds)[0])[0]).toMatchObject({
      revision: 4, dateVersion: 2, dateChangedAt: previousTime, previousDeadlineText: '15 January 2027',
    });
  });

  it('仅修改日期显示文字标点不生成新的日期版本', async () => {
    state.responses.push([round()], [round()], []);
    await saveMastersRound({ ...input(), details: { ...round().details, deadlineText: '31 January 2027.' } });
    expect(valuesOf(writes(mastersRounds)[0])[0]).toMatchObject({ revision: 4, dateVersion: 1, dateChangedAt: null });
  });

  it('真实改期同时更新日期版本、前值和变更时间，并在同一事务写通知', async () => {
    const saved = round({ revision: 4, dateVersion: 2, dateChangedAt: now }, { deadlineOn: '2027-01-15', deadlineText: '15 January 2027' });
    state.responses.push([round()], [saved], [watched(saved)], [{ id: 'deadline' }, { id: 'changed' }]);
    expect(await saveMastersRound(input(saved))).toEqual(saved);
    expect(valuesOf(writes(mastersRounds)[0])[0]).toMatchObject({
      revision: 4, dateVersion: 2, dateChangedAt: now, previousDeadlineText: '31 January 2027',
    });
    const notices = valuesOf(writes(mastersNotices)[0]);
    expect(notices.map((value) => value.kind)).toEqual(['deadline', 'changed']);
    expect(state.operations.every((operation) => operation.transactionId === 1)).toBe(true);
  });

  it('明确提前关闭也更新日期版本并通知，但不再生成普通临期提醒', async () => {
    const closed = round({ revision: 4, dateVersion: 2, dateChangedAt: now }, { openingState: 'closed' });
    state.responses.push([round()], [closed], [watched(closed)], [{ id: 'changed' }]);
    await saveMastersRound(input(closed));
    expect(valuesOf(writes(mastersRounds)[0])[0].dateVersion).toBe(2);
    expect(valuesOf(writes(mastersNotices)[0]).map((value) => value.kind)).toEqual(['changed']);
  });

  it('同一毫秒保存仍递增更新时间，不能复用旧CAS版本', async () => {
    vi.setSystemTime(new Date(previousTime));
    const draft = round({ status: 'draft' });
    state.responses.push([draft], [draft]);
    await saveMastersRound(input(draft));
    expect(valuesOf(writes(mastersRounds)[0])[0].updatedAt).toBe('2026-10-14T01:00:00.001Z');
  });

  it('重复导入只插入缺失种子，绝不覆盖人工修订或自动发布', async () => {
    state.responses.push([{ id: 'first' }], []);
    expect(await importMastersSeeds()).toEqual({ created: 1 });
    expect(await importMastersSeeds()).toEqual({ created: 0 });
    const operations = writes(mastersRounds);
    expect(operations.every((operation) => operation.kind === 'insert' && operation.conflict === 'nothing')).toBe(true);
    expect(valuesOf(operations[0]).every((value) => value.status === 'draft')).toBe(true);
    expect(valuesOf(operations[0]).map((value) => value.id)).toEqual(valuesOf(operations[1]).map((value) => value.id));
  });

  it('下架条件必须同时匹配ID、版本与published', async () => {
    state.responses.push([{ id: round().id }], []);
    expect(await unpublishMastersRound(round().id, previousTime)).toBe(true);
    expect(await unpublishMastersRound(round().id, previousTime)).toBe(false);
    for (const operation of writes(mastersRounds)) {
      expect(sqlOf(operation.where).params).toEqual([round().id, previousTime, 'published']);
      expect(valuesOf(operation)[0].status).toBe('draft');
    }
  });
});

describe('用户关注归属与停止提醒', () => {
  const watch: MastersWatchInput = { roundId: 'programme-2027-main', status: 'preparing', reminders: true };

  it('读取只取当前用户，不能从请求体注入其他userId', async () => {
    state.responses.push([]);
    await getMastersWatches('owner');
    expect(sqlOf(state.operations[0].where).params).toEqual(['owner']);
    await expect(saveMastersWatch('owner', { ...watch, userId: 'other' } as MastersWatchInput)).rejects.toThrow();
  });

  it('不存在或未发布轮次不可关注，写入前在SQL过滤published', async () => {
    state.responses.push([]);
    expect(await saveMastersWatch('owner', watch)).toBeNull();
    expect(sqlOf(state.operations[0].where).params).toEqual([watch.roundId, 'published']);
    expect(writes(mastersWatches)).toHaveLength(0);
  });

  it.each([
    { status: 'submitted', reminders: true }, { status: 'abandoned', reminders: true }, { status: 'preparing', reminders: false },
  ] as const)('%j 保存后不触发任何通知生成', async (settings) => {
    const saved = { ...watch, ...settings, updatedAt: now };
    state.responses.push([{ id: watch.roundId }], [saved]);
    expect(await saveMastersWatch('owner', { ...watch, ...settings })).toEqual(saved);
    expect(state.operations).toHaveLength(2);
    expect(writes(mastersNotices)).toHaveLength(0);
    const operation = writes(mastersWatches)[0];
    expect(valuesOf(operation)[0]).toMatchObject({ userId: 'owner', ...settings });
    expect(operation.conflictTarget).toEqual([mastersWatches.userId, mastersWatches.roundId]);
    expect(operation.conflictSet).not.toHaveProperty('userId');
    expect(operation.conflictSet).not.toHaveProperty('createdAt');
  });

  it('开启提醒只同步当前用户关注的当前轮次', async () => {
    state.responses.push([{ id: watch.roundId }], [{ ...watch, updatedAt: now }], []);
    await saveMastersWatch('owner', watch);
    expect(sqlOf(state.operations[2].where).params).toEqual(['preparing', true, 'published', 'owner', watch.roundId]);
    expect(state.operations.every((operation) => operation.transactionId === 1)).toBe(true);
  });

  it('取消关注与移除提醒在同一事务，两个删除条件均含账号和轮次', async () => {
    state.responses.push([], []);
    await removeMastersWatch('owner', watch.roundId);
    expect(state.operations.map((operation) => operation.table)).toEqual([mastersNotices, mastersWatches]);
    for (const operation of state.operations) {
      expect(operation.kind).toBe('delete');
      expect(operation.transactionId).toBe(1);
      expect(sqlOf(operation.where).params).toEqual(['owner', watch.roundId]);
    }
  });
});

describe('30/7/1天提醒与日期版本幂等', () => {
  it.each([
    ['2027-01-01T01:30:00Z', 30], ['2027-01-24T01:30:00Z', 7], ['2027-01-30T01:30:00Z', 1],
  ])('%s 只产生当前最近档位 %s', async (at, leadDays) => {
    state.responses.push([watched()], [{ id: 'notice' }]);
    expect(await syncMastersNotices({ now: new Date(at as string) })).toEqual({ created: 1 });
    expect(valuesOf(writes(mastersNotices)[0])).toHaveLength(1);
    expect(valuesOf(writes(mastersNotices)[0])[0]).toMatchObject({ kind: 'deadline', leadDays, dateVersion: 1, userId: 'user-1', roundId: round().id });
    expect(sqlOf(state.operations[0].where).params).toEqual(['preparing', true, 'published']);
  });

  it('同用户同轮次同版本同档位重跑使用相同ID并ON CONFLICT DO NOTHING', async () => {
    state.responses.push([watched()], [{ id: 'notice' }], [watched()], []);
    expect(await syncMastersNotices()).toEqual({ created: 1 });
    expect(await syncMastersNotices()).toEqual({ created: 0 });
    const operations = writes(mastersNotices);
    expect(valuesOf(operations[0])[0].id).toBe(valuesOf(operations[1])[0].id);
    expect(operations.every((operation) => operation.conflict === 'nothing')).toBe(true);
  });

  it('改期后临期及变更使用新日期版本，不与旧版本幂等键冲突', async () => {
    const revised = round({ dateVersion: 2, dateChangedAt: now }, { deadlineOn: '2027-01-25' });
    state.responses.push([watched()], [{ id: 'old' }], [watched(revised)], [{ id: 'new' }, { id: 'changed' }]);
    await syncMastersNotices();
    await syncMastersNotices();
    const first = valuesOf(writes(mastersNotices)[0])[0];
    const second = valuesOf(writes(mastersNotices)[1]);
    expect(second.map((value) => value.kind)).toEqual(['deadline', 'changed']);
    expect(second.every((value) => value.dateVersion === 2)).toBe(true);
    expect(second.every((value) => value.id !== first.id)).toBe(true);
  });

  it('改期后才关注的用户不收到此前改期提示，普通临期仍可生成', async () => {
    const revised = round({ dateVersion: 2, dateChangedAt: previousTime });
    state.responses.push([watched(revised, 'new-follower', now)], [{ id: 'deadline' }]);
    await syncMastersNotices();
    expect(valuesOf(writes(mastersNotices)[0]).map((value) => value.kind)).toEqual(['deadline']);
  });

  it('不同用户不会共享通知ID', async () => {
    state.responses.push([watched(round(), 'user-a'), watched(round(), 'user-b')], [{ id: 'a' }, { id: 'b' }]);
    await syncMastersNotices();
    const notices = valuesOf(writes(mastersNotices)[0]);
    expect(notices[0].id).not.toBe(notices[1].id);
  });

  it('超过30天、已过期、未公布日期和提前关闭的无改期记录不生成通知', async () => {
    state.responses.push([
      watched(round({}, { deadlineOn: '2027-04-30' })),
      watched(round({}, { deadlineOn: '2026-12-31' })),
      watched(round({}, { deadlineStatus: 'unannounced', deadlineOn: null })),
      watched(round({}, { openingState: 'closed' })),
    ]);
    expect(await syncMastersNotices()).toEqual({ created: 0 });
    expect(writes(mastersNotices)).toHaveLength(0);
  });
});

describe('通知读取与已读归属', () => {
  it('SQL先按未读优先排序，再按时间和ID稳定分页，已读不能遮住未读', async () => {
    state.responses.push([]);
    await getMastersNotices('owner');
    const ordering = state.operations[0].orderBy;
    expect(sqlOf(ordering?.[0]).sql).toBe('"masters_notices"."read_at" is not null');
    expect(sqlOf(ordering?.[1]).sql).toBe('"masters_notices"."created_at" desc');
    expect(sqlOf(ordering?.[2]).sql).toBe('"masters_notices"."id" asc');
  });

  it('首批100条全部失效后继续翻页取有效提醒，返回最多20条', async () => {
    const common = { roundId: round().id, dateVersion: 1, createdAt: now, readAt: null, kind: 'deadline', leadDays: 30 };
    const expired = round({}, { deadlineOn: '2026-12-31' });
    state.responses.push(
      Array.from({ length: 100 }, (_, index) => ({ ...common, id: `expired-${index}`, round: expired })),
      Array.from({ length: 25 }, (_, index) => ({ ...common, id: `valid-${index}`, round: round() })),
    );

    const notices = await getMastersNotices('owner');

    expect(notices.map((notice) => notice.id)).toEqual(Array.from({ length: 20 }, (_, index) => `valid-${index}`));
    expect(state.operations).toHaveLength(2);
    expect(state.operations.map((operation) => operation.offset)).toEqual([0, 100]);
    expect(state.operations.every((operation) => operation.limit === 100)).toBe(true);
    expect(sqlOf(state.operations[0].where).params).toEqual(sqlOf(state.operations[1].where).params);
  });

  it('读取时同时限制owner、公开状态、日期版本、preparing和提醒开启', async () => {
    state.responses.push([]);
    expect(await getMastersNotices('owner')).toEqual([]);
    const operation = state.operations[0];
    const condition = sqlOf(operation.where);
    expect(condition.params).toEqual(['owner', 'published', 'preparing', true, '2026-12-01T16:00:00.000Z']);
    expect(condition.sql).toContain('"masters_notices"."date_version" = "masters_rounds"."date_version"');
    expect(sqlOf(operation.joins[1]).sql).toContain('"masters_watches"."user_id" = "masters_notices"."user_id"');
    expect(operation.limit).toBe(100);
  });

  it('档位已过的旧临期消息不返回，当前档位与核实改期提示仍可读', async () => {
    vi.setSystemTime(new Date('2027-01-30T01:30:00Z'));
    const common = { round: round(), roundId: round().id, dateVersion: 1, createdAt: now, readAt: null };
    state.responses.push([
      { ...common, id: 'old-30', kind: 'deadline', leadDays: 30 },
      { ...common, id: 'old-7', kind: 'deadline', leadDays: 7 },
      { ...common, id: 'current-1', kind: 'deadline', leadDays: 1 },
      { ...common, id: 'changed', kind: 'changed', leadDays: null },
    ]);
    expect((await getMastersNotices('owner')).map((notice) => notice.id)).toEqual(['current-1', 'changed']);
  });

  it('提前关闭后旧临期消息消失，但关闭变更提示保留', async () => {
    const closed = round({}, { openingState: 'closed' });
    state.responses.push([
      { id: 'deadline', kind: 'deadline', leadDays: 30, round: closed },
      { id: 'changed', kind: 'changed', leadDays: null, round: closed },
    ]);
    expect((await getMastersNotices('owner')).map((notice) => notice.id)).toEqual(['changed']);
  });

  it('标记已读必须匹配当前账号；空ID不执行更新', async () => {
    await markMastersNoticesRead('owner', []);
    expect(state.operations).toHaveLength(0);
    state.responses.push([]);
    await markMastersNoticesRead('owner', ['notice-a', 'notice-b']);
    expect(sqlOf(state.operations[0].where).params).toEqual(['owner', 'notice-a', 'notice-b']);
    expect(valuesOf(state.operations[0])[0]).toEqual({ readAt: now });
  });
});
