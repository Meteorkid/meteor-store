import { describe, it, expect } from 'vitest';
import { findProduct } from '../products';
import { products } from '@/data/products';

describe('findProduct', () => {
  it('returns product by id', () => {
    const product = findProduct('omnicrawl');
    expect(product).toBeDefined();
    expect(product?.name.zh).toBe('OmniCrawl');
    expect(product?.name.en).toBe('OmniCrawl');
  });

  it('returns undefined for non-existent id', () => {
    expect(findProduct('nonexistent')).toBeUndefined();
  });

  it('returns undefined for empty string', () => {
    expect(findProduct('')).toBeUndefined();
  });

  it('Tollow 已移入实验室：两档都免费，Pro 保留 ¥29 划线原价', () => {
    const tollow = findProduct('tollow');

    expect(tollow?.pricing.map((plan) => ({
      id: plan.id,
      price: plan.price,
      originalPrice: plan.originalPrice,
      period: plan.period,
    }))).toEqual([
      { id: 'free', price: 0, originalPrice: undefined, period: undefined },
      { id: 'pro', price: 0, originalPrice: 29, period: '买断' },
    ]);
  });
});

describe('产品公开下载源', () => {
  it('不再暴露已确认不存在的 Gitee 镜像和 Tollow npm 包', () => {
    const serialized = JSON.stringify(products);
    const unavailableSources = [
      'gitee.com/Meteorkid/omnicrawl',
      'gitee.com/Meteorkid/ex-memory',
      'gitee.com/Meteorkid/skeleton-anatomy',
      'gitee.com/Meteorkid/ui-design-system',
      'gitee.com/Meteorkid/statux',
      'gitee.com/Meteorkid/Tollow',
      'gitee.com/Meteorkid/XIsland',
      'gitee.com/Meteorkid/XNook',
      'gitee.com/Meteorkid/Chakra-Visualizer',
      'gitee.com/Meteorkid/webgl-fluid-sim',
      'gitee.com/Meteorkid/claude-phone-control',
      'gitee.com/Meteorkid/cursor-source-analyzer',
      'npmjs.com/package/tollow',
    ];

    for (const source of unavailableSources) {
      expect(serialized).not.toContain(source);
    }
  });

  it('安装包统一走 R2 分发：付费产品门控，免费产品公开', () => {
    const xnook = findProduct('xnook');
    const xisland = findProduct('xisland');
    const statux = findProduct('statux');

    // 付费产品（xnook / xisland）：下载条目必须标 gated 且配 r2Key
    for (const product of [xnook, xisland]) {
      for (const d of product?.downloads ?? []) {
        expect(d.gated).toBe(true);
        expect(d.r2Key).toBeTruthy();
      }
    }

    // 免费产品（statux）：不门控，但同样走 R2 分发（配 r2Key）
    for (const d of statux?.downloads ?? []) {
      expect(d.gated).not.toBe(true);
      expect(d.r2Key).toBeTruthy();
    }
  });
});
