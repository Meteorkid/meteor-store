import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  updatedRows: [] as Array<{ id: string }>,
  currentRows: [] as Array<Record<string, unknown>>,
  insertedRows: [] as Array<Record<string, unknown>>,
}));

vi.mock('../db', () => ({
  db: {
    update: () => ({
      set: () => ({
        where: () => ({
          returning: async () => state.updatedRows,
        }),
      }),
    }),
    select: () => ({
      from: () => ({
        where: () => ({
          limit: async () => state.currentRows,
        }),
      }),
    }),
    insert: () => ({
      values: async (row: Record<string, unknown>) => {
        state.insertedRows.push(row);
      },
    }),
  },
}));

import { createReport, resolveReport } from '../reports';

describe('resolveReport', () => {
  beforeEach(() => {
    state.updatedRows = [];
    state.currentRows = [];
    state.insertedRows = [];
  });

  it('并发执行相同动作时，只有命中 pending 条件的请求成功', async () => {
    state.currentRows = [{ status: 'resolved' }];

    await expect(resolveReport({
      reportId: 'R1',
      action: 'resolve',
      resolverId: 'U-admin-2',
    })).rejects.toThrow('该举报已被处理过');
  });

  it('条件更新命中时处理成功', async () => {
    state.updatedRows = [{ id: 'R1' }];

    await expect(resolveReport({
      reportId: 'R1',
      action: 'dismiss',
      resolverId: 'U-admin-1',
    })).resolves.toBeUndefined();
  });

  it('条件更新未命中且记录不存在时返回明确错误', async () => {
    await expect(resolveReport({
      reportId: 'missing',
      action: 'resolve',
      resolverId: 'U-admin-1',
    })).rejects.toThrow('举报记录不存在');
  });
});

describe('createReport', () => {
  beforeEach(() => {
    state.currentRows = [];
    state.insertedRows = [];
  });

  it('评论存在时创建 pending 举报并记录当前用户', async () => {
    state.currentRows = [{ id: 'C1' }];

    const result = await createReport({
      targetType: 'comment',
      targetId: 'C1',
      reporterId: 'U1',
      reason: 'spam',
      detail: '重复广告',
    });

    expect(result.id).toBeTruthy();
    expect(state.insertedRows).toEqual([expect.objectContaining({
      id: result.id,
      targetType: 'comment',
      targetId: 'C1',
      reporterId: 'U1',
      reason: 'spam',
      detail: '重复广告',
      status: 'pending',
    })]);
  });

  it('评论不存在时拒绝创建举报', async () => {
    await expect(createReport({
      targetType: 'comment',
      targetId: 'missing',
      reporterId: 'U1',
      reason: 'other',
    })).rejects.toThrow('被举报的评论不存在');
    expect(state.insertedRows).toHaveLength(0);
  });

  it('未发布投稿不能进入公开举报队列', async () => {
    state.currentRows = [{ id: 'P1', status: 'pending' }];

    await expect(createReport({
      targetType: 'post',
      targetId: 'P1',
      reporterId: 'U1',
      reason: 'abuse',
    })).rejects.toThrow('只能举报已发布的文章');
    expect(state.insertedRows).toHaveLength(0);
  });
});
