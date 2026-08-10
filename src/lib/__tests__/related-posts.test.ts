import { describe, expect, it } from 'vitest';
import { getRelatedPosts } from '../related-posts';
import type { FeedPostSummary } from '@/data/blog-feed';

function makePost(overrides: Partial<FeedPostSummary> = {}): FeedPostSummary {
  return {
    slug: overrides.slug ?? 'test',
    title: overrides.title ?? 'Test',
    excerpt: '',
    date: overrides.date ?? '2026-01-01',
    section: overrides.section ?? 'tech',
    sections: overrides.sections ?? [],
    readingTime: 1,
    tags: overrides.tags ?? [],
    draft: false,
    href: overrides.href ?? '/blog/test',
    author: null,
    eventDate: overrides.eventDate ?? '2026-01-01',
  };
}

describe('getRelatedPosts', () => {
  it('排除自身（按 href）', () => {
    const current = { href: '/blog/me', sections: ['tech'], tags: ['a'] };
    const pool = [makePost({ href: '/blog/me', tags: ['a'] }), makePost({ href: '/blog/other', tags: ['a'] })];
    const result = getRelatedPosts(current, pool);
    expect(result).toHaveLength(1);
    expect(result[0].href).toBe('/blog/other');
  });

  it('共同标签优先于分区', () => {
    const current = { href: '/blog/me', sections: ['tech'], tags: ['react'] };
    const pool = [
      makePost({ href: '/blog/a', tags: ['react'], sections: ['story'] }),
      makePost({ href: '/blog/b', tags: [], sections: ['tech'] }),
    ];
    const result = getRelatedPosts(current, pool);
    expect(result[0].href).toBe('/blog/a');
  });

  it('没有共同内容时按日期降序兜底', () => {
    const current = { href: '/blog/me', sections: ['tech'], tags: [] };
    const pool = [
      makePost({ href: '/blog/old', date: '2025-01-01' }),
      makePost({ href: '/blog/new', date: '2026-06-01' }),
    ];
    const result = getRelatedPosts(current, pool);
    expect(result[0].href).toBe('/blog/new');
  });

  it('空候选池返回空数组', () => {
    expect(getRelatedPosts({ href: '/blog/me', sections: [], tags: [] }, [])).toEqual([]);
  });

  it('遵守 limit 参数', () => {
    const current = { href: '/blog/me', sections: ['tech'], tags: [] };
    const pool = Array.from({ length: 10 }, (_, i) => makePost({ href: `/blog/${i}`, tags: ['shared'] }));
    expect(getRelatedPosts(current, pool, 3)).toHaveLength(3);
    expect(getRelatedPosts(current, pool, 5)).toHaveLength(5);
  });

  it('reason 字段正确生成', () => {
    const current = { href: '/blog/me', sections: ['tech'], tags: ['react'] };
    const pool = [
      makePost({ href: '/blog/a', tags: ['react'], sections: [] }),
      makePost({ href: '/blog/b', tags: [], sections: ['tech'] }),
    ];
    const result = getRelatedPosts(current, pool);
    expect(result[0].reason).toBe('tag:react');
    expect(result[1].reason).toBe('section:tech');
  });
});
