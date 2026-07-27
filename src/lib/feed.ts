import { SITE_URL } from '@/lib/constants';
import type { BlogPostSummary } from '@/data/blog';
import { blogSectionLabels } from '@/data/blog-sections';

/** XML 文本节点转义；属性值同样适用 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** 只有日期没有时分秒，按当日零点（UTC）出，保证 RSS 阅读器排序稳定 */
function toRfc822(date: string): string {
  return new Date(`${date}T00:00:00Z`).toUTCString();
}

export interface FeedOptions {
  title: string;
  description: string;
  /** 该 feed 对应的页面路径，如 /blog 或 /blog/section/debate */
  path: string;
}

export function buildRssFeed(posts: BlogPostSummary[], options: FeedOptions): string {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const selfUrl = `${SITE_URL}${options.path}/feed.xml`;

  const items = sorted
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <category>${escapeXml(blogSectionLabels[post.section])}</category>
      <pubDate>${toRfc822(post.date)}</pubDate>
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(options.title)}</title>
    <link>${escapeXml(`${SITE_URL}${options.path}`)}</link>
    <description>${escapeXml(options.description)}</description>
    <language>zh-CN</language>
    <atom:link href="${escapeXml(selfUrl)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}

export const FEED_HEADERS = {
  'Content-Type': 'application/rss+xml; charset=utf-8',
  'Cache-Control': 'public, max-age=3600, s-maxage=3600',
};
