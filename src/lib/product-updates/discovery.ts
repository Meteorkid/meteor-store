import type { CurrentDownload, CurrentProduct, ProductUpdateRow, ReleaseAsset } from './types';

type FetchOptions = { fetcher?: typeof fetch };
type AssetRule = { fileId: string; architecture: ReleaseAsset['architecture']; name: (version: string) => string };
type GitHubSource = { productId: string; repository: string; assets: AssetRule[] };

const githubSources: GitHubSource[] = [
  { productId: 'xisland', repository: 'XIsland', assets: [{ fileId: 'dmg', architecture: 'macos-arm64', name: version => `XIsland-${version}.dmg` }] },
  { productId: 'xnook', repository: 'XNook', assets: [{ fileId: 'dmg', architecture: 'macos-arm64', name: version => `XNook-${version}.dmg` }] },
  { productId: 'statux', repository: 'statux', assets: [
    { fileId: 'macos-arm64', architecture: 'macos-arm64', name: () => 'statux-darwin-arm64' },
    { fileId: 'macos-x64', architecture: 'macos-x64', name: () => 'statux-darwin-x64' },
  ] },
];
const PYPI_PACKAGE = 'omnicrawl-core';
const PYPI_URL = `https://pypi.org/project/${PYPI_PACKAGE}/`;
const MAX_JSON_BYTES = 2 * 1024 * 1024;
const MAX_SIDECAR_BYTES = 16 * 1024;
const MAX_ASSET_BYTES = 128 * 1024 * 1024;
const SHA256 = /^[a-f0-9]{64}$/i;

class SourceError extends Error {
  readonly status: 'blocked' | 'error';

  constructor(message: string, status: 'blocked' | 'error' = 'blocked') {
    super(message);
    this.status = status;
  }
}

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new SourceError('官方来源返回了无效数据。');
  return value as Record<string, unknown>;
}

function stableVersion(value: unknown): string {
  if (typeof value !== 'string' || !/^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(value) || value.length > 64) {
    throw new SourceError('版本不是受支持的正式版本；预览版、测试版和非标准版本不会同步。');
  }
  return value.replace(/^v/, '');
}

function compareVersions(a: string, b: string): number {
  const left = stableVersion(a).split('.').map(BigInt);
  const right = stableVersion(b).split('.').map(BigInt);
  for (let index = 0; index < left.length; index++) {
    if (left[index] !== right[index]) return left[index] > right[index] ? 1 : -1;
  }
  return 0;
}

function positiveInteger(value: unknown, maximum = Number.MAX_SAFE_INTEGER): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0 && value <= maximum;
}

function safeUrl(value: string): URL | null {
  try {
    if (/[\s\\\u0000-\u001f\u007f]/.test(value) || !/^https:\/\/[^/?#:@]+(?:[/?#]|$)/.test(value)) return null;
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password && !url.port && !url.hash ? url : null;
  } catch { return null; }
}

/** 仅供固定 GitHub 发布资产及其官方 CDN 跳转使用，不接受任意 GitHub 页面。 */
export function approvedAssetUrl(value: string): boolean {
  const url = safeUrl(value);
  if (!url) return false;
  if (url.hostname === 'release-assets.githubusercontent.com' || url.hostname === 'objects.githubusercontent.com') {
    return /^\/github-production-release-asset(?:-[a-z0-9]+)?\/\d+\/[a-zA-Z0-9-]+$/.test(url.pathname);
  }
  if (url.hostname !== 'github.com' || url.search) return false;
  const parts = url.pathname.split('/');
  if (parts.length !== 7 || parts[1] !== 'Meteorkid' || parts[3] !== 'releases' || parts[4] !== 'download') return false;
  const source = githubSources.find(entry => entry.repository === parts[2]);
  if (!source) return false;
  try {
    const version = stableVersion(parts[5]);
    return source.assets.some(asset => parts[6] === asset.name(version) || parts[6] === `${asset.name(version)}.sha256`);
  } catch { return false; }
}

async function readRemote(url: string, fetcher: typeof fetch, maximum: number, followAssetRedirects = false): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    let target = url;
    for (let redirects = 0; redirects <= 3; redirects++) {
      if (followAssetRedirects && !approvedAssetUrl(target)) throw new SourceError('官方资产地址不在允许范围内。');
      const response = await fetcher(target, {
        redirect: 'manual', signal: controller.signal, cache: 'no-store',
        headers: { Accept: followAssetRedirects ? 'text/plain' : 'application/json', 'User-Agent': 'Meteor-Store-Product-Updates' },
      });
      if (response.status >= 300 && response.status < 400) {
        await response.body?.cancel();
        const location = response.headers.get('location');
        if (!followAssetRedirects || !location || redirects === 3) throw new SourceError('官方来源出现了不允许的跳转。', 'error');
        try { target = new URL(location, target).href; } catch { throw new SourceError('官方资产跳转地址无效。'); }
        continue;
      }
      if (!response.ok) {
        await response.body?.cancel();
        throw new SourceError(`官方来源请求失败（HTTP ${response.status}）。`, 'error');
      }
      const contentLength = response.headers.get('content-length');
      if (contentLength && (!/^\d+$/.test(contentLength) || Number(contentLength) > maximum)) {
        await response.body?.cancel();
        throw new SourceError('官方来源响应超过允许大小。', 'error');
      }
      if (!response.body) throw new SourceError('官方来源返回了空响应。', 'error');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let text = '';
      let bytes = 0;
      try {
        while (true) {
          const part = await reader.read();
          if (part.done) break;
          bytes += part.value.byteLength;
          if (bytes > maximum) {
            await reader.cancel();
            throw new SourceError('官方来源响应超过允许大小。', 'error');
          }
          text += decoder.decode(part.value, { stream: true });
        }
        return text + decoder.decode();
      } finally { reader.releaseLock(); }
    }
    throw new SourceError('官方资产跳转次数过多。', 'error');
  } catch (error) {
    // fetch 错误可能带 URL、签名参数或代理凭证，不能把原始异常写进检查快照。
    if (error instanceof SourceError) throw error;
    throw new SourceError(controller.signal.aborted ? '官方来源请求超时。' : '无法读取官方来源，请稍后重试。', 'error');
  } finally { clearTimeout(timeout); }
}

async function readJson(url: string, fetcher: typeof fetch): Promise<Record<string, unknown>> {
  const text = await readRemote(url, fetcher, MAX_JSON_BYTES);
  try { return record(JSON.parse(text)); } catch { throw new SourceError('官方来源返回了无效 JSON。', 'error'); }
}

function githubUrl(source: GitHubSource): string { return `https://github.com/Meteorkid/${source.repository}`; }

function releaseVersion(release: Record<string, unknown>): string {
  if (release.draft !== false || release.prerelease !== false ||
      (typeof release.name === 'string' && /(?:^|[\s._()-])(?:alpha|beta|rc\d*|preview|pre-release|prerelease|nightly|snapshot|canary)(?:$|[\s._()-])/i.test(release.name))) {
    throw new SourceError('来源是草稿或预览发布，不能同步到正式下载。');
  }
  if (!positiveInteger(release.id) || typeof release.published_at !== 'string' || !Number.isFinite(Date.parse(release.published_at))) {
    throw new SourceError('官方发布缺少有效的发布标识或发布时间。');
  }
  return stableVersion(release.tag_name);
}

async function releaseAssets(source: GitHubSource, release: Record<string, unknown>, rules: AssetRule[], fetcher: typeof fetch): Promise<ReleaseAsset[]> {
  const version = releaseVersion(release);
  if (!Array.isArray(release.assets)) throw new SourceError('官方发布没有资产列表。');
  const assets = release.assets.map(record);
  const pick = (name: string) => {
    const matches = assets.filter(asset => asset.name === name);
    if (matches.length !== 1) throw new SourceError('官方发布缺少已登记平台的唯一安装包或配对 SHA-256 校验文件。');
    const asset = matches[0];
    const expectedUrl = `${githubUrl(source)}/releases/download/${release.tag_name}/${name}`;
    if (!positiveInteger(asset.id) || !positiveInteger(asset.size, MAX_ASSET_BYTES) || asset.state !== 'uploaded' || asset.browser_download_url !== expectedUrl) {
      throw new SourceError('官方资产的标识、大小、状态或下载地址不符合固定来源规则。');
    }
    return asset;
  };
  return Promise.all(rules.map(async rule => {
    const name = rule.name(version);
    const asset = pick(name);
    let sha256: string;
    if (asset.digest != null) {
      if (typeof asset.digest !== 'string' || !/^sha256:[a-f0-9]{64}$/i.test(asset.digest)) throw new SourceError('官方资产没有有效的 SHA-256 校验值。');
      sha256 = asset.digest.slice(7).toLowerCase();
    } else {
      const sidecar = pick(`${name}.sha256`);
      if ((sidecar.size as number) > MAX_SIDECAR_BYTES) throw new SourceError('官方 SHA-256 校验文件超过允许大小。');
      const text = (await readRemote(sidecar.browser_download_url as string, fetcher, MAX_SIDECAR_BYTES, true)).trim();
      const match = /^([a-f0-9]{64})(?:[ \t]+\*?([^\r\n]+))?$/i.exec(text);
      if (!match || (match[2] !== undefined && match[2] !== name)) throw new SourceError('官方 SHA-256 校验文件没有精确匹配安装包。');
      sha256 = match[1].toLowerCase();
    }
    return { fileId: rule.fileId, name, url: asset.browser_download_url as string, sha256, bytes: asset.size as number, architecture: rule.architecture, assetId: asset.id as number };
  }));
}

function baseline(downloads: CurrentDownload[]): string | null {
  const versions = [...new Set(downloads.map(download => download.version ?? ''))];
  return versions.length === 1 && versions[0] ? versions[0] : null;
}

async function inspectGitHub(product: CurrentProduct, source: GitHubSource, row: ProductUpdateRow, fetcher: typeof fetch): Promise<void> {
  const rules = source.assets.filter(rule => product.downloads.some(download => download.id === rule.fileId));
  const downloads = product.downloads.filter(download => rules.some(rule => rule.fileId === download.id));
  row.currentVersion = baseline(downloads);
  if (!rules.length || downloads.length !== rules.length) throw new SourceError('没有唯一的已登记下载条目，不会新增或替换其他平台。');
  const release = await readJson(`https://api.github.com/repos/Meteorkid/${source.repository}/releases/latest`, fetcher);
  row.latestVersion = releaseVersion(release);
  row.releaseId = release.id as number;
  row.tag = release.tag_name as string;
  row.sourceUrl = `${githubUrl(source)}/releases/tag/${row.tag}`;
  row.publishedAt = release.published_at as string;
  row.assets = await releaseAssets(source, release, rules, fetcher);
  let changed = false;
  for (const download of downloads) {
    if (!download.version || !download.sha256 || !SHA256.test(download.sha256)) throw new SourceError('当前下载缺少正式版本或有效校验值，需先核对现有条目。');
    const comparison = compareVersions(row.latestVersion, download.version);
    if (comparison < 0) throw new SourceError('官方版本低于当前下载版本，已阻止降级。');
    const asset = row.assets.find(candidate => candidate.fileId === download.id)!;
    if (comparison === 0 && download.sha256.toLowerCase() !== asset.sha256) throw new SourceError('同一版本的官方构建校验值与当前下载不同，需人工核对，不能覆盖。');
    changed ||= comparison > 0;
  }
  row.status = changed ? 'update' : 'current';
  row.message = changed ? '已找到正式发布文件及官方 SHA-256，同步时校验下载内容。' : '当前下载已是官方正式版本。';
}

function pypiRelease(data: Record<string, unknown>): { version: string; publishedAt: string; isAlpha: boolean } {
  const info = record(data.info);
  if (typeof info.name !== 'string' || info.name.toLowerCase().replace(/[-_.]+/g, '-') !== PYPI_PACKAGE || info.yanked === true) throw new SourceError('PyPI 包名不匹配或发布已被撤回。');
  const version = stableVersion(info.version);
  if (!Array.isArray(data.urls) || data.urls.length === 0) throw new SourceError('PyPI 发布版本尚无可安装文件。');
  const published = data.urls.map(record).filter(file => file.yanked === false);
  if (!published.length) throw new SourceError('PyPI 发布文件已被撤回。');
  for (const file of published) {
    const url = typeof file.url === 'string' ? safeUrl(file.url) : null;
    const name = typeof file.filename === 'string' ? file.filename : '';
    const prefix = `omnicrawl_core-${version}`;
    const sdistPrefix = `${PYPI_PACKAGE}-${version}`;
    const validName = (file.packagetype === 'bdist_wheel' && name.startsWith(`${prefix}-`) && name.endsWith('.whl')) ||
      (file.packagetype === 'sdist' && [prefix, sdistPrefix].some(base => name === `${base}.tar.gz` || name === `${base}.zip`));
    if (!url || url.hostname !== 'files.pythonhosted.org' || url.search || !url.pathname.startsWith('/packages/') || !validName ||
        !positiveInteger(file.size, MAX_ASSET_BYTES) || !SHA256.test(String(record(file.digests).sha256 ?? '')) ||
        typeof file.upload_time_iso_8601 !== 'string' || !Number.isFinite(Date.parse(file.upload_time_iso_8601))) {
      throw new SourceError('PyPI 发布文件的名称、地址、大小、校验值或时间无效。');
    }
  }
  return { version, publishedAt: published[0].upload_time_iso_8601 as string, isAlpha: Array.isArray(info.classifiers) && info.classifiers.includes('Development Status :: 3 - Alpha') };
}

async function inspectPyPI(product: CurrentProduct, row: ProductUpdateRow, fetcher: typeof fetch): Promise<void> {
  const downloads = product.downloads.filter(download => download.id === 'pypi');
  if (downloads.length !== 1) throw new SourceError('没有唯一的已登记 PyPI 下载条目。');
  const download = downloads[0];
  row.currentVersion = download.version ?? null;
  const release = pypiRelease(await readJson(`https://pypi.org/pypi/${PYPI_PACKAGE}/json`, fetcher));
  row.latestVersion = release.version;
  row.publishedAt = release.publishedAt;
  row.link = { fileId: 'pypi', url: PYPI_URL, version: release.version, packageName: PYPI_PACKAGE };
  if (download.version && compareVersions(release.version, download.version) < 0) throw new SourceError('PyPI 版本低于当前下载版本，已阻止降级。');
  const changed = download.url !== PYPI_URL || !download.version || compareVersions(release.version, download.version) > 0;
  row.status = changed ? 'update' : 'current';
  row.message = changed ? '已确认 omnicrawl-core 已发布包，可同步安装链接与版本。' : 'PyPI 安装链接与已发布版本已是最新。';
  if (release.isAlpha) row.message += '项目元数据标注为 Alpha 开发阶段。';
}

export async function discoverProductUpdates(current: CurrentProduct[], options: FetchOptions = {}): Promise<ProductUpdateRow[]> {
  const fetcher = options.fetcher ?? fetch;
  return Promise.all(current.filter(product => product.productId === 'omnicrawl' || githubSources.some(source => source.productId === product.productId)).map(async product => {
    const source = githubSources.find(entry => entry.productId === product.productId);
    const row: ProductUpdateRow = {
      productId: product.productId, name: product.name, channel: source ? 'github-stable' : 'pypi',
      currentVersion: null, latestVersion: null, status: 'error', message: '',
      sourceUrl: source ? `${githubUrl(source)}/releases` : PYPI_URL, publishedAt: null, assets: [],
    };
    try {
      if (source) await inspectGitHub(product, source, row, fetcher);
      else await inspectPyPI(product, row, fetcher);
    } catch (error) {
      row.status = error instanceof SourceError ? error.status : 'error';
      row.message = error instanceof SourceError ? error.message : '无法检查官方来源，请稍后重试。';
    }
    return row;
  }));
}

/** 同步只核对检查时固定的发布，不能重新选择 latest。 */
export async function verifyInspectedRow(row: ProductUpdateRow, options: FetchOptions = {}): Promise<void> {
  const fetcher = options.fetcher ?? fetch;
  if (row.status !== 'update') throw new SourceError('该检查项不能同步。');
  const source = githubSources.find(entry => entry.productId === row.productId);
  if (source) {
    if (row.channel !== 'github-stable' || !positiveInteger(row.releaseId) || !row.tag || stableVersion(row.tag) !== row.latestVersion ||
        row.sourceUrl !== `${githubUrl(source)}/releases/tag/${row.tag}` || !row.assets.length || row.link) throw new SourceError('检查快照不符合固定发布规则。');
    const rules = source.assets.filter(rule => row.assets.some(asset => asset.fileId === rule.fileId));
    if (rules.length !== row.assets.length) throw new SourceError('检查快照包含未登记或重复的平台。');
    const release = await readJson(`https://api.github.com/repos/Meteorkid/${source.repository}/releases/${row.releaseId}`, fetcher);
    if (release.id !== row.releaseId || release.tag_name !== row.tag || releaseVersion(release) !== row.latestVersion) throw new SourceError('检查后的官方发布已变化，请重新检查。');
    const assets = await releaseAssets(source, release, rules, fetcher);
    for (const asset of assets) {
      const inspected = row.assets.find(candidate => candidate.fileId === asset.fileId)!;
      if (asset.assetId !== inspected.assetId || asset.name !== inspected.name || asset.url !== inspected.url || asset.sha256 !== inspected.sha256 || asset.bytes !== inspected.bytes || asset.architecture !== inspected.architecture) {
        throw new SourceError('检查后的官方安装包已变化，请重新检查。');
      }
    }
  } else if (row.productId === 'omnicrawl' && row.channel === 'pypi') {
    if (!row.latestVersion || stableVersion(row.latestVersion) !== row.latestVersion || row.assets.length || row.sourceUrl !== PYPI_URL ||
        row.link?.fileId !== 'pypi' || row.link.url !== PYPI_URL || row.link.packageName !== PYPI_PACKAGE || row.link.version !== row.latestVersion) throw new SourceError('检查快照不符合固定 PyPI 包规则。');
    const release = pypiRelease(await readJson(`https://pypi.org/pypi/${PYPI_PACKAGE}/${row.latestVersion}/json`, fetcher));
    if (release.version !== row.latestVersion) throw new SourceError('检查后的 PyPI 发布版本已变化，请重新检查。');
  } else { throw new SourceError('未登记的产品更新来源。'); }
}
