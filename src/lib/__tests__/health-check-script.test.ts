import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { createServer, type Server, type ServerResponse } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MonitoringFileSchema } from '../monitoring-types';

const script = join(process.cwd(), 'scripts/health-check.sh');
const rawSecret = 'password=private "orders"\nprivate-path';

describe('一分钟健康检查脚本', () => {
  let server: Server;
  let serverUrl: string;
  let tempDir: string;
  let stateFile: string;
  let mode: 'healthy' | 'http' | 'disconnect' | 'bad-json' | 'semantic' | 'missing-check' | 'hold';
  let held: ServerResponse | undefined;
  let onRequest: (() => void) | undefined;
  let externalRequests: number;

  const healthyPayload = () => ({ status: 'healthy', timestamp: new Date().toISOString(),
    checks: { self: { status: 'ok' }, database: { status: 'ok' }, redis: { status: 'ok' } } });
  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'meteor-health-check-'));
    stateFile = join(tempDir, 'monitoring', 'health.json');
    mode = 'healthy'; externalRequests = 0; held = undefined; onRequest = undefined;
    server = createServer((req, res) => {
      if (req.url !== '/api/health' || req.method !== 'GET') {
        externalRequests += 1; res.writeHead(200).end('{}'); return;
      }
      onRequest?.();
      if (mode === 'disconnect') { req.socket.destroy(); return; }
      if (mode === 'hold') { held = res; return; }
      res.writeHead(mode === 'http' ? 503 : 200, { 'Content-Type': 'application/json' });
      if (mode === 'bad-json') { res.end('{'); return; }
      const payload = healthyPayload();
      if (mode === 'semantic') Object.assign(payload.checks.database, { status: 'error', error: rawSecret });
      if (mode === 'missing-check') delete (payload.checks as Partial<typeof payload.checks>).redis;
      res.end(JSON.stringify(payload));
    });
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('测试服务器未监听TCP端口');
    serverUrl = `http://127.0.0.1:${address.port}`;
  });
  afterEach(async () => {
    server.closeAllConnections();
    await new Promise<void>(resolve => server.close(() => resolve()));
    await rm(tempDir, { recursive: true, force: true });
  });
  function run(extra: Record<string, string> = {}): Promise<{ code: number; stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      execFile('bash', [script, serverUrl], {
        timeout: 8000,
        // 不继承生产配置、密钥或代理；旧webhook变量仅指向隔离本机哨兵。
        env: { NODE_ENV: 'test', PATH: process.env.PATH, HEALTH_CHECK_NODE: process.execPath, HEALTH_CHECK_STATE_FILE: stateFile,
          HEALTH_ALERT_WEBHOOK: `${serverUrl}/webhook`, NO_PROXY: '127.0.0.1', ...extra },
      }, (error, stdout, stderr) => {
        if (error && (typeof error.code !== 'number' || error.killed)) { reject(error); return; }
        resolve({ code: typeof error?.code === 'number' ? error.code : 0, stdout, stderr });
      });
    });
  }
  async function state() { return MonitoringFileSchema.parse(JSON.parse(await readFile(stateFile, 'utf8'))); }

  it('健康成功退出，私有状态可被应用读取，旧webhook配置不会触发外发', async () => {
    expect((await run()).code).toBe(0);
    expect(await state()).toMatchObject({ status: 'healthy', consecutiveFailures: 0, events: [], incident: null });
    expect((await stat(stateFile)).mode & 0o777).toBe(0o600);
    expect((await stat(join(tempDir, 'monitoring'))).mode & 0o777).toBe(0o700);
    expect(externalRequests).toBe(0);
  });
  it('三次失败才告警，持续故障去重，恢复只记录一次', async () => {
    mode = 'http';
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      expect((await run()).code).toBe(1);
      expect(await state()).toMatchObject({ status: 'suspect', consecutiveFailures: attempt, events: [] });
    }
    await run();
    const failure = await state();
    expect(failure.status).toBe('down'); expect(failure.events.map(event => event.kind)).toEqual(['failure']);
    await run();
    expect((await state()).events).toEqual(failure.events);
    mode = 'healthy'; await run(); await run();
    const recovered = await state();
    expect(recovered.events.map(event => event.kind)).toEqual(['recovery', 'failure']);
    expect(recovered.events[0].incidentId).toBe(failure.incident?.id);
    expect(recovered.incident).toBeNull(); expect(externalRequests).toBe(0);
  });
  it.each([
    ['bad-json', 'invalid-response'], ['semantic', 'degraded'], ['missing-check', 'invalid-response'], ['disconnect', 'network'],
  ] as const)('拒绝%s，不因HTTP200误报健康且不存原始错误', async (nextMode, reason) => {
    mode = nextMode;
    const result = await run({ HEALTH_CHECK_FAILURE_THRESHOLD: '1' });
    expect(result.code).toBe(1);
    expect(await state()).toMatchObject({ status: 'down', lastResult: { healthy: false, reason } });
    expect(await readFile(stateFile, 'utf8')).not.toContain(rawSecret);
    expect(result.stdout + result.stderr).not.toContain(rawSecret);
  });
  it('短暂失败恢复不会制造故障或恢复提醒', async () => {
    mode = 'http'; await run(); mode = 'healthy'; await run();
    expect((await state()).events).toEqual([]);
  });
  it('并发执行被系统锁跳过；正常结束后下一轮可继续', async () => {
    mode = 'hold';
    const started = new Promise<void>(resolve => { onRequest = resolve; });
    const first = run(); await started;
    expect(await run()).toEqual({ code: 0, stdout: '', stderr: '' });
    held!.writeHead(503).end('{}');
    expect((await first).code).toBe(1);
    mode = 'http'; await run();
    expect((await state()).consecutiveFailures).toBe(2);
  });
  it('五秒超时终止悬挂检查并记录网络故障', async () => {
    mode = 'hold';
    const result = await run();
    expect(result.code).toBe(1);
    const current = await state();
    expect(current.lastResult.reason).toBe('network');
    expect(current.lastResult.latencyMs).toBeGreaterThanOrEqual(4900);
    expect(current.lastResult.latencyMs).toBeLessThan(7000);
  }, 10_000);
  it('状态损坏和配置错误不覆盖原记录，并以2退出', async () => {
    await run();
    await writeFile(stateFile, '{damaged');
    expect((await run()).code).toBe(2);
    expect(await readFile(stateFile, 'utf8')).toBe('{damaged');
    expect((await run({ HEALTH_CHECK_FAILURE_THRESHOLD: '0' })).code).toBe(2);
  });
  it('历史仅保留最新40条且每次恢复关联原故障', async () => {
    const { advanceState } = await import(pathToFileURL(join(process.cwd(), 'scripts/health-check.mjs')).href);
    let value = null;
    for (let index = 0; index < 25; index += 1) {
      value = advanceState(value, { healthy: false, reason: 'network', latencyMs: 1 }, 1);
      value = advanceState(value, { healthy: true, reason: null, latencyMs: 1 }, 1);
    }
    const parsed = MonitoringFileSchema.parse(value);
    expect(parsed.events).toHaveLength(40);
    expect(parsed.events[0].kind).toBe('recovery');
    expect(parsed.events[0].incidentId).toBe(parsed.events[1].incidentId);
  });
});
