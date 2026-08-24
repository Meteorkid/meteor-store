import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  redirect: vi.fn(),
  tollowContexts: [] as Array<Record<string, unknown> | undefined>,
  notFound: vi.fn(() => {
    throw new Error('NOT_FOUND');
  }),
}));

vi.mock('@/lib/auth', () => ({ getSession: mocks.getSession }));
vi.mock('@/i18n/navigation', () => ({ redirect: mocks.redirect }));
vi.mock('next/navigation', () => ({ notFound: mocks.notFound }));
vi.mock('next-intl/server', () => ({ setRequestLocale: vi.fn() }));
vi.mock('@/lib/products', () => ({
  findProduct: (id: string) =>
    ['webgl-fluid-sim', 'skeleton-anatomy', 'chakra-visualizer', 'tollow'].includes(id)
      ? { id }
      : null,
}));
vi.mock('@/components/apps/registry', async () => {
  const { createElement } = await import('react');
  return {
    appComponents: {
      'webgl-fluid-sim': () => createElement('div', { 'data-app': 'webgl-fluid-sim' }),
      'skeleton-anatomy': () => createElement('div', { 'data-app': 'skeleton-anatomy' }),
      'chakra-visualizer': () => createElement('div', { 'data-app': 'chakra-visualizer' }),
      tollow: (context?: Record<string, unknown>) => {
        mocks.tollowContexts.push(context);
        return createElement('div', { 'data-app': 'tollow', 'data-user-id': context?.userId });
      },
    },
  };
});

import TrialPage from '../page';

describe('独立全屏应用体验页', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.tollowContexts.length = 0;
    mocks.getSession.mockResolvedValue(null);
  });

  it.each(['webgl-fluid-sim', 'skeleton-anatomy', 'chakra-visualizer'])(
    '%s 未登录时仍可全屏体验',
    async (id) => {
      const page = await TrialPage({ params: Promise.resolve({ locale: 'zh', id }) });
      const html = renderToStaticMarkup(page);

      expect(html).toContain(`data-app="${id}"`);
      expect(html).toContain('h-dvh');
      expect(html).toContain('w-screen');
      expect(html).toContain('overflow-hidden');
      expect(html).not.toContain('container');
      expect(mocks.getSession).not.toHaveBeenCalled();
    },
  );

  it('Tollow 未登录时跳转登录并保留返回地址', async () => {
    await TrialPage({ params: Promise.resolve({ locale: 'zh', id: 'tollow' }) });

    expect(mocks.getSession).toHaveBeenCalledOnce();
    expect(mocks.redirect).toHaveBeenCalledWith({
      href: { pathname: '/login', query: { next: '/apps/tollow/trial' } },
      locale: 'zh',
    });
  });

  it('Tollow 登录后直接渲染全屏应用', async () => {
    mocks.getSession.mockResolvedValue({ userId: 'user-1' });

    const page = await TrialPage({ params: Promise.resolve({ locale: 'en', id: 'tollow' }) });
    const html = renderToStaticMarkup(page);

    expect(html).toContain('data-app="tollow"');
    expect(html).toContain('data-user-id="user-1"');
    expect(mocks.tollowContexts).toEqual([
      { userId: 'user-1', tollowAccessLevel: 'free' },
    ]);
    expect(html).toContain('h-dvh');
    expect(mocks.redirect).not.toHaveBeenCalled();
  });
});
