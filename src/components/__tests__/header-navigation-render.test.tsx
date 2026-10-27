import { renderToStaticMarkup } from 'react-dom/server';
import type { AnchorHTMLAttributes } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import zh from '../../../messages/zh.json';
import en from '../../../messages/en.json';

const state = vi.hoisted(() => ({ locale: 'zh', pathname: '/', user: null }));
vi.mock('next-intl', () => ({
  useLocale: () => state.locale,
  useTranslations: () => (key: string) => (state.locale === 'en' ? en : zh).Header[key as keyof typeof zh.Header],
}));
vi.mock('@/i18n/navigation', () => ({
  usePathname: () => state.pathname,
  Link: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props} />,
}));
vi.mock('../AuthProvider', () => ({ useAuth: () => ({ user: state.user, logout: vi.fn() }) }));
vi.mock('../UserMenu', () => ({ default: () => <button>Account fixture</button> }));
vi.mock('../NotificationBell', () => ({ default: () => <button>Notifications fixture</button> }));
vi.mock('../LanguageSwitcher', () => ({ default: () => <button>Language fixture</button> }));
vi.mock('../BrandMark', () => ({ default: () => <svg aria-hidden="true" /> }));

import Header from '../Header';

beforeEach(() => { state.locale = 'zh'; state.pathname = '/'; });

describe('主导航初始呈现', () => {
  it.each(['zh', 'en'])('%s 一级名称是独立总览链接，旁边按钮只负责展开', locale => {
    state.locale = locale;
    const html = renderToStaticMarkup(<Header />);
    for (const [id, href] of Object.entries({ products: '/products', daily: '/daily', learn: '/pathfinder', content: '/blog', help: '/docs' })) {
      expect(html).toMatch(new RegExp(`<a(?=[^>]*id="header-overview-${id}")(?=[^>]*href="${href}")[^>]*>`));
      expect(html).toMatch(new RegExp(`<button(?=[^>]*id="header-trigger-${id}")(?=[^>]*aria-expanded="false")[^>]*>`));
    }
    expect(html).not.toMatch(/<a[^>]*>[^<]*<button/);
  });
  it('五个展开按钮有独立关系，不把隐藏面板链接留在键盘顺序内', () => {
    const html = renderToStaticMarkup(<Header />);
    for (const id of ['products', 'daily', 'learn', 'content', 'help']) {
      expect(html).toContain(`id="header-trigger-${id}"`);
      expect(html).toContain(`aria-controls="header-panel-${id}"`);
      expect(html).not.toContain(`id="header-panel-${id}"`);
    }
    expect(html).not.toContain('id="header-mobile-panel"');
    expect(html).not.toContain('href="/products/xisland"');
    expect(html).toContain('aria-label="主导航"');
  });

  it('保留回首页、搜索、移动菜单状态及既有彩蛋入口', () => {
    const html = renderToStaticMarkup(<Header />);
    expect(html).toContain('href="/"');
    expect(html).toContain('data-meteor-logo="true"');
    expect(html).toContain('aria-label="搜索"');
    expect(html).toContain('aria-label="打开菜单"');
    expect(html).toContain('aria-controls="header-mobile-panel"');
    expect(html).toContain('aria-expanded="false"');
  });

  it('英文导航使用英文入口，不把中文菜单标题留在英文页', () => {
    state.locale = 'en';
    const html = renderToStaticMarkup(<Header />);
    expect(html).toContain('Main navigation');
    expect(html).toContain('Products');
    expect(html).toContain('Daily');
    expect(html).toContain('Open menu');
    expect(html).not.toContain('每日一新');
  });
});
