import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PgDialect } from 'drizzle-orm/pg-core';
import type { SQL } from 'drizzle-orm';
import {
  blogImages,
  dailyPreferences,
  mastersNotices,
  mastersRounds,
  mastersWatches,
  phdNotices,
  phdRounds,
  phdWatches,
  personalAccessTokens,
  postSections,
  tollowBookProgress,
  tollowPracticeSessions,
  tollowTextFavorites,
  users,
} from '../db/schema';

const state = vi.hoisted(() => ({
  posts: [{ id: 'P1', status: 'published' }],
  deletedTables: [] as unknown[],
  failFirstCleanup: false,
  deleteCount: 0,
  deletedConditions: [] as Array<{ table: unknown; sql: string; params: unknown[] }>,
  failTable: null as unknown,
}));

const deleteSoftwareDevices = vi.fn();
vi.mock('../software-licenses/service', () => ({ deleteSoftwareDeviceData: (...args: unknown[]) => deleteSoftwareDevices(...args) }));

vi.mock('../db', () => ({
  db: {
    select: () => ({
      from: () => ({
        where: async () => state.posts,
      }),
    }),
    delete: (table: unknown) => {
      state.deletedTables.push(table);
      state.deleteCount += 1;
      const shouldFail = state.failFirstCleanup && state.deleteCount === 1;
      return {
        where: async (condition: SQL) => {
          state.deletedConditions.push({ table, ...new PgDialect().sqlToQuery(condition) });
          if (shouldFail || table === state.failTable) throw new Error('cleanup failed');
          return { rowCount: 1 };
        },
      };
    },
    update: () => ({
      set: () => ({ where: async () => ({ rowCount: 1 }) }),
    }),
  },
}));

const revalidate = vi.fn();
vi.mock('../revalidate', () => ({
  revalidatePublishedPaths: () => revalidate(),
}));

const deleteAvatar = vi.fn();
vi.mock('../avatar-storage', () => ({
  keyFromUrl: () => 'avatars/U1/avatar.webp',
  deleteAvatar: (...args: unknown[]) => deleteAvatar(...args),
}));

const deleteImages = vi.fn();
vi.mock('../blog-image-storage', () => ({
  deleteUserBlogImages: (...args: unknown[]) => deleteImages(...args),
}));

describe('账户数据删除顺序', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    state.posts = [{ id: 'P1', status: 'published' }];
    state.deletedTables.length = 0;
    state.failFirstCleanup = false;
    state.deleteCount = 0;
    state.deletedConditions.length = 0;
    state.failTable = null;
    deleteAvatar.mockResolvedValue(undefined);
    deleteImages.mockResolvedValue(undefined);
    deleteSoftwareDevices.mockResolvedValue(undefined);
  });

  it('子数据清理完成后才删除用户并刷新公开内容', async () => {
    const { deleteUserAccount } = await import('../account-deletion');

    await deleteUserAccount({
      userId: 'U1',
      email: 'user@example.com',
      avatarUrl: 'https://cdn.example.com/avatars/U1/avatar.webp',
    });

    expect(state.deletedTables.at(-1)).toBe(users);
    expect(state.deletedTables).toContain(blogImages);
    expect(state.deletedTables).toContain(dailyPreferences);
    expect(state.deletedTables).toContain(mastersNotices);
    expect(state.deletedTables).toContain(mastersWatches);
    expect(state.deletedTables).toContain(phdNotices);
    expect(state.deletedTables).toContain(phdWatches);
    expect(state.deletedTables).not.toContain(mastersRounds);
    expect(state.deletedTables).not.toContain(phdRounds);
    for (const table of [phdNotices, phdWatches]) {
      expect(state.deletedConditions.find(item => item.table === table)?.params).toEqual(['U1']);
      expect(state.deletedTables.indexOf(table)).toBeLessThan(state.deletedTables.indexOf(users));
    }
    expect(state.deletedTables.indexOf(blogImages)).toBeLessThan(
      state.deletedTables.indexOf(users),
    );
    expect(state.deletedTables).toContain(personalAccessTokens);
    expect(state.deletedTables).toContain(postSections);
    expect(state.deletedTables).toContain(tollowBookProgress);
    expect(state.deletedTables).toContain(tollowPracticeSessions);
    expect(state.deletedTables).toContain(tollowTextFavorites);
    expect(state.deletedTables.indexOf(tollowBookProgress)).toBeLessThan(
      state.deletedTables.indexOf(users),
    );
    expect(revalidate).toHaveBeenCalledOnce();
    expect(deleteAvatar).toHaveBeenCalledWith('avatars/U1/avatar.webp');
    expect(deleteImages).toHaveBeenCalledWith('U1');
    expect(deleteSoftwareDevices).toHaveBeenCalledWith('user@example.com');
  });

  it('子数据清理失败时保留用户行，允许再次尝试', async () => {
    state.failFirstCleanup = true;
    const { deleteUserAccount } = await import('../account-deletion');

    await expect(deleteUserAccount({
      userId: 'U1',
      email: 'user@example.com',
      avatarUrl: null,
    })).rejects.toThrow('cleanup failed');

    expect(state.deletedTables).not.toContain(users);
    expect(deleteImages).not.toHaveBeenCalled();
  });

  it('博士私人记录清理失败时也保留账号，公共申请轮次不进入删除范围', async () => {
    state.failTable = phdNotices;
    const { deleteUserAccount } = await import('../account-deletion');
    await expect(deleteUserAccount({ userId: 'U1', email: 'user@example.com', avatarUrl: null }))
      .rejects.toThrow('cleanup failed');
    expect(state.deletedTables).not.toContain(users);
    expect(state.deletedTables).not.toContain(phdRounds);
    expect(state.deletedTables).not.toContain(mastersRounds);
  });
});
