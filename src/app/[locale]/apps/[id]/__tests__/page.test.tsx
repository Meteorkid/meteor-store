import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  getUserEntitlements: vi.fn(),
  getTollowAccess: vi.fn(),
  redirect: vi.fn(() => { throw new Error('REDIRECT'); }),
  notFound: vi.fn(() => { throw new Error('NOT_FOUND'); }),
  renderApp: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({ getSession: mocks.getSession }));
vi.mock('@/lib/entitlements', () => ({ getUserEntitlements: mocks.getUserEntitlements }));
vi.mock('@/lib/tollow-access', () => ({ getTollowAccess: mocks.getTollowAccess }));
vi.mock('@/components/Header', () => ({ default: () => null }));
vi.mock('@/components/Footer', () => ({ default: () => null }));
vi.mock('@/i18n/navigation', () => ({ Link: 'a', redirect: mocks.redirect }));
vi.mock('next/navigation', () => ({ notFound: mocks.notFound }));
vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(async () => (key: string) => key),
  setRequestLocale: vi.fn(),
}));
vi.mock('@/components/apps/registry', () => ({
  appComponents: {
    'webgl-fluid-sim': mocks.renderApp,
    'skeleton-anatomy': mocks.renderApp,
    'chakra-visualizer': mocks.renderApp,
    tollow: mocks.renderApp,
  },
}));

import AppPage, { generateMetadata } from '../page';
import { appIds } from '@/data/app-manifest';
import { findProduct } from '@/lib/products';

describe('旧应用入口与站内应用门控', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getSession.mockResolvedValue({ userId: 'user-1', email: 'user@example.com' });
    mocks.getUserEntitlements.mockResolvedValue([]);
    mocks.getTollowAccess.mockResolvedValue({ level: 'none' });
    mocks.renderApp.mockReturnValue('已授权应用内容');
  });

  it.each([
    ['xisland', '/products/xisland#download'],
    ['xnook', '/products/xnook#download'],
    ['statux', '/products/statux#download'],
    ['claude-phone-control', '/products/claude-phone-control'],
    ['cursor-source-analyzer', '/products/cursor-source-analyzer'],
  ])('%s 旧入口回到真实产品获取页', async (id, href) => {
    for (const locale of ['zh', 'en']) {
      await expect(AppPage({ params: Promise.resolve({ locale, id }) })).rejects.toThrow('REDIRECT');
      expect(mocks.redirect).toHaveBeenLastCalledWith({ href, locale });
    }
    expect(mocks.getSession).not.toHaveBeenCalled();
    expect(mocks.renderApp).not.toHaveBeenCalled();
  });

  it('不存在的产品仍返回 404', async () => {
    await expect(AppPage({ params: Promise.resolve({ locale: 'zh', id: 'missing' }) }))
      .rejects.toThrow('NOT_FOUND');
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it.each(appIds)('%s 游客登录保留原应用入口，并按语言展示产品介绍', async (id) => {
    mocks.getSession.mockResolvedValue(null);
    const product = findProduct(id)!;
    for (const locale of ['zh', 'en'] as const) {
      const page = await AppPage({ params: Promise.resolve({ locale, id }) });
      const html = renderToStaticMarkup(page);
      expect(html).toContain(`href="/login?next=${encodeURIComponent(`/apps/${id}`)}"`);
      expect(html).toContain(product.name[locale]);
      expect(html).toContain(product.tagline[locale]);
      expect(html).toContain('freeLockedDesc');
      expect(html).not.toContain('>lockedTitle<');
    }
    expect(mocks.renderApp).not.toHaveBeenCalled();
    expect(mocks.getUserEntitlements).not.toHaveBeenCalled();
    expect(mocks.getTollowAccess).not.toHaveBeenCalled();
  });

  it.each(['webgl-fluid-sim', 'skeleton-anatomy', 'chakra-visualizer'])(
    '%s 只有授权通过才渲染应用',
    async (id) => {
      const params = Promise.resolve({ locale: 'zh', id });
      const lockedPage = await AppPage({ params });
      expect(renderToStaticMarkup(lockedPage)).toContain('freeLockedTitle');
      expect(renderToStaticMarkup(lockedPage)).toContain('getFree');
      expect(mocks.renderApp).not.toHaveBeenCalled();

      mocks.getUserEntitlements.mockResolvedValue([{ productId: id }]);
      const unlockedPage = await AppPage({ params });
      expect(renderToStaticMarkup(unlockedPage)).toContain('已授权应用内容');
      expect(mocks.renderApp).toHaveBeenCalledWith({
        locale: 'zh', userId: 'user-1', tollowAccessLevel: undefined,
      });
      expect(mocks.redirect).not.toHaveBeenCalled();
    },
  );

  it('Tollow 继续使用自己的权限级别', async () => {
    const params = Promise.resolve({ locale: 'en', id: 'tollow' });
    await AppPage({ params });
    expect(mocks.renderApp).not.toHaveBeenCalled();

    mocks.getTollowAccess.mockResolvedValue({ level: 'free' });
    await AppPage({ params });
    expect(mocks.renderApp).toHaveBeenCalledWith({
      locale: 'en', userId: 'user-1', tollowAccessLevel: 'free',
    });
    expect(mocks.getUserEntitlements).not.toHaveBeenCalled();
  });
});


describe('站内应用搜索元信息', () => {
  it.each(appIds)('%s 使用本地化产品标题并排除私人应用页面索引', async id => {
    const product = findProduct(id)!;
    for (const locale of ['zh', 'en'] as const) {
      const metadata = await generateMetadata({ params: Promise.resolve({ locale, id }) });
      expect(metadata.title).toContain(product.name[locale]);
      expect(metadata.description).toBe(product.tagline[locale]);
      expect(metadata.robots).toEqual({ index: false, follow: true });
    }
  });
});
