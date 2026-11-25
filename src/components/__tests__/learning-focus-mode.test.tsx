import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ pathname: '/study' }));
vi.mock('next/navigation', () => ({ usePathname: () => state.pathname }));

import LearningFocusMode from '../LearningFocusMode';

describe('学习区专注模式浮层', () => {
  it.each([
    '/study',
    '/zh/study',
    '/en/study/ielts/listening',
    '/pathfinder/items/abc',
    '/competitions',
    '/masters',
    '/phd',
  ])('%s 渲染专注模式按钮', pathname => {
    state.pathname = pathname;
    const html = renderToStaticMarkup(<LearningFocusMode />);
    expect(html).toContain('data-focus-control');
    expect(html).toContain(pathname.startsWith('/en') ? 'Focus mode' : '专注模式');
    expect(html).toContain('aria-pressed="false"');
  });

  it.each(['/', '/products', '/daily', '/student', '/account'])('%s 不渲染按钮', pathname => {
    state.pathname = pathname;
    expect(renderToStaticMarkup(<LearningFocusMode />)).toBe('');
  });
});
