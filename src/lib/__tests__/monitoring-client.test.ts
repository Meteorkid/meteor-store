import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let client: typeof import('../monitoring-client');
let fetchMock: ReturnType<typeof vi.fn>;
let storage: Map<string, string>;
let dispose: Array<() => void>;
const snapshot = {
  status: 'healthy', checkedAt: '2026-10-22T00:00:00.000Z', consecutiveFailures: 0, latencyMs: 10, reason: null, incidentOpenedAt: null,
  events: [{ id: 'recovery-1', kind: 'recovery', at: '2026-10-22T00:00:00.000Z', incidentId: 'incident-1', reason: null }],
};
const task = { taskId: 'pathfinder-recheck', status: 'partial', lastAttemptAt: '2026-10-22T00:00:00.000Z', finishedAt: '2026-10-22T00:00:00.000Z', lastSuccessAt: null, dataUpdatedAt: null, consecutiveAnomalies: 1,
  result: { checked: 2, skipped: 0, verified: 1, failed: 1, doomed: 0, archived: 0, reason: null, failures: [{ id: 'pf_public', reason: 'http', httpStatus: 403 }] } };
const response = (userId = 'a', monitoring = snapshot) => Response.json({ userId, monitoring, task });
const flush = () => new Promise<void>(resolve => setImmediate(resolve));

beforeEach(async () => {
  vi.resetModules();
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
  storage = new Map(); dispose = [];
  const browser = Object.assign(new EventTarget(), {
    localStorage: { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value) },
    setTimeout, clearTimeout, setInterval, clearInterval,
  });
  vi.stubGlobal('window', browser);
  vi.stubGlobal('document', Object.assign(new EventTarget(), { visibilityState: 'visible' }));
  fetchMock = vi.fn(); vi.stubGlobal('fetch', fetchMock);
  client = await import('../monitoring-client');
});
afterEach(() => {
  dispose.forEach(stop => stop());
  vi.useRealTimers(); vi.unstubAllGlobals();
});
function watch(userId = 'a') {
  const stop = client.watchMonitoring(userId);
  // cleanup模拟React effect，每份只调用一次。
  let stopped = false;
  const once = () => { if (!stopped) { stopped = true; stop(); } };
  dispose.push(once);
  return once;
}

describe('管理员监控提醒客户端', () => {
  it('没有管理员消费者就不请求，双铃铛只发一个请求并共享一分钟轮询', async () => {
    fetchMock.mockResolvedValue(response());
    client.ensureMonitoring('a');
    expect(fetchMock).not.toHaveBeenCalled();
    watch(); watch(); await flush();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(60_000); await flush();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ cache: 'no-store' });
  });
  it('缺少或不符owner的响应不能进入缓存', async () => {
    fetchMock.mockResolvedValue(response('b'));
    watch(); await flush();
    expect(client.getMonitoringState('a')).toMatchObject({ snapshot: null, failed: true });
    expect(client.getMonitoringState('a').task).toBeNull();
    expect(client.getMonitoringState(null)).toBe(client.EMPTY_MONITORING_STATE);
    expect(client.getMonitoringState('b')).toBe(client.EMPTY_MONITORING_STATE);
  });
  it('退出与换号后旧响应不能回填，重新进入同账号也不接受旧请求', async () => {
    let resolveOld!: (value: Response) => void;
    fetchMock.mockReturnValueOnce(new Promise(resolve => { resolveOld = resolve; }))
      .mockResolvedValueOnce(response('b')).mockResolvedValueOnce(response('a', { ...snapshot, events: [] }));
    const leaveA = watch(); leaveA(); watch('b'); watch('a'); await flush();
    resolveOld(response()); await flush();
    expect(client.getMonitoringState('a').snapshot?.events).toEqual([]);
    expect(client.getMonitoringState('b').snapshot?.events).toEqual(snapshot.events);
    expect(client.getMonitoringState('a').task).toEqual(task);
  });
  it('已读按账号保存，故障恢复新事件重新亮点，存储失败仍可临时标记', async () => {
    fetchMock.mockImplementation(async () => response());
    watch(); await flush();
    expect(client.hasUnreadMonitoring('a')).toBe(true);
    client.markMonitoringRead('a');
    expect(client.hasUnreadMonitoring('a')).toBe(false);
    expect(storage.get('ms_monitoring_read_v1:a')).toBe('recovery-1');
    expect(storage.has('ms_monitoring_read_v1:b')).toBe(false);
    fetchMock.mockResolvedValue(response('a', { ...snapshot, events: [{ ...snapshot.events[0], id: 'recovery-2' }] }));
    await vi.advanceTimersByTimeAsync(60_000); await flush();
    expect(client.hasUnreadMonitoring('a')).toBe(true);
    window.localStorage.setItem = () => { throw new Error('quota'); };
    client.markMonitoringRead('a');
    expect(client.hasUnreadMonitoring('a')).toBe(false);
  });
  it('读取失败清除旧内容，避免继续显示过时健康', async () => {
    fetchMock.mockResolvedValueOnce(response()).mockRejectedValueOnce(new Error('network'));
    watch(); await flush();
    await vi.advanceTimersByTimeAsync(60_000); await flush();
    expect(client.getMonitoringState('a')).toMatchObject({ snapshot: null, failed: true });
    expect(client.getMonitoringState('a').task).toBeNull();
  });
  it('任务异常不制造服务事件或铃铛未读；退出会清除任务缓存', async () => {
    fetchMock.mockResolvedValue(response('a', { ...snapshot, events: [] }));
    const leave = watch(); await flush();
    expect(client.getMonitoringState('a').task).toEqual(task);
    expect(client.getMonitoringState('a').snapshot?.status).toBe('healthy');
    expect(client.hasUnreadMonitoring('a')).toBe(false);
    leave();
    expect(client.getMonitoringState('a')).toBe(client.EMPTY_MONITORING_STATE);
  });
  it('损坏的任务响应不抹掉独立服务健康，也不回显未知字段', async () => {
    fetchMock.mockResolvedValue(Response.json({ userId: 'a', monitoring: snapshot, task: { error: '/private/secret' } }));
    watch(); await flush();
    expect(client.getMonitoringState('a')).toMatchObject({ snapshot: { status: 'healthy' }, task: { status: 'unavailable', result: null }, failed: false });
    expect(JSON.stringify(client.getMonitoringState('a'))).not.toContain('/private/secret');
  });
});
