import type { AnchorHTMLAttributes, ImgHTMLAttributes } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import zh from '../../../messages/zh.json';
import en from '../../../messages/en.json';

const state = vi.hoisted(() => ({ locale: 'en' as 'zh' | 'en', signedIn: false }));
vi.mock('next-intl', async original => {
  const intl = await original<typeof import('next-intl')>();
  return { ...intl, useLocale: () => state.locale,
    useTranslations: (namespace: keyof typeof en) => intl.createTranslator({ locale: state.locale, messages: state.locale === 'zh' ? zh : en, namespace }) };
});
vi.mock('next-intl/server', async () => {
  const { createTranslator } = await import('next-intl');
  return { getTranslations: async (namespace: keyof typeof en) => createTranslator({ locale: state.locale, messages: state.locale === 'zh' ? zh : en, namespace }) };
});
vi.mock('next/image', () => ({ default: ({ alt, src }: ImgHTMLAttributes<HTMLImageElement>) => <span role="img" aria-label={alt} data-src={src} /> }));
vi.mock('@/i18n/navigation', () => ({ Link: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props} /> }));
vi.mock('../AuthProvider', () => ({ useAuth: () => ({ user: state.signedIn ? { id: 'fixture-user' } : null }) }));
vi.mock('../DownloadCard', () => ({ default: ({ fileId, gated, label }: { fileId: string; gated: boolean; label: string }) => <span data-file={fileId} data-gated={gated}>{label}</span> }));

import ProductGallery from '../ProductGallery';
import BlogListClient from '../BlogListClient';
import DownloadSection from '../DownloadSection';
import { localizeProduct, products } from '@/data/products';

beforeEach(() => { state.locale = 'en'; state.signedIn = false; });
const product = (id: string) => localizeProduct(products.find(item => item.id === id)!, state.locale);

describe('产品媒体与获取入口', () => {
  it('画廊使用原生按钮，图片说明留在按钮外', () => {
    const html = renderToStaticMarkup(<ProductGallery product={product('xnook')} />);
    const figures = html.match(/<figure\b[\s\S]*?<\/figure>/g) ?? [];
    expect(figures.length).toBeGreaterThan(0);
    for (const figure of figures) {
      expect(figure).toContain('<button type="button"');
      expect(figure).toContain('</button><figcaption');
      expect(figure).not.toContain('role="button"');
    }
  });

  it.each(['zh', 'en'] as const)('%s 游客投稿保留登录回跳，已登录直接进入编辑器', locale => {
    state.locale = locale;
    const guest = renderToStaticMarkup(<BlogListClient posts={[]} counts={{}} />);
    expect(guest).toContain('href="/login?next=%2Fblog%2Fsubmit"');
    state.signedIn = true;
    const signedIn = renderToStaticMarkup(<BlogListClient posts={[]} counts={{}} />);
    expect(signedIn).toContain('href="/blog/submit"');
    expect(signedIn).not.toContain('/login?next=');
  });

  it.each(['zh', 'en'] as const)('%s 下载说明跟随现有渠道且不改变门控条目', async locale => {
    state.locale = locale;
    const messages = locale === 'zh' ? zh.ProductDetailPage : en.ProductDetailPage;
    for (const id of ['xisland', 'xnook']) {
      const html = renderToStaticMarkup(await DownloadSection({ product: product(id) }));
      expect(html).toContain(messages.downloadHintGated);
      expect(html).toContain('data-file="dmg" data-gated="true"');
      expect(html).not.toContain('Gitee');
    }
    const binary = renderToStaticMarkup(await DownloadSection({ product: product('statux') }));
    expect(binary).toContain(messages.downloadHint);
    expect(binary).toContain('data-file="macos-arm64" data-gated="false"');
    expect(binary).toContain('data-file="macos-x64" data-gated="false"');
    const packagePage = renderToStaticMarkup(await DownloadSection({ product: product('omnicrawl') }));
    expect(packagePage).toContain(messages.downloadHintPackage);
    expect(packagePage).toContain('data-file="pypi" data-gated="false"');
  });

  it('没有公开下载条目时不生成空的下载引导', async () => {
    expect(await DownloadSection({ product: { ...product('xnook'), downloads: [] } })).toBeNull();
  });
});
