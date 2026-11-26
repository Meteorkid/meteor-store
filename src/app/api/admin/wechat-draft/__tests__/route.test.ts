import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  session: vi.fn(),
  isAdmin: vi.fn(),
  csrf: vi.fn(),
  rateLimit: vi.fn(),
  audit: vi.fn(),
  createDraft: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({ getSession: mocks.session }));
vi.mock('@/lib/admin', () => ({ isAdminSession: mocks.isAdmin }));
vi.mock('@/lib/csrf', () => ({ assertMatchingOrigin: mocks.csrf }));
vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '127.0.0.1',
  rateLimit: mocks.rateLimit,
}));
vi.mock('@/lib/admin-audit', () => ({ logAdminAction: mocks.audit }));
vi.mock('@/lib/wechat-mp/draft', () => ({ createWechatDraft: mocks.createDraft }));

import { POST } from '../route';
import { WechatMpConfigError, WechatMpError } from '@/lib/wechat-mp/client';

const session = { userId: 'admin-1', email: 'admin@example.com', emailVerified: true };
const body = { source: { kind: 'markdown', markdown: '# 标题\n\n正文' }, dryRun: true };

function request(payload: unknown = body, headers?: HeadersInit): NextRequest {
  return new NextRequest('http://localhost:3000/api/admin/wechat-draft', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:3000', ...headers },
    body: JSON.stringify(payload),
  });
}

const previewResult = {
  mode: 'preview',
  title: '标题',
  imageSources: [],
  warnings: [],
  nextStep: '预览',
  backendUrl: 'https://mp.weixin.qq.com/',
};

describe('POST /api/admin/wechat-draft', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.session.mockResolvedValue(session);
    mocks.isAdmin.mockReturnValue(true);
    mocks.csrf.mockReturnValue(null);
    mocks.rateLimit.mockResolvedValue({ limited: false });
    mocks.audit.mockResolvedValue(undefined);
    mocks.createDraft.mockResolvedValue(previewResult);
  });

  it('非管理员返回不可缓存的 404，且不触碰草稿逻辑', async () => {
    mocks.isAdmin.mockReturnValue(false);
    const response = await POST(request());
    expect(response.status).toBe(404);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect((await response.json()).error).toBe('Not found');
    expect(mocks.createDraft).not.toHaveBeenCalled();
  });

  it('跨站 Origin 返回 403', async () => {
    mocks.csrf.mockReturnValue(NextResponse.json({ error: 'Forbidden' }, { status: 403 }));
    expect((await POST(request())).status).toBe(403);
    expect(mocks.createDraft).not.toHaveBeenCalled();
  });

  it('触发限流返回 429', async () => {
    mocks.rateLimit.mockResolvedValue({ limited: true });
    expect((await POST(request())).status).toBe(429);
  });

  it('非法参数返回 400', async () => {
    const response = await POST(request({ source: { kind: 'unknown' }, dryRun: true }));
    expect(response.status).toBe(400);
    expect(mocks.createDraft).not.toHaveBeenCalled();
  });

  it('预览请求透传 dryRun，并写审计日志', async () => {
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect((await response.json()).result.mode).toBe('preview');
    expect(mocks.createDraft).toHaveBeenCalledWith(expect.objectContaining({ dryRun: true, publish: false }));
    expect(mocks.audit).toHaveBeenCalledWith(session, expect.objectContaining({ action: 'wechat-draft.preview' }));
  });

  it('创建草稿返回 201 与 media_id', async () => {
    mocks.createDraft.mockResolvedValue({ ...previewResult, mode: 'created', mediaId: 'MEDIA_ID' });
    const response = await POST(request({ ...body, dryRun: false }));
    expect(response.status).toBe(201);
    expect((await response.json()).result.mediaId).toBe('MEDIA_ID');
    expect(mocks.audit).toHaveBeenCalledWith(session, expect.objectContaining({ action: 'wechat-draft.create' }));
  });

  it('日刊草稿写入日更工作台可识别的 sourceKey', async () => {
    mocks.createDraft.mockResolvedValue({ ...previewResult, mode: 'created', mediaId: 'MEDIA_ID' });
    const response = await POST(request({
      source: { kind: 'daily', date: '2026-11-26' },
      dryRun: false,
    }));
    expect(response.status).toBe(201);
    expect(mocks.audit).toHaveBeenCalledWith(session, expect.objectContaining({
      action: 'wechat-draft.create',
      detail: expect.objectContaining({
        source: 'daily',
        sourceKey: 'daily:2026-11-26',
      }),
    }));
  });

  it('业务错误带出微信错误码，配置缺失返回 503', async () => {
    mocks.createDraft.mockRejectedValue(new WechatMpError('未授权', 48001, '权限被回收'));
    const unauthorized = await POST(request());
    expect(unauthorized.status).toBe(400);
    expect(await unauthorized.json()).toMatchObject({ errorCode: '48001' });

    mocks.createDraft.mockRejectedValue(new WechatMpConfigError('未配置'));
    expect((await POST(request())).status).toBe(503);
  });
});
