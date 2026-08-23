import { describe, expect, it } from 'vitest';
import { productDisplayOrderIds, selectProductsInDisplayOrder } from '../product-order';
import { products } from '../products';

const expectedOrder = [
  'ex-memory',
  'xisland',
  'xnook',
  'statux',
  'tollow',
  'skeleton-anatomy',
  'webgl-fluid-sim',
  'omnicrawl',
  'ui-design-system',
  'chakra-visualizer',
  'claude-phone-control',
  'cursor-source-analyzer',
];

describe('产品展示顺序', () => {
  it('顺序配置唯一且覆盖全部产品', () => {
    expect(productDisplayOrderIds).toEqual(expectedOrder);
    expect(new Set(productDisplayOrderIds).size).toBe(productDisplayOrderIds.length);
    expect(new Set(productDisplayOrderIds)).toEqual(new Set(products.map((product) => product.id)));
  });

  it('按运营配置返回产品且不修改输入数组', () => {
    const input = [...products].reverse();
    const inputIds = input.map((product) => product.id);

    const orderedProducts = selectProductsInDisplayOrder(input);

    expect(orderedProducts.map((product) => product.id)).toEqual(expectedOrder);
    expect(input.map((product) => product.id)).toEqual(inputIds);
  });

  it('配置引用不存在的产品时直接报错', () => {
    expect(() => selectProductsInDisplayOrder([])).toThrow('未找到展示产品：ex-memory');
  });
});
