import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  session: vi.fn(), isAdmin: vi.fn(), rateLimit: vi.fn(), audit: vi.fn(),
  generate: vi.fn(), upsert: vi.fn(), setStatus: vi.fn(), remove: vi.fn(),
  listRows: vi.fn(), listPairs: vi.fn(), validCurated: vi.fn(), findRow: vi.fn(),
}));
vi.mock('@/lib/auth', () => ({ getSession: mocks.session }));
vi.mock('@/lib/admin', () => ({ isAdminSession: mocks.isAdmin }));
vi.mock('@/lib/admin-audit', () => ({ logAdminAction: mocks.audit }));
vi.mock('@/lib/rate-limit', () => ({ getClientIp: () => '127.0.0.1', rateLimit: mocks.rateLimit }));
vi.mock('@/lib/ielts/generator', () => ({ generateIeltsPair: mocks.generate }));
vi.mock('@/lib/ielts/service', () => ({
  upsertIeltsPairRow: mocks.upsert, setIeltsPairStatus: mocks.setStatus, deleteIeltsPairRow: mocks.remove,
}));
vi.mock('@/lib/ielts/catalog', () => ({
  listIeltsPairRows: mocks.listRows, listIeltsPairs: mocks.listPairs,
  validCuratedPairs: mocks.validCurated, findIeltsPairRow: mocks.findRow,
}));

import { GET, POST } from '../route';

/**
 * 雅思对照后台接口的身份与动作边界。
 *
 * 重点在三条容易写坏的线：非管理员/未登录一律 404（不暴露后台存在）、
 * 生成失败与未配密钥要给出可读原因、四个管理动作各自落到对应的服务函数并留审计。
 */

const session = { userId: 'admin-1', email: 'admin@example.com', emailVerified: true };
const seed = {
  slug: 'task2-opinion-university-education',
  task: 'task2',
  category: 'opinion',
  topic: 'education',
  status: 'published',
  sortOrder: 10,
  content: { title: { zh: '大学教育该不该免费', en: 'Should University Education Be Free?' } },
};
const publishedRow = {
  slug: 'task2-discussion-remote-work-abc123',
  task: 'task2',
  category: 'discussion',
  topic: 'work',
  status: 'published',
  sortOrder: 130,
  source: 'generated',
  content: { title: { zh: '远程办公的讨论', en: 'The remote work debate' } },
  publishedAt: '2026-11-14T02:00:00.000Z',
  createdAt: '2026-11-14T02:00:00.000Z',
  updatedAt: '2026-11-14T02:00:00.000Z',
};
const curatedOverrideRow = {
  slug: seed.slug,
  task: seed.task,
  category: seed.category,
  topic: seed.topic,
  status: 'hidden',
  sortOrder: seed.sortOrder,
  source: 'curated',
  content: null,
  publishedAt: null,
  createdAt: '2026-11-14T00:00:00.000Z',
  updatedAt: '2026-11-14T01:00:00.000Z',
};
const generated = {
  slug: 'task2-opinion-urban-life-xyz789',
  content: { title: { zh: '城市生活', en: 'Urban life' } },
  wordCounts: { low: 260, high: 275 },
};

function request(method: 'GET' | 'POST', body?: unknown, headers: Record<string, string> = {}) {
  return new NextRequest('http://localhost:3000/api/admin/ielts', {
    method,
    headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:3000', ...headers },
    ...(body === undefined ? {} : { body: typeof body === 'string' ? body : JSON.stringify(body) }),
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv('DEEPSEEK_API_KEY', 'test-key');
  mocks.session.mockResolvedValue(session);
  mocks.isAdmin.mockReturnValue(true);
  mocks.rateLimit.mockResolvedValue({ limited: false });
  mocks.listRows.mockResolvedValue([publishedRow, curatedOverrideRow]);
  mocks.listPairs.mockResolvedValue([
    { slug: seed.slug, task: seed.task, category: seed.category, topic: seed.topic, sortOrder: seed.sortOrder, source: 'curated', content: seed.content },
    { slug: publishedRow.slug, task: publishedRow.task, category: publishedRow.category, topic: publishedRow.topic, sortOrder: publishedRow.sortOrder, source: 'generated', content: publishedRow.content },
  ]);
  mocks.validCurated.mockReturnValue([seed]);
  mocks.findRow.mockResolvedValue(null);
  mocks.generate.mockResolvedValue(generated);
});

afterEach(() => vi.unstubAllEnvs());

describe('雅思对照后台接口的身份边界', () => {
  it('非管理员 GET/POST 都是不可缓存的 404，且不读写任何数据', async () => {
    mocks.isAdmin.mockReturnValue(false);
    const responses = await Promise.all([
      GET(),
      POST(request('POST', { action: 'delete', slug: seed.slug })),
    ]);
    for (const response of responses) {
      expect(response.status).toBe(404);
      expect(response.headers.get('Cache-Control')).toBe('no-store');
      expect((await response.json()).error).toBe('Not found');
    }
    expect(mocks.listRows).not.toHaveBeenCalled();
    expect(mocks.remove).not.toHaveBeenCalled();
    expect(mocks.audit).not.toHaveBeenCalled();
  });

  it('未登录同样 404（与 daily 路由口径一致，不暴露后台存在）', async () => {
    mocks.session.mockResolvedValue(null);
    expect((await GET()).status).toBe(404);
    expect((await POST(request('POST', { action: 'publish', slug: seed.slug }))).status).toBe(404);
    expect(mocks.setStatus).not.toHaveBeenCalled();
  });

  it('跨站 Origin 返回 403，不执行动作', async () => {
    const response = await POST(request('POST', { action: 'delete', slug: seed.slug }, { Origin: 'https://attacker.example' }));
    expect(response.status).toBe(403);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(mocks.remove).not.toHaveBeenCalled();
    expect(mocks.audit).not.toHaveBeenCalled();
  });
});

describe('雅思对照后台接口的读取', () => {
  it('返回数据库行与公开列表，并标出文件精选与正文来源', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    const body = await response.json();
    expect(body.rows).toEqual([
      expect.objectContaining({ slug: publishedRow.slug, status: 'published', source: 'generated', inCurated: false, title: publishedRow.content.title }),
      expect.objectContaining({ slug: seed.slug, status: 'hidden', inCurated: true, title: seed.content.title }),
    ]);
    expect(body.pairs).toEqual([
      expect.objectContaining({ slug: seed.slug, source: 'curated', fromDatabase: false }),
      expect.objectContaining({ slug: publishedRow.slug, source: 'generated', fromDatabase: true }),
    ]);
  });

  it('读取失败返回不缓存的 500，不暴露内部错误内容', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      mocks.listRows.mockRejectedValue(new Error('private database details'));
      const response = await GET();
      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({ error: 'load_failed', errorCode: 'load_failed' });
    } finally {
      log.mockRestore();
    }
  });
});

describe('雅思对照的生成', () => {
  it('生成成功写入草稿，排序排在数据库行与文件精选之后', async () => {
    const response = await POST(request('POST', { action: 'generate', task: 'task2', topic: 'urban', category: 'opinion' }));
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    const body = await response.json();
    expect(body.wordCounts).toEqual(generated.wordCounts);
    expect(body.row).toEqual(expect.objectContaining({
      slug: generated.slug, task: 'task2', topic: 'urban', category: 'opinion',
      status: 'draft', source: 'generated', sortOrder: 140, inCurated: false,
    }));
    expect(mocks.upsert).toHaveBeenCalledWith(expect.objectContaining({
      slug: generated.slug, task: 'task2', topic: 'urban', category: 'opinion',
      status: 'draft', source: 'generated', sortOrder: 140, content: generated.content,
    }));
    expect(mocks.audit).toHaveBeenCalledWith(session, expect.objectContaining({
      action: 'ielts.generate',
      targetId: generated.slug,
      detail: expect.objectContaining({ slug: generated.slug, status: 'draft', sortOrder: 140 }),
    }));
  });

  it('文件精选也参与排序最大值，避免新草稿插到精选组中间', async () => {
    mocks.listRows.mockResolvedValue([]);
    mocks.validCurated.mockReturnValue([{ ...seed, sortOrder: 150 }]);
    const response = await POST(request('POST', { action: 'generate', task: 'task2', topic: 'urban', category: 'opinion' }));
    expect(response.status).toBe(200);
    expect(mocks.upsert).toHaveBeenCalledWith(expect.objectContaining({ sortOrder: 160 }));
  });

  it('生成器抛错返回 502 与中文原因，不写库也不审计', async () => {
    mocks.generate.mockRejectedValue(new Error('雅思对照生成失败：DeepSeek 返回 429'));
    const response = await POST(request('POST', { action: 'generate', task: 'task2', topic: 'urban', category: 'opinion' }));
    expect(response.status).toBe(502);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    const body = await response.json();
    expect(body.errorCode).toBe('generate_failed');
    expect(body.error).toContain('雅思对照生成失败');
    expect(mocks.upsert).not.toHaveBeenCalled();
    expect(mocks.audit).not.toHaveBeenCalled();
  });

  it('未配置生成密钥时返回 503 与可读消息，不调用生成器', async () => {
    vi.stubEnv('DEEPSEEK_API_KEY', '');
    const response = await POST(request('POST', { action: 'generate', task: 'task2', topic: 'urban', category: 'opinion' }));
    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body.errorCode).toBe('generate_unconfigured');
    expect(body.error).toContain('未配置生成密钥');
    expect(mocks.generate).not.toHaveBeenCalled();
    expect(mocks.audit).not.toHaveBeenCalled();
  });
});

describe('雅思对照的管理动作', () => {
  it('发布、下架、恢复、删除分别落到对应服务函数并留审计', async () => {
    const publishResponse = await POST(request('POST', { action: 'publish', slug: seed.slug }));
    expect(publishResponse.status).toBe(200);
    expect(mocks.setStatus).toHaveBeenCalledWith(seed.slug, 'published');
    expect(mocks.audit).toHaveBeenCalledWith(session, expect.objectContaining({
      action: 'ielts.publish', targetId: seed.slug, detail: expect.objectContaining({ slug: seed.slug, status: 'published' }),
    }));

    mocks.findRow.mockResolvedValue(curatedOverrideRow);
    const hideResponse = await POST(request('POST', { action: 'hide', slug: seed.slug }));
    expect(hideResponse.status).toBe(200);
    expect((await hideResponse.json()).fileOverride).toBe(false);
    expect(mocks.setStatus).toHaveBeenCalledWith(seed.slug, 'hidden');
    expect(mocks.upsert).not.toHaveBeenCalled();
    expect(mocks.audit).toHaveBeenCalledWith(session, expect.objectContaining({ action: 'ielts.hide', targetId: seed.slug }));

    const restoreResponse = await POST(request('POST', { action: 'restore', slug: seed.slug }));
    expect(restoreResponse.status).toBe(200);
    expect((await restoreResponse.json()).inCurated).toBe(true);
    expect(mocks.remove).toHaveBeenCalledWith(seed.slug);
    expect(mocks.audit).toHaveBeenCalledWith(session, expect.objectContaining({ action: 'ielts.restore', targetId: seed.slug }));

    const deleteResponse = await POST(request('POST', { action: 'delete', slug: publishedRow.slug }));
    expect(deleteResponse.status).toBe(200);
    expect((await deleteResponse.json()).inCurated).toBe(false);
    expect(mocks.remove).toHaveBeenCalledWith(publishedRow.slug);
    expect(mocks.audit).toHaveBeenCalledWith(session, expect.objectContaining({ action: 'ielts.delete', targetId: publishedRow.slug }));
  });

  it('下架文件里还没有数据库行的精选组时，新建一行只覆盖状态的隐藏行', async () => {
    mocks.findRow.mockResolvedValue(null);
    const response = await POST(request('POST', { action: 'hide', slug: seed.slug }));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ success: true, slug: seed.slug, status: 'hidden', fileOverride: true });
    expect(mocks.setStatus).not.toHaveBeenCalled();
    expect(mocks.upsert).toHaveBeenCalledWith({
      slug: seed.slug, task: seed.task, category: seed.category, topic: seed.topic,
      status: 'hidden', sortOrder: seed.sortOrder, content: null, source: 'curated',
    });
    expect(mocks.audit).toHaveBeenCalledWith(session, expect.objectContaining({
      action: 'ielts.hide', detail: expect.objectContaining({ fileOverride: true }),
    }));
  });

  it('下架既不在数据库也不是精选的 slug 返回 404，不写任何记录', async () => {
    mocks.findRow.mockResolvedValue(null);
    const response = await POST(request('POST', { action: 'hide', slug: 'task2-ghost-abc123' }));
    expect(response.status).toBe(404);
    expect(mocks.upsert).not.toHaveBeenCalled();
    expect(mocks.audit).not.toHaveBeenCalled();
  });
});

describe('雅思对照后台接口的校验与限流', () => {
  it('非法请求体返回 400 且不落库', async () => {
    const bodies = [
      { action: 'archive', slug: seed.slug },
      { action: 'publish' },
      { action: 'publish', slug: 'Bad Slug!' },
      { action: 'publish', slug: seed.slug, extra: true },
      { action: 'generate', task: 'task3', topic: 'urban', category: 'opinion' },
      { action: 'generate', task: 'task2', topic: '', category: 'opinion' },
    ];
    for (const body of bodies) {
      const response = await POST(request('POST', body));
      expect(response.status).toBe(400);
      expect(response.headers.get('Cache-Control')).toBe('no-store');
    }
    expect((await POST(request('POST', '{'))).status).toBe(400);
    expect(mocks.setStatus).not.toHaveBeenCalled();
    expect(mocks.upsert).not.toHaveBeenCalled();
    expect(mocks.generate).not.toHaveBeenCalled();
    expect(mocks.audit).not.toHaveBeenCalled();
  });

  it('超过 4KB 的请求体返回 413，不读服务层', async () => {
    const declared = await POST(request('POST', { action: 'publish', slug: seed.slug }, { 'Content-Length': String(4 * 1024 + 1) }));
    expect(declared.status).toBe(413);
    const streamed = await POST(request('POST', { action: 'publish', slug: seed.slug, note: 'x'.repeat(5 * 1024) }));
    expect(streamed.status).toBe(413);
    expect(mocks.setStatus).not.toHaveBeenCalled();
  });

  it('限流命中时生成与管理动作都不执行', async () => {
    mocks.rateLimit.mockResolvedValue({ limited: true });
    const responses = await Promise.all([
      POST(request('POST', { action: 'generate', task: 'task2', topic: 'urban', category: 'opinion' })),
      POST(request('POST', { action: 'publish', slug: seed.slug })),
    ]);
    expect(responses.map(response => response.status)).toEqual([429, 429]);
    expect(mocks.generate).not.toHaveBeenCalled();
    expect(mocks.setStatus).not.toHaveBeenCalled();
  });

  it('生成按 5 次/分钟收紧，管理动作按 30 次/分钟，键带管理员与 IP', async () => {
    await POST(request('POST', { action: 'generate', task: 'task2', topic: 'urban', category: 'opinion' }));
    await POST(request('POST', { action: 'publish', slug: seed.slug }));
    expect(mocks.rateLimit.mock.calls.map(call => call[0])).toEqual([
      'admin-ielts:generate:admin-1:127.0.0.1',
      'admin-ielts:manage:admin-1:127.0.0.1',
    ]);
    expect(mocks.rateLimit.mock.calls.map(call => call[1])).toEqual([5, 30]);
  });
});
