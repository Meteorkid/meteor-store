import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(), listPathfinderSaves: vi.fn(), togglePathfinderSave: vi.fn(),
  setPathfinderSaveReminder: vi.fn(),
}));
vi.mock('@/lib/auth', () => ({ getSession: mocks.getSession }));
vi.mock('@/lib/rate-limit', () => ({ getClientIp: () => '127.0.0.1', rateLimit: async () => ({ limited: false }) }));
vi.mock('@/lib/pathfinder/saves', () => ({
  listPathfinderSaves: mocks.listPathfinderSaves, togglePathfinderSave: mocks.togglePathfinderSave,
  getPathfinderSaveCounts: async () => ({}), setPathfinderSaveReminder: mocks.setPathfinderSaveReminder,
}));

import { GET, POST } from '../route';

describe('收藏API的归属与缓存边界', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getSession.mockResolvedValue({ userId: 'user-a' });
    mocks.listPathfinderSaves.mockResolvedValue([]);
    mocks.togglePathfinderSave.mockResolvedValue({ saved: true, count: 1 });
  });

  it('GET只按服务端session读取本人记录，忽略客户端指定的其他用户', async () => {
    const response = await GET(new NextRequest('https://imagentx.top/api/pathfinder/saves?userId=user-b'));
    expect(mocks.listPathfinderSaves).toHaveBeenCalledExactlyOnceWith('user-a');
    expect(response.headers.get('cache-control')).toBe('no-store');
  });

  it('游客不获得任何收藏记录且响应不缓存', async () => {
    mocks.getSession.mockResolvedValue(null);
    const response = await GET(new NextRequest('https://imagentx.top/api/pathfinder/saves'));
    expect(await response.json()).toEqual({ saves: [] });
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(mocks.listPathfinderSaves).not.toHaveBeenCalled();
  });

  it('POST忽略请求体的其他owner，无法新收藏过期条目时404且no-store', async () => {
    mocks.togglePathfinderSave.mockResolvedValue(null);
    const response = await POST(new NextRequest('https://imagentx.top/api/pathfinder/saves', {
      method: 'POST', headers: { 'content-type': 'application/json', 'x-pathfinder-user': 'user-a' },
      body: JSON.stringify({ itemId: 'expired-id', userId: 'user-b', includeExpired: true }),
    }));
    expect(mocks.togglePathfinderSave).toHaveBeenCalledExactlyOnceWith('expired-id', 'user-a');
    expect(response.status).toBe(404);
    expect(response.headers.get('cache-control')).toBe('no-store');
  });

  it.each([null, 'user-b'])('缺失或过期owner头不能操作当前会话收藏：%s', async (owner) => {
    const response = await POST(new NextRequest('https://imagentx.top/api/pathfinder/saves', {
      method: 'POST', headers: owner ? { 'x-pathfinder-user': owner } : {},
      body: JSON.stringify({ itemId: 'item-a', userId: 'user-a' }),
    }));
    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({ code: 'ACCOUNT_CHANGED', error: '账号已变化，请刷新页面' });
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(mocks.togglePathfinderSave).not.toHaveBeenCalled();
  });

  it('Origin不匹配时拒绝，即使owner头匹配', async () => {
    const response = await POST(new NextRequest('https://imagentx.top/api/pathfinder/saves', {
      method: 'POST', headers: { 'x-pathfinder-user': 'user-a', origin: 'https://evil.test' },
      body: JSON.stringify({ itemId: 'item-a' }),
    }));
    expect(response.status).toBe(403);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(mocks.togglePathfinderSave).not.toHaveBeenCalled();
  });

  it('提醒开关也核对owner，匹配时仅更新当前会话的收藏', async () => {
    const request = (owner: string) => new NextRequest('https://imagentx.top/api/pathfinder/saves', {
      method: 'POST', headers: { 'x-pathfinder-user': owner },
      body: JSON.stringify({ itemId: 'item-a', remindDeadline: false }),
    });
    expect((await POST(request('user-b'))).status).toBe(409);
    expect(mocks.setPathfinderSaveReminder).not.toHaveBeenCalled();
    mocks.setPathfinderSaveReminder.mockResolvedValue(true);
    expect(await (await POST(request('user-a'))).json()).toEqual({ saved: true, remindDeadline: false });
    expect(mocks.setPathfinderSaveReminder).toHaveBeenCalledExactlyOnceWith('item-a', 'user-a', false);
  });
});
