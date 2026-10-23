import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ getSession: vi.fn(), togglePathfinderFollow: vi.fn() }));
vi.mock('@/lib/auth', () => ({ getSession: mocks.getSession }));
vi.mock('@/lib/rate-limit', () => ({ getClientIp: () => '127.0.0.1', rateLimit: async () => ({ limited: false }) }));
vi.mock('@/lib/pathfinder/saves', () => ({
  togglePathfinderFollow: mocks.togglePathfinderFollow,
  listPathfinderFollows: async () => ({ organization: [], topic: [] }),
}));
import { POST } from '../route';

const request = (owner: string | null, origin?: string) => new NextRequest('https://imagentx.top/api/pathfinder/follows', {
  method: 'POST', headers: { ...(owner ? { 'x-pathfinder-user': owner } : {}), ...(origin ? { origin } : {}) },
  body: JSON.stringify({ kind: 'topic', value: 'ai', userId: 'user-b' }),
});

describe('关注写入的身份边界', () => {
  beforeEach(() => {
    vi.clearAllMocks(); mocks.getSession.mockResolvedValue({ userId: 'user-a' });
    mocks.togglePathfinderFollow.mockResolvedValue({ following: true, value: 'ai' });
  });
  it.each([null, 'user-b'])('owner不匹配不写入当前会话：%s', async (owner) => {
    const response = await POST(request(owner));
    expect(response.status).toBe(409);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(await response.json()).toMatchObject({ code: 'ACCOUNT_CHANGED' });
    expect(mocks.togglePathfinderFollow).not.toHaveBeenCalled();
  });
  it('请求体owner不能取代服务端session', async () => {
    const response = await POST(request('user-a'));
    expect(response.status).toBe(200);
    expect(mocks.togglePathfinderFollow).toHaveBeenCalledExactlyOnceWith('user-a', 'topic', 'ai');
  });
  it('未登录不能凭owner头写入', async () => {
    mocks.getSession.mockResolvedValue(null);
    expect((await POST(request('user-a'))).status).toBe(401);
    expect(mocks.togglePathfinderFollow).not.toHaveBeenCalled();
  });
  it('恶意Origin被拒绝', async () => {
    const response = await POST(request('user-a', 'https://evil.test'));
    expect(response.status).toBe(403);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(mocks.togglePathfinderFollow).not.toHaveBeenCalled();
  });
});
