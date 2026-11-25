import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ pathname: '/', fullscreen: false, theme: 'nebula' }));
vi.mock('next/navigation', () => ({ usePathname: () => state.pathname }));
vi.mock('@/lib/fullscreen-experience', () => ({ isFullscreenExperiencePath: () => state.fullscreen }));
vi.mock('../EasterEggs', () => ({ default: () => <i data-preserved="easter-eggs" /> }));
vi.mock('../SpotlightSearch', () => ({ default: () => <i data-preserved="search" /> }));
vi.mock('../help/HelpPanel', () => ({ default: () => <i data-preserved="help" /> }));
vi.mock('../FilmGrain', () => ({ default: () => <i data-legacy-sky="grain" /> }));
vi.mock('../HeroCanvas', () => ({ default: () => <i data-legacy-sky="particles" /> }));
vi.mock('../MeteorShower', () => ({ default: () => <i data-legacy-sky="meteors" /> }));
vi.mock('@/components/theme/ThemeProvider', () => ({ useOptionalSiteTheme: () => ({ theme: state.theme }) }));
import ExperienceAwareChrome from '../ExperienceAwareChrome';

describe('首页与内页的星空分层', () => {
  it.each(['/', '/zh', '/en', '/zh/', '/en/'])('%s 不再重复挂载通用粒子，只保留流星与 grain，并保留搜索和帮助', pathname => {
    state.pathname = pathname;
    state.fullscreen = false;
    const html = renderToStaticMarkup(<ExperienceAwareChrome><p>content</p></ExperienceAwareChrome>);
    expect(html.match(/data-legacy-sky=/g)).toHaveLength(2);
    expect(html).toContain('data-preserved="search"');
    expect(html).toContain('data-preserved="help"');
    expect(html).toContain('content');
  });

  it.each(['/zh/products', '/en/blog', '/daily', '/zh/account'])('%s 不改变既有背景入口', pathname => {
    state.pathname = pathname;
    state.fullscreen = false;
    const html = renderToStaticMarkup(<ExperienceAwareChrome><p>content</p></ExperienceAwareChrome>);
    expect(html.match(/data-legacy-sky=/g)).toHaveLength(3);
  });

  it('全屏应用仍不挂商城外壳', () => {
    state.fullscreen = true;
    const html = renderToStaticMarkup(<ExperienceAwareChrome><p>app</p></ExperienceAwareChrome>);
    expect(html).toBe('<p>app</p>');
  });

  it('行星轨道首页用场景自带星空，内页沿用全站背景', () => {
    state.fullscreen = false;
    state.theme = 'orbit';
    for (const pathname of ['/zh', '/en', '/zh/products']) {
      state.pathname = pathname;
      const html = renderToStaticMarkup(<ExperienceAwareChrome><p>content</p></ExperienceAwareChrome>);
      expect(html.match(/data-legacy-sky=/g)).toHaveLength(pathname.endsWith('/products') ? 3 : 1);
    }
    state.theme = 'nebula';
  });
});
