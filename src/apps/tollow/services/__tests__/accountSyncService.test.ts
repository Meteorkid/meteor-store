import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  TOLLOW_IMPORT_MARKER_KEY,
  TOLLOW_LEGACY_MIGRATION_OWNER_KEY,
  TOLLOW_PRACTICE_SESSIONS_KEY,
  TOLLOW_SYNC_QUEUE_KEY,
  TollowAccountSync,
  getTollowAccountStorageKey,
  mergeProgressMaps,
} from '../accountSyncService';

class MemoryStorage implements Storage {
  private data = new Map<string, string>();
  get length() { return this.data.size; }
  clear() { this.data.clear(); }
  getItem(key: string) { return this.data.get(key) ?? null; }
  key(index: number) { return [...this.data.keys()][index] ?? null; }
  removeItem(key: string) { this.data.delete(key); }
  setItem(key: string, value: string) { this.data.set(key, value); }
}

const older = {
  bookId: 'book-one',
  sectionId: 'chapter-one',
  segmentIndex: 0,
  offset: 2,
  updatedAt: '2026-08-23T00:00:00.000Z',
};
const newer = { ...older, offset: 12, updatedAt: '2026-08-24T00:00:00.000Z' };

describe('TollowAccountSync', () => {
  let storage: MemoryStorage;

  beforeEach(() => {
    storage = new MemoryStorage();
  });

  function createSync(
    userId = 'user-one',
    fetcher: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response> = vi.fn(
      async () => Response.json({ items: [] }),
    ),
  ) {
    return new TollowAccountSync({ userId, storage, fetcher });
  }

  it('按书籍合并本地和远端进度并保留较新记录', () => {
    expect(mergeProgressMaps({ 'book-one': older }, [newer])).toEqual({ 'book-one': newer });
    expect(mergeProgressMaps({ 'book-one': newer }, [older])).toEqual({ 'book-one': newer });
  });

  it('相同书籍的待同步进度只保留最新一条', async () => {
    const fetcher = vi.fn(async () => new Response('{}', { status: 503 }));
    const sync = createSync('user-one', fetcher);

    sync.enqueueProgress(older);
    sync.enqueueProgress(newer);

    const queue = JSON.parse(storage.getItem(
      getTollowAccountStorageKey('user-one', TOLLOW_SYNC_QUEUE_KEY),
    ) ?? '[]');
    expect(queue).toHaveLength(1);
    expect(queue[0].payload.offset).toBe(12);
    expect(sync.getStatus()).toBe('pending');
  });

  it('首次导入成功后才写完成标记，且不删除旧数据', async () => {
    storage.setItem('tollow-book-progress-v1', JSON.stringify({ 'book-one': newer }));
    storage.setItem('tollow_practice_sessions', JSON.stringify([{
      id: 'session-one',
      startTime: '2026-08-23T00:00:00.000Z',
      endTime: '2026-08-23T00:01:00.000Z',
      duration: 60_000,
      wordsTyped: 100,
      wpm: 100,
      accuracy: 98,
      errors: 2,
    }]));
    const fetcher = vi.fn(async () => Response.json({ accepted: 2, duplicate: 0, rejected: 0 }));
    const sync = createSync('user-one', fetcher);

    await sync.importLocalData();

    expect(storage.getItem(
      getTollowAccountStorageKey('user-one', TOLLOW_IMPORT_MARKER_KEY),
    )).toBeTruthy();
    expect(storage.getItem('tollow-book-progress-v1')).toBeTruthy();
    expect(storage.getItem('tollow_practice_sessions')).toBeTruthy();
    expect(fetcher).toHaveBeenCalledOnce();
  });

  it('导入中途失败时不写完成标记，允许下次继续', async () => {
    storage.setItem('tollow-book-progress-v1', JSON.stringify({ 'book-one': newer }));
    const sync = createSync(
      'user-one',
      vi.fn(async () => new Response('{}', { status: 503 })),
    );

    await expect(sync.importLocalData()).rejects.toThrow('Tollow 本地数据导入失败');
    expect(storage.getItem(
      getTollowAccountStorageKey('user-one', TOLLOW_IMPORT_MARKER_KEY),
    )).toBeNull();
    expect(storage.getItem('tollow-book-progress-v1')).toBeTruthy();
  });

  it('队列发送成功后清除记录并回到 synced', async () => {
    const sync = createSync(
      'user-one',
      vi.fn(async () => Response.json({ progress: newer })),
    );
    sync.enqueueProgress(newer);

    await sync.flush();

    expect(JSON.parse(storage.getItem(
      getTollowAccountStorageKey('user-one', TOLLOW_SYNC_QUEUE_KEY),
    ) ?? '[]')).toEqual([]);
    expect(sync.getStatus()).toBe('synced');
  });

  it('Pro 权限失效后保留队列并停止继续请求', async () => {
    const fetcher = vi.fn(async () => Response.json(
      { error: '需要 Tollow Pro', code: 'TOLLOW_PRO_REQUIRED' },
      { status: 403 },
    ));
    const sync = createSync('user-one', fetcher);
    sync.enqueueProgress(newer);

    await sync.flush();
    await sync.flush();

    expect(fetcher).toHaveBeenCalledOnce();
    expect(JSON.parse(storage.getItem(
      getTollowAccountStorageKey('user-one', TOLLOW_SYNC_QUEUE_KEY),
    ) ?? '[]')).toHaveLength(1);
    expect(sync.getStatus()).toBe('error');
  });

  it('旧进度请求返回时不会删除飞行期间产生的新版本', async () => {
    let resolveRequest: ((response: Response) => void) | undefined;
    const fetcher = vi.fn(() => new Promise<Response>((resolve) => {
      resolveRequest = resolve;
    }));
    const sync = createSync('user-one', fetcher);
    sync.enqueueProgress(older);

    const flushing = sync.flush();
    await vi.waitFor(() => expect(fetcher).toHaveBeenCalledOnce());
    sync.enqueueProgress(newer);
    resolveRequest?.(Response.json({ progress: older }));
    await flushing;

    const queue = JSON.parse(storage.getItem(
      getTollowAccountStorageKey('user-one', TOLLOW_SYNC_QUEUE_KEY),
    ) ?? '[]');
    expect(queue).toHaveLength(1);
    expect(queue[0].payload).toEqual(newer);
    expect(sync.getStatus()).toBe('pending');
  });

  it('同一浏览器中的两个账号看不到彼此的待同步队列', async () => {
    const userOneFetcher = vi.fn(async () => Response.json({ progress: newer }));
    const userTwoFetcher = vi.fn(async () => Response.json({ items: [] }));
    const userOne = createSync('user-one', userOneFetcher);
    const userTwo = createSync('user-two', userTwoFetcher);

    userOne.enqueueProgress(newer);
    await userTwo.flush();

    expect(userTwoFetcher).not.toHaveBeenCalled();
    expect(JSON.parse(storage.getItem(
      getTollowAccountStorageKey('user-one', TOLLOW_SYNC_QUEUE_KEY),
    ) ?? '[]')).toHaveLength(1);
    expect(storage.getItem(
      getTollowAccountStorageKey('user-two', TOLLOW_SYNC_QUEUE_KEY),
    )).toBeNull();
  });

  it('旧版全局数据只迁移给第一个登录账号', async () => {
    storage.setItem('tollow-book-progress-v1', JSON.stringify({ 'book-one': newer }));
    const userOneFetcher = vi.fn(async () => Response.json({ accepted: 1, duplicate: 0, rejected: 0 }));
    const userTwoFetcher = vi.fn(async () => Response.json({ accepted: 0, duplicate: 0, rejected: 0 }));

    await createSync('user-one', userOneFetcher).importLocalData();
    await createSync('user-two', userTwoFetcher).importLocalData();

    expect(storage.getItem(TOLLOW_LEGACY_MIGRATION_OWNER_KEY)).toBe('user-one');
    expect(userOneFetcher).toHaveBeenCalledOnce();
    expect(userTwoFetcher).not.toHaveBeenCalled();
    expect(storage.getItem(
      getTollowAccountStorageKey('user-two', 'book-progress'),
    )).toBeNull();
  });

  it('初始化时分页恢复远端练习记录并保留同 ID 的本地记录', async () => {
    const localSession = {
      id: 'session-local',
      startTime: '2026-08-23T00:00:00.000Z',
      endTime: '2026-08-23T00:01:00.000Z',
      duration: 60_000,
      wordsTyped: 100,
      wpm: 100,
      accuracy: 98,
      errors: 2,
      mistakes: [{ word: '本地扩展数据' }],
    };
    storage.setItem(
      getTollowAccountStorageKey('user-one', TOLLOW_PRACTICE_SESSIONS_KEY),
      JSON.stringify([localSession]),
    );
    storage.setItem(
      getTollowAccountStorageKey('user-one', TOLLOW_IMPORT_MARKER_KEY),
      '2026-08-24T00:00:00.000Z',
    );
    const remoteSession = {
      id: 'server-session-two',
      userId: 'user-one',
      clientRecordId: 'session-remote',
      bookId: 'book-two',
      bookTitle: '远端书籍',
      startedAt: '2026-08-24T00:00:00.000Z',
      endedAt: '2026-08-24T00:02:00.000Z',
      durationMs: 120_000,
      wordsTyped: 220,
      wpm: 110,
      accuracy: 99,
      errorCount: 1,
      createdAt: '2026-08-24T00:02:00.000Z',
    };
    const fetcher = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url === '/api/tollow/progress') return Response.json({ items: [] });
      if (url.includes('/api/tollow/sessions?page=1')) {
        return Response.json({ items: [{ ...remoteSession, clientRecordId: 'session-local' }], total: 2, page: 1, limit: 100 });
      }
      if (url.includes('/api/tollow/sessions?page=2')) {
        return Response.json({ items: [remoteSession], total: 2, page: 2, limit: 100 });
      }
      throw new Error(`unexpected request: ${url}`);
    });

    await createSync('user-one', fetcher).initialize();

    const cached = JSON.parse(storage.getItem(
      getTollowAccountStorageKey('user-one', TOLLOW_PRACTICE_SESSIONS_KEY),
    ) ?? '[]');
    expect(cached).toHaveLength(2);
    expect(cached.find((item: { id?: string }) => item.id === 'session-local')).toEqual(localSession);
    expect(cached.find((item: { clientRecordId?: string }) => item.clientRecordId === 'session-remote')).toMatchObject({
      bookId: 'book-two',
      bookTitle: '远端书籍',
    });
    expect(fetcher).toHaveBeenCalledWith(
      '/api/tollow/sessions?page=1&limit=100',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(fetcher).toHaveBeenCalledWith(
      '/api/tollow/sessions?page=2&limit=100',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it('远端请求无响应时按超时结束初始化并进入可重试状态', async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn(() => new Promise<Response>(() => undefined));
    const sync = new TollowAccountSync({
      userId: 'user-one',
      storage,
      fetcher,
      requestTimeoutMs: 50,
    });

    const initializing = sync.initialize();
    await vi.advanceTimersByTimeAsync(51);
    await initializing;

    expect(sync.getStatus()).toBe('error');
    vi.useRealTimers();
  });
});
