import { describe, expect, it, vi } from 'vitest';
import { isLearningFocusPath } from '@/lib/learning-focus';

describe('学习区专注模式路由', () => {
  it.each([
    '/study',
    '/zh/study',
    '/en/study/ielts',
    '/zh/study/ielts/listening',
    '/pathfinder',
    '/en/pathfinder/items/abc',
    '/competitions',
    '/zh/masters',
    '/en/phd',
  ])('%s 属于学习区', pathname => {
    expect(isLearningFocusPath(pathname)).toBe(true);
  });

  it.each([
    '/',
    '/products',
    '/daily',
    '/student',
    '/account',
    '/studyroom',
  ])('%s 不属于学习区', pathname => {
    expect(isLearningFocusPath(pathname)).toBe(false);
  });
});
