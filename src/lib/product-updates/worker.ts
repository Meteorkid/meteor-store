import { readCurrentCatalog, writeCatalog } from './catalog.ts';
import { verifyInspectedRow } from './discovery.ts';
import { assertArtifact, downloadArtifact, uploadVerifiedArtifact } from './artifact.ts';
import { processIdentity, readStateFile, writeStateFile } from './state.ts';
import type { JobRecord } from './state.ts';
import type { ProductUpdateRow, ReleaseAsset } from './types';

interface WorkerDependencies {
  verifyRow: (row: ProductUpdateRow) => Promise<void>;
  download: (asset: ReleaseAsset, signal: AbortSignal) => Promise<Buffer>;
  upload: (key: string, body: Buffer, asset: ReleaseAsset, signal: AbortSignal) => Promise<void>;
}

export async function runProductUpdateJob(id: string, dependencies: Partial<WorkerDependencies> = {}): Promise<void> {
  const record = await readStateFile<JobRecord>('job');
  if (!record || record.job.id !== id || record.job.status !== 'queued') return;
  const { job, check } = record;
  const deps = { verifyRow: verifyInspectedRow, download: downloadArtifact, upload: uploadVerifiedArtifact, ...dependencies };
  const signal = AbortSignal.timeout(15 * 60_000);
  async function save() {
    const latest = await readStateFile<JobRecord>('job');
    if (latest?.job.id !== id) throw new Error('同步任务已被替换');
    job.updatedAt = new Date().toISOString();
    await writeStateFile('job', record);
  }
  record.pid = process.pid;
  record.processIdentity = await processIdentity(process.pid);
  job.status = 'running';
  await save();
  try {
    const base = await readCurrentCatalog();
    if (base.catalogError || base.revision !== check.baseRevision) throw new Error('下载目录已变化，请重新检查');
    if (Date.now() - Date.parse(check.checkedAt) > 3_600_000) throw new Error('检查已过期，请重新检查');
    const catalog = structuredClone(base.catalog);
    let verified = 0;
    for (const row of check.rows.filter(row => row.status === 'update')) {
      const progress = job.rows.find(item => item.productId === row.productId);
      if (!progress) throw new Error('任务与检查记录不一致');
      try {
        signal.throwIfAborted();
        progress.status = 'downloading'; progress.message = '复核正式发布记录'; await save();
        await deps.verifyRow(row);
        if (!row.latestVersion) throw new Error('发布记录缺少版本');
        const downloads = { ...catalog.downloads[row.productId] };
        if (row.channel === 'pypi' && row.link) {
          downloads[row.link.fileId] = { version: row.link.version, url: row.link.url };
        } else {
          if (!row.assets.length) throw new Error('发布记录缺少安装包');
          for (const asset of row.assets) {
            progress.status = 'downloading'; progress.message = '下载并校验正式安装包'; await save();
            const body = await deps.download(asset, signal);
            assertArtifact(body, asset);
            const key = `releases/${row.productId}/${row.latestVersion}/${asset.name}`;
            progress.status = 'uploading'; progress.message = '上传到私有存储并完整回读校验'; await save();
            await deps.upload(key, body, asset, signal);
            downloads[asset.fileId] = { version: row.latestVersion, sha256: asset.sha256, r2Key: key };
          }
        }
        catalog.downloads[row.productId] = downloads;
        progress.status = 'verified'; progress.message = '校验通过，等待切换下载目录'; verified++;
      } catch {
        progress.status = 'failed'; progress.message = '来源复核、下载或存储校验失败；此产品保留原下载';
      }
      await save();
    }
    if (verified) {
      signal.throwIfAborted();
      await save();
      catalog.updatedAt = new Date().toISOString();
      await writeCatalog(catalog, check.baseRevision);
      for (const item of job.rows) {
        if (item.status === 'verified') { item.status = 'synced'; item.message = '已更新网站下载'; }
      }
    }
    job.status = !verified ? 'failed' : job.rows.some(item => item.status === 'failed') ? 'partial' : 'completed';
    if (!verified) job.error = '本次没有更新下载，请重新检查来源和私有存储配置';
  } catch {
    job.status = 'failed';
    job.error = '同步未能完成，请重新检查当前下载目录；已上传的包不会覆盖原文件';
    for (const item of job.rows) {
      if (item.status !== 'synced' && item.status !== 'failed') { item.status = 'failed'; item.message = '下载目录未切换'; }
    }
  }
  job.finishedAt = new Date().toISOString();
  await save();
}
