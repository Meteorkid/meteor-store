import { describe, expect, it } from 'vitest';
import { homeFeaturedProductIds, selectHomeFeaturedProducts } from '../homepage';
import { products } from '../products';

describe('首页精选产品', () => {
  it('固定展示六款产品且不重复', () => {
    expect(homeFeaturedProductIds).toHaveLength(6);
    expect(new Set(homeFeaturedProductIds).size).toBe(homeFeaturedProductIds.length);
  });

  it('按运营配置顺序返回真实产品', () => {
    const featuredProducts = selectHomeFeaturedProducts(products);

    expect(featuredProducts.map((product) => product.id)).toEqual([
      'xisland',
      'xnook',
      'chakra-visualizer',
      'skeleton-anatomy',
      'tollow',
      'ex-memory',
    ]);
  });

  it('配置引用不存在的产品时直接报错', () => {
    expect(() => selectHomeFeaturedProducts([])).toThrow('未找到首页精选产品：xisland');
  });
});
