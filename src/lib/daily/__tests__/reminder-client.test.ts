import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { DailyReminder } from '../types';

type ReminderClient = typeof import('../reminder-client');
let client: ReminderClient;
let now: number;
let storage: Map<string, string>;
let fetchMock: ReturnType<typeof vi.fn>;
let setItem: ReturnType<typeof vi.fn>;

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

const reminder = (channel: 'english' | 'papers' | 'ai' = 'english'): DailyReminder => ({
  date: '2026-10-14', channels: [channel], publishedAt: '2026-10-14T01:30:00.000Z',
});
const response = (userId: string, value: DailyReminder | null = reminder()) => Response.json({ userId, reminder: value });
const flushRequests = () => new Promise<void>(resolve => setImmediate(resolve));

beforeEach(async () => {
  vi.resetModules();
  now = new Date('2026-10-14T02:00:00Z').getTime();
  vi.spyOn(Date, 'now').mockImplementation(() => now);
  storage = new Map();
  setItem = vi.fn((key: string, value: string) => { storage.set(key, value); });
  vi.stubGlobal('localStorage', {
    getItem: vi.fn((key: string) => storage.get(key) ?? null),
    setItem,
  });
  fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
  client = await import('../reminder-client');
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('共享日刊提醒客户端', () => {
  it('旧标签页不能将另一标签页的较新已读日期写回过去', async () => {
    fetchMock.mockResolvedValue(response('user-a'));
    client.ensureDailyReminder('user-a');
    await flushRequests();
    storage.set('ms_daily_reminder_read:user-a', '2026-10-15');
    client.markDailyReminderRead('user-a');
    expect(storage.get('ms_daily_reminder_read:user-a')).toBe('2026-10-15');
    expect(client.getReminderState('user-a').readDate).toBe('2026-10-15');
    storage.set('ms_daily_reminder_read:user-a', '2026-10-13');
    client.syncDailyReminderRead('user-a');
    expect(client.getReminderState('user-a').readDate).toBe('2026-10-15');
  });

  it('15秒超时释放请求占位，重试成功后忽略超时请求的迟到结果', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const stale = deferred<Response>();
    fetchMock.mockReturnValueOnce(stale.promise).mockResolvedValueOnce(response('user-a', reminder('papers')));
    client.ensureDailyReminder('user-a');
    await vi.advanceTimersByTimeAsync(15_000);
    expect(client.getReminderState('user-a').failed).toBe(true);
    expect(fetchMock.mock.calls[0][1].signal.aborted).toBe(true);
    client.ensureDailyReminder('user-a');
    await flushRequests();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(client.getReminderState('user-a').reminder).toEqual(reminder('papers'));
    stale.resolve(response('user-a', reminder('ai')));
    await flushRequests();
    expect(client.getReminderState('user-a')).toMatchObject({ reminder: reminder('papers'), failed: false });
  });

  it('同一账号的两个铃铛共享在途请求，并在一分钟内复用结果', async () => {
    const pending = deferred<Response>();
    fetchMock.mockReturnValue(pending.promise);
    const listener = vi.fn();
    const unsubscribe = client.subscribeDailyReminder(listener);

    client.ensureDailyReminder('user-a');
    client.ensureDailyReminder('user-a');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('/api/daily/reminder', expect.objectContaining({ cache: 'no-store', signal: expect.any(AbortSignal) }));
    pending.resolve(response('user-a'));
    await flushRequests();

    expect(client.getReminderState('user-a')).toEqual({ reminder: reminder(), readDate: '', failed: false });
    expect(listener).toHaveBeenCalledOnce();
    now += 59_999;
    client.ensureDailyReminder('user-a');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    unsubscribe();

    fetchMock.mockResolvedValue(response('user-a', reminder('papers')));
    now += 1;
    client.ensureDailyReminder('user-a');
    await flushRequests();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenCalledOnce();
  });

  it('另一个账号的响应不写入请求账号，也不覆盖当前账号', async () => {
    fetchMock.mockResolvedValueOnce(response('user-b', reminder('papers')))
      .mockResolvedValueOnce(response('user-b', reminder('ai')));
    client.ensureDailyReminder('user-a');
    client.ensureDailyReminder('user-b');
    await flushRequests();

    expect(client.getReminderState('user-a')).toEqual({ reminder: null, readDate: '', failed: true });
    expect(client.getReminderState('user-b')).toEqual({ reminder: reminder('ai'), readDate: '', failed: false });
    expect(client.getReminderState(null)).toBe(client.EMPTY_REMINDER_STATE);
  });

  it('缺少响应owner的游客结果不能作为已登录账号结果', async () => {
    fetchMock.mockResolvedValue(Response.json({ reminder: null }));
    client.ensureDailyReminder('user-a');
    await flushRequests();
    expect(client.getReminderState('user-a')).toEqual({ reminder: null, readDate: '', failed: true });
  });

  it('强制刷新清空旧提醒，迟到的旧响应不能覆盖新结果', async () => {
    fetchMock.mockResolvedValueOnce(response('user-a'));
    client.ensureDailyReminder('user-a');
    await flushRequests();

    const stale = deferred<Response>();
    const fresh = deferred<Response>();
    fetchMock.mockReturnValueOnce(stale.promise).mockReturnValueOnce(fresh.promise);
    now += 60_000;
    client.ensureDailyReminder('user-a');
    client.ensureDailyReminder('user-a', true);
    expect(client.getReminderState('user-a').reminder).toBeNull();

    fresh.resolve(response('user-a', reminder('papers')));
    await flushRequests();
    stale.resolve(response('user-a', reminder('ai')));
    await flushRequests();
    expect(client.getReminderState('user-a').reminder).toEqual(reminder('papers'));
  });

  it('旧请求先结束也不能清除新请求的共享占位', async () => {
    const stale = deferred<Response>();
    const fresh = deferred<Response>();
    fetchMock.mockReturnValueOnce(stale.promise).mockReturnValueOnce(fresh.promise);
    client.ensureDailyReminder('user-a');
    client.ensureDailyReminder('user-a', true);

    stale.resolve(response('user-a'));
    await flushRequests();
    client.ensureDailyReminder('user-a');
    expect(fetchMock).toHaveBeenCalledTimes(2);
    fresh.resolve(response('user-a', reminder('papers')));
    await flushRequests();
    expect(client.getReminderState('user-a').reminder).toEqual(reminder('papers'));
  });

  it('旧请求失败不能清空已完成的强制刷新结果', async () => {
    const stale = deferred<Response>();
    fetchMock.mockReturnValueOnce(stale.promise).mockResolvedValueOnce(response('user-a', reminder('papers')));
    client.ensureDailyReminder('user-a');
    client.ensureDailyReminder('user-a', true);
    await flushRequests();
    stale.reject(new Error('late network failure'));
    await flushRequests();
    expect(client.getReminderState('user-a')).toEqual({ reminder: reminder('papers'), readDate: '', failed: false });
  });

  it('同一轮偏好更新的两个铃铛共享强制刷新请求', async () => {
    const pending = deferred<Response>();
    fetchMock.mockReturnValue(pending.promise);
    client.ensureDailyReminder('user-a', true);
    client.ensureDailyReminder('user-a', true);
    pending.resolve(response('user-a'));
    await flushRequests();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(client.getReminderState('user-a')).toEqual({ reminder: reminder(), readDate: '', failed: false });
  });

  it('下一轮偏好事件仍能再次刷新，不被上一轮在途请求或TTL挡住', async () => {
    const firstEvent = deferred<Response>();
    const secondEvent = deferred<Response>();
    fetchMock.mockReturnValueOnce(firstEvent.promise).mockReturnValueOnce(secondEvent.promise);
    client.ensureDailyReminder('user-a', true);
    await flushRequests();

    client.ensureDailyReminder('user-a', true);
    client.ensureDailyReminder('user-a', true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    secondEvent.resolve(response('user-a', reminder('papers')));
    await flushRequests();
    firstEvent.resolve(response('user-a', reminder('ai')));
    await flushRequests();
    expect(client.getReminderState('user-a')).toEqual({ reminder: reminder('papers'), readDate: '', failed: false });
  });

  it('已读日期按账号读写，不污染另一个账号或游客', async () => {
    storage.set('ms_daily_reminder_read:user-a', '2026-10-13');
    fetchMock.mockResolvedValueOnce(response('user-a')).mockResolvedValueOnce(response('user-b', reminder('papers')));
    client.ensureDailyReminder('user-a');
    client.ensureDailyReminder('user-b');
    await flushRequests();
    expect(client.getReminderState('user-a').readDate).toBe('2026-10-13');
    expect(client.getReminderState('user-b').readDate).toBe('');

    client.markDailyReminderRead('user-a');
    expect(setItem).toHaveBeenCalledWith('ms_daily_reminder_read:user-a', '2026-10-14');
    expect(client.getReminderState('user-a').readDate).toBe('2026-10-14');
    expect(client.getReminderState('user-b').readDate).toBe('');
    expect(client.getReminderState(null).readDate).toBe('');

    storage.set('ms_daily_reminder_read:user-b', '2026-10-14');
    client.syncDailyReminderRead('user-b');
    expect(client.getReminderState('user-b').readDate).toBe('2026-10-14');
    expect(client.getReminderState('user-a').readDate).toBe('2026-10-14');
  });

  it('本地存储不可写时仍保存本页的已读状态', async () => {
    fetchMock.mockResolvedValue(response('user-a'));
    client.ensureDailyReminder('user-a');
    await flushRequests();
    setItem.mockImplementation(() => { throw new Error('storage blocked'); });
    expect(() => client.markDailyReminderRead('user-a')).not.toThrow();
    expect(client.getReminderState('user-a').readDate).toBe('2026-10-14');
  });

  it.each([
    { label: 'localStorage读取和写入都抛错', readBlocked: true },
    { label: '仅写入配额失败而读取返回null', readBlocked: false },
  ])('$label时，61秒刷新后仍保留内存已读日期', async ({ readBlocked }) => {
    vi.mocked(localStorage.getItem).mockImplementation(() => {
      if (readBlocked) throw new Error('storage access blocked');
      return null;
    });
    setItem.mockImplementation(() => { throw new Error(readBlocked ? 'storage access blocked' : 'quota exceeded'); });
    fetchMock.mockImplementation(async () => response('user-a'));

    client.ensureDailyReminder('user-a');
    await flushRequests();
    client.markDailyReminderRead('user-a');
    expect(client.getReminderState('user-a').readDate).toBe('2026-10-14');
    expect(storage.size).toBe(0);

    now += 61_000;
    client.ensureDailyReminder('user-a');
    await flushRequests();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(client.getReminderState('user-a')).toEqual({ reminder: reminder(), readDate: '2026-10-14', failed: false });
    client.syncDailyReminderRead('user-a');
    expect(client.getReminderState('user-a').readDate).toBe('2026-10-14');
  });

  it('没有提醒时不会写入已读标记', () => {
    client.markDailyReminderRead('user-a');
    expect(setItem).not.toHaveBeenCalled();
    expect(client.getReminderState('user-a')).toBe(client.EMPTY_REMINDER_STATE);
  });

  it.each(['http', 'network', 'owner'] as const)('刷新%s失败时清空此前提醒，而不是展示陈旧内容', async failure => {
    fetchMock.mockResolvedValueOnce(response('user-a'));
    client.ensureDailyReminder('user-a');
    await flushRequests();
    client.markDailyReminderRead('user-a');
    now += 60_000;
    if (failure === 'network') fetchMock.mockRejectedValueOnce(new Error('offline'));
    else fetchMock.mockResolvedValueOnce(failure === 'http' ? new Response('failed', { status: 503 }) : response('user-b'));

    client.ensureDailyReminder('user-a');
    await flushRequests();
    expect(client.getReminderState('user-a')).toEqual({ reminder: null, readDate: '2026-10-14', failed: true });
  });
});
