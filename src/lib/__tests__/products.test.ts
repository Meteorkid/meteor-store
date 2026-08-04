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

  it('保留已确认可用的 XIsland Gitee 镜像', () => {
    expect(JSON.stringify(findProduct('xisland'))).toContain('gitee.com/Meteorkid/XIsland');
  });
});
