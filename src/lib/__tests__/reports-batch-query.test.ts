import { PgDialect } from 'drizzle-orm/pg-core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  reportRows: [] as Array<Record<string, unknown>>,
  commentCondition: undefined as unknown,
  postCondition: undefined as unknown,
  countCondition: undefined as unknown,
}));

vi.mock('../db', () => ({
  db: {
    select: (columns: Record<string, unknown>) => {
      if ('reason' in columns) {
        return {
          from: () => ({
            leftJoin: () => ({
              where: () => ({
                orderBy: async () => state.reportRows,
              }),
            }),
          }),
        };
      }
      if ('content' in columns) {
        return {
          from: () => ({
            where: async (condition: unknown) => {
              state.commentCondition = condition;
              return [{ id: 'C1', content: 'comment', status: 'approved' }];
            },
          }),
        };
      }
      if ('title' in columns) {
        return {
          from: () => ({
            where: async (condition: unknown) => {
              state.postCondition = condition;
              return [{ id: 'P1', title: 'post', status: 'published' }];
            },
          }),
        };
      }
      return {
        from: () => ({
          where: (condition: unknown) => {
            state.countCondition = condition;
            return {
              groupBy: async () => [{ targetId: 'C1', count: 1 }],
            };
          },
        }),
      };
    },
  },
}));

import { countPendingReports, listReports } from '../reports';

function compiledSql(condition: unknown): string {
  return new PgDialect().sqlToQuery(condition as Parameters<PgDialect['sqlToQuery']>[0]).sql;
}

describe('举报批量查询', () => {
  beforeEach(() => {
    state.reportRows = [];
    state.commentCondition = undefined;
    state.postCondition = undefined;
    state.countCondition = undefined;
  });

  it('为 Neon HTTP 生成标量 IN 参数，而不是 PostgreSQL 数组 ANY 参数', async () => {
    state.reportRows = [
      {
        id: 'R1',
        targetType: 'comment',
        targetId: 'C1',
        reason: 'spam',
        detail: null,
        status: 'pending',
        reporterName: 'User',
        reporterEmail: 'user@example.com',
        createdAt: '2026-08-03T00:00:00.000Z',
        resolvedAt: null,
      },
      {
        id: 'R2',
        targetType: 'post',
        targetId: 'P1',
        reason: 'other',
        detail: null,
        status: 'pending',
        reporterName: 'User',
        reporterEmail: 'user@example.com',
        createdAt: '2026-08-03T00:00:00.000Z',
        resolvedAt: null,
      },
    ];

    await listReports('pending');
    await countPendingReports('comment', ['C1']);

    for (const condition of [
      state.commentCondition,
      state.postCondition,
      state.countCondition,
    ]) {
      expect(compiledSql(condition)).toContain(' in (');
      expect(compiledSql(condition)).not.toContain('ANY');
    }
  });
});
