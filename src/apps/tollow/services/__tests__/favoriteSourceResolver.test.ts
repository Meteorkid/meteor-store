import { describe, expect, it } from 'vitest';
import { resolveFavoriteSource } from '../favoriteSourceResolver';

describe('resolveFavoriteSource', () => {
  it('原偏移仍匹配时沿用原位置', () => {
    expect(resolveFavoriteSource('甲乙丙丁', '乙丙', 1, 3, 'zh-CN')).toEqual({
      status: 'exact',
      startOffset: 1,
      endOffset: 3,
    });
  });

  it('偏移变化后只重定位唯一匹配', () => {
    expect(resolveFavoriteSource('新增甲乙丙丁', '乙丙', 1, 3, 'zh-CN')).toEqual({
      status: 'relocated',
      startOffset: 3,
      endOffset: 5,
    });
  });

  it('没有匹配时判定来源失效', () => {
    expect(resolveFavoriteSource('甲乙丁', '乙丙', 1, 3, 'zh-CN')).toEqual({ status: 'invalid' });
  });

  it('存在多个匹配时不猜测来源', () => {
    expect(resolveFavoriteSource('甲乙甲乙', '甲乙', 1, 3, 'zh-CN')).toEqual({ status: 'invalid' });
  });
});
