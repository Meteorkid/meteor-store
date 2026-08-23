import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { localizeProduct, products } from '../products';

const productPage = readFileSync(
  resolve(process.cwd(), 'src/app/[locale]/products/[id]/page.tsx'),
  'utf8',
);

describe('Ex-Memory 在线体验入口', () => {
  it('产品数据为中英文页面提供同一个站内体验地址', () => {
    const product = products.find((item) => item.id === 'ex-memory');
    expect(product).toBeDefined();
    expect(localizeProduct(product!, 'zh').experienceUrl).toBe('/apps/ex-memory');
    expect(localizeProduct(product!, 'en').experienceUrl).toBe('/apps/ex-memory');
  });

  it('在线体验使用隔离的新窗口打开', () => {
    const experienceLink = productPage.slice(
      productPage.indexOf('{product.experienceUrl && ('),
      productPage.indexOf('</Link>', productPage.indexOf('{product.experienceUrl && (')),
    );

    expect(experienceLink).toContain('target="_blank"');
    expect(experienceLink).toContain('rel="noopener noreferrer"');
  });
});
