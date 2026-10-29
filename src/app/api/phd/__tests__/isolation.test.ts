import { NextRequest } from 'next/server';
import { PgDialect } from 'drizzle-orm/pg-core';
import type { SQL } from 'drizzle-orm';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mastersRounds, mastersWatches, phdNotices, phdRounds, phdWatches } from '@/lib/db/schema';
import { phdSeeds } from '@/lib/phd/seeds';
import type { MastersRound } from '@/lib/masters/types';

const state = vi.hoisted(() => ({
  selectedTables: [] as unknown[],
  deletes: [] as Array<{ table: unknown; sql: string; params: unknown[] }>,
  mastersWatches: [{ userId: 'user-a', roundId: 'master-only', status: 'preparing' }],
}));
vi.mock('@/lib/auth', () => ({ getSession: async () => ({ userId: 'user-a', emailVerified: true }) }));
vi.mock('@/lib/rate-limit', () => ({ getClientIp: () => 'test', rateLimit: async () => ({ limited: false }) }));
vi.mock('@/lib/db', () => {
  const db = {
    select: () => ({ from: (table: unknown) => ({ where: () => {
      state.selectedTables.push(table);
      const rows = table === mastersRounds ? [masterRound()] : [];
      return Object.assign(Promise.resolve(rows), { limit: () => Promise.resolve(rows) });
    } }) }),
    delete: (table: unknown) => ({ where: async (condition: SQL) => {
      const query = new PgDialect().sqlToQuery(condition);
      state.deletes.push({ table, ...query });
      if (table === mastersWatches) {
        state.mastersWatches = state.mastersWatches.filter(row => !query.params.includes(row.userId) || !query.params.includes(row.roundId));
      }
    } }),
    transaction: async <T>(callback: (transaction: unknown) => Promise<T>) => callback(db),
  };
  return { db };
});

// 使用真实博士 service 和 ICS，只替换数据库边界，防止 handler 意外引用硕士表组。
import { GET } from '../calendar/route';
import { DELETE, PUT } from '../watches/route';

function masterRound(): MastersRound {
  const template = phdSeeds[0];
  return {
    ...template, id: 'master-only', status: 'published', verifiedOn: '2026-10-29',
    revision: 1, dateVersion: 1, dateChangedAt: null, previousDeadlineText: null,
    createdAt: '2026-10-29T00:00:00Z', updatedAt: '2026-10-29T00:00:00Z',
    details: { ...template.details, studyType: 'taught', openingState: 'open', opensOn: null,
      deadlineStatus: 'confirmed', deadlineOn: '2027-01-31', deadlineAt: null, deadlineTimeZone: null },
  };
}
function request(path: string, method = 'GET', body?: unknown) {
  return new NextRequest(`http://localhost:3000/api/phd/${path}`, {
    method, headers: { Origin: 'http://localhost:3000', 'Content-Type': 'application/json', 'X-Phd-User': 'user-a' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

beforeEach(() => {
  state.selectedTables.length = 0;
  state.deletes.length = 0;
  state.mastersWatches = [{ userId: 'user-a', roundId: 'master-only', status: 'preparing' }];
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-29T01:00:00Z'));
});
afterEach(() => vi.useRealTimers());

describe('博士接口的学位表组隔离', () => {
  it('仅存在于硕士表的ID不能保存为博士关注', async () => {
    const response = await PUT(request('watches', 'PUT', { roundId: 'master-only', status: 'preparing', reminders: true }));
    expect(response.status).toBe(404);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(state.selectedTables).toEqual([phdRounds]);
    expect(state.mastersWatches).toHaveLength(1);
  });

  it('仅存在于硕士表的ID不能从博士ICS导出', async () => {
    const response = await GET(request('calendar?ids=master-only'));
    expect(response.status).toBe(404);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(state.selectedTables).toEqual([phdRounds]);
    expect(await response.text()).not.toContain('BEGIN:VEVENT');
  });

  it('使用硕士ID取消博士关注可幂等成功，只删除博士表中当前owner记录', async () => {
    expect((await DELETE(request('watches', 'DELETE', { roundId: 'master-only' }))).status).toBe(200);
    expect(state.deletes.map(item => item.table)).toEqual([phdNotices, phdWatches]);
    expect(state.deletes.map(item => item.params)).toEqual([['user-a', 'master-only'], ['user-a', 'master-only']]);
    expect(state.mastersWatches).toEqual([{ userId: 'user-a', roundId: 'master-only', status: 'preparing' }]);
  });
});
