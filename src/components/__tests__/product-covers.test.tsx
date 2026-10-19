import { existsSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { products, localizeProduct } from '@/data/products';
import { productCoverSources } from '@/data/product-cover-sources';
import ProductVisual from '@/components/ProductVisual';

vi.mock('next-intl', () => ({
  useTranslations: () => (_key: string, values?: { name: string; description: string }) =>
    `${values?.name} 原型操作动画：${values?.description}`,
}));

describe('产品封面真实素材契约', () => {
  it('每款产品均有新制作短片与静态回退', () => {
    expect(Object.keys(productCoverSources).sort()).toEqual(products.map((p) => p.id).sort());
  });

  it.each(products)('$id 服务端保留回退图，不提前下载12段短片', (product) => {
    const source = productCoverSources[product.id];
    for (const file of [source.poster, source.video].filter((p): p is string => Boolean(p))) {
      expect(file).toMatch(/^\/products\/[^/]+\/[^/]+\.(webp|mp4)$/);
      expect(existsSync(path.join(process.cwd(), 'public', file))).toBe(true);
    }
    const html = renderToStaticMarkup(<ProductVisual product={localizeProduct(product, 'zh')} />);
    expect(html).toContain(`data-product-cover="${product.id}"`);
    expect(html).toContain('原型操作动画');
    expect(html).toContain(`src="${source.poster}"`);
    expect(html).toContain('data-cover-frame="poster"');
    expect(html).not.toMatch(/<(video|canvas|svg)\b/);
    expect(html).not.toContain('demo.mp4');
    expect(html).not.toContain('CONCEPT');
    expect(html).not.toContain('Agents, together.');
  });

  it('首屏尚未进入视口时不挂载播放器', () => {
    const html = renderToStaticMarkup(<ProductVisual product={localizeProduct(products.find((p) => p.id === 'xisland')!, 'zh')} />);
    expect(html).toContain('data-active="false"');
    expect(html).toContain('data-cover-frame="poster"');
  });
});
