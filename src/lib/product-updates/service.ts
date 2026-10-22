import { spawn } from 'node:child_process';
import { open } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { readCurrentCatalog } from './catalog.ts';
import { discoverProductUpdates } from './discovery.ts';
import { isActiveJob, prepareDirectory, readJob, readStateFile, writeStateFile } from './state.ts';
import type { JobRecord } from './state.ts';
import type { ProductUpdateCheck, ProductUpdateJob, ProductUpdateState } from './types';

export class ProductUpdateError extends Error {
  status: number;
  constructor(message: string, status = 409) { super(message); this.status = status; }
}

// 当前部署是单个 PM2 fork；跨 route bundle 共享队列，后台进程另持 OS 文件锁。
const runtime = globalThis as typeof globalThis & { __productUpdateQueue?: Promise<unknown> };
function serialized<T>(action: () => Promise<T>): Promise<T> {
  const next = (runtime.__productUpdateQueue ?? Promise.resolve()).then(action, action);
  runtime.__productUpdateQueue = next.catch(() => undefined);
  return next;
}

export async function getProductUpdateState(): Promise<ProductUpdateState> {
  return serialized(async () => {
    const [catalog, check, record] = await Promise.all([
      readCurrentCatalog(), readStateFile<ProductUpdateCheck>('check'), readJob(),
    ]);
    return { current: catalog.current, currentRevision: catalog.revision, catalogError: catalog.catalogError, check, job: record?.job ?? null };
  });
}

export async function checkProductUpdates(): Promise<ProductUpdateCheck> {
  return serialized(async () => {
    if (isActiveJob((await readJob())?.job)) throw new ProductUpdateError('同步进行中，请等待完成');
    const catalog = await readCurrentCatalog();
    if (catalog.catalogError) throw new ProductUpdateError('下载目录损坏，请先恢复目录备份', 503);
    const rows = await discoverProductUpdates(catalog.current);
    const check = { id: randomUUID(), checkedAt: new Date().toISOString(), baseRevision: catalog.revision, rows };
    await writeStateFile('check', check);
    return check;
  });
}

export async function startProductUpdateSync(checkId: string): Promise<ProductUpdateJob> {
  return serialized(async () => {
    if (!/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(checkId)) throw new ProductUpdateError('检查编号无效', 400);
    if (isActiveJob((await readJob())?.job)) throw new ProductUpdateError('同步进行中，请勿重复启动');
    const check = await readStateFile<ProductUpdateCheck>('check');
    const catalog = await readCurrentCatalog();
    if (catalog.catalogError) throw new ProductUpdateError('下载目录损坏，请先恢复目录备份', 503);
    if (!check || check.id !== checkId || Date.now() - Date.parse(check.checkedAt) > 3_600_000 || !Number.isFinite(Date.parse(check.checkedAt))) {
      throw new ProductUpdateError('检查已过期，请重新检查产品更新');
    }
    if (check.baseRevision !== catalog.revision) throw new ProductUpdateError('下载目录已变化，请重新检查');
    const updates = check.rows.filter(row => row.status === 'update');
    if (!updates.length) throw new ProductUpdateError('没有可同步的更新');
    const now = new Date().toISOString();
    const job: ProductUpdateJob = {
      id: randomUUID(), checkId, status: 'queued', startedAt: now, updatedAt: now, finishedAt: null,
      rows: updates.map(row => ({ productId: row.productId, status: 'pending', message: '等待同步' })),
    };
    const record: JobRecord = { job, check, pid: null };
    const directory = await prepareDirectory();
    await writeStateFile('job', record);
    let log: Awaited<ReturnType<typeof open>> | undefined;
    try {
      log = await open(path.join(directory, 'worker.log'), 'w', 0o600);
      const child = spawn('bash', [path.join(process.cwd(), 'scripts/product-update-worker.sh'), job.id], {
        cwd: process.cwd(), detached: true,
        env: { ...process.env, PRODUCT_UPDATES_NODE: process.execPath },
        stdio: ['ignore', log.fd, log.fd],
      });
      await new Promise<void>((resolve, reject) => {
        child.once('spawn', resolve);
        child.once('error', reject);
      });
      child.unref();
    } catch {
      record.job.status = 'failed';
      record.job.error = '无法启动同步进程，请检查服务器配置';
      record.job.finishedAt = record.job.updatedAt = new Date().toISOString();
      await writeStateFile('job', record);
      throw new ProductUpdateError(record.job.error, 503);
    } finally { await log?.close(); }
    return job;
  });
}
