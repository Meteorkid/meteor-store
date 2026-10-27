import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  rateLimit: vi.fn(), session: vi.fn(), admin: vi.fn(),
  recipientLookup: vi.fn(), audit: vi.fn(),
  startSoftwareTrial: vi.fn(), activateSoftwareLicense: vi.fn(), refreshSoftwareLicense: vi.fn(), deactivateSoftwareLicense: vi.fn(),
  listSoftwareDevicesByEmail: vi.fn(), listSoftwareLicensesByEmail: vi.fn(), revokeSoftwareDevice: vi.fn(), grantSoftwareLicenses: vi.fn(),
}));
vi.mock('@/lib/rate-limit', () => ({ rateLimit: mocks.rateLimit, getClientIp: () => '127.0.0.1' }));
vi.mock('@/lib/auth', () => ({ getSession: mocks.session }));
vi.mock('@/lib/admin', () => ({ isAdminSession: mocks.admin }));
vi.mock('@/lib/admin-audit', () => ({ logAdminAction: mocks.audit }));
vi.mock('@/lib/db', () => ({
  db: { select: () => ({ from: () => ({ where: () => ({ limit: () => mocks.recipientLookup() }) }) }) },
}));
vi.mock('../service', () => mocks);

import { POST as trial } from '@/app/api/software-licenses/trial/route';
import { POST as activate } from '@/app/api/software-licenses/activate/route';
import { POST as refresh } from '@/app/api/software-licenses/refresh/route';
import { POST as deactivate } from '@/app/api/software-licenses/deactivate/route';
import { GET as userGet, PATCH as userPatch } from '@/app/api/software-licenses/route';
import { GET as adminGet, POST as adminPost, PATCH as adminPatch } from '@/app/api/admin/software-licenses/route';

const device = { productId: 'xnook', deviceId: 'a'.repeat(64), deviceName: 'test' };
const token = { ...device, deviceToken: 'b'.repeat(43) };
const handlers = [
  { name: 'trial', method: 'POST', handler: trial, body: device },
  { name: 'activate', method: 'POST', handler: activate, body: { ...device, code: 'MS-AAAA-BBBB-CCCC-DDDD' } },
  { name: 'refresh', method: 'POST', handler: refresh, body: token },
  { name: 'deactivate', method: 'POST', handler: deactivate, body: token },
  { name: 'user-unbind', method: 'PATCH', handler: userPatch, body: { id: '039b3bbc-ec09-4446-bf14-fc8db87f9f21', action: 'revoke-device' } },
  { name: 'admin-gift', method: 'POST', handler: adminPost, body: { email: 'buyer@example.com', productIds: ['xnook'], kind: 'annual', requestId: '039b3bbc-ec09-4446-bf14-fc8db87f9f21' } },
  { name: 'admin-unbind', method: 'PATCH', handler: adminPatch, body: { email: 'buyer@example.com', id: '039b3bbc-ec09-4446-bf14-fc8db87f9f21', action: 'revoke-device' } },
];
const serviceMocks = [mocks.startSoftwareTrial, mocks.activateSoftwareLicense, mocks.refreshSoftwareLicense, mocks.deactivateSoftwareLicense,
  mocks.listSoftwareDevicesByEmail, mocks.listSoftwareLicensesByEmail, mocks.revokeSoftwareDevice, mocks.grantSoftwareLicenses];
const request = (method: string, body: unknown, headers: Record<string, string> = {}) => new NextRequest('https://www.imagentx.top/api/software-licenses', {
  method, body: typeof body === 'string' ? body : JSON.stringify(body),
  headers: { 'content-type': 'application/json', 'X-Software-License-User': 'user-1', ...headers },
});

beforeEach(() => {
  vi.clearAllMocks();
  mocks.rateLimit.mockResolvedValue({ limited: false });
  mocks.session.mockResolvedValue({ userId: 'user-1', email: 'buyer@example.com', emailVerified: true });
  mocks.admin.mockReturnValue(true);
  mocks.startSoftwareTrial.mockResolvedValue({ lease: 'lease', deviceToken: 'token' });
  mocks.listSoftwareDevicesByEmail.mockResolvedValue([]);
  mocks.listSoftwareLicensesByEmail.mockResolvedValue([]);
  mocks.grantSoftwareLicenses.mockResolvedValue([]);
  mocks.recipientLookup.mockResolvedValue([]);
  mocks.audit.mockResolvedValue(undefined);
});

describe('从用户列表赠送激活码', () => {
  const input = { email: 'receiver@example.com', recipientUserId: 'legacy-user-7', productIds: ['xnook'], kind: 'annual', requestId: '039b3bbc-ec09-4446-bf14-fc8db87f9f21' };

  it('目标用户已删除时返回404，不发码', async () => {
    const response = await adminPost(request('POST', input));
    expect(response.status).toBe(404);
    expect(mocks.recipientLookup).toHaveBeenCalledOnce();
    expect(mocks.grantSoftwareLicenses).not.toHaveBeenCalled();
    expect(mocks.audit).not.toHaveBeenCalled();
  });

  it('目标邮箱已变化时返回409，不向旧邮箱发码', async () => {
    mocks.recipientLookup.mockResolvedValue([{ id: input.recipientUserId, email: 'changed@example.com' }]);
    const response = await adminPost(request('POST', input));
    expect(response.status).toBe(409);
    expect(mocks.grantSoftwareLicenses).not.toHaveBeenCalled();
    expect(mocks.audit).not.toHaveBeenCalled();
  });

  it('目标邮箱一致且未验证时可赠送，审计记录目标用户ID', async () => {
    mocks.recipientLookup.mockResolvedValue([{ id: input.recipientUserId, email: ' Receiver@Example.com ', emailVerified: false }]);
    const response = await adminPost(request('POST', input));
    expect(response.status).toBe(201);
    expect(mocks.grantSoftwareLicenses).toHaveBeenCalledWith(expect.objectContaining({ email: input.email, productIds: ['xnook'], kind: 'annual' }));
    expect(mocks.audit).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ detail: expect.objectContaining({ recipientUserId: input.recipientUserId }) }));
    expect(response.headers.get('cache-control')).toBe('no-store');
  });

  it('未传recipientUserId保留原商业后台赠码行为，不查询用户表', async () => {
    const original = { ...input, recipientUserId: undefined };
    const response = await adminPost(request('POST', original));
    expect(response.status).toBe(201);
    expect(mocks.recipientLookup).not.toHaveBeenCalled();
    expect(mocks.grantSoftwareLicenses).toHaveBeenCalledOnce();
  });

  it('未通过管理员鉴权或会话归属校验时不查询目标用户', async () => {
    mocks.admin.mockReturnValue(false);
    expect((await adminPost(request('POST', input))).status).toBe(404);
    mocks.admin.mockReturnValue(true);
    expect((await adminPost(request('POST', input, { 'X-Software-License-User': 'old-user' }))).status).toBe(409);
    expect(mocks.recipientLookup).not.toHaveBeenCalled();
    expect(mocks.grantSoftwareLicenses).not.toHaveBeenCalled();
  });

  it.each(['', 'u'.repeat(101)])('拒绝长度无效的目标用户ID', async (recipientUserId) => {
    expect((await adminPost(request('POST', { ...input, recipientUserId }))).status).toBe(400);
    expect(mocks.grantSoftwareLicenses).not.toHaveBeenCalled();
  });
});

describe('所有软件授权写入口执行真实公共 guard', () => {
  it.each(handlers)('$name 限流后返回 429，不能进入业务服务', async ({ method, handler, body }) => {
    mocks.rateLimit.mockResolvedValue({ limited: true });
    const response = await handler(request(method, body));
    expect(response.status).toBe(429);
    expect(response.headers.get('cache-control')).toBe('no-store');
    for (const service of serviceMocks) expect(service).not.toHaveBeenCalled();
  });
  it.each(handlers)('$name 拒绝跨站 Origin', async ({ method, handler, body }) => {
    const response = await handler(request(method, body, { origin: 'https://evil.example.com' }));
    expect(response.status).toBe(403);
    for (const service of serviceMocks) expect(service).not.toHaveBeenCalled();
  });
  it.each(handlers)('$name Content-Length 超限返回 413', async ({ method, handler, body }) => {
    const response = await handler(request(method, body, { 'content-length': '4097' }));
    expect(response.status).toBe(413);
    for (const service of serviceMocks) expect(service).not.toHaveBeenCalled();
  });
  it('没有 Content-Length 也不会读入超过 4 KiB 的请求体', async () => {
    const response = await trial(request('POST', JSON.stringify({ ...device, padding: 'x'.repeat(5000) })));
    expect(response.status).toBe(413);
    expect(mocks.startSoftwareTrial).not.toHaveBeenCalled();
  });
  it('未知产品或非法设备标识被拒绝', async () => {
    expect((await trial(request('POST', { ...device, productId: 'other' }))).status).toBe(400);
    expect((await trial(request('POST', { ...device, deviceId: 'raw-hardware-id' }))).status).toBe(400);
    expect(mocks.startSoftwareTrial).not.toHaveBeenCalled();
  });
  it('原生客户端无 Origin 可正常调用，额外输入不进入业务对象', async () => {
    const response = await trial(request('POST', { ...device, admin: true }));
    expect(response.status).toBe(200);
    expect(mocks.startSoftwareTrial).toHaveBeenCalledWith(device);
  });
});

describe('账号及管理员边界', () => {
  it('未验证邮箱不可查询激活码', async () => {
    mocks.session.mockResolvedValue({ userId: 'user-1', email: 'buyer@example.com', emailVerified: false });
    expect((await userGet()).status).toBe(401);
    expect(mocks.listSoftwareLicensesByEmail).not.toHaveBeenCalled();
  });
  it('非管理员查询后台返回404', async () => {
    mocks.admin.mockReturnValue(false);
    expect((await adminGet(new NextRequest('https://www.imagentx.top/api/admin/software-licenses?email=buyer@example.com'))).status).toBe(404);
  });
  it.each(handlers.filter(({ name }) => name.startsWith('admin') || name === 'user-unbind'))('$name 换号后旧页面操作返回409', async ({ handler, method, body }) => {
    expect((await handler(request(method, body, { 'X-Software-License-User': 'old-user' }))).status).toBe(409);
    for (const service of serviceMocks) expect(service).not.toHaveBeenCalled();
  });
  it('私有列表返回会话 owner 且禁止缓存', async () => {
    const response = await userGet();
    expect(await response.json()).toEqual({ userId: 'user-1', licenses: [], devices: [] });
    expect(response.headers.get('cache-control')).toBe('no-store');
  });
});
