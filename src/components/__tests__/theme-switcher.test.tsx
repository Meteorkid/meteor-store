import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ theme: 'nebula' as 'classic' | 'nebula' }));
vi.mock('next-intl', () => ({ useLocale: () => 'zh' }));
vi.mock('@/components/AuthProvider', () => ({ useAuth: () => ({ user: { id: 'u1' } }) }));
vi.mock('../theme/ThemeProvider', () => ({
  useOptionalSiteTheme: () => ({ theme: state.theme, saving: false, saveError: null, setTheme: vi.fn() }),
}));

import ThemeSwitcher from '../theme/ThemeSwitcher';

describe('ThemeSwitcher', () => {
  it('同时展示两套主题，并正确标记当前选择', () => {
    state.theme = 'nebula';
    const html = renderToStaticMarkup(<ThemeSwitcher />);
    expect(html).toContain('经典紫夜');
    expect(html).toContain('星云星海');
    expect(html).toContain('aria-label="网站主题"');
    expect((html.match(/aria-pressed="true"/g) ?? [])).toHaveLength(1);
    expect(html).toContain('保存到账号');
  });
});
