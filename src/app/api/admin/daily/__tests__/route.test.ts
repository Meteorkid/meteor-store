import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { dailyDate } from '@/lib/daily/types';

const mocks = vi.hoisted(() => ({
  session: vi.fn(), isAdmin: vi.fn(), rateLimit: vi.fn(), audit: vi.fn(),
  list: vi.fn(), generate: vi.fn(), save: vi.fn(), retire: vi.fn(),
}));
vi.mock('@/lib/auth', () => ({ getSession: mocks.session }));
vi.mock('@/lib/admin', () => ({ isAdminSession: mocks.isAdmin }));
vi.mock('@/lib/admin-audit', () => ({ logAdminAction: mocks.audit }));
vi.mock('@/lib/rate-limit', () => ({ getClientIp: () => '127.0.0.1', rateLimit: mocks.rateLimit }));
vi.mock('@/lib/daily/service', () => ({
  listDailyEditions: mocks.list, generateDailyEditions: mocks.generate,
  saveDailyEdition: mocks.save, retireDailyEdition: mocks.retire,
}));

import { GET, PATCH, POST } from '../route';

const date = dailyDate();
const updatedAt = '2026-10-14T00:00:00.000Z';
const session = { userId: 'admin-1', email: 'admin@example.com', emailVerified: true };
const item = {
  id: 'official-event', title: 'Launch', summary: 'Confirmed launch information',
  url: 'https://example.com/event', sourceName: 'Example', sourceType: 'official', phase: 'upcoming',
};
const saveBody = {
  action: 'save', id: `${date}:events`, date, channel: 'events', title: 'Events', summary: 'Upcoming events',
  content: { kind: 'events', items: [item] }, status: 'published', expectedUpdatedAt: updatedAt,
};
const edition = {
  ...saveBody, status: 'published', sourceKey: null, publishedAt: updatedAt, updatedAt,
};

function request(method: 'GET' | 'POST' | 'PATCH', body?: unknown, headers?: HeadersInit, query = '') {
  return new NextRequest(`http://localhost:3000/api/admin/daily${query}`, {
    method,
    headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:3000', ...headers },
    ...(body === undefined ? {} : { body: typeof body === 'string' ? body : JSON.stringify(body) }),
  });
}

describe('每日一新后台接口', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.session.mockResolvedValue(session);
    mocks.isAdmin.mockReturnValue(true);
    mocks.rateLimit.mockResolvedValue({ limited: false });
    mocks.list.mockResolvedValue([edition]);
    mocks.generate.mockResolvedValue([edition]);
    mocks.save.mockResolvedValue(edition);
    mocks.retire.mockResolvedValue(true);
  });

  it('所有 handler 对非管理员返回不可缓存的 404，不读写日刊', async () => {
    mocks.isAdmin.mockReturnValue(false);
    const responses = await Promise.all([
      GET(request('GET')), POST(request('POST', { action: 'generate', date })), PATCH(request('PATCH', saveBody)),
    ]);
    for (const response of responses) {
      expect(response.status).toBe(404);
      expect(response.headers.get('Cache-Control')).toBe('no-store');
      expect((await response.json()).error).toBe('Not found');
    }
    expect(mocks.list).not.toHaveBeenCalled();
    expect(mocks.generate).not.toHaveBeenCalled();
    expect(mocks.save).not.toHaveBeenCalled();
  });

  it('未登录同样不能读取后台数据', async () => {
    mocks.session.mockResolvedValue(null);
    expect((await GET(request('GET'))).status).toBe(404);
    expect(mocks.list).not.toHaveBeenCalled();
  });

  it('按有效日期读取四栏数据，响应不缓存', async () => {
    const response = await GET(request('GET', undefined, undefined, `?date=${date}`));
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(mocks.list).toHaveBeenCalledWith(date);
    expect((await response.json()).editions).toEqual([edition]);
  });

  it('拒绝不存在的日期', async () => {
    expect((await GET(request('GET', undefined, undefined, '?date=2026-02-30'))).status).toBe(400);
    expect(mocks.list).not.toHaveBeenCalled();
  });

  it('生成和编辑都检查 Origin 并返回 no-store', async () => {
    const headers = { Origin: 'https://attacker.example' };
    const responses = await Promise.all([
      POST(request('POST', { action: 'generate', date }, headers)), PATCH(request('PATCH', saveBody, headers)),
    ]);
    for (const response of responses) {
      expect(response.status).toBe(403);
      expect(response.headers.get('Cache-Control')).toBe('no-store');
    }
    expect(mocks.generate).not.toHaveBeenCalled();
    expect(mocks.save).not.toHaveBeenCalled();
  });

  it('写入限流命中时不执行采集或保存', async () => {
    mocks.rateLimit.mockResolvedValue({ limited: true });
    const responses = await Promise.all([
      POST(request('POST', { action: 'generate', date })), PATCH(request('PATCH', saveBody)),
    ]);
    expect(responses.map(response => response.status)).toEqual([429, 429]);
    expect(responses.every(response => response.headers.get('Cache-Control') === 'no-store')).toBe(true);
    expect(mocks.generate).not.toHaveBeenCalled();
    expect(mocks.save).not.toHaveBeenCalled();
  });

  it('按指定栏目生成并审计，保留采集失败状态给管理员处理', async () => {
    const failed = { ...edition, id: `${date}:papers`, channel: 'papers', status: 'failed', content: null };
    mocks.generate.mockResolvedValue([failed]);
    const response = await POST(request('POST', { action: 'generate', date, channel: 'papers' }));
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect((await response.json()).editions[0].status).toBe('failed');
    expect(mocks.generate).toHaveBeenCalledWith(date, 'papers');
    expect(mocks.audit).toHaveBeenCalledWith(session, expect.objectContaining({
      action: 'daily.generate', detail: { date, channel: 'papers', results: [{ id: failed.id, status: 'failed' }] },
    }));
  });

  it('拒绝畸形 JSON 和未知栏目', async () => {
    expect((await PATCH(request('PATCH', '{'))).status).toBe(400);
    expect((await POST(request('POST', { action: 'generate', date, channel: 'unknown' }))).status).toBe(400);
    expect(mocks.generate).not.toHaveBeenCalled();
    expect(mocks.save).not.toHaveBeenCalled();
  });

  it('无 Content-Length 时也限制实际请求体大小', async () => {
    const response = await PATCH(request('PATCH', { ...saveBody, summary: 'x'.repeat(128 * 1024) }));
    expect(response.status).toBe(413);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(mocks.save).not.toHaveBeenCalled();
  });

  it('根据声明长度在读入请求体前拒绝超大输入', async () => {
    const response = await POST(request('POST', { action: 'generate', date }, { 'Content-Length': String(128 * 1024 + 1) }));
    expect(response.status).toBe(413);
    expect(mocks.generate).not.toHaveBeenCalled();
  });

  it('禁止把内容写入错误栏目或另一日期的 ID', async () => {
    expect((await PATCH(request('PATCH', { ...saveBody, channel: 'papers' }))).status).toBe(400);
    expect((await PATCH(request('PATCH', { ...saveBody, id: '2000-01-01:events' }))).status).toBe(400);
    expect(mocks.save).not.toHaveBeenCalled();
  });

  it('带版本保存并审核发布，审计仅记录摘要', async () => {
    const response = await PATCH(request('PATCH', saveBody));
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(mocks.save).toHaveBeenCalledWith(expect.objectContaining({ id: edition.id, expectedUpdatedAt: updatedAt, status: 'published' }));
    expect(mocks.audit).toHaveBeenCalledWith(session, expect.objectContaining({ action: 'daily.publish', targetId: edition.id }));
    expect(mocks.audit.mock.calls[0][1].detail).not.toHaveProperty('content');
  });

  it('新建草稿可由日期与栏目派生 ID，不要求先运行生成器', async () => {
    const response = await PATCH(request('PATCH', { ...saveBody, id: undefined, expectedUpdatedAt: undefined, status: 'draft' }));
    expect(response.status).toBe(200);
    expect(mocks.save).toHaveBeenCalledWith(expect.objectContaining({ date, channel: 'events', status: 'draft' }));
    expect(mocks.audit).toHaveBeenCalledWith(session, expect.objectContaining({ action: 'daily.save' }));
  });

  it('保存版本冲突返回 409，不伪造成功审计', async () => {
    mocks.save.mockResolvedValue(null);
    const response = await PATCH(request('PATCH', saveBody));
    expect(response.status).toBe(409);
    expect((await response.json()).errorCode).toBe('conflict');
    expect(mocks.audit).not.toHaveBeenCalled();
  });

  it('下架传递版本、保留草稿并记录审计；竞争更新返回 409', async () => {
    const body = { action: 'retire', id: edition.id, expectedUpdatedAt: updatedAt };
    expect((await PATCH(request('PATCH', body))).status).toBe(200);
    expect(mocks.retire).toHaveBeenCalledWith(edition.id, updatedAt);
    expect(mocks.audit).toHaveBeenCalledWith(session, expect.objectContaining({ action: 'daily.retire', targetId: edition.id }));
    mocks.retire.mockResolvedValue(false);
    expect((await PATCH(request('PATCH', body))).status).toBe(409);
    expect(mocks.audit).toHaveBeenCalledTimes(1);
  });

  it('下架必须携带读到的版本', async () => {
    expect((await PATCH(request('PATCH', { action: 'retire', id: edition.id }))).status).toBe(400);
    expect(mocks.retire).not.toHaveBeenCalled();
  });

  it.each([
    { sourceType: 'aggregator' }, { phase: undefined }, { startAt: '2026-10-15T09:00:00+08:00' },
    { startAt: '2026-10-15T09:00:00+08:00', timeZone: 'Not/A_Timezone' },
  ])('发布活动前要求官方来源、阶段与已确认的时区：%j', async patch => {
    const content = { kind: 'events', items: [{ ...item, ...patch }] };
    expect((await PATCH(request('PATCH', { ...saveBody, content }))).status).toBe(400);
    expect(mocks.save).not.toHaveBeenCalled();
  });

  it('事件时间未知可留空发布，不自动填今天', async () => {
    expect((await PATCH(request('PATCH', saveBody))).status).toBe(200);
    expect(mocks.save.mock.calls[0][0].content.items[0]).not.toHaveProperty('startAt');
  });

  it('活动可以保存已确认的开始时间与有效时区', async () => {
    const content = { kind: 'events', items: [{ ...item, startAt: '2026-10-15T09:00:00+08:00', timeZone: 'Asia/Shanghai' }] };
    expect((await PATCH(request('PATCH', { ...saveBody, content }))).status).toBe(200);
  });

  it('存储读取失败返回不缓存的错误，不暴露内部错误内容', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      mocks.list.mockRejectedValue(new Error('private database details'));
      const response = await GET(request('GET'));
      expect(response.status).toBe(500);
      expect(response.headers.get('Cache-Control')).toBe('no-store');
      expect(await response.json()).toEqual({ error: 'load_failed', errorCode: 'load_failed' });
    } finally { log.mockRestore(); }
  });

  it('论文修改解读时原始摘要和来源版本仍完整传给服务层', async () => {
    const paper = { ...item, originalAbstract: 'Original author abstract.', version: 'v2', announcementType: 'replace' };
    const response = await PATCH(request('PATCH', { ...saveBody, id: `${date}:papers`, channel: 'papers', content: { kind: 'papers', items: [paper] } }));
    expect(response.status).toBe(200);
    expect(mocks.save.mock.calls[0][0].content.items[0]).toEqual(expect.objectContaining({ originalAbstract: paper.originalAbstract, version: 'v2', announcementType: 'replace' }));
  });

  it('历史期刊只能人工修订，不能将今天来源重新生成成过去的内容', async () => {
    const response = await POST(request('POST', { action: 'generate', date: '2000-01-01' }));
    expect(response.status).toBe(400);
    expect((await response.json()).errorCode).toBe('today_only');
    expect(mocks.generate).not.toHaveBeenCalled();
  });

  it('拒绝不指向实际选项的英语答案', async () => {
    const content = {
      kind: 'english', vocabulary: [{ term: 'review', meaning: '复习', example: 'I review a lesson.', translation: '我复习一节课。' }],
      passage: 'A short reading.', questions: [{ question: 'Choose one.', options: ['A', 'B'], answerIndex: 3, explanation: 'Only A is correct.' }],
    };
    expect((await PATCH(request('PATCH', { ...saveBody, id: `${date}:english`, channel: 'english', content }))).status).toBe(400);
    expect(mocks.save).not.toHaveBeenCalled();
  });
});
