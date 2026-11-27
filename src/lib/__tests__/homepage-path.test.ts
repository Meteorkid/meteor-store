import { describe, expect, it } from 'vitest';
import { isHomepagePath } from '../homepage-path';

describe('isHomepagePath', () => {
  it.each(['/', '/zh', '/zh/', '/en', '/en/'])('识别首页：%s', path => {
    expect(isHomepagePath(path)).toBe(true);
  });

  it.each(['/zh/blog', '/zh/products', '/en/docs', '/zh?from=nav', '/zh#top'])('其他路径不是首页：%s', path => {
    expect(isHomepagePath(path)).toBe(false);
  });
});
