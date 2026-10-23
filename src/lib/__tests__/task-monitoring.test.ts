import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { readRecheckSnapshot } from '../task-monitoring';

const now = Date.parse('2026-10-22T08:00:00.000Z');
const at = new Date(now).toISOString();
const base = { version: 1, taskId: 'pathfinder-recheck', status: 'ok', lastAttemptAt: at, finishedAt: at, lastSuccessAt: at, dataUpdatedAt: null, consecutiveAnomalies: 0,
  result: { checked: 0, skipped: 0, verified: 0, failed: 0, doomed: 0, archived: 0, reason: null, failures: [] } };
let directory: string;
let stateFile: string;
beforeEach(async () => { directory = await mkdtemp(join(tmpdir(), 'task-monitoring-')); stateFile = join(directory, 'state.json'); });
afterEach(async () => { await rm(directory, { recursive: true, force: true }); });
const write = (value: unknown) => writeFile(stateFile, JSON.stringify(value));
const read = () => readRecheckSnapshot({ stateFile, now });

describe('管理员任务状态读取', () => {
  it('缺失、损坏、超限状态分别可见，不假装成功', async () => {
    expect((await read()).status).toBe('not-configured');
    await writeFile(stateFile, '{private-secret');
    expect(await read()).toMatchObject({ status: 'unavailable', result: null });
    await writeFile(stateFile, 'x'.repeat(128 * 1024 + 1));
    expect((await read()).status).toBe('unavailable');
  });
  it('仅白名单进入客户端，字段矛盾拒绝', async () => {
    await write({ ...base, url: 'private-secret', result: { ...base.result, error: 'private-secret' } });
    expect((await read()).status).toBe('ok');
    expect(JSON.stringify(await read())).not.toMatch(/private-secret|version/);
    await write({ ...base, status: 'failed' });
    expect((await read()).status).toBe('unavailable');
  });
  it('每日记录超过 30 小时或时间异常变过期，运行超一小时也变过期', async () => {
    await write({ ...base, lastAttemptAt: new Date(now - 30 * 60 * 60_000 - 1).toISOString() });
    expect((await read()).status).toBe('stale');
    await write({ ...base, lastSuccessAt: new Date(now + 61_000).toISOString() });
    expect((await read()).status).toBe('stale');
    await write({ ...base, status: 'running', result: null, finishedAt: null, lastAttemptAt: new Date(now - 3_600_001).toISOString() });
    expect((await read()).status).toBe('stale');
  });
});
