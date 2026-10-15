import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ sync: vi.fn(), rateLimit: vi.fn(), revalidatePath: vi.fn() }));
vi.mock('@/lib/masters/automation', () => ({ syncMastersSources: mocks.sync }));
vi.mock('@/lib/rate-limit', () => ({ getClientIp: () => '127.0.0.1', rateLimit: mocks.rateLimit }));
vi.mock('next/cache', () => ({ revalidatePath: mocks.revalidatePath }));
import { POST } from '../route';

const secret = 'masters-sync-test-secret-longer-than-32-chars';
const result = { checked: 6, published: 11, changed: 0, failed: 0, unchanged: 0, paused: 0, errors: [] };
function request(authorization: string | null = `Bearer ${secret}`) {
  return new NextRequest('http://localhost:3000/api/cron/masters-sync', { method: 'POST', headers: authorization ? { authorization } : {} });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv('PATHFINDER_CRON_SECRET', secret);
  vi.spyOn(console, 'error').mockImplementation(() => {});
  mocks.rateLimit.mockResolvedValue({ limited: false });
  mocks.sync.mockResolvedValue(result);
});
afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

describe('官方申请来源定时同步入口', () => {
  it.each([null, 'Bearer wrong', `Bearer ${'x'.repeat(secret.length)}`])('错误凭据不执行同步', async authorization => {
    expect((await POST(request(authorization))).status).toBe(401);
    expect(mocks.sync).not.toHaveBeenCalled();
    expect(mocks.rateLimit).not.toHaveBeenCalled();
  });
  it.each([undefined, 'short'])('共用密钥未配置或太短时拒绝', async value => {
    vi.stubEnv('PATHFINDER_CRON_SECRET', value);
    expect((await POST(request(`Bearer ${value}`))).status).toBe(401);
    expect(mocks.sync).not.toHaveBeenCalled();
  });
  it('限流failClosed，超限不发网络同步', async () => {
    mocks.rateLimit.mockResolvedValue({ limited: true });
    expect((await POST(request())).status).toBe(429);
    expect(mocks.rateLimit).toHaveBeenCalledWith('masters-sync:127.0.0.1', 5, 60_000, { failClosed: true });
    expect(mocks.sync).not.toHaveBeenCalled();
  });
  it('成功回报计数并刷新两个公开入口', async () => {
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true, ...result });
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/[locale]/masters', 'page');
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/[locale]/daily', 'page');
  });
  it('单源失败返回503但保留其他来源成功统计', async () => {
    const partial = { ...result, published: 10, failed: 1, errors: [{ source: 'oxford', reason: 'fetch_failed' }] };
    mocks.sync.mockResolvedValue(partial);
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ success: false, ...partial });
  });
  it('数据库等意外失败不暴露内部错误', async () => {
    mocks.sync.mockRejectedValue(new Error('secret connection detail'));
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain('secret connection');
  });
});
