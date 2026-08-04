import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  session: null as null | { userId: string; email: string },
}));

vi.mock('@/lib/auth', () => ({
  getSession: async () => state.session,
}));

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: async () => ({ limited: false }),
}));

const exportData = vi.fn();
vi.mock('@/lib/user-data-export', () => ({
  exportUserData: (...args: unknown[]) => exportData(...args),
}));

describe('导出个人数据', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    state.session = null;
    exportData.mockResolvedValue({
      exportedAt: '2026-08-04T00:00:00.000Z',
      account: { id: 'U1', email: 'user@example.com' },
      orders: [],
    });
  });

  it('未登录不能导出', async () => {
    const { GET } = await import('../export/route');

    const response = await GET();

    expect(response.status).toBe(401);
    expect(exportData).not.toHaveBeenCalled();
  });

  it('登录后下载不缓存的 JSON 数据副本', async () => {
    state.session = { userId: 'U1', email: 'user@example.com' };
    const { GET } = await import('../export/route');

    const response = await GET();

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(response.headers.get('content-disposition')).toContain('attachment');
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(exportData).toHaveBeenCalledWith('U1', 'user@example.com');
    await expect(response.json()).resolves.toMatchObject({
      account: { id: 'U1', email: 'user@example.com' },
    });
  });
});
