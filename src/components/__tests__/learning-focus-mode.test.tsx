import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ pathname: '/study' }));
vi.mock('next/navigation', () => ({ usePathname: () => state.pathname }));

import LearningFocusMode from '../LearningFocusMode';

describe('内容页专注模式浮层', () => {
  it.each([
    ['/study', '专注模式'],
    ['/zh/study', '专注模式'],
    ['/en/study/ielts/listening', 'Focus mode'],
    ['/pathfinder/items/abc', '专注模式'],
    ['/competitions', '专注模式'],
    ['/masters', '专注模式'],
    ['/phd', '专注模式'],
    ['/daily', '专注阅读'],
    ['/en/daily', 'Focus reading'],
    ['/blog/p/abc', '专注阅读'],
    ['/blog/api-guide', '专注阅读'],
    ['/docs/macos-cannot-open-app', '专注阅读'],
    ['/blog/submit', '写作专注'],
    ['/en/blog/submit', 'Writing focus'],
  ])('%s 渲染专注模式按钮', (pathname, label) => {
    state.pathname = pathname;
    const html = renderToStaticMarkup(<LearningFocusMode />);
    expect(html).toContain('data-focus-control');
    expect(html).toContain(label);
    expect(html).toContain('aria-pressed="false"');
  });

  it.each([
    '/',
    '/products',
    '/student',
    '/account',
    '/blog',
    '/docs',
    '/blog/p',
  ])('%s 不渲染按钮', pathname => {
    state.pathname = pathname;
    expect(renderToStaticMarkup(<LearningFocusMode />)).toBe('');
  });
});
