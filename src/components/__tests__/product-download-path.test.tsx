import type { AnchorHTMLAttributes } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import ProductPage from '@/app/[locale]/products/[id]/page';
import LoginPage from '@/app/[locale]/login/page';
import DownloadCard from '@/components/DownloadCard';

vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));
vi.mock('next-intl/server', () => ({
  getTranslations: async () => (key: string) => key,
  setRequestLocale: vi.fn(),
}));
vi.mock('@/components/AuthProvider', () => ({ useAuth: () => ({ user: null }) }));
vi.mock('@/i18n/navigation', () => ({
  Link: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props} />,
}));
vi.mock('@/components/TransitionLink', () => ({
  default: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props} />,
}));
vi.mock('@/components/Header', () => ({ default: () => null }));
vi.mock('@/components/Footer', () => ({ default: () => null }));
vi.mock('@/components/ProductGallery', () => ({ default: () => null }));
vi.mock('@/components/ProductVisual', () => ({ default: () => null }));
vi.mock('@/components/InstallCommand', () => ({ default: () => null }));
vi.mock('@/components/DownloadSection', () => ({ default: () => null }));
vi.mock('@/components/ProductDemoEmbed', () => ({ default: () => null }));
vi.mock('@/components/PassOwnedBadge', () => ({ default: () => null }));
vi.mock('@/components/ProductPricingCards', () => ({ default: () => null }));
vi.mock('@/components/AuthForm', () => ({
  default: ({ next }: { next: string }) => <a href={next}>登录后的目的地</a>,
}));

function renderDownload(productId: string, gated: boolean) {
  return renderToStaticMarkup(
    <DownloadCard
      productId={productId}
      fileId={productId === 'statux' ? 'macos-arm64' : 'dmg'}
      label="下载 DMG"
      icon={null}
      iconColor=""
      recommended
      gated={gated}
    />,
  );
}

describe('产品下载与登录路径', () => {
  it.each([
    ['xisland', '下载 DMG'],
    ['xnook', '下载 DMG'],
    ['statux', 'macOS 二进制 (Apple 芯片)'],
  ])('%s 首屏下载按钮指向已有下载区', async (id, label) => {
    const html = renderToStaticMarkup(await ProductPage({
      params: Promise.resolve({ locale: 'zh', id }),
      searchParams: Promise.resolve({}),
    }));
    const downloadButton = html.match(/<a\b[^>]*>[\s\S]*?<\/a>/g)
      ?.find((anchor) => anchor.includes(label));
    expect(downloadButton).toBeDefined();
    expect(downloadButton).toContain('href="#download"');
    expect(html).not.toContain('releases/');
  });

  it.each(['xisland', 'xnook'])('%s 游客下载经登录页校验后仍回原下载区', async (productId) => {
    const html = renderDownload(productId, true);
    const href = html.match(/href="([^"]+)"/)?.[1];
    expect(href).toBeDefined();
    const url = new URL(href!, 'https://store.test');
    expect(url.pathname).toBe('/login');
    const next = url.searchParams.get('next');
    expect(next).toBe(`/products/${productId}#download`);

    const login = renderToStaticMarkup(await LoginPage({
      params: Promise.resolve({ locale: 'zh' }),
      searchParams: Promise.resolve({ next: next! }),
    }));
    expect(login).toContain(`href="/products/${productId}#download"`);
    expect(html).not.toContain('/api/download/');
  });

  it('Statux 免费下载直接走下载接口，无需登录', () => {
    const html = renderDownload('statux', false);
    expect(html).toContain('href="/api/download/statux?file=macos-arm64"');
    expect(html).not.toContain('/login');
  });
});
