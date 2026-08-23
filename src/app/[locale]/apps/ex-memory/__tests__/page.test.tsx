import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({ getSession: mocks.getSession }));
vi.mock('@/i18n/navigation', () => ({
  Link: 'a',
  redirect: mocks.redirect,
}));
vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(async () => (key: string) => key),
  setRequestLocale: vi.fn(),
}));
vi.mock('@/components/Header', async () => {
  const { createElement } = await import('react');
  return { default: () => createElement('header', { 'data-testid': 'store-header' }) };
});
vi.mock('@/components/Footer', async () => {
  const { createElement } = await import('react');
  return { default: () => createElement('footer', { 'data-testid': 'store-footer' }) };
});
vi.mock('@/components/ExMemoryExperienceFrame', async () => {
  const { createElement } = await import('react');
  return { default: () => createElement('iframe', { 'data-testid': 'experience-frame' }) };
});

import ExMemoryExperiencePage from '../page';

describe('Ex-Memory 全屏体验页', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('未登录时直接跳到当前语言登录页并保留体验返回地址', async () => {
    mocks.getSession.mockResolvedValue(null);

    await ExMemoryExperiencePage({ params: Promise.resolve({ locale: 'zh' }) });

    expect(mocks.redirect).toHaveBeenCalledWith({
      href: { pathname: '/login', query: { next: '/apps/ex-memory' } },
      locale: 'zh',
    });
  });

  it('登录后只渲染全屏体验，不渲染商城导航和页尾', async () => {
    mocks.getSession.mockResolvedValue({ userId: 'store-user' });

    const page = await ExMemoryExperiencePage({ params: Promise.resolve({ locale: 'zh' }) });
    const html = renderToStaticMarkup(page);

    expect(html).toContain('data-testid="experience-frame"');
    expect(html).not.toContain('data-testid="store-header"');
    expect(html).not.toContain('data-testid="store-footer"');
    expect(html).toContain('h-dvh');
    expect(html).toContain('w-screen');
  });
});
