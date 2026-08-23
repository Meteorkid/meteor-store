import { describe, expect, it, vi } from 'vitest';
import {
  TOLLOW_FAVORITES_OUTBOX_KEY,
  TollowFavoriteService,
} from '../favoriteService';
import { TOLLOW_FAVORITES_CACHE_KEY, getTollowAccountStorageKey } from '../accountSyncService';

class MemoryStorage {
  private data = new Map<string, string>();
  getItem(key: string) { return this.data.get(key) ?? null; }
  setItem(key: string, value: string) { this.data.set(key, value); }
}

const favoriteDraft = {
  bookId: 'lunyu',
  bookTitle: '论语',
  sectionId: 'chapter-01',
  sectionTitle: '學而第一',
  segmentIndex: 0,
  startOffset: 0,
  endOffset: 4,
  quote: '学而时习',
  note: null,
  tags: ['经典'],
};

const defaultQuery = {
  sort: 'updated-desc' as const,
  page: 1,
  limit: 20,
};

describe('TollowFavoriteService', () => {
  it('列表请求只发送白名单筛选参数', async () => {
    const facets = {
      books: [{ id: 'lunyu', title: '论语' }, { id: 'mengzi', title: '孟子' }],
      tags: ['哲思', '经典'],
    };
    const fetcher = vi.fn(async () => Response.json({ items: [], total: 0, page: 2, limit: 10, facets }));
    const service = new TollowFavoriteService(fetcher);

    const result = await service.list({
      q: '重要',
      bookId: 'lunyu',
      tag: '哲思',
      sort: 'position',
      page: 2,
      limit: 10,
    });

    expect(fetcher).toHaveBeenCalledWith('/api/tollow/favorites?q=%E9%87%8D%E8%A6%81&bookId=lunyu&tag=%E5%93%B2%E6%80%9D&sort=position&page=2&limit=10');
    expect(result.facets).toEqual(facets);
  });

  it('创建、编辑和删除使用对应方法且不携带 userId', async () => {
    const fetcher = vi.fn(async () => Response.json({ favorite: { id: 'F1' } }));
    const service = new TollowFavoriteService(fetcher);
    await service.create(favoriteDraft);
    await service.update('F1', { note: '常读常新', tags: ['经典'] });
    await service.remove('F1');

    const calls = fetcher.mock.calls as unknown as Array<[string, RequestInit?]>;
    expect(calls[0]?.[1]).toMatchObject({ method: 'POST' });
    expect(calls[1]?.[0]).toBe('/api/tollow/favorites/F1');
    expect(calls[1]?.[1]).toMatchObject({ method: 'PATCH' });
    expect(calls[2]?.[1]).toMatchObject({ method: 'DELETE' });
    expect(JSON.stringify(fetcher.mock.calls)).not.toContain('userId');
  });

  it('服务端错误转为可展示的错误消息', async () => {
    const service = new TollowFavoriteService(async () => Response.json(
      { error: '收藏不存在' },
      { status: 404 },
    ));

    await expect(service.remove('missing')).rejects.toThrow('收藏不存在');
  });

  it('断网创建会立即写入账号缓存与 outbox，列表可离线读取', async () => {
    const storage = new MemoryStorage();
    const fetcher = vi.fn(async () => { throw new TypeError('offline'); });
    const service = new TollowFavoriteService(fetcher, { storage, userId: 'user-one' });

    const created = await service.create(favoriteDraft);
    const result = await service.list(defaultQuery);

    expect(created.syncState).toBe('pending');
    expect(result.items).toEqual([created]);
    expect(JSON.parse(storage.getItem(
      getTollowAccountStorageKey('user-one', TOLLOW_FAVORITES_CACHE_KEY),
    ) ?? '[]')).toHaveLength(1);
    expect(JSON.parse(storage.getItem(
      getTollowAccountStorageKey('user-one', TOLLOW_FAVORITES_OUTBOX_KEY),
    ) ?? '[]')).toMatchObject([{ type: 'create' }]);
  });

  it('未同步创建后的编辑会压缩进同一条 create 操作', async () => {
    const storage = new MemoryStorage();
    const fetcher = vi.fn(() => new Promise<Response>(() => undefined));
    const service = new TollowFavoriteService(fetcher, { storage, userId: 'user-one' });

    const created = await service.create(favoriteDraft);
    await service.update(created.id, { note: '离线笔记', tags: ['经典', '重点'] });

    const outbox = JSON.parse(storage.getItem(
      getTollowAccountStorageKey('user-one', TOLLOW_FAVORITES_OUTBOX_KEY),
    ) ?? '[]');
    expect(outbox).toHaveLength(1);
    expect(outbox[0]).toMatchObject({
      type: 'create',
      payload: { note: '离线笔记', tags: ['经典', '重点'] },
    });
  });

  it('两个账号的收藏缓存与 outbox 完全隔离', async () => {
    const storage = new MemoryStorage();
    const offline = async () => { throw new TypeError('offline'); };
    const userOne = new TollowFavoriteService(offline, { storage, userId: 'user-one' });
    const userTwo = new TollowFavoriteService(offline, { storage, userId: 'user-two' });

    await userOne.create(favoriteDraft);

    expect((await userTwo.list(defaultQuery)).items).toEqual([]);
    expect(storage.getItem(
      getTollowAccountStorageKey('user-two', TOLLOW_FAVORITES_OUTBOX_KEY),
    )).toBeNull();
  });

  it('创建响应丢失后使用同一 clientRecordId 重试并收敛为一条服务端记录', async () => {
    const storage = new MemoryStorage();
    const requestBodies: Array<Record<string, unknown>> = [];
    let attempt = 0;
    const fetcher = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      const payload = JSON.parse(String(init?.body)) as Record<string, unknown>;
      requestBodies.push(payload);
      attempt += 1;
      if (attempt === 1) throw new TypeError('response lost');
      return Response.json({
        favorite: {
          ...payload,
          id: 'server-favorite-1',
          createdAt: '2026-08-24T00:00:00.000Z',
          updatedAt: '2026-08-24T00:00:00.000Z',
        },
        created: false,
      });
    });
    const service = new TollowFavoriteService(fetcher, { storage, userId: 'user-one' });

    await service.create(favoriteDraft);
    await vi.waitFor(() => expect(fetcher).toHaveBeenCalledOnce());
    await vi.waitFor(async () => {
      await service.flush();
      expect(fetcher).toHaveBeenCalledTimes(2);
    });

    expect(requestBodies[0]?.clientRecordId).toBe(requestBodies[1]?.clientRecordId);
    const cached = JSON.parse(storage.getItem(
      getTollowAccountStorageKey('user-one', TOLLOW_FAVORITES_CACHE_KEY),
    ) ?? '[]');
    expect(cached).toMatchObject([{ id: 'server-favorite-1', syncState: 'synced' }]);
    expect(JSON.parse(storage.getItem(
      getTollowAccountStorageKey('user-one', TOLLOW_FAVORITES_OUTBOX_KEY),
    ) ?? '[]')).toEqual([]);
  });

  it('离线删除已同步收藏时立即从列表消失并保留 delete 操作', async () => {
    const storage = new MemoryStorage();
    const serverFavorite = {
      ...favoriteDraft,
      clientRecordId: 'favorite-client-1',
      id: 'server-favorite-1',
      createdAt: '2026-08-24T00:00:00.000Z',
      updatedAt: '2026-08-24T00:00:00.000Z',
    };
    let offline = false;
    const fetcher = vi.fn(async () => {
      if (offline) throw new TypeError('offline');
      return Response.json({
        items: [serverFavorite],
        total: 1,
        page: 1,
        limit: 20,
        facets: { books: [{ id: 'lunyu', title: '论语' }], tags: ['经典'] },
      });
    });
    const service = new TollowFavoriteService(fetcher, { storage, userId: 'user-one' });
    await service.list(defaultQuery);
    offline = true;

    await service.remove(serverFavorite.id);

    expect((await service.list(defaultQuery)).items).toEqual([]);
    expect(JSON.parse(storage.getItem(
      getTollowAccountStorageKey('user-one', TOLLOW_FAVORITES_OUTBOX_KEY),
    ) ?? '[]')).toMatchObject([{ type: 'delete', payload: { id: 'server-favorite-1' } }]);
  });
});
