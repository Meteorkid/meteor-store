import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { dailyDate } from '../types';

const hooks = vi.hoisted(() => ({ effect: null as (() => (() => void) | undefined) | null, subscriptions: [] as (() => void)[] }));
vi.mock('react', async importOriginal => ({
  ...await importOriginal<typeof import('react')>(),
  useCallback: (callback: unknown) => callback,
  useEffect: (effect: () => (() => void) | undefined) => { hooks.effect = effect; },
  useSyncExternalStore: (subscribe: (listener: () => void) => (() => void), snapshot: () => unknown) => {
    hooks.subscriptions.push(subscribe(() => {})); return snapshot();
  },
}));
let client: typeof import('../panel-client');
let cleanup: (() => void) | undefined;
let fetchMock: ReturnType<typeof vi.fn>;
const flush = () => new Promise<void>(resolve => setImmediate(resolve));
function render(active: boolean) {
  cleanup?.(); hooks.subscriptions.forEach(stop => stop()); hooks.subscriptions = [];
  client.useDailyPanel('A', false, active);
  cleanup = hooks.effect?.();
}

beforeEach(async () => {
  vi.resetModules(); vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
  vi.setSystemTime(new Date('2026-10-24T01:00:00Z'));
  cleanup = undefined; hooks.effect = null; hooks.subscriptions = [];
  vi.stubGlobal('window', Object.assign(new EventTarget(), { setInterval, clearInterval }));
  vi.stubGlobal('document', Object.assign(new EventTarget(), { visibilityState: 'visible' }));
  vi.stubGlobal('localStorage', { getItem: () => null, setItem: vi.fn() });
  fetchMock = vi.fn(async (url: string) => Response.json(url.startsWith('/api/daily/preview')
    ? { date: dailyDate(), updatedAt: null, editions: [] }
    : { userId: 'A', settings: null, revision: null, followedChannels: ['english'] }));
  vi.stubGlobal('fetch', fetchMock);
  client = await import('../panel-client');
});
afterEach(async () => {
  cleanup?.(); hooks.subscriptions.forEach(stop => stop()); await flush();
  vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals();
});

describe('保留实例的每日面板active边界', () => {
  it('初次隐藏不拉取内容或设置，也不注册focus/storage/interval', async () => {
    const listen = vi.spyOn(window, 'addEventListener');
    render(false); await flush();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(listen).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('关闭或切分区后解除监听，隐藏期间focus/storage和一分钟计时不会请求', async () => {
    const remove = vi.spyOn(window, 'removeEventListener');
    render(true); await flush(); expect(fetchMock).toHaveBeenCalledTimes(2);
    render(false); fetchMock.mockClear();
    window.dispatchEvent(new Event('focus')); window.dispatchEvent(new Event('storage'));
    document.dispatchEvent(new Event('visibilitychange'));
    await vi.advanceTimersByTimeAsync(61_000); await flush();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(remove.mock.calls.map(call => call[0])).toEqual(expect.arrayContaining(['focus', 'storage']));
    expect(vi.getTimerCount()).toBe(0);
  });

  it('重开会确认云端设置，预览仍复用有效TTL，不自动清保存冲突', async () => {
    render(true); await flush();
    render(false); fetchMock.mockClear();
    render(true); await flush();
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0][0]).toBe('/api/daily/panel-preferences');
  });
});
