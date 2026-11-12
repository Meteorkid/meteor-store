import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ pathname: '/', fullscreen: false }));
vi.mock('next/navigation', () => ({ usePathname: () => state.pathname }));
vi.mock('@/lib/fullscreen-experience', () => ({ isFullscreenExperiencePath: () => state.fullscreen }));
vi.mock('../EasterEggs', () => ({ default: () => <i data-preserved="easter-eggs" /> }));
vi.mock('../SpotlightSearch', () => ({ default: () => <i data-preserved="search" /> }));
vi.mock('../help/HelpPanel', () => ({ default: () => <i data-preserved="help" /> }));
vi.mock('../FilmGrain', () => ({ default: () => <i data-legacy-sky="grain" /> }));
vi.mock('../HeroCanvas', () => ({ default: () => <i data-legacy-sky="particles" /> }));
vi.mock('../MeteorShower', () => ({ default: () => <i data-legacy-sky="meteors" /> }));
import ExperienceAwareChrome from '../ExperienceAwareChrome';

describe('首页复用全站背景层', () => {
  it.each(['/', '/zh', '/en', '/zh/', '/en/'])('%s 挂载与产品页相同的背景层并保留搜索和帮助', pathname => {
    state.pathname = pathname;
    state.fullscreen = false;
    const html = renderToStaticMarkup(<ExperienceAwareChrome><p>content</p></ExperienceAwareChrome>);
    expect(html.match(/data-legacy-sky=/g)).toHaveLength(3);
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
});
