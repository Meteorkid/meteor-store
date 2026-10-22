import { chmod, mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import type { ProductUpdateCheck, ProductUpdateJob } from './types';

export interface JobRecord {
  job: ProductUpdateJob;
  check: ProductUpdateCheck;
  pid: number | null;
  processIdentity?: string;
}

const execFileAsync = promisify(execFile);
export async function processIdentity(pid: number): Promise<string | undefined> {
  try {
    if (process.platform === 'linux') {
      const [stat, boot] = await Promise.all([
        readFile(`/proc/${pid}/stat`, 'utf8'), readFile('/proc/sys/kernel/random/boot_id', 'utf8'),
      ]);
      // comm 可能含空格；最后一个右括号后才是第3列，starttime 为第22列。
      const started = stat.slice(stat.lastIndexOf(')') + 2).split(' ')[19];
      return started ? `${boot.trim()}:${started}` : undefined;
    }
    const { stdout } = await execFileAsync('ps', ['-p', String(pid), '-o', 'lstart='], { timeout: 2000 });
    return stdout.trim() || undefined;
  } catch { return undefined; }
}

export function updateDirectory(): string {
  return process.env.PRODUCT_UPDATES_DIR || path.join(process.cwd(), 'data/product-updates');
}

export async function prepareDirectory(): Promise<string> {
  const directory = updateDirectory();
  await mkdir(directory, { recursive: true, mode: 0o700 });
  await chmod(directory, 0o700);
  return directory;
}

export async function readStateFile<T>(name: 'check' | 'job'): Promise<T | null> {
  try {
    return JSON.parse(await readFile(path.join(updateDirectory(), `${name}.json`), 'utf8')) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw new Error('产品更新记录无法读取，请检查服务器状态文件');
  }
}

export async function writeStateFile(name: 'check' | 'job', value: unknown): Promise<void> {
  const directory = await prepareDirectory();
  const temporary = path.join(directory, `.${name}-${randomUUID()}.tmp`);
  await writeFile(temporary, JSON.stringify(value, null, 2), { mode: 0o600 });
  await rename(temporary, path.join(directory, `${name}.json`));
}

export function isActiveJob(job: ProductUpdateJob | null | undefined): boolean {
  return job?.status === 'queued' || job?.status === 'running';
}

export async function readJob(): Promise<JobRecord | null> {
  const record = await readStateFile<JobRecord>('job');
  if (!record || !isActiveJob(record.job)) return record;
  // 只回收已确认退出的进程。排队启动留出时间，实际写入另有内核文件锁。
  let alive = true;
  if (record.pid) {
    try { process.kill(record.pid, 0); }
    catch (error) { if ((error as NodeJS.ErrnoException).code === 'ESRCH') alive = false; }
    if (alive && record.processIdentity) {
      const identity = await processIdentity(record.pid);
      if (identity && identity !== record.processIdentity) alive = false;
    }
  } else if (Date.now() - Date.parse(record.job.startedAt) > 60_000) alive = false;
  if (!alive) {
    const latest = await readStateFile<JobRecord>('job');
    if (!latest || latest.job.id !== record.job.id || !isActiveJob(latest.job)
        || latest.pid !== record.pid || latest.job.updatedAt !== record.job.updatedAt) return latest;
    record.job.status = 'failed';
    record.job.error = '同步进程已中断，请重新检查当前下载目录后再试';
    record.job.finishedAt = record.job.updatedAt = new Date().toISOString();
    await writeStateFile('job', record);
  }
  return record;
}
