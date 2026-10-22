import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  session: vi.fn(), admin: vi.fn(), state: vi.fn(), check: vi.fn(), sync: vi.fn(), limit: vi.fn(), audit: vi.fn(),
}));
vi.mock('@/lib/auth', () => ({ getSession: mocks.session }));
vi.mock('@/lib/admin', () => ({ isAdminSession: mocks.admin }));
vi.mock('@/lib/admin-audit', () => ({ logAdminAction: mocks.audit }));
vi.mock('@/lib/rate-limit', () => ({ getClientIp: () => '203.0.113.1', rateLimit: mocks.limit }));
vi.mock('@/lib/product-updates/service', () => ({
  getProductUpdateState: mocks.state, checkProductUpdates: mocks.check, startProductUpdateSync: mocks.sync,
  ProductUpdateError: class extends Error { constructor(message: string, readonly status: number) { super(message); } },
}));

import { ProductUpdateError } from '@/lib/product-updates/service';
import { GET } from '../route';
import { POST as CHECK } from '../check/route';
import { POST as SYNC } from '../sync/route';

const checkId = '20397c3d-62ea-4582-8c7c-0d1ea4f811ea';
const check = { id: checkId, rows: [{ productId: 'xisland', status: 'update' }] };
const job = { id: 'job-1', checkId, status: 'queued', rows: [{ productId: 'xisland', status: 'pending' }] };
const state = { check, job: null, current: [], currentRevision: 'revision', catalogError: false };
const routes = [
  { name: 'GET', call: () => GET(), service: mocks.state },
  { name: 'check', call: () => CHECK(request('check')), service: mocks.check },
  { name: 'sync', call: () => SYNC(request('sync', { checkId })), service: mocks.sync },
];

function request(route: string, body?: unknown, origin = 'http://localhost:3000') {
  return new NextRequest(`http://localhost:3000/api/admin/product-updates/${route}`, {
    method: 'POST', headers: { origin, 'content-type': 'application/json' },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  mocks.session.mockResolvedValue({ userId: 'admin-a', email: 'admin@example.com', emailVerified: true });
  mocks.admin.mockReturnValue(true);
  mocks.state.mockResolvedValue(state);
  mocks.check.mockResolvedValue(check);
  mocks.sync.mockResolvedValue(job);
  mocks.limit.mockResolvedValue({ limited: false });
});

describe('产品更新管理接口', () => {
  for (const route of routes) {
    it.each(['guest', 'member'])(`${route.name}: %s 返回404与no-store，不触及服务`, async identity => {
      if (identity === 'guest') mocks.session.mockResolvedValue(null);
      else mocks.admin.mockReturnValue(false);
      const response = await route.call();
      expect(response.status).toBe(404);
      expect(response.headers.get('cache-control')).toBe('no-store');
      expect(await response.json()).toEqual({ error: 'Not found' });
      expect(route.service).not.toHaveBeenCalled();
      expect(mocks.limit).not.toHaveBeenCalled();
    });

    it(`${route.name}: 意外错误不泄露私有路径或凭证`, async () => {
      route.service.mockRejectedValue(new Error('/private/token=secret'));
      const response = await route.call();
      expect(response.status).toBe(503);
      expect(response.headers.get('cache-control')).toBe('no-store');
      expect(await response.text()).not.toMatch(/private|secret|token/);
    });

    it(`${route.name}: 保留业务错误状态并禁用缓存`, async () => {
      route.service.mockRejectedValue(new ProductUpdateError('检查结果已失效', 409));
      const response = await route.call();
      expect(response.status).toBe(409);
      expect(response.headers.get('cache-control')).toBe('no-store');
      expect(await response.json()).toEqual({ error: '检查结果已失效' });
    });
  }

  it('读取结果附带当前账号身份', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(await response.json()).toEqual({ userId: 'admin-a', state });
  });

  for (const route of ['check', 'sync']) {
    const call = route === 'check' ? CHECK : SYNC;
    it(`${route}: 跨站拒绝且不触发限流或服务`, async () => {
      const response = await call(request(route, route === 'sync' ? { checkId } : undefined, 'https://evil.example'));
      expect(response.status).toBe(403);
      expect(response.headers.get('cache-control')).toBe('no-store');
      expect(mocks.limit).not.toHaveBeenCalled();
      expect(mocks.check).not.toHaveBeenCalled();
      expect(mocks.sync).not.toHaveBeenCalled();
    });
    it(`${route}: 按账号和IP限流并使用memory降级`, async () => {
      mocks.limit.mockResolvedValue({ limited: true });
      const response = await call(request(route, route === 'sync' ? { checkId } : undefined));
      expect(response.status).toBe(429);
      expect(response.headers.get('cache-control')).toBe('no-store');
      expect(mocks.limit).toHaveBeenCalledWith(`admin-product-updates:${route}:admin-a:203.0.113.1`, 5, 60_000, { fallback: 'memory' });
      expect(mocks.check).not.toHaveBeenCalled();
      expect(mocks.sync).not.toHaveBeenCalled();
    });
  }

  it('检查只使用服务端固定来源并审计检查ID', async () => {
    const response = await CHECK(request('check'));
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(await response.json()).toEqual({ userId: 'admin-a', check });
    expect(mocks.check).toHaveBeenCalledWith();
    expect(mocks.audit).toHaveBeenCalledWith(expect.objectContaining({ userId: 'admin-a' }), expect.objectContaining({ action: 'product-updates.check', targetId: checkId }));
  });

  it('检查不接受客户端来源参数', async () => {
    const response = await CHECK(request('check', { url: 'https://evil.example' }));
    expect(response.status).toBe(400);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(mocks.check).not.toHaveBeenCalled();
  });

  it('检查接受真实服务器传入的空请求流', async () => {
    const body = new ReadableStream({ start(controller) { controller.close(); } });
    const init = { method: 'POST', body, duplex: 'half' as const };
    const response = await CHECK(new NextRequest('http://localhost:3000/api/admin/product-updates/check', init));
    expect(response.status).toBe(200);
    expect(mocks.check).toHaveBeenCalledOnce();
  });

  it('同步只传检查ID，返回202和可轮询任务', async () => {
    const response = await SYNC(request('sync', { checkId }));
    expect(response.status).toBe(202);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(await response.json()).toEqual({ userId: 'admin-a', job });
    expect(mocks.sync).toHaveBeenCalledWith(checkId);
    expect(mocks.audit).toHaveBeenCalledWith(expect.objectContaining({ userId: 'admin-a' }), expect.objectContaining({ action: 'product-updates.sync', targetId: 'job-1', detail: { checkId, products: 1 } }));
  });

  it.each([
    {}, { checkId: 'not-a-uuid' }, { checkId, url: 'https://evil.example' }, { checkId, r2Key: 'other/key' },
    { checkId, gated: false }, { checkId, repository: 'other/repo' }, null, [],
  ])('同步拒绝非法字段或检查ID: %j', async body => {
    const response = await SYNC(request('sync', body));
    expect(response.status).toBe(400);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(mocks.sync).not.toHaveBeenCalled();
  });

  it.each(['{', ' '.repeat(1025)])('同步拒绝无Content-Length的非法或超长JSON', async body => {
    const response = await SYNC(new NextRequest('http://localhost:3000/api/admin/product-updates/sync', { method: 'POST', body }));
    expect(response.status).toBe(400);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(mocks.sync).not.toHaveBeenCalled();
  });
});
