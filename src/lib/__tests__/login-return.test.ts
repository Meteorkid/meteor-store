import { describe, expect, it } from 'vitest';
import { buildLoginHref, normalizeLoginReturn } from '../login-return';
import { products } from '@/data/products';
import { appIds } from '@/data/app-manifest';

describe('normalizeLoginReturn', () => {
  it.each(['/masters?year=2020', '/masters?year=2100', '/phd', '/phd?year=2027'])('申请页回跳保留学位与合法入学年份：%s', value => {
    expect(normalizeLoginReturn(value)).toBe(value);
    expect(new URL(buildLoginHref(value), 'https://store.test').searchParams.get('next')).toBe(value);
  });
  it.each(['/phd?year=2019', '/masters?year=2101', '/phd?year=2027&year=2028', '/phd?year=2027&next=/admin',
    '/phd?year=2027#admin', '/phd?year=2027\n', '/phd?year=02027', '/phd?year=2027.0', '/phd?year=%32%30%32%37'])('申请页拒绝非法年份与额外回跳参数：%s', value => {
    expect(normalizeLoginReturn(value)).toBe('/');
  });
  it('日刊回跳保留合法日期、全部视图和栏目', () => {
    const href = '/daily?date=2026-10-22&view=all#papers';
    expect(normalizeLoginReturn(href)).toBe(href);
    expect(new URL(buildLoginHref(href), 'https://store.test').searchParams.get('next')).toBe(href);
    expect(normalizeLoginReturn('/daily#masters')).toBe('/daily#masters');
  });
  it.each(['/daily?date=2026-02-30', '/daily?date=2026-10-22&date=2026-10-23', '/daily?view=all&view=all',
    '/daily?view=admin', '/daily?date=2026-10-22&redirect=https://evil.example', '/daily#unknown', '/daily#%ZZ'])('拒绝不合法日刊回跳：%s', value => {
    expect(normalizeLoginReturn(value)).toBe('/');
  });
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

  it.each(appIds)('只允许已登记应用的准确挂载路径：%s', (id) => {
    const path = `/apps/${id}`;
    expect(normalizeLoginReturn(path)).toBe(path);
    expect(new URL(buildLoginHref(path), 'https://store.test').searchParams.get('next')).toBe(path);
    expect(normalizeLoginReturn(`${path}?next=https://evil.example`)).toBe('/');
    expect(normalizeLoginReturn(`${path}#download`)).toBe('/');
    expect(normalizeLoginReturn(`${path}/settings`)).toBe('/');
  });

  it.each([
    '/account', '/orders', '/redeem', '/blog/submit', '/blog/my-posts',
    '/blog/favorites', '/pathfinder/saved', '/student', '/pathfinder/opportunities',
    '/pathfinder/topics', '/pathfinder/organizations',
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

  it.each(['/pathfinder/items/pf_06fd62c7c93de63798c85674', '/pathfinder/topics/ai', '/pathfinder/organizations/Hugging%20Face'])('收藏或关注登录后返回准确对象：%s', (value) => {
    expect(normalizeLoginReturn(value)).toBe(value);
    expect(new URL(buildLoginHref(value), 'https://store.test').searchParams.get('next')).toBe(value);
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
    '/student?next=https://evil.example',
    '/pathfinder/items/../admin',
    '/pathfinder/items/a?next=https://evil.example',
    '/pathfinder/items/pf_test\n',
    '/pathfinder/topics/%2e%2e',
    '/pathfinder/topics/a%2fb',
    '/pathfinder/topics/a%5cb',
    '/pathfinder/topics/a%3fb',
    '/pathfinder/topics/%252fadmin',
    '/pathfinder/organizations/%0aevil',
    '/apps/unknown-app',
    '/apps/xisland',
    '/apps/tollow/../../admin',
    '/apps/tollow%2f..%2fadmin',
    '/apps/tollow\n',
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
