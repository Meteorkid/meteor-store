import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
const state = vi.hoisted(() => ({ pathname: '/daily' }));
vi.mock('@/i18n/navigation', () => ({ usePathname: () => state.pathname }));
vi.mock('next-intl', () => ({ useTranslations: () => () => '' }));
vi.mock('@/lib/motion', () => ({ useReducedMotion: () => false, createFrameGuard: () => () => {} }));
import HeroCanvas from '../HeroCanvas';
import MeteorShower from '../MeteorShower';
import GlobalParticles from '../GlobalParticles';

describe('内容阅读页安静背景', () => {
  it.each(['/daily', '/masters', '/zh/daily', '/en/masters'])('%s 不渲染持续粒子画布', pathname => {
    state.pathname = pathname;
    expect(renderToStaticMarkup(<><HeroCanvas /><MeteorShower /><GlobalParticles /></>)).toBe('');
  });
  it('首页与产品页仍保留原画布', () => {
    for (const pathname of ['/', '/products/xisland']) {
      state.pathname = pathname;
      expect(renderToStaticMarkup(<><HeroCanvas /><MeteorShower /><GlobalParticles /></>).match(/<canvas/g)).toHaveLength(3);
    }
  });
});
