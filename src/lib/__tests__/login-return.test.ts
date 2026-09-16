import { describe, expect, it } from 'vitest';
import { buildLoginHref, normalizeLoginReturn } from '../login-return';
import { products } from '@/data/products';

describe('normalizeLoginReturn', () => {
  it('保留原有体验页并允许返回我的产品', () => {
    expect(normalizeLoginReturn('/apps/ex-memory')).toBe('/apps/ex-memory');
    expect(normalizeLoginReturn('/apps/tollow/trial')).toBe('/apps/tollow/trial');
    expect(normalizeLoginReturn('/apps')).toBe('/apps');
  });

  it('所有现有产品都能返回详情、下载或定价区', () => {
    for (const product of products) {
      for (const anchor of ['', '#download', '#pricing']) {
        const href = `/products/${product.id}${anchor}`;
        expect(normalizeLoginReturn(href)).toBe(href);
      }
    }
  });

  it.each([
    'https://evil.example',
    '//evil.example',
    '/\\evil.example',
    '/products/xisland/../../admin',
    '/products/xisland%2f..%2fadmin',
    '/products/xisland?next=https://evil.example',
    '/products/xisland#unexpected',
    '/products/xisland\n',
    '/products/unknown-product',
    '/admin',
    '',
    null,
    undefined,
  ])('拒绝非白名单地址：%s', (value) => {
    expect(normalizeLoginReturn(value)).toBe('/');
  });
});

describe('buildLoginHref', () => {
  it('编码回跳中的下载锚点，使它留在 next 参数中', () => {
    const url = new URL(buildLoginHref('/products/xisland#download'), 'https://store.test');
    expect(url.pathname).toBe('/login');
    expect(url.hash).toBe('');
    expect(url.searchParams.get('next')).toBe('/products/xisland#download');
    expect(buildLoginHref('https://evil.example')).toBe('/login');
  });
});
