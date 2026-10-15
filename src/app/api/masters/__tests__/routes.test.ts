import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mock = vi.hoisted(() => ({ session: vi.fn(), limit: vi.fn(), list: vi.fn(), byIds: vi.fn(), watches: vi.fn(),
  save: vi.fn(), remove: vi.fn(), notices: vi.fn(), read: vi.fn(), sync: vi.fn(), calendar: vi.fn() }));
vi.mock('@/lib/auth', () => ({ getSession: mock.session }));
vi.mock('@/lib/rate-limit', () => ({ getClientIp: () => 'test', rateLimit: mock.limit }));
vi.mock('@/lib/masters/ics', () => ({ buildMastersCalendar: mock.calendar }));
vi.mock('@/lib/masters/service', () => ({ listMastersRounds: mock.list, getMastersRoundsByIds: mock.byIds,
  getMastersWatches: mock.watches, saveMastersWatch: mock.save, removeMastersWatch: mock.remove,
  getMastersNotices: mock.notices, markMastersNoticesRead: mock.read, syncMastersNotices: mock.sync }));
import { GET as publicGet } from '../route';
import { GET as watchesGet, PUT, DELETE } from '../watches/route';
import { GET as calendarGet } from '../calendar/route';
import { GET as noticesGet, PATCH } from '../notices/route';
import { POST } from '../../cron/masters-deadlines/route';

function req(path: string, method = 'GET', body?: unknown, headers: Record<string, string> = {}) {
  return new NextRequest(`http://127.0.0.1:3000${path}`, { method,
    headers: { 'Content-Type': 'application/json', Origin: 'http://127.0.0.1:3000', 'X-Masters-User': 'user-a', ...headers },
    ...(body ? { body: JSON.stringify(body) } : {}) });
}
beforeEach(() => {
  vi.resetAllMocks();
  mock.session.mockResolvedValue({ userId: 'user-a', emailVerified: true });
  mock.limit.mockResolvedValue({ limited: false });
  mock.list.mockResolvedValue([]); mock.byIds.mockResolvedValue([]); mock.watches.mockResolvedValue([]);
  mock.save.mockResolvedValue({ roundId: 'round-1', status: 'preparing', reminders: false, updatedAt: '2026-10-14T00:00:00Z' });
  mock.notices.mockResolvedValue([]); mock.sync.mockResolvedValue({ created: 2 });
  mock.calendar.mockReturnValue('BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n');
  vi.stubEnv('PATHFINDER_CRON_SECRET', 'x'.repeat(40));
});
afterEach(() => vi.unstubAllEnvs());

describe('公开申请日历和导出', () => {
  it('公开查询不读取私人身份，校验入学年份', async () => {
    expect((await publicGet(req('/api/masters?year=2027'))).status).toBe(200);
    expect(mock.list).toHaveBeenCalledWith(2027);
    expect(mock.session).not.toHaveBeenCalled();
    expect((await publicGet(req('/api/masters?year=bad'))).status).toBe(400);
  });
  it('数据库不可用不伪装为空清单', async () => {
    mock.list.mockRejectedValue(new Error('offline'));
    expect((await publicGet(req('/api/masters?year=2027'))).status).toBe(503);
  });
  it('导出仅取公开轮次、使用下载头且不缓存选择', async () => {
    const response = await calendarGet(req('/api/masters/calendar?ids=round-1,round-1,round-2'));
    expect(response.status).toBe(200);
    expect(mock.byIds).toHaveBeenCalledWith(['round-1', 'round-2']);
    expect(response.headers.get('content-type')).toContain('text/calendar');
    expect(response.headers.get('content-disposition')).toContain('attachment');
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(mock.session).not.toHaveBeenCalled();
  });
  it.each(['', '../private', Array.from({ length: 51 }, (_, n) => `r${n}`).join(',')])('拒绝无效或超限导出 %s', async ids => {
    expect((await calendarGet(req(`/api/masters/calendar?ids=${encodeURIComponent(ids)}`))).status).toBe(400);
  });
  it('没有有效截止时不下载伪造事件', async () => {
    mock.calendar.mockReturnValue('BEGIN:VCALENDAR\r\nEND:VCALENDAR\r\n');
    expect((await calendarGet(req('/api/masters/calendar?ids=round-1'))).status).toBe(404);
  });
});

describe('个人申请与提醒', () => {
  const input = { roundId: 'round-1', status: 'preparing', reminders: true };
  it('个人查询带owner且no-store，跨年关注按ID补公开轮次', async () => {
    mock.watches.mockResolvedValue([{ roundId: 'past-year' }]);
    const response = await watchesGet();
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect((await response.json()).userId).toBe('user-a');
    expect(mock.byIds).toHaveBeenCalledWith(['past-year']);
  });
  it('游客不能读写个人申请', async () => {
    mock.session.mockResolvedValue(null);
    expect((await watchesGet()).status).toBe(401);
    expect((await PUT(req('/api/masters/watches', 'PUT', input))).status).toBe(401);
    expect((await noticesGet()).headers.get('cache-control')).toBe('no-store');
    expect(mock.save).not.toHaveBeenCalled();
  });
  it('账号切换与跨站请求不能写入', async () => {
    expect((await PUT(req('/api/masters/watches', 'PUT', input, { 'X-Masters-User': 'other' }))).status).toBe(409);
    expect((await PUT(req('/api/masters/watches', 'PUT', input, { Origin: 'https://evil.test' }))).status).toBe(403);
    expect(mock.save).not.toHaveBeenCalled();
  });
  it('进度更新只能作用于会话账号', async () => {
    const response = await PUT(req('/api/masters/watches', 'PUT', input));
    expect(response.status).toBe(200);
    expect(mock.save).toHaveBeenCalledWith('user-a', input);
    expect(response.headers.get('cache-control')).toBe('no-store');
  });
  it('下架、错误输入和限流分别返回404/400/429', async () => {
    mock.save.mockResolvedValue(null);
    expect((await PUT(req('/api/masters/watches', 'PUT', input))).status).toBe(404);
    expect((await PUT(req('/api/masters/watches', 'PUT', { ...input, status: 'read' }))).status).toBe(400);
    mock.limit.mockResolvedValue({ limited: true });
    expect((await PUT(req('/api/masters/watches', 'PUT', input))).status).toBe(429);
  });
  it('取消关注和标记已读都核对owner', async () => {
    expect((await DELETE(req('/api/masters/watches', 'DELETE', { roundId: 'round-1' }))).status).toBe(200);
    expect(mock.remove).toHaveBeenCalledWith('user-a', 'round-1');
    const ids = ['a'.repeat(64)];
    expect((await PATCH(req('/api/masters/notices', 'PATCH', { ids }, { 'X-Masters-User': 'other' }))).status).toBe(409);
    expect((await PATCH(req('/api/masters/notices', 'PATCH', { ids }))).status).toBe(200);
    expect(mock.read).toHaveBeenCalledWith('user-a', ids);
  });
  it('提醒读取失败不返回缓存的其他用户数据', async () => {
    mock.notices.mockRejectedValue(new Error('offline'));
    const response = await noticesGet();
    expect(response.status).toBe(503);
    expect(response.headers.get('cache-control')).toBe('no-store');
  });
});

describe('申请截止调度', () => {
  it('拒绝未知密钥，合法请求返回生成数量', async () => {
    expect((await POST(req('/api/cron/masters-deadlines', 'POST'))).status).toBe(401);
    const response = await POST(req('/api/cron/masters-deadlines', 'POST', undefined, { Authorization: `Bearer ${'x'.repeat(40)}` }));
    expect(await response.json()).toEqual({ success: true, created: 2 });
  });
  it('调度故障返回503供包装脚本识别', async () => {
    mock.sync.mockRejectedValue(new Error('offline'));
    const response = await POST(req('/api/cron/masters-deadlines', 'POST', undefined, { Authorization: `Bearer ${'x'.repeat(40)}` }));
    expect(response.status).toBe(503);
    expect((await response.json()).success).toBe(false);
  });
});
