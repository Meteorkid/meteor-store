import { describe, it, expect } from 'vitest';
import { allTags, findTag, getHotTags, getPostsByTag, normalizeTag, tagHref } from '../blog-tags';
import { blogPosts } from '../blog';

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

describe('标签索引', () => {
  it('不为空，且每个标签至少对应一篇文章', () => {
    expect(allTags.length).toBeGreaterThan(0);
    allTags.forEach((t) => expect(t.count).toBeGreaterThan(0));
  });

  it('按热度降序；同热度按名称排，保证构建之间顺序稳定', () => {
    for (let i = 1; i < allTags.length; i++) {
      const prev = allTags[i - 1];
      const cur = allTags[i];
      expect(prev.count).toBeGreaterThanOrEqual(cur.count);
      if (prev.count === cur.count) {
        expect(prev.label.localeCompare(cur.label, 'zh')).toBeLessThanOrEqual(0);
      }
    }
  });

  it('计数与文章里的实际出现次数一致', () => {
    allTags.forEach((t) => {
      const actual = blogPosts.filter((p) => p.tags.some((x) => normalizeTag(x) === t.key)).length;
      expect(t.count, `标签 ${t.label} 的计数不对`).toBe(actual);
    });
  });

  it('key 唯一，不存在只有大小写差异的重复项', () => {
    const keys = allTags.map((t) => t.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe('getHotTags', () => {
  it('取前 N 个，且是索引的前缀', () => {
    const hot = getHotTags(3);
    expect(hot).toHaveLength(Math.min(3, allTags.length));
    expect(hot).toEqual(allTags.slice(0, hot.length));
  });

  it('标签总数不足 N 时不报错', () => {
    expect(getHotTags(9999)).toHaveLength(allTags.length);
  });
});

describe('findTag / getPostsByTag', () => {
  it('大小写不敏感地找到标签', () => {
    const sample = allTags[0];
    expect(findTag(sample.label.toUpperCase())?.key).toBe(sample.key);
    expect(findTag(sample.label.toLowerCase())?.key).toBe(sample.key);
  });

  it('找不到时返回 undefined，而不是抛错', () => {
    expect(findTag('这个标签不存在-xyz')).toBeUndefined();
  });

  it('取到的文章确实带这个标签，且数量与计数一致', () => {
    const sample = allTags[0];
    const posts = getPostsByTag(sample.key);
    expect(posts).toHaveLength(sample.count);
    posts.forEach((p) => {
      expect(p.tags.some((t) => normalizeTag(t) === sample.key)).toBe(true);
    });
  });

  it('不存在的标签返回空数组', () => {
    expect(getPostsByTag('不存在-xyz')).toEqual([]);
  });
});
