import { PgDialect } from 'drizzle-orm/pg-core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { STATIC_PATHFINDER_ITEMS } from '@/data/pathfinder/catalog-seeds';
import { catalogItemFixture } from './fixtures';

const { select, insert, remove, listDatabaseItems, readTombstones } = vi.hoisted(() => ({
  select: vi.fn(),
  insert: vi.fn(),
  remove: vi.fn(),
  listDatabaseItems: vi.fn(),
  readTombstones: vi.fn(),
}));
vi.mock('@/lib/db', () => ({ db: { select, insert, delete: remove } }));
vi.mock('../catalog-db', () => ({ listDatabaseCatalogItems: listDatabaseItems }));
vi.mock('../static-tombstones', () => ({ readStaticPathfinderTombstones: readTombstones }));
vi.mock('next/cache', () => ({ unstable_cache: (fn: unknown) => fn }));
vi.mock('@/lib/rate-limit', () => ({ getClientIp: () => '127.0.0.1', rateLimit: async () => ({ limited: false }) }));

import { getCatalogItem, listCatalogItems } from '../catalog';
import { getSavedPathfinderItem, getSavedPathfinderItems, togglePathfinderSave } from '../saves';

const expired = catalogItemFixture({
  id: 'expired-saved', origin: 'database', deadlineAt: '2026-10-01T00:00:00Z',
});

describe('私人收藏的历史回看', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-22T00:00:00Z'));
    listDatabaseItems.mockResolvedValue([expired]);
    readTombstones.mockResolvedValue({ ids: [], available: true });
    select.mockImplementation(() => ({ from: () => ({ where: (predicate: Parameters<PgDialect['sqlToQuery']>[0]) => {
      const query = new PgDialect().sqlToQuery(predicate);
      expect(query.sql).toContain('"pathfinder_saves"."user_id" =');
      const rows = query.params.includes('user-a')
        ? [{ itemId: expired.id, createdAt: '2026-09-01T00:00:00Z', remindDeadline: true }]
        : [];
      return { orderBy: () => Promise.resolve(rows) };
    } }) }));
  });
  afterEach(() => vi.useRealTimers());

  it('全部收藏到期后仍返回历史摘要，真正空收藏仍为空', async () => {
    const saved = await getSavedPathfinderItems('user-a');
    expect(saved.map(({ item }) => item.id)).toEqual([expired.id]);
    expect(saved[0].item.summary).toEqual(expired.summary);
    expect(await getSavedPathfinderItems('user-b')).toEqual([]);
  });

  it('公开列表与单条读取始终隐藏截止条目', async () => {
    expect((await listCatalogItems()).some(({ id }) => id === expired.id)).toBe(false);
    expect(await getCatalogItem(expired.id)).toBeNull();
  });

  it('公开API即使被传入includeExpired和私有收藏ID也不返回过期摘要', async () => {
    const { GET } = await import('@/app/api/pathfinder/items/route');
    const { NextRequest } = await import('next/server');
    const response = await GET(new NextRequest(`https://imagentx.top/api/pathfinder/items?includeExpired=true&ids=${expired.id}`));
    expect(await response.json()).toMatchObject({ items: [], total: 0 });
  });

  it('不能先收藏任意过期ID，再借私人历史入口读取', async () => {
    select.mockReturnValue({ from: () => ({ where: async () => [{ count: 0 }] }) });
    expect(await togglePathfinderSave(expired.id, 'user-b')).toBeNull();
    expect(insert).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
  });

  it('已有过期收藏仍可取消，不再要求条目公开', async () => {
    select.mockReturnValueOnce({ from: () => ({ where: async () => [{ count: 1 }] }) })
      .mockReturnValueOnce({ from: () => ({ where: async () => [{ count: 0 }] }) });
    remove.mockReturnValue({ where: async () => undefined });
    expect(await togglePathfinderSave(expired.id, 'user-a')).toEqual({ saved: false, count: 0 });
    expect(remove).toHaveBeenCalledTimes(1);
    expect(listDatabaseItems).not.toHaveBeenCalled();
  });

  it('历史详情只能由收藏所属用户读取，且目录仅查询已核对的收藏ID', async () => {
    expect(await getSavedPathfinderItem('user-a', expired.id)).toEqual(expired);
    expect(listDatabaseItems).toHaveBeenLastCalledWith(expect.any(Array), [expired.id]);
    listDatabaseItems.mockClear();
    expect(await getSavedPathfinderItem('user-b', expired.id)).toBeNull();
    expect(await getSavedPathfinderItem('user-a', 'arbitrary-private-id')).toBeNull();
    expect(listDatabaseItems).not.toHaveBeenCalled();
  });

  it('不共享缓存历史结果，下架立即退出本人收藏', async () => {
    expect(await getSavedPathfinderItem('user-a', expired.id)).toEqual(expired);
    listDatabaseItems.mockResolvedValue([{ ...expired, status: 'archived' }]);
    expect(await getSavedPathfinderItem('user-a', expired.id)).toBeNull();
  });

  it('数据库或tombstone不可读时明确失败，不伪装为空收藏或恢复历史', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    listDatabaseItems.mockRejectedValue(new Error('unavailable'));
    await expect(getSavedPathfinderItems('user-a')).rejects.toThrow('Saved Pathfinder content is temporarily unavailable');
    listDatabaseItems.mockResolvedValue([expired]);
    readTombstones.mockResolvedValue({ ids: [], available: false });
    await expect(getSavedPathfinderItems('user-a')).rejects.toThrow('Saved Pathfinder content is temporarily unavailable');
    await expect(getSavedPathfinderItem('user-a', expired.id)).rejects.toThrow('Saved Pathfinder content is temporarily unavailable');
    vi.restoreAllMocks();
  });

  it('收藏记录查询失败只抛固定安全错误，不携带数据库细节', async () => {
    select.mockReturnValue({ from: () => ({ where: () => ({ orderBy: async () => {
      throw new Error('postgres://private-database-detail');
    } }) }) });
    await expect(getSavedPathfinderItems('user-a')).rejects.toThrow('Saved Pathfinder content is temporarily unavailable');
    await expect(getSavedPathfinderItem('user-a', expired.id)).rejects.toThrow('Saved Pathfinder content is temporarily unavailable');
  });

  it.each(['archived', 'rejected', 'stale', 'pending', 'expired'] as const)('收藏不恢复 %s 状态', async (status) => {
    listDatabaseItems.mockResolvedValue([{ ...expired, status }]);
    expect(await getSavedPathfinderItems('user-a')).toEqual([]);
  });

  it('已删除记录不恢复，静态 tombstone 也不会复活', async () => {
    listDatabaseItems.mockResolvedValue([]);
    expect(await getSavedPathfinderItems('user-a')).toEqual([]);
    const seed = STATIC_PATHFINDER_ITEMS[0];
    select.mockReturnValue({ from: () => ({ where: () => ({ orderBy: async () => [
      { itemId: seed.id, createdAt: '2026-09-01T00:00:00Z', remindDeadline: true },
    ] }) }) });
    readTombstones.mockResolvedValue({ ids: [seed.id], available: true });
    expect(await getSavedPathfinderItems('user-a')).toEqual([]);
  });
});
