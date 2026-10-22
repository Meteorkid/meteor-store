import { execFile } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { processIdentity, readJob, readStateFile, writeStateFile, type JobRecord } from '../state.ts';

const runtime = vi.hoisted(() => ({
  procFiles: new Map<string, string | Error>(),
}));

vi.mock('node:fs/promises', async (importOriginal) => {
  const original = await importOriginal<typeof import('node:fs/promises')>();
  return {
    ...original,
    readFile: (...args: unknown[]) => {
      const fixture = typeof args[0] === 'string' ? runtime.procFiles.get(args[0]) : undefined;
      if (fixture instanceof Error) return Promise.reject(fixture);
      if (fixture !== undefined) return Promise.resolve(fixture);
      return Reflect.apply(original.readFile, original, args);
    },
  };
});

const bootId = 'f3951c0a-fd10-4ca8-8a76-b2bcacdf5e93';
const startTime = '123456789';
let directory: string;

function linuxIdentity(started = startTime): string {
  // stat 第3列是 state，第22列是 starttime；comm 中的空格和括号不应改变列号。
  const stat = `${process.pid} (node (worker)) S ${Array(18).fill('0').join(' ')} ${started} 0 0\n`;
  runtime.procFiles.set(`/proc/${process.pid}/stat`, stat);
  runtime.procFiles.set('/proc/sys/kernel/random/boot_id', `${bootId}\n`);
  return `${bootId}:${started}`;
}

async function activeJob(identity: string): Promise<void> {
  const record: JobRecord = {
    pid: process.pid,
    processIdentity: identity,
    check: { id: 'check', checkedAt: '2020-01-01T00:00:00.000Z', baseRevision: '', rows: [] },
    job: {
      id: 'job', checkId: 'check', status: 'running',
      startedAt: '2020-01-01T00:00:00.000Z', updatedAt: '2020-01-01T00:00:00.000Z', finishedAt: null,
      rows: [{ productId: 'xisland', status: 'downloading', message: '下载并校验正式安装包' }],
    },
  };
  await writeStateFile('job', record);
}

beforeEach(async () => {
  directory = await mkdtemp(path.join(tmpdir(), 'product-update-runtime-platform-'));
  vi.stubEnv('PRODUCT_UPDATES_DIR', directory);
  runtime.procFiles.clear();
});

afterEach(async () => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  runtime.procFiles.clear();
  await rm(directory, { recursive: true, force: true });
});

describe('产品更新任务的运行时平台与进程身份', () => {
  it('运行时存在 Linux proc 文件时读取 boot ID 和 starttime，不依赖构建机的平台', async () => {
    const identity = linuxIdentity();
    expect(await processIdentity(process.pid)).toBe(identity);
  });

  it('Linux worker 仍存活且原生身份一致时保留运行状态', async () => {
    await activeJob(linuxIdentity());
    expect((await readJob())?.job).toMatchObject({ status: 'running', finishedAt: null });
    expect((await readStateFile<JobRecord>('job'))?.job.status).toBe('running');
  });

  it('Linux PID 存活但 starttime 改变时才判定为被复用', async () => {
    await activeJob(linuxIdentity());
    linuxIdentity('987654321');
    expect((await readJob())?.job).toMatchObject({ status: 'failed', error: '同步进程已中断，请重新检查当前下载目录后再试' });
  });

  it.each(['EACCES', 'ENOENT'])('Linux stat 返回 %s 时不回退为另一种身份或回收活跃任务', async (code) => {
    await activeJob(linuxIdentity());
    runtime.procFiles.set(`/proc/${process.pid}/stat`, Object.assign(new Error('fixture stat inaccessible'), { code }));
    expect(await processIdentity(process.pid)).toBeUndefined();
    expect((await readJob())?.job.status).toBe('running');
  });

  it('Linux boot ID 权限不足时不回退为 ps 身份或回收活跃任务', async () => {
    await activeJob(linuxIdentity());
    runtime.procFiles.set('/proc/sys/kernel/random/boot_id', Object.assign(new Error('fixture boot inaccessible'), { code: 'EACCES' }));
    expect(await processIdentity(process.pid)).toBeUndefined();
    expect((await readJob())?.job.status).toBe('running');
  });

  it('macOS 没有 Linux boot ID 文件时使用 ps，保留身份一致的活跃任务', async () => {
    linuxIdentity();
    runtime.procFiles.set('/proc/sys/kernel/random/boot_id', Object.assign(new Error('fixture proc unavailable'), { code: 'ENOENT' }));
    const { stdout } = await promisify(execFile)('ps', ['-p', String(process.pid), '-o', 'lstart=']);
    const identity = stdout.trim();
    expect(identity).not.toBe('');
    expect(await processIdentity(process.pid)).toBe(identity);
    await activeJob(identity);
    expect((await readJob())?.job.status).toBe('running');
  });
});
