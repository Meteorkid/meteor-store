import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ session: vi.fn(), admin: vi.fn(), snapshot: vi.fn(), task: vi.fn() }));
vi.mock('@/lib/auth', () => ({ getSession: mocks.session }));
vi.mock('@/lib/admin', () => ({ isAdminSession: mocks.admin }));
vi.mock('@/lib/monitoring', () => ({ readMonitoringSnapshot: mocks.snapshot }));
vi.mock('@/lib/task-monitoring', () => ({ readRecheckSnapshot: mocks.task }));
import { GET } from '../route';

beforeEach(() => {
  vi.resetAllMocks();
  mocks.session.mockResolvedValue({ userId: 'admin-a', emailVerified: true });
  mocks.admin.mockReturnValue(true);
  mocks.snapshot.mockResolvedValue({ status: 'not-configured', events: [] });
  mocks.task.mockResolvedValue({ taskId: 'pathfinder-recheck', status: 'not-configured' });
});

describe('管理员监控只读接口', () => {
  it.each(['guest', 'member'])('%s 返回404与no-store，不读取私有文件', async identity => {
    if (identity === 'guest') mocks.session.mockResolvedValue(null);
    else mocks.admin.mockReturnValue(false);
    const response = await GET();
    expect(response.status).toBe(404);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(await response.json()).toEqual({ error: 'Not found' });
    expect(mocks.snapshot).not.toHaveBeenCalled();
    expect(mocks.task).not.toHaveBeenCalled();
  });
  it('管理员结果附带owner并禁止缓存', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(await response.json()).toEqual({ userId: 'admin-a', monitoring: { status: 'not-configured', events: [] }, task: { taskId: 'pathfinder-recheck', status: 'not-configured' } });
    expect(mocks.admin).toHaveBeenCalledWith({ userId: 'admin-a', emailVerified: true });
  });
  it('意外读取失败返回不含原始错误的503', async () => {
    mocks.snapshot.mockRejectedValue(new Error('/private/secret password=secret'));
    const response = await GET();
    expect(response.status).toBe(503);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(await response.json()).toEqual({ error: 'Monitoring unavailable' });
  });
});
