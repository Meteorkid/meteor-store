import { SITE_URL } from '@/lib/constants';
import type { FeedPostSummary } from '@/data/blog-feed';
import { getBlogSectionLabels } from '@/data/blog-sections';
import type { Locale } from '@/i18n/routing';

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
  /** feed 内容对应的语言，用于选取分区标签的本地化文本 */
  locale: Locale;
}

export interface GenericFeedItem {
  title: string;
  /** 站内绝对路径，或完整外链地址 */
  link: string;
  description: string;
  category?: string;
  /** ISO 时间或 YYYY-MM-DD */
  pubDate: string;
}

export interface GenericFeedOptions {
  title: string;
  description: string;
  /** 该 feed 对应的页面路径 */
  path: string;
}

/**
 * 通用 RSS 输出。
 *
 * 与博客 feed 共用同一套转义和信道结构，但不绑定博客的分区与 `FeedPostSummary`——
 * Pathfinder 的条目没有分区、日期是完整时间戳、链接可能指向站外原文。
 */
export function buildGenericRssFeed(
  items: GenericFeedItem[],
  options: GenericFeedOptions,
): string {
  const selfUrl = `${SITE_URL}${options.path}/feed.xml`;
  const entries = items
    .map((item) => {
      const url = item.link.startsWith('http') ? item.link : `${SITE_URL}${item.link}`;
      const published = new Date(
        /^\d{4}-\d{2}-\d{2}$/.test(item.pubDate) ? `${item.pubDate}T00:00:00Z` : item.pubDate,
      );
      return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(item.description)}</description>${
        item.category ? `\n      <category>${escapeXml(item.category)}</category>` : ''
      }${
        Number.isNaN(published.getTime())
          ? ''
          : `\n      <pubDate>${published.toUTCString()}</pubDate>`
      }
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
${entries}
  </channel>
</rss>
`;
}

export function buildRssFeed(posts: FeedPostSummary[], options: FeedOptions): string {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const selfUrl = `${SITE_URL}${options.path}/feed.xml`;

  const items = sorted
    .map((post) => {
      // 文件文章与读者投稿的地址规则不同，由 href 决定，这里不再拼 slug
      const url = `${SITE_URL}${post.href}`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <category>${escapeXml(getBlogSectionLabels(options.locale)[post.section])}</category>${
        post.author ? `\n      <author>${escapeXml(post.author)}</author>` : ''
      }
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
