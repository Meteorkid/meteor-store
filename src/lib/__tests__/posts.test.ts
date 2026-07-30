import { describe, it, expect } from 'vitest';
import { newPostId, normalizeTags } from '../posts';

describe('newPostId', () => {
  it('是 URL 安全的，不需要额外编码', () => {
    for (let i = 0; i < 50; i++) {
      const id = newPostId();
      expect(id).toMatch(/^[A-Za-z0-9_-]+$/);
      expect(encodeURIComponent(id)).toBe(id);
    }
  });

  it('不重复', () => {
    const ids = new Set(Array.from({ length: 500 }, () => newPostId()));
    expect(ids.size).toBe(500);
  });
});

describe('normalizeTags', () => {
  it('去掉首尾空格', () => {
    expect(normalizeTags(['  法律  '])).toEqual([{ tag: '法律', label: '法律' }]);
  });

  it('只有大小写差异的标签算同一个，保留先出现的写法', () => {
    expect(normalizeTags(['AI', 'ai', 'Ai'])).toEqual([{ tag: 'ai', label: 'AI' }]);
  });

  it('丢掉空标签', () => {
    expect(normalizeTags(['', '   ', '法律'])).toEqual([{ tag: '法律', label: '法律' }]);
  });

  it('超出上限的部分被截断——用户输入不可信', () => {
    const many = Array.from({ length: 30 }, (_, i) => `tag${i}`);
    expect(normalizeTags(many)).toHaveLength(8);
    expect(normalizeTags(many, 3)).toHaveLength(3);
  });

  it('去重发生在截断之前，重复标签不会挤占名额', () => {
    const result = normalizeTags(['a', 'a', 'a', 'b', 'c'], 3);
    expect(result.map((t) => t.tag)).toEqual(['a', 'b', 'c']);
  });

  it('空数组返回空数组', () => {
    expect(normalizeTags([])).toEqual([]);
  });

  it('保留中文、空格与点号的原始写法', () => {
    expect(normalizeTags(['Three.js', 'Meteor Store', '民法典'])).toEqual([
      { tag: 'three.js', label: 'Three.js' },
      { tag: 'meteor store', label: 'Meteor Store' },
      { tag: '民法典', label: '民法典' },
    ]);
  });
});
