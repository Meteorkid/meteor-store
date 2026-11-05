import { describe, expect, it } from 'vitest';
import { homeFeaturedProductIds } from '../homepage';
import { productDisplayOrderIds } from '../product-order';
import { getProductTrack, labProductIds, productLineIds } from '../product-tracks';
import { localizeProduct, products } from '../products';

const duocast = products.find((product) => product.id === 'duocast')!;

describe('DuoCast 产品目录', () => {
  it('以单一免费档追加到实验室，不加入 Pass 主产品线', () => {
    expect(products.filter((product) => product.id === 'duocast')).toHaveLength(1);
    expect(duocast.category).toBe('utility');
    expect(getProductTrack('duocast')).toBe('lab');
    expect(labProductIds.at(-1)).toBe('duocast');
    expect(productDisplayOrderIds.at(-1)).toBe('duocast');
    expect(productLineIds).not.toContain('duocast');
    expect(duocast.pricing).toHaveLength(1);
    expect(duocast.pricing[0]).toMatchObject({ id: 'free', price: 0 });
    expect(duocast.pricing[0].originalPrice).toBeUndefined();
  });

  it('仅提供已核实的 Apple Silicon 构建，经私有 R2 匿名下载', () => {
    expect(duocast.platforms).toEqual(['macOS 14.2+', 'Apple Silicon']);
    expect(duocast.downloads).toHaveLength(1);
    expect(duocast.downloads![0]).toMatchObject({
      id: 'macos-arm64',
      icon: 'zip',
      r2Key: 'releases/duocast/0.1.1/DuoCast-0.1.1-macOS-arm64.zip',
      version: '0.1.1',
      sha256: '92efeae754d2da37459047d936bcca9855c9a5ec9b3fc74d19b4b3c9755eae28',
    });
    expect(duocast.downloads![0].gated).not.toBe(true);
    expect(duocast.downloads![0].url).toBeUndefined();
    expect(duocast.quickstart?.download).toBe('/api/download/duocast?file=macos-arm64');
    expect(duocast.github).toBe('https://github.com/Meteorkid/duocast');
    expect(duocast.license).toBeUndefined();
    expect(duocast.appUrl).toBeUndefined();
    expect(duocast.experienceUrl).toBeUndefined();
  });

  it.each(['zh', 'en'] as const)('%s 获取说明保留签名、公证、权限与平台限制', (locale) => {
    const product = localizeProduct(duocast, locale);
    expect(product.quickstart?.note).toContain('ad-hoc');
    expect(product.quickstart?.note).toContain('Apple');
    expect(product.quickstart?.note).toContain(locale === 'zh' ? '未经 Apple 公证' : 'not notarized by Apple');
    expect(product.quickstart?.note).toContain(locale === 'zh' ? '录屏与系统录音' : 'Screen & System Audio Recording');
    expect(product.description).toContain(locale === 'zh' ? '不保证两副蓝牙耳机同时播放' : 'simultaneous playback on two Bluetooth headsets is not guaranteed');
    expect(product.description).toContain(locale === 'zh' ? 'Windows 暂无安装包' : 'no Windows installer is available yet');
    expect(product.description).not.toMatch(/永久免费|free forever|lifetime free/i);
  });

  it('保留既有首页精选配置的六项顺序', () => {
    expect(homeFeaturedProductIds).toEqual([
      'ex-memory', 'xisland', 'xnook', 'statux', 'tollow', 'skeleton-anatomy',
    ]);
  });
});
