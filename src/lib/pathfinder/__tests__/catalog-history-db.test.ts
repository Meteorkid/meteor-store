import { beforeEach, describe, expect, it, vi } from 'vitest';

const { query } = vi.hoisted(() => ({ query: vi.fn() }));
vi.mock('@/lib/db', async () => {
  const { drizzle } = await import('drizzle-orm/node-postgres');
  return { db: drizzle({ client: { query } as never }) };
});

import { getStartedCodeforcesContest, listDatabaseCatalogItems } from '../catalog-db';

describe('收藏历史的定向数据库查询', () => {
  beforeEach(() => {
    query.mockReset().mockResolvedValue({ rows: [] });
  });

  it('开赛后的定向详情只读取该官方源已公开或曾自动过期的赛事', async () => {
    const now = new Date('2026-11-24T00:00:00Z');
    const id = 'pf_8c81264bac9bf4c5d87f746e';
    await getStartedCodeforcesContest(id, now);
    const [options, params] = query.mock.calls[0];
    expect(options.text).toContain('"pathfinder_items"."deadline_at" <=');
    expect(params).toEqual([id, 'codeforces-contests', 'competition', 'published', 'expired', now.toISOString(), 1]);
  });

  it('直接按收藏ID查历史，不受公开目录最近500条限制', async () => {
    await listDatabaseCatalogItems([], ['old-saved-id']);
    const [options, params] = query.mock.calls[0];
    expect(options.text).toContain('"pathfinder_items"."id" in ($1)');
    expect(options.text).not.toContain('limit');
    expect(params).toEqual(['old-saved-id']);
  });

  it('公开读取仍限制published与500条窗口', async () => {
    await listDatabaseCatalogItems();
    const [options, params] = query.mock.calls[0];
    expect(options.text).toContain('"pathfinder_items"."status" = $1');
    expect(options.text).toContain('limit $2');
    expect(params).toEqual(['published', 500]);
  });
});
