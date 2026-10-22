import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ session: vi.fn(), get: vi.fn(), save: vi.fn(), remove: vi.fn(), limited: vi.fn(), origin: vi.fn() }));
vi.mock('@/lib/auth', () => ({ getSession: mocks.session }));
vi.mock('@/lib/pathfinder/plan-store', () => ({ getUserPlan: mocks.get, saveUserPlan: mocks.save, deleteUserPlan: mocks.remove }));
vi.mock('@/lib/rate-limit', () => ({ rateLimit: mocks.limited, getClientIp: () => '127.0.0.1' }));
vi.mock('@/lib/csrf', () => ({ assertMatchingOrigin: mocks.origin }));
import { GET, PUT, DELETE } from '../route';
const request = (method: 'PUT' | 'DELETE', owner?: string, body: unknown = {}) => new NextRequest('http://localhost/api/pathfinder/plan/saved', {
  method, headers: { 'Content-Type': 'application/json', ...(owner ? { 'X-Pathfinder-User': owner } : {}) },
  ...(method === 'PUT' ? { body: JSON.stringify(body) } : {}),
});
beforeEach(() => { vi.clearAllMocks(); mocks.session.mockResolvedValue({ userId: 'B' }); mocks.limited.mockResolvedValue({ limited: false }); mocks.origin.mockReturnValue(null); mocks.get.mockResolvedValue(null); mocks.save.mockResolvedValue({ ok: true, state: { plan: { title: 'B plan' } } }); });
async function checkPrivate(response: Response, status: number) { expect(response.status).toBe(status); expect(response.headers.get('cache-control')).toBe('no-store'); return response.json(); }

describe('学习路径账号契约', () => {
  it('游客和空云端分别返回明确身份', async () => {
    mocks.session.mockResolvedValueOnce(null);
    expect(await checkPrivate(await GET(), 200)).toEqual({ userId: null, plan: null });
    expect(await checkPrivate(await GET(), 200)).toEqual({ userId: 'B', plan: null });
  });
  it.each(['PUT', 'DELETE'] as const)('%s拒绝旧标签A和缺失owner，不调用存储', async method => {
    const handler = method === 'PUT' ? PUT : DELETE;
    await checkPrivate(await handler(request(method, 'A')), 409);
    await checkPrivate(await handler(request(method)), 409);
    expect(mocks.save).not.toHaveBeenCalled(); expect(mocks.remove).not.toHaveBeenCalled();
  });
  it.each(['PUT', 'DELETE'] as const)('%s拒绝游客和跨站', async method => {
    const handler = method === 'PUT' ? PUT : DELETE;
    mocks.session.mockResolvedValueOnce(null); await checkPrivate(await handler(request(method, 'B')), 401);
    mocks.origin.mockReturnValue(true); await checkPrivate(await handler(request(method, 'B')), 403);
    expect(mocks.save).not.toHaveBeenCalled(); expect(mocks.remove).not.toHaveBeenCalled();
  });
  it('同账号保存与删除保留合法行为并回显owner', async () => {
    const value = { plan: { title: 'owned' }, completedTaskIds: ['x'], pinnedTaskIds: [], profile: { profile: { goal: 'learn' } } };
    expect((await checkPrivate(await PUT(request('PUT', 'B', value)), 200)).userId).toBe('B');
    expect(mocks.save).toHaveBeenCalledWith('B', value, false);
    expect(await checkPrivate(await DELETE(request('DELETE', 'B')), 200)).toEqual({ userId: 'B', ok: true });
    expect(mocks.remove).toHaveBeenCalledWith('B');
  });
  it('手动导入请求原子仅新增，冲突不覆写', async () => {
    mocks.save.mockResolvedValue({ ok: false, conflict: true, reason: 'existing' });
    await checkPrivate(await PUT(request('PUT', 'B', { plan: {}, importOnly: true })), 409);
    expect(mocks.save).toHaveBeenCalledWith('B', expect.any(Object), true);
  });
  it('异常、限流、坏输入均为私有响应', async () => {
    mocks.get.mockRejectedValue(new Error('db')); await checkPrivate(await GET(), 503);
    mocks.save.mockRejectedValue(new Error('db')); await checkPrivate(await PUT(request('PUT', 'B', {})), 503);
    mocks.remove.mockRejectedValue(new Error('db')); await checkPrivate(await DELETE(request('DELETE', 'B')), 503);
    await checkPrivate(await PUT(request('PUT', 'B', [])), 400);
    await checkPrivate(await PUT(request('PUT', 'B', { text: 'x'.repeat(100_001) })), 413);
    mocks.limited.mockResolvedValue({ limited: true }); await checkPrivate(await PUT(request('PUT', 'B')), 429);
  });
});
