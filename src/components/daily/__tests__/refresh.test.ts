import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DAILY_REFRESH_INTERVAL, fetchDailyEditions, subscribeDailyRefresh } from '../refresh';

const date = '2026-10-21';
let visibility = 'visible';
let dispose: (() => void) | undefined;
const fetchMock = vi.fn();
const accept = vi.fn();
const fail = vi.fn();

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-21T15:59:30Z'));
  vi.clearAllMocks();
  visibility = 'visible';
  vi.stubGlobal('window', Object.assign(new EventTarget(), { setTimeout, clearTimeout }));
  vi.stubGlobal('document', Object.defineProperty(new EventTarget(), 'visibilityState', { get: () => visibility }));
  vi.stubGlobal('fetch', fetchMock);
  fetchMock.mockResolvedValue({ ok: true, json: async () => ({ date, editions: [] }) });
});
afterEach(() => { dispose?.(); dispose = undefined; vi.useRealTimers(); vi.unstubAllGlobals(); });

describe('日刊恢复阅读刷新', () => {
  it('连续 focus/visibility 只请求一次当前日期，跨午夜也不跳到另一期', async () => {
    dispose = subscribeDailyRefresh(date, accept, fail);
    window.dispatchEvent(new Event('focus'));
    expect(fetchMock).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(DAILY_REFRESH_INTERVAL);
    document.dispatchEvent(new Event('visibilitychange'));
    window.dispatchEvent(new Event('focus'));
    await vi.advanceTimersByTimeAsync(0);
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith('/api/daily?date=2026-10-21', expect.objectContaining({ cache: 'no-store' }));
    expect(accept).toHaveBeenCalledWith([]);
    window.dispatchEvent(new Event('focus'));
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('隐藏状态不刷新，失败保留现有内容并允许下一次恢复重试', async () => {
    dispose = subscribeDailyRefresh(date, accept, fail);
    await vi.advanceTimersByTimeAsync(DAILY_REFRESH_INTERVAL);
    visibility = 'hidden';
    document.dispatchEvent(new Event('visibilitychange'));
    expect(fetchMock).not.toHaveBeenCalled();
    visibility = 'visible';
    fetchMock.mockResolvedValueOnce({ ok: false });
    window.dispatchEvent(new Event('focus'));
    await vi.advanceTimersByTimeAsync(0);
    expect(fail).toHaveBeenCalledOnce();
    expect(accept).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(DAILY_REFRESH_INTERVAL);
    document.dispatchEvent(new Event('visibilitychange'));
    await vi.advanceTimersByTimeAsync(0);
    expect(accept).toHaveBeenCalledOnce();
  });

  it('卸载或切日期中止旧请求，晚到响应不覆盖新页面', async () => {
    let finish!: (value: unknown) => void;
    fetchMock.mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }));
    dispose = subscribeDailyRefresh(date, accept, fail);
    await vi.advanceTimersByTimeAsync(DAILY_REFRESH_INTERVAL);
    window.dispatchEvent(new Event('focus'));
    const signal = fetchMock.mock.calls[0][1].signal as AbortSignal;
    dispose();
    expect(signal.aborted).toBe(true);
    finish({ ok: true, json: async () => ({ date, editions: [] }) });
    await vi.advanceTimersByTimeAsync(0);
    expect(accept).not.toHaveBeenCalled();
    window.dispatchEvent(new Event('focus'));
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('不同期次或缺失正文数组的响应被拒绝', async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ date: '2026-10-22', editions: [] }) });
    await expect(fetchDailyEditions(date)).rejects.toThrow('Daily edition changed');
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ date }) });
    await expect(fetchDailyEditions(date)).rejects.toThrow('Daily edition changed');
  });
});
