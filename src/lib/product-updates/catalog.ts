import { createHash, randomUUID } from 'node:crypto';
import { chmod, lstat, mkdir, open, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { products, type Product } from '../../data/products.ts';
import type { CurrentDownload, CurrentProduct, DownloadOverride, ReleaseCatalog } from './types.ts';

interface CatalogOptions {
  directory?: string;
}

const EMPTY_CATALOG: ReleaseCatalog = { version: 1, updatedAt: '1970-01-01T00:00:00.000Z', downloads: {} };
const CATALOG_LIMIT = 64 * 1024;
const HISTORY_LIMIT = 20;
const STABLE_VERSION = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const PYPI_VERSION = /^(0|[1-9]\d*)(\.(0|[1-9]\d*)){1,3}$/;
const ALLOWED_FILES: Record<string, readonly string[]> = {
  xisland: ['dmg'],
  xnook: ['dmg'],
  statux: ['macos-arm64', 'macos-x64'],
  omnicrawl: ['pypi'],
};
const writeQueues = new Map<string, Promise<void>>();

function catalogDirectory(options: CatalogOptions): string {
  return path.resolve(options.directory || process.env.PRODUCT_UPDATES_DIR || path.join(process.cwd(), 'data/product-updates'));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
}

function assertKeys(value: Record<string, unknown>, keys: readonly string[]): void {
  if (Object.keys(value).some((key) => !keys.includes(key))) throw new Error('下载目录包含未允许的字段');
}

function compareVersions(left: string, right: string): number {
  const a = left.split('.').map(BigInt);
  const b = right.split('.').map(BigInt);
  const zero = BigInt(0);
  for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
    if ((a[i] ?? zero) !== (b[i] ?? zero)) return (a[i] ?? zero) > (b[i] ?? zero) ? 1 : -1;
  }
  return 0;
}

function assertForwardVersion(next: CurrentDownload, previous: CurrentDownload): void {
  if (!previous.version) return;
  if (!next.version) throw new Error('不能移除已发布的下载版本');
  const comparison = compareVersions(next.version, previous.version);
  if (comparison < 0) throw new Error('下载版本不能降级');
  if (comparison === 0 && previous.sha256 && next.sha256 !== previous.sha256) {
    throw new Error('同版本不能替换 SHA-256');
  }
}

function validateCatalog(value: unknown): ReleaseCatalog {
  if (!isRecord(value)) throw new Error('下载目录格式不正确');
  assertKeys(value, ['version', 'updatedAt', 'downloads']);
  if (value.version !== 1 || typeof value.updatedAt !== 'string'
      || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value.updatedAt)
      || !Number.isFinite(Date.parse(value.updatedAt)) || new Date(value.updatedAt).toISOString() !== value.updatedAt
      || !isRecord(value.downloads)) {
    throw new Error('下载目录格式不正确');
  }

  const downloads: ReleaseCatalog['downloads'] = {};
  for (const [productId, files] of Object.entries(value.downloads)) {
    const allowed = Object.hasOwn(ALLOWED_FILES, productId) ? ALLOWED_FILES[productId] : undefined;
    if (!allowed || !isRecord(files)) throw new Error('下载目录包含未登记的产品');
    const product = products.find((item) => item.id === productId);
    downloads[productId] = {};
    for (const [fileId, override] of Object.entries(files)) {
      const original = product?.downloads?.find((item) => item.id === fileId);
      if (!allowed.includes(fileId) || !original || !isRecord(override)) throw new Error('下载目录包含未登记的文件');
      const pypi = productId === 'omnicrawl';
      assertKeys(override, pypi ? ['version', 'url'] : ['version', 'sha256', 'r2Key']);
      if (typeof override.version !== 'string' || override.version.length > 64
          || !(pypi ? PYPI_VERSION : STABLE_VERSION).test(override.version)) {
        throw new Error('下载版本必须为稳定版本');
      }
      let normalized: DownloadOverride;
      if (pypi) {
        if (override.url !== 'https://pypi.org/project/omnicrawl-core/') throw new Error('PyPI 地址不在允许范围内');
        normalized = { version: override.version, url: override.url };
      } else {
        const fileName = productId === 'xisland' ? `XIsland-${override.version}.dmg`
          : productId === 'xnook' ? `XNook-${override.version}.dmg`
            : fileId === 'macos-arm64' ? 'statux-darwin-arm64' : 'statux-darwin-x64';
        if (typeof override.sha256 !== 'string' || !/^[a-f0-9]{64}$/i.test(override.sha256)
            || override.r2Key !== `releases/${productId}/${override.version}/${fileName}`) {
          throw new Error('下载对象路径或 SHA-256 不正确');
        }
        normalized = { version: override.version, sha256: override.sha256.toLowerCase(), r2Key: override.r2Key };
      }
      assertForwardVersion({ id: fileId, ...normalized }, original);
      downloads[productId][fileId] = normalized;
    }
  }
  return { version: 1, updatedAt: value.updatedAt, downloads };
}

function withDownloads(product: Product, catalog: ReleaseCatalog): Product {
  return {
    ...product,
    downloads: product.downloads?.map((download) => ({
      ...download,
      ...catalog.downloads[product.id]?.[download.id],
    })),
  };
}

function currentProducts(catalog: ReleaseCatalog): CurrentProduct[] {
  return products.filter((product) => product.downloads?.length && Object.hasOwn(ALLOWED_FILES, product.id))
    .map((product) => ({
      productId: product.id,
      name: product.name.zh,
      downloads: withDownloads(product, catalog).downloads!.map(({ id, version, sha256, r2Key, url, gated }) => ({
        id, version, sha256, r2Key, url, gated,
      })),
    }));
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (isRecord(value)) {
    return `{${Object.keys(value).filter((key) => value[key] !== undefined).sort()
      .map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

/** 不缓存文件读取：一次目录切换同时供产品页和签名下载入口使用。 */
export async function readCurrentCatalog(options: CatalogOptions = {}): Promise<{
  catalog: ReleaseCatalog;
  current: CurrentProduct[];
  revision: string;
  catalogError: boolean;
}> {
  let catalog: ReleaseCatalog = structuredClone(EMPTY_CATALOG);
  let catalogError = false;
  try {
    const file = path.join(catalogDirectory(options), 'catalog.json');
    const stat = await lstat(file);
    if (!stat.isFile() || stat.size > CATALOG_LIMIT) throw new Error('下载目录文件不正确');
    catalog = validateCatalog(JSON.parse(await readFile(file, 'utf8')));
  } catch (error) {
    catalogError = (error as NodeJS.ErrnoException).code !== 'ENOENT';
  }
  const revision = createHash('sha256').update(stableJson({
    catalog,
    defaults: products.filter((product) => product.downloads?.length).map(({ id, downloads }) => ({ id, downloads })),
  })).digest('hex');
  return { catalog, current: currentProducts(catalog), revision, catalogError };
}

export async function getProductWithCurrentDownloads(id: string): Promise<Product | undefined> {
  const product = products.find((item) => item.id === id);
  if (!product) return undefined;
  if (!product.downloads?.length) return product;
  const { catalog } = await readCurrentCatalog();
  return withDownloads(product, catalog);
}

async function ensurePrivateDirectory(directory: string): Promise<void> {
  await mkdir(directory, { recursive: true, mode: 0o700 });
  if (!(await lstat(directory)).isDirectory()) throw new Error('下载目录必须为真实目录');
  await chmod(directory, 0o700);
}

async function persistCatalog(catalog: ReleaseCatalog, expectedRevision: string, directory: string): Promise<void> {
  const validated = validateCatalog(catalog);
  const previous = await readCurrentCatalog({ directory });
  if (previous.catalogError) throw new Error('当前下载目录损坏，请先恢复');
  if (previous.revision !== expectedRevision) throw new Error('下载目录已变更，请重新检查');
  const next = currentProducts(validated);
  for (const product of previous.current) {
    for (const download of product.downloads) {
      const updated = next.find((item) => item.productId === product.productId)?.downloads.find((item) => item.id === download.id);
      if (updated) assertForwardVersion(updated, download);
    }
  }
  await ensurePrivateDirectory(directory);
  const file = path.join(directory, 'catalog.json');
  const temporary = path.join(directory, `.catalog-${randomUUID()}.tmp`);
  const historyDirectory = path.join(directory, 'history');
  let oldContents: string | undefined;
  try {
    oldContents = await readFile(file, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
  try {
    const handle = await open(temporary, 'wx', 0o600);
    try {
      await handle.writeFile(`${JSON.stringify(validated, null, 2)}\n`);
      await handle.sync();
    } finally {
      await handle.close();
    }
    if (oldContents !== undefined) {
      await ensurePrivateDirectory(historyDirectory);
      await writeFile(path.join(historyDirectory, `${Date.now()}-${randomUUID()}.json`), oldContents, { mode: 0o600, flag: 'wx' });
    }
    await rename(temporary, file);
  } finally {
    await rm(temporary, { force: true });
  }
  // 切换成功后才清理历史；清理失败不能把已生效的更新报告成失败。
  if (oldContents !== undefined) {
    try {
      const history = (await readdir(historyDirectory)).filter((name) => /^\d+-[a-f0-9-]+\.json$/.test(name)).sort();
      await Promise.all(history.slice(0, Math.max(0, history.length - HISTORY_LIMIT)).map((name) => rm(path.join(historyDirectory, name))));
    } catch {
      console.warn('[product-updates] 下载目录已保存，但历史清理失败');
    }
  }
}

/** 跨进程写入由同步 worker 的 OS 文件锁串行化；这里同时防止本进程的并发写入。 */
export async function writeCatalog(catalog: ReleaseCatalog, expectedRevision: string, options: CatalogOptions = {}): Promise<void> {
  const directory = catalogDirectory(options);
  const pending = writeQueues.get(directory) ?? Promise.resolve();
  const operation = pending.catch(() => undefined).then(() => persistCatalog(catalog, expectedRevision, directory));
  writeQueues.set(directory, operation);
  try {
    await operation;
  } finally {
    if (writeQueues.get(directory) === operation) writeQueues.delete(directory);
  }
}
