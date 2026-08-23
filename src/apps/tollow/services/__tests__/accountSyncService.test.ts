import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  TOLLOW_IMPORT_MARKER_KEY,
  TOLLOW_SYNC_QUEUE_KEY,
  TollowAccountSync,
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

  it('按书籍合并本地和远端进度并保留较新记录', () => {
    expect(mergeProgressMaps({ 'book-one': older }, [newer])).toEqual({ 'book-one': newer });
    expect(mergeProgressMaps({ 'book-one': newer }, [older])).toEqual({ 'book-one': newer });
  });

  it('相同书籍的待同步进度只保留最新一条', async () => {
    const fetcher = vi.fn(async () => new Response('{}', { status: 503 }));
    const sync = new TollowAccountSync({ storage, fetcher });

    sync.enqueueProgress(older);
    sync.enqueueProgress(newer);

    const queue = JSON.parse(storage.getItem(TOLLOW_SYNC_QUEUE_KEY) ?? '[]');
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
    const sync = new TollowAccountSync({ storage, fetcher });

    await sync.importLocalData();

    expect(storage.getItem(TOLLOW_IMPORT_MARKER_KEY)).toBeTruthy();
    expect(storage.getItem('tollow-book-progress-v1')).toBeTruthy();
    expect(storage.getItem('tollow_practice_sessions')).toBeTruthy();
    expect(fetcher).toHaveBeenCalledOnce();
  });

  it('导入中途失败时不写完成标记，允许下次继续', async () => {
    storage.setItem('tollow-book-progress-v1', JSON.stringify({ 'book-one': newer }));
    const sync = new TollowAccountSync({
      storage,
      fetcher: vi.fn(async () => new Response('{}', { status: 503 })),
    });

    await expect(sync.importLocalData()).rejects.toThrow('Tollow 本地数据导入失败');
    expect(storage.getItem(TOLLOW_IMPORT_MARKER_KEY)).toBeNull();
    expect(storage.getItem('tollow-book-progress-v1')).toBeTruthy();
  });

  it('队列发送成功后清除记录并回到 synced', async () => {
    const sync = new TollowAccountSync({
      storage,
      fetcher: vi.fn(async () => Response.json({ progress: newer })),
    });
    sync.enqueueProgress(newer);

    await sync.flush();

    expect(JSON.parse(storage.getItem(TOLLOW_SYNC_QUEUE_KEY) ?? '[]')).toEqual([]);
    expect(sync.getStatus()).toBe('synced');
  });
});
