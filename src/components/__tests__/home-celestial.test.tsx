import type { AnchorHTMLAttributes } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ locale: 'zh', reduced: false }));
vi.mock('next-intl', () => ({ useLocale: () => state.locale }));
vi.mock('@/lib/motion', () => ({ useReducedMotion: () => state.reduced }));
vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => <a href={`/${state.locale}${href}`} {...props} />,
}));
vi.mock('../home/HomeSky', () => ({
  default: ({ peopleVisible, paused }: { peopleVisible: boolean; paused: boolean }) => <div data-sky-people={String(peopleVisible)} data-sky-paused={String(paused)} />,
}));
import HeroSection from '../HeroSection';

function render(locale: string, reduced = false) {
  state.locale = locale;
  state.reduced = reduced;
  return renderToStaticMarkup(<HeroSection productCount={19} webAppCount={8} freeCount={7} helpCount={31} />);
}

describe('首页星光首屏', () => {
  it('服务端可读标题与入口保留中文语义，星空默认不展示人海', () => {
    const html = render('zh');
    expect(html).toContain('星光不远');
    expect(html).toContain('href="/zh/products"');
    expect(html).toContain('href="/zh/docs"');
    expect(html).toContain('data-sky-people="false"');
    expect(html).toContain('data-sky-paused="false"');
    expect(html).toContain('aria-label="看见星光背后的人"');
    expect(html).not.toContain('data-celestial-fallback');
  });

  it('英文首页有完整入口与可读标题，不把中文专属字形当作英文文案', () => {
    const html = render('en');
    expect(html).toContain('Starlight is near');
    expect(html).toContain('href="/en/products"');
    expect(html).toContain('href="/en/docs"');
    expect(html).toContain('See the people behind the starlight');
    expect(html).not.toContain('data-celestial-fallback');
  });

  it('减少动态偏好默认暂停，真实统计由调用方数据决定', () => {
    const html = render('zh', true);
    expect(html).toContain('data-sky-paused="true"');
    expect(html).toContain('aria-label="目录中的工具: 19"');
    expect(html).toContain('aria-label="可在线体验的应用: 8"');
    expect(html).toContain('aria-label="免费工具: 7"');
    expect(html).toContain('aria-label="帮助文档: 31"');
  });
});
