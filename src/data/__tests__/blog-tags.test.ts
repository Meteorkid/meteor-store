import { describe, it, expect } from 'vitest';
import { buildTagIndex, normalizeTag, tagHref } from '../blog-tags';

describe('normalizeTag', () => {
  it('大小写与首尾空格不应该把同一个标签拆成两个', () => {
    expect(normalizeTag('  AI  ')).toBe('ai');
    expect(normalizeTag('ai')).toBe(normalizeTag('AI'));
  });
});

describe('tagHref', () => {
  it('中文标签被正确编码', () => {
    expect(tagHref('法律')).toBe(`/blog/tag/${encodeURIComponent('法律')}`);
  });

  it('含空格与点号的标签也能进 URL', () => {
    expect(tagHref('Meteor Store')).toBe('/blog/tag/Meteor%20Store');
    expect(tagHref('Three.js')).toBe('/blog/tag/Three.js');
  });
});

describe('buildTagIndex', () => {
  it('按热度降序；同热度按名称排，保证构建之间顺序稳定', () => {
    const index = buildTagIndex([
      { tags: ['甲', '乙', '丙'] },
      { tags: ['甲', '乙'] },
      { tags: ['甲'] },
    ]);
    expect(index.map((t) => [t.label, t.count])).toEqual([
      ['甲', 3],
      ['乙', 2],
      ['丙', 1],
    ]);
  });

  it('同一篇文章里重复写同一个标签只算一次', () => {
    const index = buildTagIndex([{ tags: ['AI', 'ai', ' AI '] }]);
    expect(index).toHaveLength(1);
    expect(index[0].count).toBe(1);
  });

  it('展示写法取出现次数最多的那种大小写', () => {
    const index = buildTagIndex([{ tags: ['AI'] }, { tags: ['AI'] }, { tags: ['ai'] }]);
    expect(index[0]).toMatchObject({ key: 'ai', label: 'AI', count: 3 });
  });

  it('key 唯一，不存在只有大小写差异的重复项', () => {
    const keys = buildTagIndex([{ tags: ['AI', '法律'] }, { tags: ['ai', 'Ai'] }]).map((t) => t.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('丢掉空标签', () => {
    expect(buildTagIndex([{ tags: ['', '   ', '法律'] }]).map((t) => t.label)).toEqual(['法律']);
  });

  it('href 用展示写法生成', () => {
    expect(buildTagIndex([{ tags: ['Three.js'] }])[0].href).toBe('/blog/tag/Three.js');
  });

  it('没有文章时返回空数组', () => {
    expect(buildTagIndex([])).toEqual([]);
  });
});
