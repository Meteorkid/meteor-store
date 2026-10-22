import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readCurrentCatalog, writeCatalog } from '../catalog.ts';
import { runProductUpdateJob } from '../worker.ts';
import { readStateFile, writeStateFile } from '../state.ts';
import type { JobRecord } from '../state.ts';
import type { ProductUpdateRow } from '../types';

let directory: string;
const body = Buffer.alloc(1024);
body.write('koly', 512);
const hash = createHash('sha256').update(body).digest('hex');
function row(productId = 'xisland'): ProductUpdateRow {
  const name = productId === 'xisland' ? 'XIsland' : 'XNook';
  return { productId, name, channel: 'github-stable', currentVersion: '1.0.0', latestVersion: '2.1.0', status: 'update',
    message: '', sourceUrl: `https://github.com/Meteorkid/${name}/releases/tag/v2.1.0`, publishedAt: new Date().toISOString(), releaseId: 42, tag: 'v2.1.0',
    assets: [{ fileId: 'dmg', name: `${name}-2.1.0.dmg`, url: `https://github.com/Meteorkid/${name}/releases/download/v2.1.0/${name}-2.1.0.dmg`, bytes: body.length, sha256: hash, architecture: 'macos-arm64', assetId: 1 }] };
}
async function queue(rows = [row()]): Promise<JobRecord> {
  const record: JobRecord = {
    check: { id: randomUUID(), checkedAt: new Date().toISOString(), baseRevision: (await readCurrentCatalog()).revision, rows },
    job: { id: randomUUID(), checkId: '', status: 'queued', startedAt: new Date().toISOString(), updatedAt: new Date().toISOString(), finishedAt: null,
      rows: rows.filter(row => row.status === 'update').map(row => ({ productId: row.productId, status: 'pending', message: '' })) }, pid: null,
  };
  record.job.checkId = record.check.id;
  await writeStateFile('job', record);
  return record;
}
const dependencies = () => ({ verifyRow: vi.fn(async () => undefined), download: vi.fn(async () => body), upload: vi.fn(async () => undefined) });
beforeEach(async () => { directory = await mkdtemp(path.join(os.tmpdir(), 'update-worker-')); vi.stubEnv('PRODUCT_UPDATES_DIR', directory); });
afterEach(async () => { vi.unstubAllEnvs(); await rm(directory, { recursive: true, force: true }); });

describe('产品更新后台任务（隔离安装包与存储）', () => {
  it('先上传并回读确认，再切换目录，保留权限和稳定文件ID', async () => {
    const record = await queue(); const deps = dependencies();
    deps.upload.mockImplementation(async () => { expect((await readCurrentCatalog()).catalog.downloads).toEqual({}); });
    await runProductUpdateJob(record.job.id, deps);
    expect(deps.verifyRow).toHaveBeenCalledWith(record.check.rows[0]);
    expect(deps.upload).toHaveBeenCalledWith('releases/xisland/2.1.0/XIsland-2.1.0.dmg', body, record.check.rows[0].assets[0], expect.any(AbortSignal));
    expect((await readCurrentCatalog()).current.find(p => p.productId === 'xisland')?.downloads[0]).toMatchObject({ id: 'dmg', gated: true, version: '2.1.0', sha256: hash });
    expect((await readStateFile<JobRecord>('job'))?.job).toMatchObject({ status: 'completed', rows: [{ productId: 'xisland', status: 'synced' }] });
  });
  it('单项失败时只切换成功产品，准确显示部分完成', async () => {
    const record = await queue([row(), row('xnook')]); const deps = dependencies();
    deps.upload.mockImplementationOnce(async () => { throw new Error('fixture failure'); });
    await runProductUpdateJob(record.job.id, deps);
    const catalog = await readCurrentCatalog();
    expect(catalog.catalog.downloads.xisland).toBeUndefined();
    expect(catalog.catalog.downloads.xnook.dmg.version).toBe('2.1.0');
    expect((await readStateFile<JobRecord>('job'))?.job.status).toBe('partial');
  });
  it('hash错误阻止上传且不生成发布目录', async () => {
    const record = await queue(); const deps = dependencies(); deps.download.mockResolvedValue(Buffer.from('incorrect'));
    await runProductUpdateJob(record.job.id, deps);
    expect(deps.upload).not.toHaveBeenCalled();
    expect(await readdir(directory)).not.toContain('catalog.json');
    expect((await readStateFile<JobRecord>('job'))?.job.status).toBe('failed');
  });
  it('来源复核失败保留旧下载，错误不泄漏原始签名参数', async () => {
    const record = await queue(); const deps = dependencies(); deps.verifyRow.mockRejectedValue(new Error('https://secret?token=PRIVATE'));
    await runProductUpdateJob(record.job.id, deps);
    expect(deps.download).not.toHaveBeenCalled();
    expect(await readFile(path.join(directory, 'job.json'), 'utf8')).not.toContain('PRIVATE');
    expect((await readCurrentCatalog()).catalog.downloads).toEqual({});
  });
  it('启动前目录变更拒绝任务', async () => {
    const record = await queue(); const deps = dependencies();
    const base = await readCurrentCatalog();
    await writeCatalog({ ...base.catalog, updatedAt: new Date().toISOString(), downloads: { omnicrawl: { pypi: { version: '0.3.0', url: 'https://pypi.org/project/omnicrawl-core/' } } } }, base.revision);
    await runProductUpdateJob(record.job.id, deps);
    expect(deps.verifyRow).not.toHaveBeenCalled();
    expect((await readStateFile<JobRecord>('job'))?.job.status).toBe('failed');
  });
  it('上传期间目录变更时拒绝覆盖最新目录', async () => {
    const record = await queue(); const deps = dependencies();
    deps.upload.mockImplementation(async () => {
      const base = await readCurrentCatalog();
      await writeCatalog({ ...base.catalog, updatedAt: new Date().toISOString(), downloads: { omnicrawl: { pypi: { version: '0.3.0', url: 'https://pypi.org/project/omnicrawl-core/' } } } }, base.revision);
    });
    await runProductUpdateJob(record.job.id, deps);
    expect((await readCurrentCatalog()).catalog.downloads.xisland).toBeUndefined();
    expect((await readStateFile<JobRecord>('job'))?.job.status).toBe('failed');
  });
  it('过期检查不发起下载，重放完成任务不重复执行', async () => {
    const record = await queue(); const deps = dependencies(); record.check.checkedAt = '2020-01-01T00:00:00.000Z'; await writeStateFile('job', record);
    await runProductUpdateJob(record.job.id, deps); await runProductUpdateJob(record.job.id, deps);
    expect(deps.verifyRow).not.toHaveBeenCalled();
  });
  it('PyPI 同步只发布固定链接与已复核版本，不调用 R2', async () => {
    const pypi: ProductUpdateRow = { ...row(), productId: 'omnicrawl', channel: 'pypi', latestVersion: '0.3.0', assets: [],
      link: { fileId: 'pypi', version: '0.3.0', packageName: 'omnicrawl-core', url: 'https://pypi.org/project/omnicrawl-core/' } };
    const record = await queue([pypi]); const deps = dependencies(); await runProductUpdateJob(record.job.id, deps);
    expect(deps.upload).not.toHaveBeenCalled(); expect(deps.download).not.toHaveBeenCalled();
    expect((await readCurrentCatalog()).catalog.downloads.omnicrawl.pypi.version).toBe('0.3.0');
  });
});
