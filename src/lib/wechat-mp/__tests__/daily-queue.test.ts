import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  select: vi.fn(),
  from: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
}));

vi.mock('@/lib/db', () => ({ db: { select: mocks.select } }));

import { getDailyQueue } from '../daily-queue';

describe('getDailyQueue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.select.mockReturnValue({ from: mocks.from });
    mocks.from.mockReturnValue({ where: mocks.where });
    mocks.where.mockReturnValue({ orderBy: mocks.orderBy });
  });

  it('按日期倒序返回 7 天，只统计已发布且有标题的栏目', async () => {
    mocks.orderBy.mockResolvedValue([
      { date: '2026-11-26', channel: 'papers', title: '论文' },
      { date: '2026-11-26', channel: 'english', title: '英语' },
      { date: '2026-11-25', channel: 'ai', title: 'AI' },
      { date: '2026-11-24', channel: 'events', title: '   ' },
      { date: '2026-11-20', channel: 'open-source', title: '开源' },
    ]);

    const queue = await getDailyQueue('2026-11-26');

    const selected = mocks.select.mock.calls[0][0];
    expect(selected).not.toHaveProperty('content');
    expect(queue).toHaveLength(7);
    expect(queue[0]).toMatchObject({ date: '2026-11-26', count: 2, channels: ['每日英语', '每日论文'] });
    expect(queue[1]).toMatchObject({ date: '2026-11-25', count: 1, channels: ['每日 AI 圈内大事'] });
    expect(queue[2]).toMatchObject({ date: '2026-11-24', count: 0 });
    expect(queue[3]).toMatchObject({ date: '2026-11-23', count: 0 });
    expect(queue[6]).toMatchObject({ date: '2026-11-20', count: 1, channels: ['每日开源项目'] });
  });

  it('限制查询窗口最大 14 天，避免管理页一次搬太多日期', async () => {
    mocks.orderBy.mockResolvedValue([]);
    const queue = await getDailyQueue('2026-11-26', 30);
    expect(queue).toHaveLength(14);
    expect(queue[0].date).toBe('2026-11-26');
    expect(queue[13].date).toBe('2026-11-13');
  });
});
