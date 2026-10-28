import { NextRequest, type NextResponse } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  rateLimit: vi.fn(),
  getDailyEditions: vi.fn(),
  getDailyPreferencesState: vi.fn(),
  saveDailyPreferences: vi.fn(),
  getDailyReminder: vi.fn(),
  freezeDailyReminder: vi.fn(),
  generateDailyEditions: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({ getSession: mocks.getSession }));
vi.mock('@/lib/rate-limit', () => ({ getClientIp: () => '203.0.113.10', rateLimit: mocks.rateLimit }));
vi.mock('@/lib/daily/service', () => ({
  getDailyEditions: mocks.getDailyEditions,
  getDailyPreferencesState: mocks.getDailyPreferencesState,
  saveDailyPreferences: mocks.saveDailyPreferences,
  getDailyReminder: mocks.getDailyReminder,
  freezeDailyReminder: mocks.freezeDailyReminder,
  generateDailyEditions: mocks.generateDailyEditions,
}));
vi.mock('next/cache', () => ({ revalidatePath: mocks.revalidatePath }));

import { GET as getDaily } from '../route';
import { GET as getPreferences, PUT as putPreferences } from '../preferences/route';
import { GET as getReminder } from '../reminder/route';
import { POST as postCron } from '../../cron/daily/route';

const SITE = 'http://localhost:3000';
const TODAY = '2026-10-14';
const SECRET = 'daily-test-cron-secret-at-least-32-characters';
const REVISION = '2026-10-14T00:00:00.000Z';
const PREFERENCES = { channels: ['english', 'papers'], reminders: true };

function preferenceRequest(input: unknown, options: { owner?: string | null; origin?: string; raw?: boolean; legacy?: boolean } = {}) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', Origin: options.origin ?? SITE };
  const owner = options.owner === undefined ? 'user-1' : options.owner;
  if (owner !== null) headers['X-Daily-User'] = owner;
  return new NextRequest(`${SITE}/api/daily/preferences`, {
    method: 'PUT', headers, body: options.raw ? String(input) : JSON.stringify(!options.legacy && input && typeof input === 'object' && !Array.isArray(input) ? { expectedRevision: REVISION, ...input } : input),
  });
}

function cronRequest(action: string | null = 'generate', authorization: string | null = `Bearer ${SECRET}`) {
  return new NextRequest(`${SITE}/api/cron/daily${action === null ? '' : `?action=${encodeURIComponent(action)}`}`, {
    method: 'POST', headers: authorization === null ? {} : { Authorization: authorization },
  });
}

function expectPrivate(response: NextResponse, status: number) {
  expect(response.status).toBe(status);
  expect(response.headers.get('Cache-Control')).toBe('no-store');
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  // UTC 仍是13日，北京时间已经进入14日。
  vi.setSystemTime(new Date('2026-10-13T16:30:00Z'));
  vi.stubEnv('PATHFINDER_CRON_SECRET', SECRET);
  vi.spyOn(console, 'error').mockImplementation(() => {});
  mocks.getSession.mockResolvedValue({ userId: 'user-1', email: 'test@example.com' });
  mocks.rateLimit.mockResolvedValue({ limited: false });
  mocks.getDailyEditions.mockResolvedValue([]);
  mocks.getDailyPreferencesState.mockResolvedValue({ preferences: PREFERENCES, revision: REVISION });
  mocks.saveDailyPreferences.mockImplementation(async (_userId: string, input: unknown) => ({ preferences: input, revision: REVISION }));
  mocks.getDailyReminder.mockResolvedValue(null);
  mocks.freezeDailyReminder.mockResolvedValue({ status: 'created', date: TODAY });
  mocks.generateDailyEditions.mockResolvedValue([]);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('公共日刊 API', () => {
  it('按北京时间默认日期查询公共内容，不读取身份或私人偏好', async () => {
    const editions = [{ id: `${TODAY}:english`, channel: 'english', status: 'published' }];
    mocks.getDailyEditions.mockResolvedValue(editions);
    const response = await getDaily(new NextRequest(`${SITE}/api/daily?userId=other-user&channels=ai`));

    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toContain('public');
    expect(await response.json()).toEqual({ date: TODAY, editions });
    expect(mocks.getDailyEditions).toHaveBeenCalledWith(TODAY);
    expect(mocks.getSession).not.toHaveBeenCalled();
    expect(mocks.getDailyPreferencesState).not.toHaveBeenCalled();
    expect(mocks.getDailyReminder).not.toHaveBeenCalled();
  });

  it('允许最近30天窗口的第一天', async () => {
    const response = await getDaily(new NextRequest(`${SITE}/api/daily?date=2026-09-15`));
    expect(response.status).toBe(200);
    expect(mocks.getDailyEditions).toHaveBeenCalledWith('2026-09-15');
  });

  it.each(['2026-09-14', '2026-10-15', '2026-02-31', 'not-a-date', ''])('拒绝非法或越界日期 %s', async date => {
    const response = await getDaily(new NextRequest(`${SITE}/api/daily?date=${encodeURIComponent(date)}`));
    expect(response.status).toBe(400);
    expect(mocks.getDailyEditions).not.toHaveBeenCalled();
  });

  it('数据库失败返回503，不缓存或暴露底层错误', async () => {
    mocks.getDailyEditions.mockRejectedValue(new Error('internal database credentials'));
    const response = await getDaily(new NextRequest(`${SITE}/api/daily`));
    expectPrivate(response, 503);
    expect(await response.text()).not.toContain('credentials');
  });
});

describe('个人栏目偏好 API', () => {
  it('未登录读取返回401且不查私人数据', async () => {
    mocks.getSession.mockResolvedValue(null);
    const response = await getPreferences();
    expectPrivate(response, 401);
    expect(mocks.getDailyPreferencesState).not.toHaveBeenCalled();
  });

  it.each([PREFERENCES, null, { channels: [], reminders: false }])('读取自己的偏好并保留未设置和空选区别', async preferences => {
    mocks.getDailyPreferencesState.mockResolvedValue({ preferences, revision: preferences ? REVISION : null });
    const response = await getPreferences();
    expectPrivate(response, 200);
    expect(await response.json()).toEqual({ userId: 'user-1', preferences, revision: preferences ? REVISION : null });
    expect(mocks.getDailyPreferencesState).toHaveBeenCalledWith('user-1');
  });

  it('读取失败返回503，不把失败当未设置', async () => {
    mocks.getDailyPreferencesState.mockRejectedValue(new Error('private database detail'));
    const response = await getPreferences();
    expectPrivate(response, 503);
    const data = await response.json();
    expect(data).not.toHaveProperty('preferences');
    expect(JSON.stringify(data)).not.toContain('database detail');
  });

  it('跨站写入被真实Origin校验拦截', async () => {
    const response = await putPreferences(preferenceRequest(PREFERENCES, { origin: 'https://outside.example' }));
    expectPrivate(response, 403);
    expect(mocks.getSession).not.toHaveBeenCalled();
    expect(mocks.saveDailyPreferences).not.toHaveBeenCalled();
  });

  it('未登录不能保存', async () => {
    mocks.getSession.mockResolvedValue(null);
    const response = await putPreferences(preferenceRequest(PREFERENCES));
    expectPrivate(response, 401);
    expect(mocks.saveDailyPreferences).not.toHaveBeenCalled();
  });

  it.each([null, 'user-2'])('缺失或陈旧的owner头返回409：%s', async owner => {
    const response = await putPreferences(preferenceRequest(PREFERENCES, { owner }));
    expectPrivate(response, 409);
    expect(mocks.rateLimit).not.toHaveBeenCalled();
    expect(mocks.saveDailyPreferences).not.toHaveBeenCalled();
  });

  it('按账号与IP限流，受限请求不保存', async () => {
    mocks.rateLimit.mockResolvedValue({ limited: true });
    const response = await putPreferences(preferenceRequest(PREFERENCES));
    expectPrivate(response, 429);
    expect(mocks.rateLimit).toHaveBeenCalledWith('daily-preferences:user-1:203.0.113.10', 30, 60_000, { fallback: 'memory' });
    expect(mocks.saveDailyPreferences).not.toHaveBeenCalled();
  });

  it.each([
    { channels: ['unknown'], reminders: false },
    { channels: ['ai', 'ai'], reminders: false },
    { channels: ['english'], reminders: 'true' },
    { channels: ['papers'] },
    { channels: [], reminders: false, userId: 'other-user' },
    null,
  ])('拒绝非法偏好结构 %j', async input => {
    const response = await putPreferences(preferenceRequest(input));
    expectPrivate(response, 400);
    expect(mocks.saveDailyPreferences).not.toHaveBeenCalled();
  });

  it('无效JSON返回400', async () => {
    const response = await putPreferences(preferenceRequest('{broken', { raw: true }));
    expectPrivate(response, 400);
    expect(mocks.saveDailyPreferences).not.toHaveBeenCalled();
  });

  it('过大请求返回413', async () => {
    const response = await putPreferences(preferenceRequest('x'.repeat(2049), { raw: true }));
    expectPrivate(response, 413);
    expect(mocks.saveDailyPreferences).not.toHaveBeenCalled();
  });

  it.each([PREFERENCES, { channels: [], reminders: false }])('保存明确选择，包含空列表', async preferences => {
    const response = await putPreferences(preferenceRequest(preferences));
    expectPrivate(response, 200);
    expect(await response.json()).toEqual({ userId: 'user-1', preferences, revision: REVISION });
    expect(mocks.saveDailyPreferences).toHaveBeenCalledWith('user-1', preferences, REVISION);
  });

  it('保存失败返回503，不回传虚假的已保存偏好', async () => {
    mocks.saveDailyPreferences.mockRejectedValue(new Error('private write failure'));
    const response = await putPreferences(preferenceRequest(PREFERENCES));
    expectPrivate(response, 503);
    const data = await response.json();
    expect(data).not.toHaveProperty('preferences');
    expect(JSON.stringify(data)).not.toContain('private write failure');
  });

  it('旧页面未携带版本时返回409，要求刷新而不静默覆盖', async () => {
    const response = await putPreferences(preferenceRequest(PREFERENCES, { legacy: true }));
    expectPrivate(response, 409);
    expect(await response.json()).toMatchObject({ code: 'revision_required' });
    expect(mocks.saveDailyPreferences).not.toHaveBeenCalled();
  });

  it('版本冲突返回409，失败响应不伪造已保存设置', async () => {
    mocks.saveDailyPreferences.mockResolvedValue(null);
    const response = await putPreferences(preferenceRequest(PREFERENCES));
    expectPrivate(response, 409);
    expect(await response.json()).toMatchObject({ code: 'revision_conflict' });
  });

  it('首次保存显式发送null版本；非法版本拒绝', async () => {
    const response = await putPreferences(preferenceRequest({ ...PREFERENCES, expectedRevision: null }));
    expectPrivate(response, 200);
    expect(mocks.saveDailyPreferences).toHaveBeenCalledWith('user-1', PREFERENCES, null);
    mocks.saveDailyPreferences.mockClear();
    const invalid = await putPreferences(preferenceRequest({ ...PREFERENCES, expectedRevision: 'yesterday' }));
    expectPrivate(invalid, 400);
    expect(mocks.saveDailyPreferences).not.toHaveBeenCalled();
  });
});

describe('私人日刊提醒 API', () => {
  it('游客仅返回null，不读取任何用户提醒', async () => {
    mocks.getSession.mockResolvedValue(null);
    const response = await getReminder();
    expectPrivate(response, 200);
    expect(await response.json()).toEqual({ reminder: null });
    expect(mocks.getDailyReminder).not.toHaveBeenCalled();
  });

  it('只查询会话本人并标记响应owner', async () => {
    const reminder = { date: TODAY, channels: ['ai'], publishedAt: `${TODAY}T01:30:00.000Z` };
    mocks.getDailyReminder.mockResolvedValue(reminder);
    const response = await getReminder();
    expectPrivate(response, 200);
    expect(await response.json()).toEqual({ userId: 'user-1', reminder });
    expect(mocks.getDailyReminder).toHaveBeenCalledWith('user-1');
  });

  it('读取失败返回503且不暴露服务错误', async () => {
    mocks.getDailyReminder.mockRejectedValue(new Error('private reminder failure'));
    const response = await getReminder();
    expectPrivate(response, 503);
    expect(await response.text()).not.toContain('private reminder failure');
  });
});

describe('日刊cron API', () => {
  it.each([null, 'Bearer wrong', `Bearer ${'x'.repeat(SECRET.length)}`])('拒绝缺失或错误凭据', async authorization => {
    const response = await postCron(cronRequest('generate', authorization));
    expect(response.status).toBe(401);
    expect(mocks.rateLimit).not.toHaveBeenCalled();
    expect(mocks.generateDailyEditions).not.toHaveBeenCalled();
    expect(mocks.freezeDailyReminder).not.toHaveBeenCalled();
  });

  it.each([undefined, 'too-short'])('未配置或过短密钥不能放行', async secret => {
    vi.stubEnv('PATHFINDER_CRON_SECRET', secret);
    const response = await postCron(cronRequest('generate', `Bearer ${secret}`));
    expect(response.status).toBe(401);
    expect(mocks.generateDailyEditions).not.toHaveBeenCalled();
  });

  it.each([null, 'publish', ''])('拒绝缺失或未知action：%s', async action => {
    const response = await postCron(cronRequest(action));
    expect(response.status).toBe(400);
    expect(mocks.generateDailyEditions).not.toHaveBeenCalled();
    expect(mocks.freezeDailyReminder).not.toHaveBeenCalled();
  });

  it('cron限流采用failClosed并阻止执行', async () => {
    mocks.rateLimit.mockResolvedValue({ limited: true });
    const response = await postCron(cronRequest());
    expect(response.status).toBe(429);
    expect(mocks.rateLimit).toHaveBeenCalledWith('daily-cron:203.0.113.10', 5, 60_000, { failClosed: true });
    expect(mocks.generateDailyEditions).not.toHaveBeenCalled();
  });

  it('生成采用北京时间今日，仅返回栏目状态', async () => {
    mocks.generateDailyEditions.mockResolvedValue([
      { channel: 'english', status: 'published', content: 'private draft content' },
      { channel: 'papers', status: 'published', error: 'private failure' },
      { channel: 'ai', status: 'published' },
      { channel: 'events', status: 'empty' },
      ...['open-source', 'competitions', 'internships'].map(channel => ({ channel, status: 'empty' })),
    ]);
    const response = await postCron(cronRequest());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true, editions: [
      { channel: 'english', status: 'published' }, { channel: 'papers', status: 'published' }, { channel: 'ai', status: 'published' }, { channel: 'events', status: 'empty' },
      ...['open-source', 'competitions', 'internships'].map(channel => ({ channel, status: 'empty' })),
    ] });
    expect(mocks.generateDailyEditions).toHaveBeenCalledWith(TODAY);
    expect(mocks.freezeDailyReminder).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/[locale]/daily', 'page');
  });

  it('缺失栏目不能误报生成成功', async () => {
    mocks.generateDailyEditions.mockResolvedValue([{ channel: 'ai', status: 'published' }]);
    expect((await postCron(cronRequest())).status).toBe(503);
  });

  it('任一栏目失败则整体返回503，不能静默报成功', async () => {
    mocks.generateDailyEditions.mockResolvedValue([{ channel: 'english', status: 'published' }, { channel: 'ai', status: 'failed' }]);
    const response = await postCron(cronRequest());
    expect(response.status).toBe(503);
    expect((await response.json()).success).toBe(false);
  });

  it.each(['created', 'empty', 'duplicate', 'not-due'])('提醒冻结正常状态%s不是执行失败', async status => {
    mocks.freezeDailyReminder.mockResolvedValue({ status, date: TODAY });
    const response = await postCron(cronRequest('remind'));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true, status, date: TODAY });
    expect(mocks.freezeDailyReminder).toHaveBeenCalledOnce();
    expect(mocks.generateDailyEditions).not.toHaveBeenCalled();
  });

  it.each(['generate', 'remind'])('%s抛错返回503且隐藏底层细节', async action => {
    mocks.generateDailyEditions.mockRejectedValue(new Error('private upstream failure'));
    mocks.freezeDailyReminder.mockRejectedValue(new Error('private database failure'));
    const response = await postCron(cronRequest(action));
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ success: false, error: 'Daily job failed' });
  });
});
