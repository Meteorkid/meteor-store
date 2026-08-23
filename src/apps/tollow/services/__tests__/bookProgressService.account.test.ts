import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { bookProgressService } from '../bookProgressService';
import {
  configureTollowAccountStorage,
  releaseTollowAccountStorage,
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

const progress = {
  bookId: 'book-one',
  sectionId: 'chapter-one',
  segmentIndex: 0,
  offset: 8,
  updatedAt: '2026-08-24T00:00:00.000Z',
};

describe('bookProgressService 账号存储隔离', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', new MemoryStorage());
  });

  afterEach(() => {
    releaseTollowAccountStorage('user-one');
    releaseTollowAccountStorage('user-two');
    vi.unstubAllGlobals();
  });

  it('切换账号后不会读取上一账号的阅读进度', () => {
    configureTollowAccountStorage('user-one');
    expect(bookProgressService.saveProgress(progress)).toBe(true);
    expect(bookProgressService.getProgress('book-one')).toEqual(progress);

    configureTollowAccountStorage('user-two');
    expect(bookProgressService.getProgress('book-one')).toBeNull();
  });
});
