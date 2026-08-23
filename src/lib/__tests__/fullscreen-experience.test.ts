import { describe, expect, it } from 'vitest';
import { isFullscreenExperiencePath } from '../fullscreen-experience';

describe('全屏体验路由识别', () => {
  it.each([
    '/zh/apps/chakra-visualizer/trial',
    '/en/apps/webgl-fluid-sim/trial',
    '/zh/apps/skeleton-anatomy/trial/',
    '/en/apps/tollow/trial',
    '/zh/apps/ex-memory',
    '/en/apps/ex-memory/',
  ])('%s 不加载商城全局特效', (pathname) => {
    expect(isFullscreenExperiencePath(pathname)).toBe(true);
  });

  it.each([
    '/zh/products/ex-memory',
    '/en/apps/ex-memory/settings',
    '/zh/apps/chakra-visualizer',
    '/zh/blog',
  ])('%s 保留正常商城页面结构', (pathname) => {
    expect(isFullscreenExperiencePath(pathname)).toBe(false);
  });
});
