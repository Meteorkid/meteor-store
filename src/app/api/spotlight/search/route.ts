import { NextRequest, NextResponse } from 'next/server';
import { searchEntriesWithBlogPostsMeta, type BlogPostSearchData } from '@/lib/search-index';
import { getFeedPosts } from '@/data/blog-feed';
import type { Locale } from '@/i18n/routing';

/**
 * 全站聚焦搜索 API：索引包含产品、页面、帮助、博客文章、FAQ 和彩蛋。
 * 返回结果含 hasFuzzy 标记，用于前端展示"你是不是想搜…？"提示。
 *
 * GET /api/spotlight/search?q=关键词&locale=zh
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q')?.trim() ?? '';
  const rawLocale = searchParams.get('locale') ?? 'zh';
  const locale: Locale = rawLocale === 'en' ? 'en' : 'zh';

  if (!query) {
    return NextResponse.json({ results: [], hasFuzzy: false });
  }

  const feedPosts = await getFeedPosts(locale);

  const blogPosts: BlogPostSearchData[] = feedPosts.map((post) => ({
    title: post.title,
    excerpt: post.excerpt,
    href: post.href,
    tags: post.tags,
  }));

  const { results, hasFuzzy } = searchEntriesWithBlogPostsMeta(query, locale, blogPosts);

  return NextResponse.json({ results, hasFuzzy });
}
