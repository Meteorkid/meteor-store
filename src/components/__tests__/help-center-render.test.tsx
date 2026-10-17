import { renderToStaticMarkup } from 'react-dom/server';
import type { AnchorHTMLAttributes } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ locale: 'zh', openPanel: vi.fn(), panel: { open: false, slug: 'start-here', width: 480 } }));
vi.mock('next-intl', () => ({ useLocale: () => state.locale }));
vi.mock('next-intl/server', () => ({ getTranslations: async () => (key: string) => key, setRequestLocale: vi.fn() }));
vi.mock('@/i18n/navigation', () => ({
  Link: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props} />,
  useRouter: () => ({ push: vi.fn() }),
}));
vi.mock('../Header', () => ({ default: () => null }));
vi.mock('../Footer', () => ({ default: () => null }));
vi.mock('../help/HelpCosmicBg', () => ({ default: () => null }));
vi.mock('../help/HelpDecorations', () => ({ MeteorTrail: () => null, StarDust: () => null, ConstellationDot: () => null, SectionDivider: () => null }));
vi.mock('../help/HelpPanelContext', () => ({ useHelpPanel: () => ({ state: state.panel, openPanel: state.openPanel, closePanel: vi.fn(), setWidth: vi.fn() }) }));
vi.mock('@/data/help-search.server', () => ({ buildHelpSearchEntries: () => [] }));

import DocsPage from '@/app/[locale]/docs/page';
import { OpenInPanelButton } from '../help/OpenInPanelButton';
import HelpPanel from '../help/HelpPanel';

beforeEach(() => { state.locale = 'zh'; state.openPanel.mockClear(); state.panel = { open: false, slug: 'start-here', width: 480 }; });

async function renderPage() {
  return renderToStaticMarkup(await DocsPage({
    params: Promise.resolve({ locale: state.locale }), searchParams: Promise.resolve({}),
  }));
}

describe('帮助中心可访问结构', () => {
  it('文章导航链接不包裹侧栏按钮，标题与按钮独立可聚焦', async () => {
    const html = await renderPage();
    const links = html.match(/<a\b[^>]*>[\s\S]*?<\/a>/g) ?? [];
    expect(links.length).toBeGreaterThan(0);
    expect(links.filter(link => link.includes('<button')).length).toBe(0);
    expect(html).toMatch(/<h3\b[^>]*><a\b[^>]*href="\/docs\//);
    expect(html).not.toContain('tabindex="-1"');
  });

  it.each(['icon', 'text'] as const)('%s 侧栏操作默认可见，保留44px触达与聚焦环', variant => {
    const html = renderToStaticMarkup(<OpenInPanelButton slug="start-here" variant={variant} />);
    const button = html.match(/<button\b[^>]*>/)?.[0] ?? '';
    expect(button).toContain('type="button"');
    expect(button).toContain('min-h-11');
    expect(button).toContain('min-w-11');
    expect(button).toContain('focus-visible:ring-2');
    expect(button).not.toContain('opacity-0');
    expect(button).not.toContain('text-white/20');
    expect(button).not.toContain('text-white/50');
  });

  it('页面不再把侧栏操作隐藏到hover，信息文字使用既有亮度基线', async () => {
    const html = await renderPage();
    const buttons = html.match(/<button\b[^>]*>/g) ?? [];
    expect(buttons.length).toBeGreaterThan(0);
    expect(buttons.every(button => !button.includes('opacity-0'))).toBe(true);
    const informationTags = html.match(/<(?:p|a|span)\b[^>]*>/g)?.filter(tag => !tag.includes('aria-hidden="true"')) ?? [];
    expect(informationTags.every(tag => !/text-white\/(?:30|40|45|50)(?=[" ])/.test(tag))).toBe(true);
    expect(html).toContain('placeholder:text-white/60');
  });

  it.each(['zh', 'en'])('%s 侧栏按钮提供对应语言的可访问名称', locale => {
    state.locale = locale;
    const html = renderToStaticMarkup(<OpenInPanelButton slug="start-here" />);
    expect(html).toContain(`aria-label="${locale === 'zh' ? '在侧边栏查看' : 'Open in side panel'}"`);
  });

  it.each(['icon', 'text'] as const)('%s 原生按钮激活时只请求对应文章面板', variant => {
    const button = OpenInPanelButton({ slug: 'start-here', variant });
    button.props.onClick();
    expect(state.openPanel).toHaveBeenCalledExactlyOnceWith('start-here');
  });

  it.each([360, 480, 720])('侧栏保留 %ipx 桌面宽度偏好，同时受当前视口宽度约束', width => {
    state.panel = { open: true, slug: 'start-here', width };
    const html = renderToStaticMarkup(<HelpPanel />);
    const panel = html.match(/<div\b[^>]*role="complementary"[^>]*>/)?.[0] ?? '';
    expect(panel).toContain(`width:${width}px`);
    expect(panel).toContain('max-width:100%');
    expect(panel).toContain('fixed right-0');
  });
});
