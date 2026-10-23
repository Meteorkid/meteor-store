import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defaultDailyPanelSettings } from '@/lib/daily/panel-types';
const mocks = vi.hoisted(() => ({ session: vi.fn(), rateLimit: vi.fn(), get: vi.fn(), save: vi.fn(), preview: vi.fn() }));
vi.mock('@/lib/auth', () => ({ getSession: mocks.session }));
vi.mock('@/lib/rate-limit', () => ({ getClientIp: () => '203.0.113.10', rateLimit: mocks.rateLimit }));
vi.mock('@/lib/daily/panel-service', () => ({ getDailyPanelPreferences: mocks.get, saveDailyPanelPreferences: mocks.save }));
vi.mock('@/lib/daily/preview', () => ({ getDailyPreview: mocks.preview }));
import { GET as getPreferences, PUT as putPreferences } from '../panel-preferences/route';
import { GET as getPreview } from '../preview/route';
const SITE = 'http://localhost:3000';
const settings = defaultDailyPanelSettings(['english']);
const saved = { userId: 'user-a', settings, revision: '2026-10-23T01:00:00.000Z', followedChannels: ['english'] };
function request(input: unknown, options: { owner?: string | null; origin?: string; raw?: boolean } = {}) {
  const headers: Record<string, string> = { Origin: options.origin ?? SITE, 'Content-Type': 'application/json' };
  if (options.owner !== null) headers['X-Daily-User'] = options.owner ?? 'user-a';
  return new NextRequest(`${SITE}/api/daily/panel-preferences`, { method: 'PUT', headers, body: options.raw ? String(input) : JSON.stringify(input) });
}
beforeEach(() => {
  vi.clearAllMocks(); vi.useFakeTimers(); vi.setSystemTime(new Date('2026-10-22T16:30:00Z'));
  mocks.session.mockResolvedValue({ userId: 'user-a' }); mocks.rateLimit.mockResolvedValue({ limited: false });
  mocks.get.mockResolvedValue(saved); mocks.save.mockResolvedValue(saved);
  mocks.preview.mockResolvedValue({ date: '2026-10-23', updatedAt: null, editions: [] });
});
afterEach(() => { vi.useRealTimers(); });

describe('公告面板接口隔离', () => {
  it('公共预览使用北京时间日期，不读取身份或个人设置', async () => {
    const response = await getPreview(new NextRequest(`${SITE}/api/daily/preview?userId=other&channels=ai`));
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toContain('public');
    expect(await response.json()).toEqual({ date: '2026-10-23', updatedAt: null, editions: [] });
    expect(mocks.preview).toHaveBeenCalledWith('2026-10-23');
    expect(mocks.session).not.toHaveBeenCalled(); expect(mocks.get).not.toHaveBeenCalled();
  });

  it('私人读取只查会话本人并返回owner和no-store，游客不可读取', async () => {
    const response = await getPreferences();
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(await response.json()).toEqual(saved);
    expect(mocks.get).toHaveBeenCalledWith('user-a');
    mocks.session.mockResolvedValue(null); mocks.get.mockClear();
    const guest = await getPreferences();
    expect(guest.status).toBe(401); expect(guest.headers.get('Cache-Control')).toBe('no-store');
    expect(mocks.get).not.toHaveBeenCalled();
  });

  it('保存使用会话owner与预期版本，并把并发冲突返回409而不伪造成功', async () => {
    const input = { settings, expectedRevision: null };
    const response = await putPreferences(request(input));
    expect(response.status).toBe(200); expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(await response.json()).toEqual(saved);
    expect(mocks.save).toHaveBeenCalledWith('user-a', input);
    mocks.save.mockResolvedValue(null);
    const conflict = await putPreferences(request(input));
    expect(conflict.status).toBe(409); expect(conflict.headers.get('Cache-Control')).toBe('no-store');
    expect(await conflict.json()).toMatchObject({ error: expect.any(String), code: 'revision_conflict' });
  });

  it.each([null, 'user-b'])('错误owner %s在限流和写库前被拒绝', async owner => {
    const response = await putPreferences(request({ settings, expectedRevision: null }, { owner }));
    expect(response.status).toBe(409); expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(await response.json()).toMatchObject({ code: 'account_changed' });
    expect(mocks.rateLimit).not.toHaveBeenCalled(); expect(mocks.save).not.toHaveBeenCalled();
  });

  it('跨站Origin和游客保存被拒绝', async () => {
    const crossSite = await putPreferences(request({ settings, expectedRevision: null }, { origin: 'https://outside.example' }));
    expect(crossSite.status).toBe(403); expect(crossSite.headers.get('Cache-Control')).toBe('no-store');
    expect(mocks.session).not.toHaveBeenCalled();
    mocks.session.mockResolvedValue(null);
    const guest = await putPreferences(request({ settings, expectedRevision: null }));
    expect(guest.status).toBe(401); expect(guest.headers.get('Cache-Control')).toBe('no-store');
    expect(mocks.save).not.toHaveBeenCalled();
  });

  it('按当前账号和IP限流', async () => {
    mocks.rateLimit.mockResolvedValue({ limited: true });
    const response = await putPreferences(request({ settings, expectedRevision: null }));
    expect(response.status).toBe(429); expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(mocks.rateLimit).toHaveBeenCalledWith('daily-panel-preferences:user-a:203.0.113.10', 30, 60_000, { fallback: 'memory' });
    expect(mocks.save).not.toHaveBeenCalled();
  });

  it.each([
    { settings, expectedRevision: null, userId: 'other' }, { settings },
    { settings, expectedRevision: 'not-an-iso-date' },
    { settings: { ...settings, channels: ['english', 'english'] }, expectedRevision: null },
    { settings: { ...settings, showDates: 'true' }, expectedRevision: null },
    { settings: { ...settings, itemCounts: { ...settings.itemCounts, ai: 100 } }, expectedRevision: null },
  ])('非法strict协议不写库', async input => {
    const response = await putPreferences(request(input));
    expect(response.status).toBe(400); expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(mocks.save).not.toHaveBeenCalled();
  });

  it('无Content-Length时仍按实际UTF8字节限制请求，坏JSON不写库', async () => {
    const large = await putPreferences(request('汉'.repeat(1366), { raw: true }));
    expect(large.status).toBe(413); expect(large.headers.get('Cache-Control')).toBe('no-store');
    const malformed = await putPreferences(request('{broken', { raw: true }));
    expect(malformed.status).toBe(400); expect(malformed.headers.get('Cache-Control')).toBe('no-store');
    expect(mocks.save).not.toHaveBeenCalled();
  });

  it('恢复默认的null设置和明确空选都原样保存', async () => {
    for (const value of [null, { ...settings, channels: [] }]) {
      const input = { settings: value, expectedRevision: saved.revision };
      const response = await putPreferences(request(input));
      expect(response.status).toBe(200); expect(mocks.save).toHaveBeenLastCalledWith('user-a', input);
    }
  });

  it('私人读取或写入失败返回503且不暴露错误详情', async () => {
    mocks.get.mockRejectedValue(new Error('private database credentials'));
    mocks.save.mockRejectedValue(new Error('private database credentials'));
    for (const response of [await getPreferences(), await putPreferences(request({ settings, expectedRevision: null }))]) {
      expect(response.status).toBe(503); expect(response.headers.get('Cache-Control')).toBe('no-store');
      expect(await response.text()).not.toContain('credentials');
    }
  });

  it.each(['2026-09-23', '2026-10-24', '2026-02-31', ''])('非法预览日期 %s不查询', async date => {
    const response = await getPreview(new NextRequest(`${SITE}/api/daily/preview?date=${date}`));
    expect(response.status).toBe(400); expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(mocks.preview).not.toHaveBeenCalled();
  });

  it('公共预览故障不缓存也不泄漏内部错误', async () => {
    mocks.preview.mockRejectedValue(new Error('upstream credentials'));
    const response = await getPreview(new NextRequest(`${SITE}/api/daily/preview`));
    expect(response.status).toBe(503); expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(await response.text()).not.toContain('credentials');
  });
});
