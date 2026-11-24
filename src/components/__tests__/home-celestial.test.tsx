import { Children, isValidElement } from 'react';
import type { AnchorHTMLAttributes } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { products } from '@/data/products';
import type { SiteTheme } from '@/lib/appearance';
import type { OrbitProduct } from '../OrbitHeroSection';

const state = vi.hoisted(() => ({ locale: 'zh', reduced: false, theme: 'nebula' as SiteTheme }));
vi.mock('next-intl', () => ({ useLocale: () => state.locale, useTranslations: () => (key: string) => key }));
vi.mock('next-intl/server', () => ({ setRequestLocale: vi.fn() }));
vi.mock('@/lib/motion', () => ({ useReducedMotion: () => state.reduced }));
vi.mock('@/i18n/navigation', () => ({
  usePathname: () => '/zh',
  Link: ({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => <a href={`/${state.locale}${href}`} {...props} />,
}));
vi.mock('../theme/ThemeProvider', () => ({
  useOptionalSiteTheme: () => ({ theme: state.theme, saving: false, saveError: null, setTheme: vi.fn() }),
}));
vi.mock('../home/HomeSky', () => ({
  default: ({ peopleVisible, paused, interactionMode, autoRotate }: { peopleVisible: boolean; paused: boolean; interactionMode: string; autoRotate: boolean }) => <div data-sky-people={String(peopleVisible)} data-sky-paused={String(paused)} data-sky-view={interactionMode} data-sky-orbit={String(autoRotate)} />,
}));
vi.mock('../OrbitHeroSection', () => ({
  default: ({ products }: { products: readonly OrbitProduct[] }) =>
    <section data-orbit-hero>{products.map(product => <p key={product.id} data-product={product.id}>{product.name} · {product.tagline}</p>)}</section>,
}));
import HeroSection from '../HeroSection';
import Home from '@/app/[locale]/page';

function render(locale: string, reduced = false, orbitProducts?: readonly OrbitProduct[]) {
  state.locale = locale;
  state.reduced = reduced;
  return renderToStaticMarkup(<HeroSection productCount={19} webAppCount={8} freeCount={7} helpCount={31} orbitProducts={orbitProducts} />);
}

describe('首页星光首屏', () => {
  it('服务端可读标题与入口保留中文语义，星空默认不展示人海', () => {
    const html = render('zh');
    expect(html).toContain('星光不远');
    expect(html).toContain('href="/zh/products"');
    expect(html).toContain('浏览产品');
    expect(html).toContain('href="/zh/playground"');
    expect(html).toContain('在线体验');
    expect(html).toContain('data-sky-people="false"');
    expect(html).toContain('data-sky-paused="false"');
    expect(html).toContain('data-sky-view="follow"');
    expect(html).toContain('data-sky-orbit="false"');
    expect(html).toContain('aria-label="星空视角设置" aria-expanded="false"');
    expect(html).toContain('aria-label="看见星光背后的人"');
    expect(html).not.toContain('data-celestial-fallback');
  });

  it('英文首页有完整入口与可读标题，不把中文专属字形当作英文文案', () => {
    const html = render('en');
    expect(html).toContain('Starlight is near');
    expect(html).toContain('href="/en/products"');
    expect(html).toContain('href="/en/playground"');
    expect(html).toContain('Try apps online');
    expect(html).toContain('See the people behind the starlight');
    expect(html).not.toContain('data-celestial-fallback');
  });

  it('减少动态偏好默认暂停，真实统计由调用方数据决定', () => {
    const html = render('zh', true);
    expect(html).toContain('data-sky-paused="true"');
    expect(html).toContain('data-sky-view="off"');
    expect(html).toContain('data-sky-orbit="false"');
    expect(html).toContain('aria-label="目录中的工具: 19"');
    expect(html).toContain('aria-label="可在线体验的应用: 8"');
    expect(html).toContain('aria-label="免费工具: 7"');
    expect(html).toContain('aria-label="帮助文档: 31"');
  });

  it('经典紫夜复用原来的紫色流体首页，不挂载星云画布', () => {
    state.theme = 'classic';
    const html = render('zh');
    expect(html).toContain('data-classic-hero');
    expect(html).toContain('headingLine1');
    expect(html).not.toContain('data-sky-people');
  });

  it('黑洞视界首屏保留首页入口与服务端目录统计', () => {
    state.theme = 'horizon';
    const html = render('zh');
    expect(html).toContain('data-horizon-hero');
    expect(html).toMatch(/data-horizon-dock="true"[^>]*>[\s\S]*?目录统计[\s\S]*?观测控制/);
    expect(html).toContain('越过视界');
    expect(html).toContain('href="/zh/products"');
    expect(html).toContain('href="/zh/study"');
    expect(html).toContain('href="/zh/docs"');
    expect(html).toMatch(/<dt>目录产品<\/dt><dd>19<\/dd>/);
    expect(html).toMatch(/<dt>在线应用<\/dt><dd>8<\/dd>/);
    expect(html).toMatch(/<dt>免费实验作品<\/dt><dd>7<\/dd>/);
    expect(html).toMatch(/<dt>帮助文档<\/dt><dd>31<\/dd>/);
    expect(html).not.toContain('data-sky-people');
    expect(html).not.toContain('data-classic-hero');

    const english = render('en');
    expect(english).toContain('Beyond the');
    expect(english).toContain('href="/en/study"');
  });

  it('黑洞首屏保留原演示公开的控制范围，减少动态仅暂停自动环绕', () => {
    state.theme = 'horizon';
    const html = render('en');
    expect(html).toContain('data-black-hole-viewport');
    expect(html).toMatch(/<details class="[^"]+"><summary/);
    expect(html).toContain('More settings</summary>');
    expect(html.indexOf('Lensed Overlook')).toBeLessThan(html.indexOf('<details'));
    expect(html).toMatch(/aria-pressed="true">Lensed Overlook/);
    expect(html).toMatch(/aria-pressed="true">Doppler/);
    expect(html).toMatch(/aria-pressed="true" aria-disabled="false">Auto-Orbit/);
    expect(html).toMatch(/min="0.7" max="1.7" step="0.05" value="1.22"/);
    expect(html).toMatch(/min="0.2" max="2" step="0.1" value="1"/);
    const reduced = render('en', true);
    expect(reduced).toMatch(/aria-pressed="false" aria-disabled="true"[^>]*>Auto-Orbit/);
    expect(reduced).toContain('Polar View');
  });

  it('行星轨道使用服务端传入的本地化产品，不挂载其他主题首屏', () => {
    state.theme = 'orbit';
    const html = render('zh', false, [{ id: 'xisland', name: 'XIsland', tagline: '产品副标题' }]);
    expect(html).toContain('data-orbit-hero');
    expect(html).toContain('data-product="xisland">XIsland · 产品副标题');
    expect(html).not.toMatch(/data-home-celestial|data-classic-hero|data-horizon-hero/);
  });

  it.each(['zh', 'en'] as const)('首页向行星轨道传入完整的 %s 产品目录', async locale => {
    const page = await Home({ params: Promise.resolve({ locale }) });
    const hero = Children.toArray(page.props.children).find(child => isValidElement(child) && child.type === HeroSection);
    expect(isValidElement<{ orbitProducts: readonly OrbitProduct[] }>(hero) && hero.props.orbitProducts).toEqual(
      products.map(({ id, name, tagline }) => ({ id, name: name[locale], tagline: tagline[locale] })),
    );
  });
});
