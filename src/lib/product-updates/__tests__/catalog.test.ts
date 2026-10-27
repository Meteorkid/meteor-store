import { mkdtemp, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { products } from '../../../data/products.ts';
import { getProductWithCurrentDownloads, readCurrentCatalog, writeCatalog } from '../catalog.ts';
import type { DownloadOverride, ReleaseCatalog } from '../types.ts';

let directory: string;
const sha256 = 'a'.repeat(64);

function island(version = '1.14.0', hash = sha256): DownloadOverride {
  return { version, sha256: hash, r2Key: `releases/xisland/${version}/XIsland-${version}.dmg` };
}

function catalog(downloads: ReleaseCatalog['downloads'] = { xisland: { dmg: island() } }): ReleaseCatalog {
  return { version: 1, updatedAt: '2026-10-22T01:02:03.000Z', downloads };
}

async function save(value: ReleaseCatalog) {
  const { revision } = await readCurrentCatalog({ directory });
  await writeCatalog(value, revision, { directory });
}

beforeEach(async () => {
  directory = await mkdtemp(path.join(os.tmpdir(), 'product-catalog-'));
  vi.stubEnv('PRODUCT_UPDATES_DIR', directory);
});

afterEach(async () => {
  vi.unstubAllEnvs();
  await rm(directory, { recursive: true, force: true });
});

describe('动态下载目录', () => {
  it('启用软件授权后只开放XNook/XIsland试用下载，不把试用变成零元永久领取', async () => {
    vi.stubEnv('SOFTWARE_LICENSE_ENABLED', 'true');
    for (const id of ['xnook', 'xisland']) {
      const product = await getProductWithCurrentDownloads(id);
      expect(product!.downloads!.every(file => file.gated === false)).toBe(true);
      expect(product!.downloads![0].note!.zh).toContain('14 天');
      expect(product!.pricing.every(plan => plan.price > 0)).toBe(true);
      expect(products.find(item => item.id === id)!.downloads![0].gated).toBe(true);
    }
    expect(await getProductWithCurrentDownloads('statux')).toEqual(products.find(item => item.id === 'statux'));
  });

  it('无文件时仅列四个静态下载产品，并且不写文件', async () => {
    const state = await readCurrentCatalog({ directory });
    expect(state.catalogError).toBe(false);
    expect(state.current.map((product) => product.productId).sort()).toEqual(['omnicrawl', 'statux', 'xisland', 'xnook']);
    expect(state.catalog.downloads).toEqual({});
    expect(state.revision).toMatch(/^[a-f0-9]{64}$/);
    expect(await readdir(directory)).toEqual([]);
  });

  it('合法覆盖保留静态价格、门控、文件 ID 和其余字段，不改变原产品', async () => {
    const original = structuredClone(products.find((product) => product.id === 'xisland')!);
    await save(catalog());
    const result = await getProductWithCurrentDownloads('xisland');
    expect(result).toEqual({ ...original, downloads: original.downloads!.map((file) => ({ ...file, ...island() })) });
    expect(result!.downloads![0].gated).toBe(true);
    expect(result!.pricing).toEqual(original.pricing);
    expect(products.find((product) => product.id === 'xisland')).toEqual(original);
    expect(await getProductWithCurrentDownloads('does-not-exist')).toBeUndefined();
    expect(await getProductWithCurrentDownloads('tollow')).toEqual(products.find((product) => product.id === 'tollow'));
  });

  it('目录缺少的下载保持静态，Statux 两种架构与 PyPI 固定链接可同时更新', async () => {
    await save(catalog({
      statux: {
        'macos-arm64': { version: '0.5.0', sha256, r2Key: 'releases/statux/0.5.0/statux-darwin-arm64' },
        'macos-x64': { version: '0.5.0', sha256: 'b'.repeat(64), r2Key: 'releases/statux/0.5.0/statux-darwin-x64' },
      },
      omnicrawl: { pypi: { version: '1.2.3', url: 'https://pypi.org/project/omnicrawl-core/' } },
    }));
    const state = await readCurrentCatalog({ directory });
    expect(state.catalogError).toBe(false);
    expect(state.current.find((product) => product.productId === 'statux')?.downloads.map((file) => file.version)).toEqual(['0.5.0', '0.5.0']);
    expect((await getProductWithCurrentDownloads('omnicrawl'))?.downloads?.[0]).toMatchObject({
      id: 'pypi', version: '1.2.3', url: 'https://pypi.org/project/omnicrawl-core/',
    });
    expect(await getProductWithCurrentDownloads('xnook')).toEqual(products.find((product) => product.id === 'xnook'));
  });

  it('损坏目录与文件缺失有区别，公共读取安全回落，不能覆盖损坏目录', async () => {
    await writeFile(path.join(directory, 'catalog.json'), '{broken');
    const state = await readCurrentCatalog({ directory });
    expect(state.catalogError).toBe(true);
    expect(await getProductWithCurrentDownloads('xisland')).toEqual(products.find((product) => product.id === 'xisland'));
    await expect(writeCatalog(catalog(), state.revision, { directory })).rejects.toThrow('损坏');
    expect(await readFile(path.join(directory, 'catalog.json'), 'utf8')).toBe('{broken');
  });

  it.each([
    ['顶层未知字段', { ...catalog(), gated: false }],
    ['未知产品', catalog({ other: { dmg: island() } })],
    ['未知文件', catalog({ xisland: { windows: island() } })],
    ['尝试改门控', catalog({ xisland: { dmg: { ...island(), gated: false } as DownloadOverride } })],
    ['尝试改 ID', catalog({ xisland: { dmg: { ...island(), id: 'other' } as DownloadOverride } })],
    ['尝试改价格', catalog({ xisland: { dmg: { ...island(), price: 0 } as DownloadOverride } })],
    ['二进制公开地址', catalog({ xisland: { dmg: { ...island(), url: 'https://github.com/a/a.dmg' } } })],
    ['缺少对象或 hash', catalog({ xisland: { dmg: { version: '1.14.0' } } })],
    ['非预期文件名', catalog({ xisland: { dmg: { ...island(), r2Key: 'releases/xisland/1.14.0/other.dmg' } } })],
    ['错误产品路径', catalog({ xisland: { dmg: { ...island(), r2Key: 'releases/xnook/1.14.0/XIsland-1.14.0.dmg' } } })],
    ['路径穿越', catalog({ xisland: { dmg: { ...island(), r2Key: 'releases/xisland/1.14.0/../XIsland-1.14.0.dmg' } } })],
    ['预发布版本', catalog({ xisland: { dmg: island('1.14.0-beta.1') } })],
    ['带 v 版本', catalog({ xisland: { dmg: island('v1.14.0') } })],
    ['非法 SHA', catalog({ xisland: { dmg: island('1.14.0', 'not-a-hash') } })],
    ['错误 PyPI 包', catalog({ omnicrawl: { pypi: { version: '1.2.3', url: 'https://pypi.org/project/omnicrawl/' } } })],
    ['PyPI 用户名', catalog({ omnicrawl: { pypi: { version: '1.2.3', url: 'https://evil@pypi.org/project/omnicrawl-core/' } } })],
    ['PyPI 查询串', catalog({ omnicrawl: { pypi: { version: '1.2.3', url: 'https://pypi.org/project/omnicrawl-core/?next=evil' } } })],
    ['PyPI 预发布版本', catalog({ omnicrawl: { pypi: { version: '1.2.3rc1', url: 'https://pypi.org/project/omnicrawl-core/' } } })],
    ['原型产品字段', JSON.parse('{"version":1,"updatedAt":"2026-10-22T01:02:03.000Z","downloads":{"__proto__":{}}}')],
  ])('拒绝%s，写入和文件读取使用同一验证', async (_name, invalid) => {
    const state = await readCurrentCatalog({ directory });
    await expect(writeCatalog(invalid as ReleaseCatalog, state.revision, { directory })).rejects.toThrow();
    expect(await readdir(directory)).toEqual([]);
    await writeFile(path.join(directory, 'catalog.json'), JSON.stringify(invalid));
    expect((await readCurrentCatalog({ directory })).catalogError).toBe(true);
    expect(await getProductWithCurrentDownloads('xisland')).toEqual(products.find((product) => product.id === 'xisland'));
  });

  it('拒绝低于静态版本和静态同版异 hash 的目录', async () => {
    await expect(save(catalog({ xisland: { dmg: island('1.12.0') } }))).rejects.toThrow('降级');
    await expect(save(catalog({ xisland: { dmg: island('1.13.0') } }))).rejects.toThrow('同版本');
    expect(await readdir(directory)).toEqual([]);
  });

  it('写入前也检查运行时版本，拒绝退回静态、降级和同版换 hash', async () => {
    await save(catalog());
    const previous = await readFile(path.join(directory, 'catalog.json'), 'utf8');
    await expect(save(catalog({}))).rejects.toThrow('降级');
    await expect(save(catalog({ xisland: { dmg: island('1.13.1') } }))).rejects.toThrow('降级');
    await expect(save(catalog({ xisland: { dmg: island('1.14.0', 'b'.repeat(64)) } }))).rejects.toThrow('同版本');
    expect(await readFile(path.join(directory, 'catalog.json'), 'utf8')).toBe(previous);
  });

  it('不能移除已发布的 PyPI 版本', async () => {
    await save(catalog({ omnicrawl: { pypi: { version: '1.2.3', url: 'https://pypi.org/project/omnicrawl-core/' } } }));
    await expect(save(catalog({}))).rejects.toThrow();
  });

  it('旧 revision 拒绝切换，同进程竞争只有一次成功且不会留下永久锁', async () => {
    const { revision } = await readCurrentCatalog({ directory });
    const results = await Promise.allSettled([
      writeCatalog(catalog(), revision, { directory }),
      writeCatalog(catalog({ xisland: { dmg: island('1.15.0') } }), revision, { directory }),
    ]);
    expect(results.map((result) => result.status)).toEqual(['fulfilled', 'rejected']);
    await expect(writeCatalog(catalog(), revision, { directory })).rejects.toThrow('重新检查');
    expect((await readCurrentCatalog({ directory })).current.find((product) => product.productId === 'xisland')?.downloads[0].version).toBe('1.14.0');
    expect(await readdir(directory)).toEqual(['catalog.json']);
  });

  it('目录与文件权限固定为 700/600，历史最多保留 20 份且可读回旧内容', async () => {
    await save(catalog());
    const previous = await readFile(path.join(directory, 'catalog.json'), 'utf8');
    await save(catalog({ xisland: { dmg: island('1.15.0') } }));
    const historyDirectory = path.join(directory, 'history');
    expect(await readFile(path.join(historyDirectory, (await readdir(historyDirectory))[0]), 'utf8')).toBe(previous);
    for (let patch = 1; patch <= 22; patch += 1) await save(catalog({ xisland: { dmg: island(`1.15.${patch}`) } }));
    const history = await readdir(historyDirectory);
    expect(history).toHaveLength(20);
    expect((await stat(directory)).mode & 0o777).toBe(0o700);
    expect((await stat(historyDirectory)).mode & 0o777).toBe(0o700);
    expect((await stat(path.join(directory, 'catalog.json'))).mode & 0o777).toBe(0o600);
    for (const name of history) expect((await stat(path.join(historyDirectory, name))).mode & 0o777).toBe(0o600);
    expect((await readCurrentCatalog({ directory })).catalogError).toBe(false);
  });

  it('备份阶段失败时保留旧目录并清理临时文件，修复后能重试', async () => {
    await save(catalog());
    const previous = await readFile(path.join(directory, 'catalog.json'), 'utf8');
    await writeFile(path.join(directory, 'history'), 'blocked');
    await expect(save(catalog({ xisland: { dmg: island('1.15.0') } }))).rejects.toThrow();
    expect(await readFile(path.join(directory, 'catalog.json'), 'utf8')).toBe(previous);
    expect((await readdir(directory)).filter((name) => name.endsWith('.tmp'))).toEqual([]);
    await rm(path.join(directory, 'history'));
    await save(catalog({ xisland: { dmg: island('1.15.0') } }));
    expect((await getProductWithCurrentDownloads('xisland'))?.downloads?.[0].version).toBe('1.15.0');
  });

  it('切换期间读者始终读到完整有效的旧版或新版', async () => {
    await save(catalog());
    const writes = (async () => {
      for (let patch = 1; patch <= 5; patch += 1) await save(catalog({ xisland: { dmg: island(`1.14.${patch}`) } }));
    })();
    for (let i = 0; i < 20; i += 1) {
      const state = await readCurrentCatalog({ directory });
      expect(state.catalogError).toBe(false);
      expect(state.current.find((product) => product.productId === 'xisland')?.downloads[0].version).toMatch(/^1\.14\.[0-5]$/);
    }
    await writes;
  });

  it('revision 不依赖 JSON 字段顺序，静态门控变更使旧快照失效', async () => {
    await save(catalog());
    const first = await readCurrentCatalog({ directory });
    await writeFile(path.join(directory, 'catalog.json'), JSON.stringify({ downloads: catalog().downloads, updatedAt: catalog().updatedAt, version: 1 }));
    expect((await readCurrentCatalog({ directory })).revision).toBe(first.revision);
    const product = products.find((item) => item.id === 'xisland')!;
    const previousGate = product.downloads![0].gated;
    try {
      product.downloads![0].gated = false;
      expect((await readCurrentCatalog({ directory })).revision).not.toBe(first.revision);
      await expect(writeCatalog(catalog(), first.revision, { directory })).rejects.toThrow('重新检查');
    } finally {
      product.downloads![0].gated = previousGate;
    }
  });
});
