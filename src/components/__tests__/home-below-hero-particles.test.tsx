import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { SiteTheme } from '@/lib/appearance';

const state = vi.hoisted(() => ({ theme: 'nebula' as SiteTheme }));
vi.mock('../theme/ThemeProvider', () => ({ useOptionalSiteTheme: () => ({ theme: state.theme }) }));
vi.mock('../HeroCanvas', () => ({ default: () => <canvas data-ambient="particles" /> }));

import HomeBelowHeroParticles from '../home/HomeBelowHeroParticles';

describe('首页首屏以下的粒子', () => {
  it.each(['classic', 'nebula', 'horizon', 'orbit'] as const)('%s 在首屏静态输出里不提前挂载粒子', theme => {
    state.theme = theme;
    expect(renderToStaticMarkup(<HomeBelowHeroParticles />)).toBe('');
  });
});
