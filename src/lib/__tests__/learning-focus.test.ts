import { describe, expect, it } from 'vitest';
import {
  buildFocusModeBootstrapScript,
  getFocusModeScope,
  isLearningFocusPath,
} from '@/lib/learning-focus';

describe('内容页专注模式路由', () => {
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
    expect(getFocusModeScope(pathname)).toBe('learning');
    expect(isLearningFocusPath(pathname)).toBe(true);
  });

  it.each([
    '/daily',
    '/zh/daily',
    '/blog/p/abc',
    '/en/blog/p/abc/',
    '/blog/api-guide',
    '/zh/blog/api-guide',
    '/docs/macos-cannot-open-app',
    '/en/docs/start-here',
  ])('%s 属于阅读专注', pathname => {
    expect(getFocusModeScope(pathname)).toBe('reading');
    expect(isLearningFocusPath(pathname)).toBe(false);
  });

  it.each([
    '/blog/submit',
    '/zh/blog/submit',
    '/en/blog/submit/',
  ])('%s 属于写作专注', pathname => {
    expect(getFocusModeScope(pathname)).toBe('writing');
    expect(isLearningFocusPath(pathname)).toBe(false);
  });

  it.each([
    '/',
    '/products',
    '/student',
    '/account',
    '/studyroom',
    '/blog',
    '/blog/p',
    '/blog/p/abc/extra',
    '/blog/api-guide/extra',
    '/docs',
    '/docs/foo/bar',
  ])('%s 不属于内容页专注', pathname => {
    expect(getFocusModeScope(pathname)).toBeNull();
    expect(isLearningFocusPath(pathname)).toBe(false);
  });

  it('首屏内联脚本可解析，并在存储开启时正确标记语言前缀后的路径', () => {
    const script = buildFocusModeBootstrapScript();
    const dataset: Record<string, string> = {};
    // eslint-disable-next-line no-new-func
    const run = new Function('location', 'localStorage', 'document', script) as (
      location: { pathname: string },
      storage: { getItem: (key: string) => string | null },
      document: { documentElement: { dataset: Record<string, string> } },
    ) => void;

    expect(() => run({ pathname: '/zh/blog' }, { getItem: () => 'on' }, {
      documentElement: { dataset },
    })).not.toThrow();
    expect(dataset.focusMode).toBeUndefined();

    run({ pathname: '/zh/pathfinder' }, { getItem: () => 'on' }, {
      documentElement: { dataset },
    });
    expect(dataset.focusMode).toBe('on');
    expect(dataset.focusScope).toBe('learning');

    dataset.focusMode = '';
    dataset.focusScope = '';
    run({ pathname: '/en/blog/submit' }, { getItem: () => 'on' }, {
      documentElement: { dataset },
    });
    expect(dataset.focusMode).toBe('on');
    expect(dataset.focusScope).toBe('writing');
  });
});
