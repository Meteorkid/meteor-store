import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { readMonitoringSnapshot } from '../monitoring';

const now = Date.parse('2026-10-22T08:00:00.000Z');
const checkedAt = new Date(now).toISOString();
const base = {
  version: 1, checkedAt, status: 'healthy', consecutiveFailures: 0,
  lastResult: { healthy: true, reason: null, latencyMs: 10 }, incident: null, events: [],
};
let directory: string;
let stateFile: string;
beforeEach(async () => {
  directory = await mkdtemp(join(tmpdir(), 'monitoring-read-'));
  stateFile = join(directory, 'health.json');
});
afterEach(async () => { await rm(directory, { recursive: true, force: true }); });
const write = (value: unknown) => writeFile(stateFile, JSON.stringify(value));
const read = () => readMonitoringSnapshot({ stateFile, now });

describe('站内监控状态读取', () => {
  it('未运行任务不显示健康；损坏和过大状态不泄漏内容', async () => {
    expect((await read()).status).toBe('not-configured');
    await writeFile(stateFile, '{secret');
    expect(await read()).toMatchObject({ status: 'unavailable', events: [], checkedAt: null });
    await writeFile(stateFile, 'x'.repeat(128 * 1024 + 1));
    expect((await read()).status).toBe('unavailable');
  });
  it('只暴露白名单字段，不带原始错误、地址或任意附加文本', async () => {
    await write({ ...base, error: 'secret', url: 'https://secret', lastResult: { ...base.lastResult, error: 'secret' } });
    const snapshot = await read();
    expect(snapshot).toEqual({ status: 'healthy', checkedAt, consecutiveFailures: 0, latencyMs: 10, reason: null, incidentOpenedAt: null, events: [] });
    expect(JSON.stringify(snapshot)).not.toContain('secret');
  });
  it.each([-181_000, 61_000])('过期或未来时间记录不能报健康：%s', async offset => {
    await write({ ...base, checkedAt: new Date(now + offset).toISOString() });
    expect((await read()).status).toBe('stale');
  });
  it('健康字段自相矛盾时拒绝，故障与恢复历史保持', async () => {
    await write({ ...base, consecutiveFailures: 3 });
    expect((await read()).status).toBe('unavailable');
    const event = { id: 'event-1', kind: 'failure', at: checkedAt, incidentId: 'incident-1', reason: 'network' };
    await write({ ...base, status: 'down', consecutiveFailures: 3,
      lastResult: { healthy: false, reason: 'network', latencyMs: 5000 },
      incident: { id: 'incident-1', openedAt: checkedAt, reason: 'network' }, events: [event] });
    expect(await read()).toMatchObject({ status: 'down', incidentOpenedAt: checkedAt, events: [event] });
  });
});
