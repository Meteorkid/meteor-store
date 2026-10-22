import { EventEmitter } from 'node:events';
import { spawn, type ChildProcess } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, readdir, rm, stat } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readCurrentCatalog, writeCatalog } from '../catalog.ts';
import { discoverProductUpdates } from '../discovery.ts';
import { checkProductUpdates, getProductUpdateState, startProductUpdateSync } from '../service.ts';
import { processIdentity, readJob, readStateFile, writeStateFile, type JobRecord } from '../state.ts';
import type { ProductUpdateCheck, ProductUpdateRow } from '../types.ts';

vi.mock('node:child_process', async (importOriginal) => ({
  ...await importOriginal<typeof import('node:child_process')>(),
  spawn: vi.fn(),
}));
vi.mock('../discovery.ts', () => ({ discoverProductUpdates: vi.fn() }));

let directory: string;
const runtime = globalThis as typeof globalThis & { __productUpdateQueue?: Promise<unknown> };

function updateRow(): ProductUpdateRow {
  return {
    productId: 'omnicrawl', name: 'OmniCrawl', channel: 'pypi', currentVersion: null, latestVersion: '1.2.3',
    status: 'update', message: 'fixture update', sourceUrl: 'https://pypi.org/project/omnicrawl-core/',
    publishedAt: '2026-10-22T00:00:00.000Z', assets: [],
    link: { fileId: 'pypi', version: '1.2.3', packageName: 'omnicrawl-core', url: 'https://pypi.org/project/omnicrawl-core/' },
  };
}

function fakeChild(error?: Error): ChildProcess {
  const child = new EventEmitter() as ChildProcess;
  child.unref = vi.fn();
  queueMicrotask(() => error ? child.emit('error', error) : child.emit('spawn'));
  return child;
}

beforeEach(async () => {
  directory = await mkdtemp(path.join(os.tmpdir(), 'update-service-'));
  vi.stubEnv('PRODUCT_UPDATES_DIR', directory);
  vi.mocked(discoverProductUpdates).mockResolvedValue([updateRow()]);
  vi.mocked(spawn).mockImplementation(() => fakeChild());
});

afterEach(async () => {
  await runtime.__productUpdateQueue;
  delete runtime.__productUpdateQueue;
  vi.restoreAllMocks();
  vi.resetAllMocks();
  vi.unstubAllEnvs();
  await rm(directory, { recursive: true, force: true });
});

describe('产品更新服务（隔离检查来源和后台启动）', () => {
  it('检查只保存检查快照，不写发布目录、不启动同步，文件保持私有', async () => {
    const before = await readCurrentCatalog();
    const check = await checkProductUpdates();
    expect(check.baseRevision).toBe(before.revision);
    expect(check.rows).toEqual([updateRow()]);
    expect(check.id).toMatch(/^[a-f0-9-]{36}$/);
    expect(await readdir(directory)).toEqual(['check.json']);
    expect((await readCurrentCatalog()).revision).toBe(before.revision);
    expect(spawn).not.toHaveBeenCalled();
    expect((await stat(directory)).mode & 0o777).toBe(0o700);
    expect((await stat(path.join(directory, 'check.json'))).mode & 0o777).toBe(0o600);
    expect((await getProductUpdateState()).job).toBeNull();
  });

  it.each(['../catalog.json', '', 'not-a-uuid'])('无效检查编号 %j 在启动前拒绝', async (id) => {
    await expect(startProductUpdateSync(id)).rejects.toMatchObject({ status: 400 });
    expect(spawn).not.toHaveBeenCalled();
    expect(await readdir(directory)).toEqual([]);
  });

  it('未知或被较新检查替代的编号不能启动', async () => {
    const first = await checkProductUpdates();
    await checkProductUpdates();
    await expect(startProductUpdateSync(first.id)).rejects.toMatchObject({ status: 409 });
    await expect(startProductUpdateSync(randomUUID())).rejects.toMatchObject({ status: 409 });
    expect(spawn).not.toHaveBeenCalled();
    expect(await readdir(directory)).toEqual(['check.json']);
  });

  it.each(['2020-01-01T00:00:00.000Z', 'not-a-date'])('过期或无效检查时间 %s 不能启动', async (checkedAt) => {
    const check = await checkProductUpdates();
    await writeStateFile('check', { ...check, checkedAt });
    await expect(startProductUpdateSync(check.id)).rejects.toMatchObject({ status: 409 });
    expect(spawn).not.toHaveBeenCalled();
    expect(await readdir(directory)).toEqual(['check.json']);
  });

  it('目录改变后旧检查失效，不覆盖当前目录', async () => {
    const check = await checkProductUpdates();
    const base = await readCurrentCatalog();
    await writeCatalog({
      ...base.catalog, updatedAt: new Date().toISOString(),
      downloads: { omnicrawl: { pypi: { version: '1.2.0', url: 'https://pypi.org/project/omnicrawl-core/' } } },
    }, base.revision);
    const contents = await readFile(path.join(directory, 'catalog.json'), 'utf8');
    await expect(startProductUpdateSync(check.id)).rejects.toThrow('目录已变化');
    expect(spawn).not.toHaveBeenCalled();
    expect(await readFile(path.join(directory, 'catalog.json'), 'utf8')).toBe(contents);
  });

  it('没有可更新项时不启动任务', async () => {
    vi.mocked(discoverProductUpdates).mockResolvedValue([{ ...updateRow(), status: 'current' }]);
    const check = await checkProductUpdates();
    await expect(startProductUpdateSync(check.id)).rejects.toThrow('没有可同步');
    expect(spawn).not.toHaveBeenCalled();
  });

  it('并发同步只启动一个进程，正在同步时不能重新检查', async () => {
    const check = await checkProductUpdates();
    const results = await Promise.allSettled([startProductUpdateSync(check.id), startProductUpdateSync(check.id)]);
    expect(results.map((result) => result.status)).toEqual(['fulfilled', 'rejected']);
    expect(spawn).toHaveBeenCalledTimes(1);
    expect(vi.mocked(spawn).mock.calls[0]).toMatchObject([
      'bash', [path.join(process.cwd(), 'scripts/product-update-worker.sh'), expect.any(String)],
      { detached: true, cwd: process.cwd(), env: expect.objectContaining({ PRODUCT_UPDATES_DIR: directory, PRODUCT_UPDATES_NODE: process.execPath }) },
    ]);
    await expect(checkProductUpdates()).rejects.toThrow('同步进行中');
    expect((await readStateFile<JobRecord>('job'))?.job.status).toBe('queued');
    expect(await readdir(directory)).not.toContain('catalog.json');
  });

  it('spawn错误立即记失败并允许重新启动，错误不泄漏底层路径', async () => {
    const check = await checkProductUpdates();
    vi.mocked(spawn).mockImplementationOnce(() => fakeChild(new Error('/private/credential path')));
    await expect(startProductUpdateSync(check.id)).rejects.toMatchObject({ status: 503 });
    const record = await readStateFile<JobRecord>('job');
    expect(record?.job.status).toBe('failed');
    expect(record?.job.finishedAt).not.toBeNull();
    expect(JSON.stringify(record)).not.toContain('credential');
    expect(await readdir(directory)).not.toContain('catalog.json');
    expect((await startProductUpdateSync(check.id)).status).toBe('queued');
  });

  it('日志打开失败立即记启动失败，修复路径后允许重试', async () => {
    const check = await checkProductUpdates();
    await mkdir(path.join(directory, 'worker.log'));
    await expect(startProductUpdateSync(check.id)).rejects.toMatchObject({ status: 503 });
    expect((await readStateFile<JobRecord>('job'))?.job.status).toBe('failed');
    expect(spawn).not.toHaveBeenCalled();
    await rm(path.join(directory, 'worker.log'), { recursive: true });
    expect((await startProductUpdateSync(check.id)).status).toBe('queued');
  });

  it('已退出的后台进程被标记失败，可以重新检查；仍存活进程不回收', async () => {
    const check = await checkProductUpdates();
    await startProductUpdateSync(check.id);
    const record = (await readStateFile<JobRecord>('job'))!;
    record.job.status = 'running';
    record.pid = process.pid;
    await writeStateFile('job', record);
    expect((await readJob())?.job.status).toBe('running');

    vi.spyOn(process, 'kill').mockImplementation(() => { throw Object.assign(new Error('gone'), { code: 'ESRCH' }); });
    expect((await readJob())?.job.status).toBe('failed');
    expect((await checkProductUpdates()).id).not.toBe(check.id);
    expect(await readdir(directory)).not.toContain('catalog.json');
  });

  it('只在无PID排队超过60秒后恢复，活跃任务不按时间强行回收', async () => {
    const check = await checkProductUpdates();
    await startProductUpdateSync(check.id);
    const record = (await readStateFile<JobRecord>('job'))!;
    expect((await readJob())?.job.status).toBe('queued');
    record.job.startedAt = '2020-01-01T00:00:00.000Z';
    record.pid = process.pid;
    await writeStateFile('job', record);
    expect((await readJob())?.job.status).toBe('queued');
    record.pid = null;
    await writeStateFile('job', record);
    expect((await readJob())?.job.status).toBe('failed');
  });

  it.each([
    ['真实身份', false, 'running'],
    ['其他进程复用PID', true, 'failed'],
  ] as const)('通过进程启动身份识别%s', async (_name, reused, expected) => {
    const check = await checkProductUpdates();
    await startProductUpdateSync(check.id);
    const record = (await readStateFile<JobRecord>('job'))!;
    const identity = await processIdentity(process.pid);
    expect(identity).toBeTruthy();
    record.job.status = 'running';
    record.pid = process.pid;
    record.processIdentity = reused ? `old-boot:${identity}` : identity;
    await writeStateFile('job', record);
    expect((await readJob())?.job.status).toBe(expected);
    expect((await readStateFile<JobRecord>('job'))?.job.status).toBe(expected);
    expect(await readdir(directory)).not.toContain('catalog.json');
  });

  it('读取期间进程完成并退出时，恢复逻辑不能用旧运行快照覆盖已完成记录', async () => {
    const check = await checkProductUpdates();
    await startProductUpdateSync(check.id);
    const record = (await readStateFile<JobRecord>('job'))!;
    record.job.status = 'running';
    record.pid = process.pid;
    await writeStateFile('job', record);
    vi.spyOn(process, 'kill').mockImplementation(() => {
      // 精确模拟 readFile(running) → worker保存completed并退出 → kill返回ESRCH。
      const completed = structuredClone(record);
      completed.job.status = 'completed';
      completed.job.finishedAt = completed.job.updatedAt = new Date().toISOString();
      completed.job.rows[0].status = 'synced';
      writeFileSync(path.join(directory, 'job.json'), JSON.stringify(completed), { mode: 0o600 });
      throw Object.assign(new Error('gone'), { code: 'ESRCH' });
    });
    expect((await readJob())?.job.status).toBe('completed');
    expect((await readStateFile<JobRecord>('job'))?.job.status).toBe('completed');
  });

  it('损坏下载目录阻止检查和同步，不把损坏当空目录发布', async () => {
    const check: ProductUpdateCheck = { id: randomUUID(), checkedAt: new Date().toISOString(), baseRevision: '', rows: [updateRow()] };
    await writeStateFile('check', check);
    writeFileSync(path.join(directory, 'catalog.json'), 'broken');
    await expect(checkProductUpdates()).rejects.toMatchObject({ status: 503 });
    await expect(startProductUpdateSync(check.id)).rejects.toMatchObject({ status: 503 });
    expect(spawn).not.toHaveBeenCalled();
    expect(discoverProductUpdates).not.toHaveBeenCalled();
  });
});
