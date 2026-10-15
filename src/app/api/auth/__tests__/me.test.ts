import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  isAdminSession: vi.fn(),
  select: vi.fn(),
  limit: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({ getSession: mocks.getSession }));
vi.mock('@/lib/admin', () => ({ isAdminSession: mocks.isAdminSession }));
vi.mock('@/lib/db', () => ({
  db: {
    select: (...args: unknown[]) => {
      mocks.select(...args);
      return { from: () => ({ where: () => ({ limit: mocks.limit }) }) };
    },
  },
}));

import { GET } from '../me/route';

const session = {
  userId: 'user-1', email: 'user@example.com', name: 'Meteor', emailVerified: true, tokenVersion: 2,
};

describe('当前账号 API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getSession.mockResolvedValue(session);
    mocks.isAdminSession.mockReturnValue(false);
    mocks.limit.mockResolvedValue([{ avatarUrl: 'https://example.com/avatar.webp', bio: 'Hello', isStudent: true }]);
  });

  it('刷新后的登录账号同时返回相同id和userId，且不能缓存', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(await response.json()).toEqual({
      user: {
        ...session,
        id: session.userId,
        avatarUrl: 'https://example.com/avatar.webp',
        bio: 'Hello',
        isStudent: true,
        isAdmin: false,
      },
    });
    expect(mocks.isAdminSession).toHaveBeenCalledWith(session);
  });

  it('游客返回null且不能缓存，不查询账号资料', async () => {
    mocks.getSession.mockResolvedValue(null);
    const response = await GET();
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(await response.json()).toEqual({ user: null });
    expect(mocks.select).not.toHaveBeenCalled();
    expect(mocks.isAdminSession).not.toHaveBeenCalled();
  });

  it('资料查询为空时仍保留会话账号id和现有默认字段', async () => {
    mocks.limit.mockResolvedValue([]);
    const response = await GET();
    const { user } = await response.json();
    expect(user.id).toBe(session.userId);
    expect(user.userId).toBe(session.userId);
    expect(user.avatarUrl).toBeNull();
    expect(user.bio).toBeNull();
    expect(user.isStudent).toBe(false);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });
});
