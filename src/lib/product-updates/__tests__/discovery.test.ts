import { afterEach, describe, expect, it, vi } from 'vitest';
import { execFileSync } from 'node:child_process';
import { approvedAssetUrl, discoverProductUpdates, verifyInspectedRow } from '../discovery';
import type { CurrentProduct, ProductUpdateRow } from '../types';

const HASH = 'a'.repeat(64);
const OLD_HASH = 'b'.repeat(64);
const DATE = '2026-10-20T12:00:00Z';

function current(productId = 'xisland', version = '1.13.0'): CurrentProduct {
  return {
    productId, name: productId,
    downloads: productId === 'statux'
      ? ['macos-arm64', 'macos-x64'].map(id => ({ id, version, sha256: OLD_HASH }))
      : productId === 'omnicrawl'
        ? [{ id: 'pypi', url: 'https://pypi.org/project/omnicrawl/' }]
        : [{ id: 'dmg', version, sha256: OLD_HASH, gated: true }],
  };
}

function githubRelease(repository = 'XIsland', version = '2.0.3') {
  const names = repository === 'statux' ? ['statux-darwin-arm64', 'statux-darwin-x64'] : [`${repository}-${version}.dmg`];
  return {
    id: 123, tag_name: `v${version}`, draft: false, prerelease: false, published_at: DATE,
    assets: names.map((name, index) => ({
      id: 456 + index, name, state: 'uploaded', size: 128,
      digest: `sha256:${HASH}` as string | null,
      browser_download_url: `https://github.com/Meteorkid/${repository}/releases/download/v${version}/${name}`,
    })),
  };
}

function pypiRelease(version = '0.3.0') {
  return {
    info: { name: 'omnicrawl-core', version, yanked: false },
    urls: [{
      filename: `omnicrawl_core-${version}-py3-none-any.whl`, packagetype: 'bdist_wheel', size: 100,
      url: `https://files.pythonhosted.org/packages/aa/bb/omnicrawl_core-${version}-py3-none-any.whl`,
      yanked: false, digests: { sha256: HASH }, upload_time_iso_8601: DATE,
    }],
  };
}

function jsonFetcher(body: unknown) {
  return vi.fn<typeof fetch>(async () => Response.json(body));
}

async function inspect(body: unknown, product = current()): Promise<ProductUpdateRow> {
  return (await discoverProductUpdates([product], { fetcher: jsonFetcher(body) }))[0];
}

afterEach(() => { vi.useRealTimers(); });

describe('产品官方更新发现', () => {
  it('模块可在工作进程的 Node 原生类型剥离模式下直接加载', () => {
    const output = execFileSync(process.execPath, ['--experimental-strip-types', '--input-type=module', '-e',
      'import { discoverProductUpdates } from "./src/lib/product-updates/discovery.ts"; console.log(JSON.stringify(await discoverProductUpdates([])));',
    ], { cwd: process.cwd(), encoding: 'utf8' });
    expect(output.trim()).toBe('[]');
  });

  it('检查已有 DMG 并固定发布和资产标识，不改写传入目录', async () => {
    const product = current();
    const saved = structuredClone(product);
    const fetcher = jsonFetcher(githubRelease());
    const [row] = await discoverProductUpdates([product], { fetcher });
    expect(row).toMatchObject({ status: 'update', currentVersion: '1.13.0', latestVersion: '2.0.3', releaseId: 123, tag: 'v2.0.3' });
    expect(row.assets).toEqual([{
      fileId: 'dmg', name: 'XIsland-2.0.3.dmg', url: 'https://github.com/Meteorkid/XIsland/releases/download/v2.0.3/XIsland-2.0.3.dmg',
      sha256: HASH, bytes: 128, assetId: 456, architecture: 'macos-arm64',
    }]);
    expect(product).toEqual(saved);
    expect(fetcher).toHaveBeenCalledWith('https://api.github.com/repos/Meteorkid/XIsland/releases/latest', expect.objectContaining({ redirect: 'manual', cache: 'no-store', signal: expect.any(AbortSignal) }));
  });

  it('隔离单个来源失败并继续检查另一个产品，不泄漏原始异常 URL 或凭证', async () => {
    const fetcher = vi.fn<typeof fetch>(async input => {
      if (String(input).includes('/XIsland/')) throw new Error('https://user:secret@127.0.0.1/?token=private');
      return Response.json(githubRelease('XNook', '1.4.0'));
    });
    const rows = await discoverProductUpdates([current(), current('xnook', '1.3.16')], { fetcher });
    expect(rows.map(row => row.status)).toEqual(['error', 'update']);
    expect(JSON.stringify(rows)).not.toMatch(/secret|token|127\.0\.0\.1/);
  });

  it.each([
    ['1.9.9', '1.10.0', 'update'],
    ['1.10.0', '1.9.9', 'blocked'],
    ['2.0.0', '1.99.99', 'blocked'],
    ['v1.10.0', '1.10.0', 'current'],
  ])('数值比较版本 %s → %s 为 %s', async (before, latest, status) => {
    const product = current('xisland', before);
    product.downloads[0].sha256 = HASH;
    expect((await inspect(githubRelease('XIsland', latest), product)).status).toBe(status);
  });

  it('阻止同版本不同哈希的 Statux，保留独立二进制渠道', async () => {
    const row = await inspect(githubRelease('statux', '0.4.3'), current('statux', '0.4.3'));
    expect(row.status).toBe('blocked');
    expect(row.message).toContain('同一版本');
    expect(row.assets.map(asset => asset.fileId)).toEqual(['macos-arm64', 'macos-x64']);
  });

  it('只检查已登记的 Statux 平台，不新增来源里的其他平台', async () => {
    const product = current('statux', '0.4.2');
    product.downloads = product.downloads.slice(0, 1);
    const row = await inspect(githubRelease('statux', '0.4.3'), product);
    expect(row.status).toBe('update');
    expect(row.assets.map(asset => asset.fileId)).toEqual(['macos-arm64']);
  });

  it('只收到未登记平台时不请求来源', async () => {
    const product = current();
    product.downloads[0].id = 'windows';
    const fetcher = jsonFetcher(githubRelease());
    expect((await discoverProductUpdates([product], { fetcher }))[0].status).toBe('blocked');
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('忽略未登记的产品渠道', async () => {
    const fetcher = jsonFetcher({});
    expect(await discoverProductUpdates([current('web-tool')], { fetcher })).toEqual([]);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it.each([
    { draft: true }, { prerelease: true }, { tag_name: 'v2.0.3-beta.1' }, { tag_name: 'v2.0.3-rc1' },
    { tag_name: 'v2.0.3-preview' }, { name: 'Windows Preview 2.0.3' },
  ])('拒绝草稿和预览发布 %j', async patch => {
    expect((await inspect({ ...githubRelease(), ...patch })).status).toBe('blocked');
  });

  it('缺少官方 digest 和配对校验文件时阻止更新', async () => {
    const release = githubRelease();
    release.assets[0].digest = null;
    const row = await inspect(release);
    expect(row.status).toBe('blocked');
    expect(row.message).toContain('SHA-256');
  });

  it('digest 缺失时读取精确配对的 sha256 sidecar', async () => {
    const release = githubRelease();
    const binary = release.assets[0];
    binary.digest = null;
    const sidecar = { ...binary, id: 999, name: `${binary.name}.sha256`, browser_download_url: `${binary.browser_download_url}.sha256` };
    release.assets.push(sidecar);
    const fetcher = vi.fn<typeof fetch>(async input => String(input).endsWith('.sha256') ? new Response(`${HASH}  ${binary.name}\n`) : Response.json(release));
    const [row] = await discoverProductUpdates([current()], { fetcher });
    expect(row.status).toBe('update');
    expect(row.assets[0].sha256).toBe(HASH);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('校验文件列出的文件名必须与安装包一致', async () => {
    const release = githubRelease();
    const binary = release.assets[0];
    binary.digest = null;
    release.assets.push({ ...binary, id: 999, name: `${binary.name}.sha256`, browser_download_url: `${binary.browser_download_url}.sha256` });
    const fetcher = vi.fn<typeof fetch>(async input => String(input).endsWith('.sha256') ? new Response(`${HASH}  other.dmg`) : Response.json(release));
    const [row] = await discoverProductUpdates([current()], { fetcher });
    expect(row.status).toBe('blocked');
    expect(row.message).toContain('精确匹配');
  });

  it.each([
    'http://127.0.0.1/private',
    'https://github.com.evil.test/Meteorkid/XIsland/releases/download/v2.0.3/XIsland-2.0.3.dmg',
    'https://user:secret@github.com/Meteorkid/XIsland/releases/download/v2.0.3/XIsland-2.0.3.dmg',
    'https://github.com/Other/XIsland/releases/download/v2.0.3/XIsland-2.0.3.dmg',
    'https://github.com/Meteorkid/XIsland/releases/download/v2.0.4/XIsland-2.0.3.dmg',
  ])('拒绝异常资产地址且不请求它：%s', async url => {
    const release = githubRelease();
    release.assets[0].browser_download_url = url;
    const fetcher = jsonFetcher(release);
    const [row] = await discoverProductUpdates([current()], { fetcher });
    expect(row.status).toBe('blocked');
    expect(row.message).not.toContain(url);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('不能用另一个平台的包替代缺少的 DMG', async () => {
    const release = githubRelease();
    release.assets[0].name = 'XIsland-2.0.3-windows.zip';
    expect((await inspect(release)).status).toBe('blocked');
  });

  it('拒绝重复命名或不完整的发布资产', async () => {
    const release = githubRelease();
    release.assets.push({ ...release.assets[0], id: 789 });
    expect((await inspect(release)).status).toBe('blocked');
    release.assets = [{ ...release.assets[0], state: 'new' }];
    expect((await inspect(release)).status).toBe('blocked');
  });

  it('检查时即阻止超过工作进程 128 MiB 上限的安装包', async () => {
    const release = githubRelease();
    release.assets[0].size = 128 * 1024 * 1024 + 1;
    expect((await inspect(release)).status).toBe('blocked');
  });

  it('API 重定向到内网时停止，不读取 Location 指向的地址', async () => {
    const fetcher = vi.fn<typeof fetch>(async () => new Response(null, { status: 302, headers: { location: 'http://169.254.169.254/latest/meta-data/' } }));
    const [row] = await discoverProductUpdates([current()], { fetcher });
    expect(row.status).toBe('error');
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('sidecar 跳转到内网时停止，不发出第二跳请求', async () => {
    const release = githubRelease();
    const binary = release.assets[0];
    binary.digest = null;
    release.assets.push({ ...binary, id: 999, name: `${binary.name}.sha256`, browser_download_url: `${binary.browser_download_url}.sha256` });
    const fetcher = vi.fn<typeof fetch>(async input => String(input).endsWith('.sha256')
      ? new Response(null, { status: 302, headers: { location: 'http://127.0.0.1/secret' } }) : Response.json(release));
    const [row] = await discoverProductUpdates([current()], { fetcher });
    expect(row.status).toBe('blocked');
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('JSON 无论声明长度还是实际流长度都有限制', async () => {
    for (const response of [
      new Response('{}', { headers: { 'content-length': String(3 * 1024 * 1024) } }),
      new Response('x'.repeat(2 * 1024 * 1024 + 1)),
    ]) {
      const fetcher = vi.fn<typeof fetch>(async () => response);
      const [row] = await discoverProductUpdates([current()], { fetcher });
      expect(row.status).toBe('error');
      expect(row.message).toContain('大小');
    }
  });

  it('网络请求有超时上限并返回可展示的错误', async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn<typeof fetch>(async (_input, options) => new Promise((_resolve, reject) => {
      options?.signal?.addEventListener('abort', () => reject(new Error('abort with secret URL')));
    }));
    const checking = discoverProductUpdates([current()], { fetcher });
    await vi.advanceTimersByTimeAsync(15_001);
    expect((await checking)[0]).toMatchObject({ status: 'error', message: '官方来源请求超时。' });
  });

  it('PyPI 使用真实发布文件确认 omnicrawl-core 并修复旧项目链接', async () => {
    const fetcher = jsonFetcher(pypiRelease());
    const [row] = await discoverProductUpdates([current('omnicrawl')], { fetcher });
    expect(row).toMatchObject({ status: 'update', channel: 'pypi', latestVersion: '0.3.0', assets: [], link: {
      fileId: 'pypi', packageName: 'omnicrawl-core', version: '0.3.0', url: 'https://pypi.org/project/omnicrawl-core/',
    } });
    expect(fetcher).toHaveBeenCalledWith('https://pypi.org/pypi/omnicrawl-core/json', expect.any(Object));
  });

  it('PyPI 正确链接与版本重复检查保持 current', async () => {
    const product = current('omnicrawl');
    product.downloads[0] = { id: 'pypi', version: '0.3.0', url: 'https://pypi.org/project/omnicrawl-core/' };
    expect((await inspect(pypiRelease(), product)).status).toBe('current');
  });

  it('保留 PyPI Alpha 开发阶段说明，不把稳定版本号描述为成熟产品', async () => {
    const release = pypiRelease();
    const row = await inspect({ ...release, info: { ...release.info, classifiers: ['Development Status :: 3 - Alpha'] } }, current('omnicrawl'));
    expect(row.status).toBe('update');
    expect(row.message).toContain('Alpha');
  });

  it('不把 PyPI 源码版本、错误包或已撤回文件当作可安装正式发布', async () => {
    for (const data of [
      { info: { name: 'omnicrawl-core', version: '0.3.0' }, urls: [] },
      { ...pypiRelease(), info: { name: 'omnicrawl', version: '0.3.0' } },
      { ...pypiRelease(), urls: pypiRelease().urls.map(file => ({ ...file, yanked: true })) },
      pypiRelease('0.4.0rc1'),
    ]) expect((await inspect(data, current('omnicrawl'))).status).toBe('blocked');
  });
});

describe('同步前复核固定检查快照', () => {
  it('按 releaseId 重新读取，不重新选择 latest', async () => {
    const row = await inspect(githubRelease());
    const fetcher = jsonFetcher(githubRelease());
    await verifyInspectedRow(row, { fetcher });
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith('https://api.github.com/repos/Meteorkid/XIsland/releases/123', expect.any(Object));
  });

  it.each(['id', 'name', 'browser_download_url', 'digest', 'size'] as const)('资产 %s 变化时拒绝同步', async field => {
    const row = await inspect(githubRelease());
    const changed = githubRelease();
    const asset = changed.assets[0];
    if (field === 'id') asset.id = 999;
    else if (field === 'size') asset.size = 129;
    else if (field === 'digest') asset.digest = `sha256:${OLD_HASH}`;
    else asset[field] += '-changed';
    await expect(verifyInspectedRow(row, { fetcher: jsonFetcher(changed) })).rejects.toThrow();
  });

  it('发布 id 或 tag 被替换时拒绝同步', async () => {
    const row = await inspect(githubRelease());
    for (const patch of [{ id: 124 }, { tag_name: 'v2.0.4' }, { prerelease: true }]) {
      await expect(verifyInspectedRow(row, { fetcher: jsonFetcher({ ...githubRelease(), ...patch }) })).rejects.toThrow();
    }
  });

  it('拒绝未登记或重复平台的快照，不请求来源', async () => {
    const row = await inspect(githubRelease());
    row.assets.push({ ...row.assets[0], fileId: 'windows' });
    const fetcher = jsonFetcher(githubRelease());
    await expect(verifyInspectedRow(row, { fetcher })).rejects.toThrow('平台');
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('PyPI 复核固定版本，不被新 latest 替换', async () => {
    const row = await inspect(pypiRelease(), current('omnicrawl'));
    const fetcher = jsonFetcher(pypiRelease());
    await verifyInspectedRow(row, { fetcher });
    expect(fetcher).toHaveBeenCalledWith('https://pypi.org/pypi/omnicrawl-core/0.3.0/json', expect.any(Object));
    await expect(verifyInspectedRow(row, { fetcher: jsonFetcher(pypiRelease('0.4.0')) })).rejects.toThrow('已变化');
  });
});

describe('下载跳转地址白名单', () => {
  it.each([
    'https://github.com/Meteorkid/XIsland/releases/download/v2.0.3/XIsland-2.0.3.dmg',
    'https://github.com/Meteorkid/XNook/releases/download/v1.4.0/XNook-1.4.0.dmg.sha256',
    'https://github.com/Meteorkid/statux/releases/download/v0.4.3/statux-darwin-x64',
    'https://release-assets.githubusercontent.com/github-production-release-asset/123/abc-123?sig=private',
    'https://objects.githubusercontent.com/github-production-release-asset-2e65be/123/abc-123?sig=private',
  ])('允许固定资产与官方 CDN：%s', url => { expect(approvedAssetUrl(url)).toBe(true); });

  it.each([
    'http://github.com/Meteorkid/XIsland/releases/download/v2.0.3/XIsland-2.0.3.dmg',
    'https://127.0.0.1/file', 'https://[::1]/file', 'https://github.com:8443/file',
    'https://github.com:443/Meteorkid/XIsland/releases/download/v2.0.3/XIsland-2.0.3.dmg',
    'https://user:password@release-assets.githubusercontent.com/github-production-release-asset/123/abc-123',
    'https://release-assets.githubusercontent.com.evil.test/github-production-release-asset/123/abc-123',
    'https://github.com/Meteorkid/XIsland/releases/download/v2.0.3/Windows.exe',
    'https://github.com/Meteorkid/XIsland/releases/download/v2.0.3-preview/XIsland-2.0.3.dmg',
    'https://github.com/Meteorkid/XIsland/releases/download/v2.0.3/XIsland-2.0.3.dmg?redirect=private',
    'https://github.com/unknown/XIsland/releases/download/v2.0.3/XIsland-2.0.3.dmg',
    'https://raw.githubusercontent.com/Meteorkid/XIsland/main/install.sh',
    'https://release-assets.githubusercontent.com/private',
  ])('拒绝非批准下载地址：%s', url => { expect(approvedAssetUrl(url)).toBe(false); });
});
