import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

let currentSession: { userId: string; email: string; name?: string } | null = null;
let limited = false;
const rateLimitCalls: unknown[][] = [];

vi.mock('@/lib/auth', () => ({
  getSession: async () => currentSession,
}));

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: async (...args: unknown[]) => {
    rateLimitCalls.push(args);
    return { limited, remaining: 0, resetAt: 0 };
  },
  getClientIp: () => '127.0.0.1',
}));

// vi.mock 会被 hoist 到文件顶部，mock factory 内不能引用普通顶层变量。
// 用 vi.hoisted 把 mock 函数提到 hoist 作用域，factory 和测试都能访问。
const mocks = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
  sendAdminAlert: vi.fn(),
}));

// 服务层返回值，由每个测试用例设置
let updateResult: unknown = {
  ok: true,
  status: 'draft',
  wasPublished: false,
  oldSectionId: 'law',
  newSectionId: 'law',
};
let deleteResult: unknown = { ok: true, wasPublished: false };
let withdrawResult: unknown = { ok: true };

vi.mock('@/lib/posts', () => ({
  updatePost: async () => updateResult,
  deletePost: async () => deleteResult,
  withdrawPost: async () => withdrawResult,
}));

vi.mock('next/cache', () => ({
  revalidatePath: mocks.revalidatePath,
}));

vi.mock('@/lib/email', () => ({
  sendAdminAlert: (...args: unknown[]) => mocks.sendAdminAlert(args),
}));

import { PATCH, DELETE } from '../[id]/route';

type Ctx = { params: Promise<{ id: string }> };

function patchReq(id: string, body: unknown): [NextRequest, Ctx] {
  return [
    new Request(`http://localhost/api/posts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }) as unknown as NextRequest,
    { params: Promise.resolve({ id }) },
  ];
}

function deleteReq(id: string): [NextRequest, Ctx] {
  return [
    new Request(`http://localhost/api/posts/${id}`, {
      method: 'DELETE',
    }) as unknown as NextRequest,
    { params: Promise.resolve({ id }) },
  ];
}

describe('PATCH /api/posts/[id]', () => {
  beforeEach(() => {
    currentSession = { userId: 'U1', email: 'a@b.com', name: '作者' };
    limited = false;
    updateResult = {
      ok: true,
      status: 'draft',
      wasPublished: false,
      oldSectionId: 'law',
      newSectionId: 'law',
    };
    deleteResult = { ok: true, wasPublished: false };
    withdrawResult = { ok: true };
    rateLimitCalls.length = 0;
    mocks.revalidatePath.mockClear();
    mocks.sendAdminAlert.mockClear();
  });

  it('未登录 401', async () => {
    currentSession = null;
    const [req, ctx] = patchReq('P1', { title: '编辑标题测试' });
    const res = await PATCH(req, ctx);
    expect(res.status).toBe(401);
  });

  it('限流 429', async () => {
    limited = true;
    const [req, ctx] = patchReq('P1', { title: '编辑标题测试' });
    const res = await PATCH(req, ctx);
    expect(res.status).toBe(429);
  });

  it('限流调用带 fallback: memory', async () => {
    const [req, ctx] = patchReq('P1', { title: '编辑标题测试' });
    await PATCH(req, ctx);
    expect(rateLimitCalls[0][3]).toMatchObject({ fallback: 'memory' });
  });

  it('撤回正常 200，返回 draft', async () => {
    const [req, ctx] = patchReq('P1', { action: 'withdraw' });
    const res = await PATCH(req, ctx);
    expect(res.status).toBe(200);
    expect((await res.json()).status).toBe('draft');
  });

  it('撤回 - 文章不存在 404', async () => {
    withdrawResult = { ok: false, reason: 'notFound' };
    const [req, ctx] = patchReq('P1', { action: 'withdraw' });
    const res = await PATCH(req, ctx);
    expect(res.status).toBe(404);
  });

  it('撤回 - 不是作者 403', async () => {
    withdrawResult = { ok: false, reason: 'notAuthor' };
    const [req, ctx] = patchReq('P1', { action: 'withdraw' });
    const res = await PATCH(req, ctx);
    expect(res.status).toBe(403);
  });

  it('撤回 - 非 pending 409', async () => {
    withdrawResult = { ok: false, reason: 'notPending' };
    const [req, ctx] = patchReq('P1', { action: 'withdraw' });
    const res = await PATCH(req, ctx);
    expect(res.status).toBe(409);
  });

  it('编辑 draft 正常 200，不触发 revalidate', async () => {
    const [req, ctx] = patchReq('P1', { title: '编辑标题测试' });
    const res = await PATCH(req, ctx);
    expect(res.status).toBe(200);
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it('编辑 published 触发 revalidate（下架重审）', async () => {
    updateResult = {
      ok: true,
      status: 'pending',
      wasPublished: true,
      oldSectionId: 'law',
      newSectionId: 'law',
    };
    const [req, ctx] = patchReq('P1', { title: '编辑标题测试' });
    const res = await PATCH(req, ctx);
    expect(res.status).toBe(200);
    expect(mocks.revalidatePath).toHaveBeenCalled();
  });

  it('编辑已成功后即使缓存刷新失败仍返回 200', async () => {
    updateResult = {
      ok: true,
      status: 'pending',
      wasPublished: true,
      oldSectionId: 'law',
      newSectionId: 'law',
    };
    mocks.revalidatePath.mockImplementationOnce(() => {
      throw new Error('cache unavailable');
    });
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    try {
      const [req, ctx] = patchReq('P1', { title: '编辑标题测试' });
      const res = await PATCH(req, ctx);

      expect(res.status).toBe(200);
      expect(errorSpy).toHaveBeenCalledWith(
        'published post cache revalidation failed:',
        expect.any(Error),
      );
    } finally {
      errorSpy.mockRestore();
    }
  });

  it('编辑 pending 被拒 409', async () => {
    updateResult = { ok: false, reason: 'pendingCannotEdit' };
    const [req, ctx] = patchReq('P1', { title: '编辑标题测试' });
    const res = await PATCH(req, ctx);
    expect(res.status).toBe(409);
  });

  it('并发更新未命中时返回明确的 409 重试提示', async () => {
    updateResult = { ok: false, reason: 'concurrentUpdate' };
    const [req, ctx] = patchReq('P1', { title: '编辑标题测试' });
    const res = await PATCH(req, ctx);

    expect(res.status).toBe(409);
    await expect(res.json()).resolves.toEqual({ error: '文章已被其他客户端修改，请刷新后重试' });
  });

  it('编辑 - 不是作者 403', async () => {
    updateResult = { ok: false, reason: 'notAuthor' };
    const [req, ctx] = patchReq('P1', { title: '编辑标题测试' });
    const res = await PATCH(req, ctx);
    expect(res.status).toBe(403);
  });

  it('编辑 - 文章不存在 404', async () => {
    updateResult = { ok: false, reason: 'notFound' };
    const [req, ctx] = patchReq('P1', { title: '编辑标题测试' });
    const res = await PATCH(req, ctx);
    expect(res.status).toBe(404);
  });

  it('提交审核时通知管理员', async () => {
    updateResult = {
      ok: true,
      status: 'pending',
      wasPublished: false,
      oldSectionId: 'law',
      newSectionId: 'law',
    };
    const [req, ctx] = patchReq('P1', { title: '编辑标题测试', submit: true });
    await PATCH(req, ctx);
    expect(mocks.sendAdminAlert).toHaveBeenCalled();
  });

  it('编辑已发布（下架）时不发管理员通知', async () => {
    updateResult = {
      ok: true,
      status: 'pending',
      wasPublished: true,
      oldSectionId: 'law',
      newSectionId: 'law',
    };
    const [req, ctx] = patchReq('P1', { title: '编辑标题测试' });
    await PATCH(req, ctx);
    // published → pending 是下架重审，不算新投稿，不发通知
    // （管理员会在审核队列里看到，不需要额外邮件）
    expect(mocks.sendAdminAlert).not.toHaveBeenCalled();
  });

  it('没有字段且不 submit 时 400', async () => {
    const [req, ctx] = patchReq('P1', {});
    const res = await PATCH(req, ctx);
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/posts/[id]', () => {
  beforeEach(() => {
    currentSession = { userId: 'U1', email: 'a@b.com' };
    limited = false;
    deleteResult = { ok: true, wasPublished: false };
    rateLimitCalls.length = 0;
    mocks.revalidatePath.mockClear();
  });

  it('未登录 401', async () => {
    currentSession = null;
    const [req, ctx] = deleteReq('P1');
    const res = await DELETE(req, ctx);
    expect(res.status).toBe(401);
  });

  it('限流 429', async () => {
    limited = true;
    const [req, ctx] = deleteReq('P1');
    const res = await DELETE(req, ctx);
    expect(res.status).toBe(429);
  });

  it('正常删除 200', async () => {
    const [req, ctx] = deleteReq('P1');
    const res = await DELETE(req, ctx);
    expect(res.status).toBe(200);
  });

  it('删除 published 触发 revalidate', async () => {
    deleteResult = { ok: true, wasPublished: true };
    const [req, ctx] = deleteReq('P1');
    const res = await DELETE(req, ctx);
    expect(res.status).toBe(200);
    expect(mocks.revalidatePath).toHaveBeenCalled();
  });

  it('删除非 published 不触发 revalidate', async () => {
    const [req, ctx] = deleteReq('P1');
    const res = await DELETE(req, ctx);
    expect(res.status).toBe(200);
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it('删除 - 不是作者 403', async () => {
    deleteResult = { ok: false, reason: 'notAuthor' };
    const [req, ctx] = deleteReq('P1');
    const res = await DELETE(req, ctx);
    expect(res.status).toBe(403);
  });

  it('删除 - 文章不存在 404', async () => {
    deleteResult = { ok: false, reason: 'notFound' };
    const [req, ctx] = deleteReq('P1');
    const res = await DELETE(req, ctx);
    expect(res.status).toBe(404);
  });
});
