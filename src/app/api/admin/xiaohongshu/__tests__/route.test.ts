import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  session: vi.fn(),
  isAdmin: vi.fn(),
  csrf: vi.fn(),
  rateLimit: vi.fn(),
  audit: vi.fn(),
  compose: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  list: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({ getSession: mocks.session }));
vi.mock('@/lib/admin', () => ({ isAdminSession: mocks.isAdmin }));
vi.mock('@/lib/csrf', () => ({ assertMatchingOrigin: mocks.csrf }));
vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '127.0.0.1',
  rateLimit: mocks.rateLimit,
}));
vi.mock('@/lib/admin-audit', () => ({ logAdminAction: mocks.audit }));
vi.mock('@/lib/xiaohongshu/compose', () => ({
  composeXiaohongshuNote: mocks.compose,
  XiaohongshuSourceError: class XiaohongshuSourceError extends Error {
    constructor(public code: string, message: string) { super(message); }
  },
}));
vi.mock('@/lib/xiaohongshu/service', () => ({
  createXiaohongshuNote: mocks.create,
  updateXiaohongshuNote: mocks.update,
  deleteXiaohongshuNote: mocks.remove,
  listXiaohongshuNotes: mocks.list,
}));

import { GET, POST } from '../route';

const session = { userId: 'admin-1', email: 'admin@example.com', emailVerified: true };

const draft = {
  title: '每日一新｜2026-11-26',
  body: '今天整理了 2 个栏目。',
  tags: ['每日一新', 'AI'],
  images: [],
  sourceKind: 'daily' as const,
  sourceRef: '2026-11-26',
  sourceUrl: 'https://imagentx.top/daily?view=all',
  status: 'draft' as const,
};

const note = {
  id: 'note-1',
  title: '测试标题',
  body: '正文',
  tags: [],
  images: ['https://img.example/x.png'],
  sourceKind: 'manual' as const,
  sourceRef: null,
  sourceUrl: null,
  status: 'draft' as const,
  publishedAt: null,
  publishedUrl: null,
  createdAt: '2026-11-26T00:00:00.000Z',
  updatedAt: '2026-11-26T00:00:01.000Z',
};

const noteInput = {
  title: note.title,
  body: note.body,
  tags: note.tags,
  images: note.images,
  sourceKind: note.sourceKind,
  sourceRef: note.sourceRef,
  sourceUrl: note.sourceUrl,
  status: note.status,
  publishedUrl: null,
};

function request(payload: unknown): NextRequest {
  return new NextRequest('http://localhost:3000/api/admin/xiaohongshu', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:3000' },
    body: JSON.stringify(payload),
  });
}

describe('POST /api/admin/xiaohongshu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.session.mockResolvedValue(session);
    mocks.isAdmin.mockReturnValue(true);
    mocks.csrf.mockReturnValue(null);
    mocks.rateLimit.mockResolvedValue({ limited: false });
    mocks.audit.mockResolvedValue(undefined);
    mocks.compose.mockResolvedValue(draft);
    mocks.create.mockResolvedValue(note);
    mocks.update.mockResolvedValue(note);
    mocks.remove.mockResolvedValue(true);
    mocks.list.mockResolvedValue([note]);
  });

  it('非管理员返回不可缓存的 404，且不读写内容', async () => {
    mocks.isAdmin.mockReturnValue(false);
    const response = await POST(request({ action: 'generate', source: { kind: 'daily', date: '2026-11-26' } }));
    expect(response.status).toBe(404);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(mocks.compose).not.toHaveBeenCalled();
  });

  it('跨站 Origin 被拒绝', async () => {
    mocks.csrf.mockReturnValue(NextResponse.json({ error: 'Forbidden' }, { status: 403 }));
    expect((await POST(request({ action: 'generate', source: { kind: 'daily', date: '2026-11-26' } }))).status).toBe(403);
    expect(mocks.compose).not.toHaveBeenCalled();
  });

  it('日刊生成返回草稿并写审计日志', async () => {
    const response = await POST(request({ action: 'generate', source: { kind: 'daily', date: '2026-11-26' } }));
    expect(response.status).toBe(200);
    expect((await response.json()).draft.title).toBe(draft.title);
    expect(mocks.compose).toHaveBeenCalledWith({ kind: 'daily', date: '2026-11-26' });
    expect(mocks.audit).toHaveBeenCalledWith(session, expect.objectContaining({
      action: 'xiaohongshu.generate',
      detail: expect.objectContaining({ sourceRef: '2026-11-26' }),
    }));
  });

  it('正文超过 1000 字在参数层直接拒绝', async () => {
    const response = await POST(request({
      action: 'save',
      note: {
        ...noteInput,
        body: '二'.repeat(1001),
      },
    }));
    expect(response.status).toBe(400);
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it('待发状态没有图片被阻断', async () => {
    const response = await POST(request({
      action: 'save',
      note: {
        ...noteInput,
        images: [],
        status: 'ready',
      },
    }));
    expect(response.status).toBe(400);
    expect((await response.json()).errorCode).toBe('invalid_note');
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it('新建草稿返回 201，并归一化标签', async () => {
    const response = await POST(request({
      action: 'save',
      note: { ...noteInput, tags: ['#AI工具', 'AI工具', '独立开发'] },
    }));
    expect(response.status).toBe(201);
    expect(mocks.create).toHaveBeenCalledWith(expect.objectContaining({
      tags: ['AI工具', '独立开发'],
    }));
    expect(mocks.audit).toHaveBeenCalledWith(session, expect.objectContaining({ action: 'xiaohongshu.save' }));
  });

  it('更新已有笔记必须带版本时间', async () => {
    const response = await POST(request({
      action: 'save',
      id: 'note-1',
      note: noteInput,
    }));
    expect(response.status).toBe(400);
    expect(mocks.update).not.toHaveBeenCalled();
  });

  it('更新遇到版本冲突返回 409', async () => {
    mocks.update.mockResolvedValue(null);
    const response = await POST(request({
      action: 'save',
      id: 'note-1',
      expectedUpdatedAt: '2026-11-26T00:00:01.000Z',
      note: noteInput,
    }));
    expect(response.status).toBe(409);
  });

  it('已发布时记录 https 笔记链接', async () => {
    const response = await POST(request({
      action: 'save',
      note: {
        ...noteInput,
        status: 'published',
        publishedUrl: 'https://www.xiaohongshu.com/explore/abc123',
      },
    }));
    expect(response.status).toBe(201);
    expect(mocks.create).toHaveBeenCalledWith(expect.objectContaining({
      status: 'published',
      publishedUrl: 'https://www.xiaohongshu.com/explore/abc123',
    }));
  });

  it('非 https 发布链接被拒绝', async () => {
    const response = await POST(request({
      action: 'save',
      note: {
        ...noteInput,
        status: 'published',
        publishedUrl: 'javascript:alert(1)',
      },
    }));
    expect(response.status).toBe(400);
    expect((await response.json()).errorCode).toBe('invalid_published_url');
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it('草稿状态不会写入发布链接', async () => {
    const response = await POST(request({
      action: 'save',
      note: {
        ...noteInput,
        status: 'draft',
        publishedUrl: 'https://www.xiaohongshu.com/explore/abc123',
      },
    }));
    expect(response.status).toBe(201);
    expect(mocks.create).toHaveBeenCalledWith(expect.objectContaining({
      status: 'draft',
      publishedUrl: null,
    }));
  });

  it('删除使用版本时间做条件删除', async () => {
    const response = await POST(request({
      action: 'delete',
      id: 'note-1',
      expectedUpdatedAt: '2026-11-26T00:00:01.000Z',
    }));
    expect(response.status).toBe(200);
    expect(mocks.remove).toHaveBeenCalledWith('note-1', '2026-11-26T00:00:01.000Z');
  });

  it('数据库表缺失返回可读的 503', async () => {
    const error = Object.assign(new Error('relation does not exist'), { code: '42P01' });
    mocks.compose.mockRejectedValue(error);
    const response = await POST(request({ action: 'generate', source: { kind: 'daily', date: '2026-11-26' } }));
    expect(response.status).toBe(503);
    expect((await response.json()).errorCode).toBe('schema_missing');
  });

  it('GET 返回最近笔记列表', async () => {
    expect((await GET()).status).toBe(200);
    expect((await (await GET()).json()).notes).toHaveLength(1);
  });
});
