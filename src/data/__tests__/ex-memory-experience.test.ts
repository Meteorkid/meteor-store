import { describe, expect, it } from 'vitest';
import { localizeProduct, products } from '../products';

describe('Ex-Memory 在线体验入口', () => {
  it('产品数据为中英文页面提供同一个站内体验地址', () => {
    const product = products.find((item) => item.id === 'ex-memory');
    expect(product).toBeDefined();
    expect(localizeProduct(product!, 'zh').experienceUrl).toBe('/apps/ex-memory');
    expect(localizeProduct(product!, 'en').experienceUrl).toBe('/apps/ex-memory');
  });
});
