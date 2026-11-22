import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ theme: 'nebula' as 'classic' | 'nebula' | 'horizon', locale: 'zh' }));
vi.mock('next-intl', () => ({ useLocale: () => state.locale }));
vi.mock('@/components/AuthProvider', () => ({ useAuth: () => ({ user: { id: 'u1' } }) }));
vi.mock('../theme/ThemeProvider', () => ({
  useOptionalSiteTheme: () => ({ theme: state.theme, saving: false, saveError: null, setTheme: vi.fn() }),
}));

import ThemeSwitcher from '../theme/ThemeSwitcher';
import ThemeToggle from '../theme/ThemeToggle';

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    state.locale = 'zh';
    state.theme = 'nebula';
  });

  it('同时展示三套主题，标记黑洞视界为当前选择并注明来源', () => {
    state.theme = 'horizon';
    const html = renderToStaticMarkup(<ThemeSwitcher />);
    expect(html).toContain('经典紫夜');
    expect(html).toContain('星云星海');
    expect(html).toMatch(/aria-pressed="true"[^>]*>(?:(?!<\/button>).)*黑洞视界/);
    expect(html).toContain('aria-label="网站主题"');
    expect((html.match(/aria-pressed="true"/g) ?? [])).toHaveLength(1);
    expect(html).toContain('保存到账号');
    expect(html).toContain('href="https://vibefather.ai/templates/black-hole-interactive-explainer"');
  });

  it('紧凑入口使用英文主题名和对应的署名', () => {
    state.locale = 'en';
    const html = renderToStaticMarkup(<ThemeSwitcher compact headingId="header-mobile-theme" />);
    expect(html).toContain('aria-labelledby="header-mobile-theme"');
    expect(html).toContain('Classic Violet');
    expect(html).toContain('Nebula Sky');
    expect(html).toContain('Event Horizon');
    expect(html).toContain('Black Hole Interactive Explainer');
  });

  it('桌面按钮指向默认收起的外观面板', () => {
    const html = renderToStaticMarkup(<ThemeToggle />);
    expect(html).toContain('aria-label="选择网站主题"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-controls="header-theme-panel"');
    expect(html).toContain('id="header-theme-panel" hidden=""');
  });
});
