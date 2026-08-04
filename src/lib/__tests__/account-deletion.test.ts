import { beforeEach, describe, expect, it, vi } from 'vitest';
import { users } from '../db/schema';

const state = vi.hoisted(() => ({
  posts: [{ id: 'P1', status: 'published' }],
  deletedTables: [] as unknown[],
  failFirstCleanup: false,
  deleteCount: 0,
}));

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
        where: async () => {
          if (shouldFail) throw new Error('cleanup failed');
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
    deleteAvatar.mockResolvedValue(undefined);
    deleteImages.mockResolvedValue(undefined);
  });

  it('子数据清理完成后才删除用户并刷新公开内容', async () => {
    const { deleteUserAccount } = await import('../account-deletion');

    await deleteUserAccount({
      userId: 'U1',
      email: 'user@example.com',
      avatarUrl: 'https://cdn.example.com/avatars/U1/avatar.webp',
    });

    expect(state.deletedTables.at(-1)).toBe(users);
    expect(revalidate).toHaveBeenCalledOnce();
    expect(deleteAvatar).toHaveBeenCalledWith('avatars/U1/avatar.webp');
    expect(deleteImages).toHaveBeenCalledWith('U1');
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
});
