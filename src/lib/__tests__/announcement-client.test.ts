import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Announcement } from '../announcement-text';

let client: typeof import('../announcement-client');
let fetchMock: ReturnType<typeof vi.fn>;
let storage: Map<string, string>;
let stops: Array<() => void>;
const readKey = 'ms_announcements_read_at';
const item = (id = 'a', publishedAt = '2026-10-23T01:00:00.000Z'): Announcement => ({
  id, titleZh: id, titleEn: id, bodyZh: '公告正文', bodyEn: 'Announcement', published: true,
  publishedAt, createdAt: publishedAt, updatedAt: publishedAt,
});
const response = (items: Announcement[] = [item()]) => Response.json({ announcements: items });
const flush = () => new Promise<void>(resolve => setImmediate(resolve));
function watch() { const stop = client.watchAnnouncements(); stops.push(stop); return stop; }
function storageEvent() {
  const event = new Event('storage');
  Object.defineProperty(event, 'key', { value: readKey });
  window.dispatchEvent(event);
}

beforeEach(async () => {
  vi.resetModules();
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
  vi.setSystemTime(new Date('2030-01-01T00:00:00Z'));
  storage = new Map(); stops = [];
  vi.stubGlobal('window', Object.assign(new EventTarget(), {
    localStorage: { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value) },
  }));
  vi.stubGlobal('document', Object.assign(new EventTarget(), { visibilityState: 'visible' }));
  fetchMock = vi.fn(); vi.stubGlobal('fetch', fetchMock);
  client = await import('../announcement-client');
});
afterEach(async () => {
  stops.forEach(stop => stop());
  await flush();
  vi.useRealTimers(); vi.unstubAllGlobals();
});

describe('系统公告共享客户端', () => {
  it('双铃铛共享在途请求和成功TTL；打开或聚焦不会标为已读', async () => {
    fetchMock.mockResolvedValue(response());
    watch(); watch(); await flush();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(client.hasUnreadAnnouncements()).toBe(true);
    expect(storage.has(readKey)).toBe(false);
    await client.ensureAnnouncements(); window.dispatchEvent(new Event('focus')); await flush();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(60_000);
    window.dispatchEvent(new Event('focus')); await flush();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ cache: 'no-store' });
    expect(storage.has(readKey)).toBe(false);
  });

  it('首次503保持未知内容与失败，重试成功空列表才显示真实空', async () => {
    fetchMock.mockResolvedValueOnce(new Response('', { status: 503 })).mockResolvedValueOnce(response([]));
    await client.ensureAnnouncements();
    expect(client.getAnnouncementState()).toMatchObject({ items: null, failed: true, loading: false });
    await client.ensureAnnouncements();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(client.getAnnouncementState()).toMatchObject({ items: [], failed: false, loading: false });
  });

  it('刷新失败保留最近成功内容，显式重试可越过成功TTL', async () => {
    fetchMock.mockResolvedValueOnce(response()).mockRejectedValueOnce(new Error('network')).mockResolvedValueOnce(response([item('b')]));
    await client.ensureAnnouncements();
    await client.ensureAnnouncements(true);
    expect(client.getAnnouncementState()).toMatchObject({ items: [item()], failed: true, loading: false });
    await client.ensureAnnouncements(true);
    expect(client.getAnnouncementState().items?.[0].id).toBe('b');
    expect(client.getAnnouncementState().failed).toBe(false);
  });

  it('损坏响应不伪装成功空列表，也不替换旧内容', async () => {
    fetchMock.mockResolvedValueOnce(response()).mockResolvedValueOnce(Response.json({ status: 'ok' }));
    await client.ensureAnnouncements(); await client.ensureAnnouncements(true);
    expect(client.getAnnouncementState()).toMatchObject({ items: [item()], failed: true });
  });

  it('15秒超时释放pending，下一次读取可成功且旧迟到响应不覆盖它', async () => {
    let finishOld!: (value: Response) => void;
    fetchMock.mockReturnValueOnce(new Promise(resolve => { finishOld = resolve; })).mockResolvedValueOnce(response([item('new')]));
    const first = client.ensureAnnouncements();
    const signal = fetchMock.mock.calls[0][1].signal as AbortSignal;
    await vi.advanceTimersByTimeAsync(15_000); await first;
    expect(signal.aborted).toBe(true);
    expect(client.getAnnouncementState()).toMatchObject({ failed: true, loading: false, items: null });
    await client.ensureAnnouncements();
    finishOld(response([item('old')])); await flush();
    expect(client.getAnnouncementState().items?.[0].id).toBe('new');
    expect(client.getAnnouncementState().failed).toBe(false);
  });

  it('最后一个消费者卸载会取消旧请求，迟到响应不能覆盖重新挂载后的结果', async () => {
    let finishOld!: (value: Response) => void;
    fetchMock.mockReturnValueOnce(new Promise(resolve => { finishOld = resolve; })).mockResolvedValueOnce(response([item('new')]));
    const leave = watch(); const signal = fetchMock.mock.calls[0][1].signal as AbortSignal;
    leave(); expect(signal.aborted).toBe(true);
    watch(); await flush(); finishOld(response([item('old')])); await flush();
    expect(client.getAnnouncementState().items?.[0].id).toBe('new');
  });

  it('显式已读只推进至渲染快照的服务器时间，不采用浏览器时钟或后台新公告', async () => {
    const older = item('old', '2026-10-23T01:00:00.000Z');
    const newer = item('new', '2026-10-24T01:00:00.000Z');
    fetchMock.mockResolvedValueOnce(response([older])).mockResolvedValueOnce(response([newer, older]));
    await client.ensureAnnouncements(); const rendered = client.getAnnouncementState().items!;
    await client.ensureAnnouncements(true); client.markAnnouncementsRead(rendered);
    expect(storage.get(readKey)).toBe(older.publishedAt);
    expect(client.hasUnreadAnnouncements()).toBe(true);
    client.markAnnouncementsRead(client.getAnnouncementState().items!);
    expect(storage.get(readKey)).toBe(newer.publishedAt);
    expect(client.hasUnreadAnnouncements()).toBe(false);
  });

  it('存储和当前标签页已读边界均只前进，时区等价时间先归一化', async () => {
    const older = item('old', '2026-10-23T09:00:00+08:00');
    fetchMock.mockResolvedValue(response([older])); watch(); await flush();
    storage.set(readKey, '2026-10-24T01:00:00.000Z'); storageEvent();
    client.markAnnouncementsRead([older]);
    expect(storage.get(readKey)).toBe('2026-10-24T01:00:00.000Z');
    storage.set(readKey, '2026-10-22T00:00:00.000Z'); storageEvent();
    expect(client.getAnnouncementState().readAt).toBe('2026-10-24T01:00:00.000Z');
    expect(client.announcementTimestamp(older)).toBe('2026-10-23T01:00:00.000Z');
  });

  it('storage事件通知两个订阅者，存储不可用仍能在当前页面标记已读', async () => {
    const first = vi.fn(); const second = vi.fn();
    stops.push(client.subscribeAnnouncements(first), client.subscribeAnnouncements(second));
    fetchMock.mockResolvedValue(response()); watch(); await flush();
    first.mockClear(); second.mockClear();
    storage.set(readKey, '2026-10-23T01:00:00.000Z'); storageEvent();
    expect(first).toHaveBeenCalledOnce(); expect(second).toHaveBeenCalledOnce();
    window.localStorage.setItem = () => { throw new Error('quota'); };
    const later = item('later', '2026-10-24T01:00:00.000Z');
    fetchMock.mockResolvedValue(response([later])); await client.ensureAnnouncements(true);
    client.markAnnouncementsRead(client.getAnnouncementState().items!); client.syncAnnouncementsRead();
    expect(client.getAnnouncementState().readAt).toBe(later.publishedAt);
    expect(client.hasUnreadAnnouncements()).toBe(false);
  });

  it('较新的storage事件晚于旧值覆盖到达时，仍恢复较新边界供新标签页读取', () => {
    storage.set(readKey, '2026-10-22T00:00:00.000Z');
    client.syncAnnouncementsRead('2026-10-24T01:00:00.000Z');
    expect(client.getAnnouncementState().readAt).toBe('2026-10-24T01:00:00.000Z');
    expect(storage.get(readKey)).toBe('2026-10-24T01:00:00.000Z');
  });

  it('在途强制重试仍去重，空列表没有可提前写入的已读时间', async () => {
    let finish!: (value: Response) => void;
    fetchMock.mockReturnValueOnce(new Promise(resolve => { finish = resolve; }));
    const first = client.ensureAnnouncements(); const second = client.ensureAnnouncements(true);
    expect(first).toBe(second); expect(fetchMock).toHaveBeenCalledOnce();
    finish(response([])); await first; client.markAnnouncementsRead([]);
    expect(storage.has(readKey)).toBe(false);
  });
});
