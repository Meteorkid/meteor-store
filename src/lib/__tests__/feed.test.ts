import { describe, it, expect } from 'vitest';
import { buildRssFeed } from '../feed';
import type { BlogPostSummary } from '@/data/blog';

const posts: BlogPostSummary[] = [
  {
    slug: 'older',
    title: '早一点的文章',
    excerpt: '摘要一',
    date: '2026-01-01',
    section: 'tech',
    readingTime: 3,
    tags: [],
  },
  {
    slug: 'newer',
    title: 'AT&T 与 <标签> 的故事',
    excerpt: '含 & 和 < 的摘要',
    date: '2026-05-01',
    section: 'debate',
    readingTime: 4,
    tags: [],
  },
];

const options = { title: '测试 feed', description: '描述', path: '/blog' };

describe('buildRssFeed', () => {
  it('按日期倒序输出条目', () => {
    const xml = buildRssFeed(posts, options);
    expect(xml.indexOf('/blog/newer')).toBeLessThan(xml.indexOf('/blog/older'));
  });

  it('转义标题里的 XML 特殊字符', () => {
    const xml = buildRssFeed(posts, options);
    expect(xml).toContain('AT&amp;T 与 &lt;标签&gt; 的故事');
    expect(xml).not.toContain('<标签>');
  });

  it('输出绝对 URL 与 self 链接', () => {
    const xml = buildRssFeed(posts, options);
    expect(xml).toContain('<link>https://www.imagentx.top/blog</link>');
    expect(xml).toContain('href="https://www.imagentx.top/blog/feed.xml"');
    expect(xml).toContain('<guid isPermaLink="true">https://www.imagentx.top/blog/newer</guid>');
  });

  it('pubDate 用 RFC822 格式', () => {
    const xml = buildRssFeed(posts, options);
    expect(xml).toContain('<pubDate>Fri, 01 May 2026 00:00:00 GMT</pubDate>');
  });

  it('分类用分区中文名', () => {
    const xml = buildRssFeed(posts, options);
    expect(xml).toContain('<category>辩论区</category>');
    expect(xml).toContain('<category>技术分享</category>');
  });

  it('空列表也产出合法 channel', () => {
    const xml = buildRssFeed([], options);
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain('</channel>');
    expect(xml).not.toContain('<item>');
  });
});
