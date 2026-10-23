import { execFile } from 'node:child_process';
import { createServer, type Server } from 'node:http';
import { lstat, mkdtemp, readFile, readdir, rm, stat, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RecheckFileSchema } from '../task-monitoring-types';

const script = join(process.cwd(), 'scripts/recheck-pathfinder-issues.mjs');
const now = '2026-10-22T08:00:00.000Z';
const row = (id: string, canonicalUrl = `https://github.com/fixture/repo/issues/${id.replace(/\D/g, '') || '1'}`) => ({ id, canonical_url: canonicalUrl, title_en: 'private-title' });
let directory: string;
let stateFile: string;
let server: Server;
let serverUrl: string;
let responseByIssue: Record<string, number | 'network' | 'invalid'>;
let rows: ReturnType<typeof row>[];
let sql: ReturnType<typeof vi.fn> & { end: ReturnType<typeof vi.fn> };
let output: { log: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };

beforeEach(async () => {
  directory = await mkdtemp(join(tmpdir(), 'meteor-recheck-'));
  stateFile = join(directory, 'monitoring/pathfinder-recheck.json');
  rows = [row('pf_1'), row('pf_2')]; responseByIssue = {};
  output = { log: vi.fn(), error: vi.fn() };
  sql = Object.assign(vi.fn(async (parts: TemplateStringsArray) => parts[0].includes('select') ? rows : [{ id: 'pf_1' }]), { end: vi.fn() });
  server = createServer((request, response) => {
    const issue = request.url?.split('/').at(-1) ?? '';
    const mode = responseByIssue[issue] ?? 200;
    if (mode === 'network') { request.socket.destroy(); return; }
    response.writeHead(typeof mode === 'number' ? mode : 200, { 'Content-Type': 'application/json' });
    response.end(mode === 'invalid' ? '{secret-token' : JSON.stringify({ state: issue === '1' ? 'closed' : 'open', body: 'secret-token' }));
  });
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Missing fixture server');
  serverUrl = `http://127.0.0.1:${address.port}`;
});
afterEach(async () => {
  server.closeAllConnections();
  await new Promise<void>(resolve => server.close(() => resolve()));
  await rm(directory, { recursive: true, force: true });
});
async function run(args = ['--apply', '--quiet'], at = now, options: { saveState?: (path: string, state: unknown) => Promise<void> } = {}) {
  const { main } = await import(pathToFileURL(script).href);
  return main({ args, env: { DATABASE_URL: 'postgres://fixture', GITHUB_TOKEN: 'fake-token', PATHFINDER_RECHECK_STATE_FILE: stateFile },
    now: () => at, createSql: () => sql, output, ...options,
    fetch: (url: string, init: RequestInit) => {
      expect(url).toMatch(/^https:\/\/api\.github\.com\/repos\/fixture\/repo\/issues\/\d+$/);
      // 所有 GitHub 请求都映射到隔离 HTTP 夹具，没有真实凭据或外部请求。
      return fetch(`${serverUrl}${new URL(url).pathname}`, init);
    },
  });
}
async function state() { return RecheckFileSchema.parse(JSON.parse(await readFile(stateFile, 'utf8'))); }
function summary() { return JSON.parse((output.error.mock.calls.at(-1) ?? output.log.mock.calls.at(-1))![0]); }

describe('开源回查任务结果与持久状态', () => {
  it('全失败明确失败并非零退出，quiet 保留有限公开 ID/状态且不归档', async () => {
    rows = Array.from({ length: 8 }, (_, index) => row(`pf_${index + 1}`));
    responseByIssue = Object.fromEntries(rows.map((_, index) => [String(index + 1), 403]));
    expect(await run()).toBe(1);
    expect(summary()).toMatchObject({ status: 'failed', success: false, checked: 8, verified: 0, failed: 8, archived: 0 });
    expect(summary().failures).toHaveLength(5);
    expect(summary().failures[0]).toEqual({ id: 'pf_1', reason: 'http', httpStatus: 403 });
    expect(sql).toHaveBeenCalledTimes(1);
    expect(output.error).toHaveBeenCalledTimes(1);
    expect(await state()).toMatchObject({ status: 'failed', lastAttemptAt: now, lastSuccessAt: null, consecutiveAnomalies: 1 });
    expect(JSON.stringify(output.error.mock.calls) + await readFile(stateFile, 'utf8')).not.toMatch(/fake-token|secret-token|private-title|postgres/);
  });
  it('部分失败只归档核验过的条目，后续重跑成功恢复连续异常', async () => {
    expect(await run()).toBe(0);
    const first = await state();
    responseByIssue = { '2': 503 };
    const later = '2026-10-23T08:00:00.000Z';
    expect(await run(undefined, later)).toBe(1);
    expect(await state()).toMatchObject({ status: 'partial', lastSuccessAt: first.lastSuccessAt, dataUpdatedAt: later, consecutiveAnomalies: 1,
      result: { verified: 1, failed: 1, archived: 1 } });
    expect(sql.mock.calls.at(-1)?.slice(1)).toEqual([later, later, ['pf_1']]);
    responseByIssue = {};
    expect(await run(undefined, '2026-10-24T08:00:00.000Z')).toBe(0);
    expect(await state()).toMatchObject({ status: 'ok', lastSuccessAt: '2026-10-24T08:00:00.000Z', consecutiveAnomalies: 0 });
  });
  it.each(['network', 'invalid'] as const)('%s 按条记录失败，仍完成其它条目核验', async mode => {
    responseByIssue = { '2': mode };
    expect(await run()).toBe(1);
    expect(await state()).toMatchObject({ status: 'partial', result: { verified: 1, failed: 1,
      failures: [{ id: 'pf_2', reason: mode === 'network' ? 'network' : 'invalid-response' }] } });
  });
  it.each([{ fixture: [] }, { fixture: [row('pf_repo', 'https://github.com/fixture/repo')] }])('空集或全跳过也是明确完成，不伪造归档时间', async ({ fixture }) => {
    rows = fixture;
    expect(await run()).toBe(0);
    expect(await state()).toMatchObject({ status: 'ok', lastSuccessAt: now, dataUpdatedAt: null, result: { checked: fixture.length, skipped: fixture.length, verified: 0, failed: 0 } });
  });
  it('dry-run 不写库或覆盖正式状态，数据库异常保留之前完整成功', async () => {
    await run();
    const previous = await readFile(stateFile, 'utf8');
    sql.mockClear();
    expect(await run(['--quiet'])).toBe(0);
    expect(sql).toHaveBeenCalledTimes(1);
    expect(await readFile(stateFile, 'utf8')).toBe(previous);
    sql.mockRejectedValue(new Error('postgres://private-secret'));
    expect(await run(undefined, '2026-10-23T08:00:00.000Z')).toBe(1);
    expect(await state()).toMatchObject({ status: 'failed', lastSuccessAt: now, result: { reason: 'database' } });
    expect(JSON.stringify(output.error.mock.calls)).not.toContain('private-secret');
  });
  it('目录 700/文件 600，原子替换没有残留临时文件', async () => {
    await run();
    expect((await stat(stateFile)).mode & 0o777).toBe(0o600);
    expect((await stat(join(directory, 'monitoring'))).mode & 0o777).toBe(0o700);
    const previous = await import('node:fs/promises').then(fs => fs.open(stateFile, 'r'));
    responseByIssue = { '1': 403, '2': 403 };
    await run();
    expect(JSON.parse(await previous.readFile('utf8')).status).toBe('ok');
    await previous.close();
    expect((await state()).status).toBe('failed');
    expect(await readdir(join(directory, 'monitoring'))).toEqual(['pathfinder-recheck.json']);
  });
  it('损坏 JSON 先私有隔离再继续核验；业务失败不伪造历史成功', async () => {
    await run();
    await writeFile(stateFile, '{damaged');
    sql.mockClear(); output.log.mockClear(); output.error.mockClear();
    responseByIssue = { '1': 403, '2': 403 };
    expect(await run()).toBe(2);
    expect(sql).toHaveBeenCalledTimes(1);
    expect(await state()).toMatchObject({ status: 'failed', lastSuccessAt: null, dataUpdatedAt: null, consecutiveAnomalies: 1 });
    expect(summary()).toMatchObject({ status: 'failed', success: false, error: 'task-state-reset', stateRecorded: true, checked: 2, failed: 2 });
    expect(output.error).toHaveBeenCalledTimes(1); expect(output.log).not.toHaveBeenCalled();
    const files = await readdir(join(directory, 'monitoring'));
    const backup = files.find(name => name.endsWith('.corrupt'));
    expect(backup).toBeDefined();
    expect(await readFile(join(directory, 'monitoring', backup!), 'utf8')).toBe('{damaged');
    expect((await stat(join(directory, 'monitoring', backup!))).mode & 0o777).toBe(0o600);
    expect((await stat(stateFile)).mode & 0o777).toBe(0o600);
    expect((await stat(join(directory, 'monitoring'))).mode & 0o777).toBe(0o700);
  });
  it('坏 schema 恢复后只记录本次真实成功，记录故障仍以 2 退出', async () => {
    await run();
    const corrupt = '{"lastSuccessAt":"2099-01-01T00:00:00.000Z","secret":"private"}';
    await writeFile(stateFile, corrupt);
    sql.mockClear(); output.log.mockClear(); output.error.mockClear();
    const later = '2026-10-23T08:00:00.000Z';
    expect(await run(undefined, later)).toBe(2);
    expect(sql).toHaveBeenCalledTimes(2);
    expect(await state()).toMatchObject({ status: 'ok', lastSuccessAt: later, dataUpdatedAt: later });
    expect(summary()).toMatchObject({ status: 'ok', success: false, error: 'task-state-reset', stateRecorded: true, checked: 2, archived: 1 });
    expect(output.error).toHaveBeenCalledTimes(1); expect(output.log).not.toHaveBeenCalled();
    const backup = (await readdir(join(directory, 'monitoring'))).find(name => name.endsWith('.corrupt'))!;
    expect(await readFile(join(directory, 'monitoring', backup), 'utf8')).toBe(corrupt);
    expect(JSON.stringify(output.error.mock.calls)).not.toContain('private');
    output.error.mockClear(); output.log.mockClear();
    expect(await run(undefined, '2026-10-24T08:00:00.000Z')).toBe(0);
    expect(summary()).toMatchObject({ status: 'ok', success: true, stateRecorded: true });
    expect(summary()).not.toHaveProperty('error');
  });
  it.each([false, true])('只读存储 EROFS 仍完成 HTTP/SQL，业务失败=%s 的计数保留且单行退出 2', async failBusiness => {
    await run();
    const previous = await readFile(stateFile, 'utf8');
    const saveState = vi.fn(async () => { throw Object.assign(new Error('/private/secret'), { code: 'EROFS' }); });
    sql.mockClear(); output.log.mockClear(); output.error.mockClear();
    if (failBusiness) responseByIssue = { '1': 403, '2': 403 };
    expect(await run(undefined, '2026-10-23T08:00:00.000Z', { saveState })).toBe(2);
    expect(sql).toHaveBeenCalledTimes(failBusiness ? 1 : 2);
    expect(saveState).toHaveBeenCalledTimes(2);
    expect(summary()).toMatchObject({ status: failBusiness ? 'failed' : 'ok', success: false, error: 'task-state-unavailable',
      stateRecorded: false, checked: 2, verified: failBusiness ? 0 : 2, failed: failBusiness ? 2 : 0, archived: failBusiness ? 0 : 1 });
    expect(output.error).toHaveBeenCalledTimes(1); expect(output.log).not.toHaveBeenCalled();
    expect(JSON.stringify(output.error.mock.calls)).not.toContain('/private/secret');
    expect(await readFile(stateFile, 'utf8')).toBe(previous);
  });
  it('真实不可用状态路径不改现有文件，业务核验和归档仍继续', async () => {
    const blocker = join(directory, 'existing-file');
    await writeFile(blocker, 'preserve existing file');
    stateFile = join(blocker, 'state.json');
    expect(await run()).toBe(2);
    expect(sql).toHaveBeenCalledTimes(2);
    expect(summary()).toMatchObject({ status: 'ok', success: false, error: 'task-state-unavailable', checked: 2, archived: 1, stateRecorded: false });
    expect(await readFile(blocker, 'utf8')).toBe('preserve existing file');
    expect(output.error).toHaveBeenCalledTimes(1); expect(output.log).not.toHaveBeenCalled();
  });
  it('无法隔离符号链接时保留链接及目标内容，仍完成业务', async () => {
    const target = join(directory, 'other-data');
    await writeFile(target, '{do-not-replace');
    stateFile = join(directory, 'linked-state.json');
    await symlink(target, stateFile);
    expect(await run()).toBe(2);
    expect(sql).toHaveBeenCalledTimes(2);
    expect((await lstat(stateFile)).isSymbolicLink()).toBe(true);
    expect(await readFile(target, 'utf8')).toBe('{do-not-replace');
    expect(summary()).toMatchObject({ status: 'ok', success: false, error: 'task-state-unavailable', stateRecorded: false });
  });
  it('开始写入失败即使结束写入恢复也不能被成功结果吞掉', async () => {
    const { saveRecheckState } = await import(pathToFileURL(join(process.cwd(), 'scripts/lib/recheck-state.mjs')).href);
    const saveState = vi.fn(async (path: string, value: unknown) => {
      if (saveState.mock.calls.length === 1) throw Object.assign(new Error('private-initial-write'), { code: 'EROFS' });
      return saveRecheckState(path, value);
    });
    expect(await run(undefined, now, { saveState })).toBe(2);
    expect(await state()).toMatchObject({ status: 'ok', lastSuccessAt: now });
    expect(summary()).toMatchObject({ status: 'ok', success: false, error: 'task-state-unavailable', checked: 2, archived: 1, stateRecorded: true });
    expect(output.error).toHaveBeenCalledTimes(1); expect(output.log).not.toHaveBeenCalled();
  });
  it('最终写入失败不丢弃已完成的业务结果或覆盖开始记录', async () => {
    const { saveRecheckState } = await import(pathToFileURL(join(process.cwd(), 'scripts/lib/recheck-state.mjs')).href);
    const saveState = vi.fn(async (path: string, value: unknown) => {
      if (saveState.mock.calls.length === 1) return saveRecheckState(path, value);
      throw Object.assign(new Error('private-final-write'), { code: 'EROFS' });
    });
    expect(await run(undefined, now, { saveState })).toBe(2);
    expect(await state()).toMatchObject({ status: 'running', lastSuccessAt: null, result: null });
    expect(summary()).toMatchObject({ status: 'ok', success: false, error: 'task-state-unavailable', checked: 2, verified: 2, archived: 1, stateRecorded: false });
    expect(output.error).toHaveBeenCalledTimes(1); expect(output.log).not.toHaveBeenCalled();
  });
  it('归档写入失败不能刷新完整成功或数据时间，异常退出的旧 running 也被计入', async () => {
    await run();
    const previous = await state();
    await writeFile(stateFile, JSON.stringify({ ...previous, status: 'running', result: null, finishedAt: null }));
    sql.mockImplementation(async (parts: TemplateStringsArray) => {
      if (parts[0].includes('select')) return rows;
      throw new Error('/private/secret');
    });
    expect(await run(undefined, '2026-10-23T08:00:00.000Z')).toBe(1);
    expect(await state()).toMatchObject({ status: 'failed', lastSuccessAt: now, dataUpdatedAt: now, consecutiveAnomalies: 2,
      result: { reason: 'database', verified: 2, archived: 0 } });
    expect(JSON.stringify(output.error.mock.calls)).not.toContain('/private/secret');
  });
  it('真实 CLI 缺少配置也会记录尝试且非零退出，不读取生产环境文件', async () => {
    const result = await new Promise<{ code: number; stderr: string }>((resolve, reject) => {
      execFile(process.execPath, ['--experimental-strip-types', script, '--apply', '--quiet'], {
        env: { NODE_ENV: 'test', PATH: process.env.PATH, PATHFINDER_RECHECK_STATE_FILE: stateFile }, timeout: 10_000,
      }, (error, _stdout, stderr) => {
        if (error && typeof error.code !== 'number') return reject(error);
        resolve({ code: typeof error?.code === 'number' ? error.code : 0, stderr });
      });
    });
    expect(result.code).toBe(2);
    expect(result.stderr).toContain('"success":false');
    expect(await state()).toMatchObject({ status: 'failed', result: { reason: 'configuration' } });
  });
});
