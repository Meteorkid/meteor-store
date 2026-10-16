import { describe, expect, it } from 'vitest';
import { buildLoginHref, normalizeLoginReturn } from '../login-return';
import { products } from '@/data/products';

describe('normalizeLoginReturn', () => {
  it('每日一新登录后回到阅读页，仍拒绝附加的任意跳转', () => {
    expect(normalizeLoginReturn('/daily')).toBe('/daily');
    expect(normalizeLoginReturn('/masters')).toBe('/masters');
    expect(buildLoginHref('/masters')).toBe('/login?next=%2Fmasters');
    expect(buildLoginHref('/daily')).toBe('/login?next=%2Fdaily');
    expect(normalizeLoginReturn('/daily?next=https://evil.example')).toBe('/');
  });
  it('保留原有体验页并允许返回我的产品', () => {
    expect(normalizeLoginReturn('/apps/ex-memory')).toBe('/apps/ex-memory');
    expect(normalizeLoginReturn('/apps/tollow/trial')).toBe('/apps/tollow/trial');
    expect(normalizeLoginReturn('/apps')).toBe('/apps');
  });

  it.each([
    '/account', '/orders', '/redeem', '/blog/submit', '/blog/my-posts',
    '/blog/favorites', '/pathfinder/saved',
  ])('保留需要登录的站内目的地：%s', (path) => {
    expect(normalizeLoginReturn(path)).toBe(path);
    expect(new URL(buildLoginHref(path), 'https://store.test').searchParams.get('next')).toBe(path);
    expect(normalizeLoginReturn(`${path}?next=https://evil.example`)).toBe('/');
  });

  it.each([
    '/blog/submit?id=Abc_123-defG',
    '/blog/submit?id=Abc_123-defG&admin=1',
  ])('投稿编辑只保留合法文章 ID 和管理员入口标记：%s', (path) => {
    expect(normalizeLoginReturn(path)).toBe(path);
    expect(new URL(buildLoginHref(path), 'https://store.test').searchParams.get('next')).toBe(path);
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
    '/blog/submit?admin=1',
    '/blog/submit?id=',
    '/blog/submit?id=abc&admin=0',
    '/blog/submit?id=abc&next=https://evil.example',
    '/blog/submit?id=abc&id=def',
    '/blog/submit?id=abc%26admin%3D1',
    '/blog/submit?id=abc#fragment',
    '/blog/submit?id=abc\n',
    `/blog/submit?id=${'a'.repeat(65)}`,
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
