import { NextRequest, NextResponse } from 'next/server';
import { searchEntriesWithBlogPosts, type BlogPostSearchData } from '@/lib/search-index';
import { getFeedPosts } from '@/data/blog-feed';
import type { Locale } from '@/i18n/routing';

/**
 * 全站聚焦搜索 API：索引包含产品、页面、帮助、博客文章、FAQ 和彩蛋。
 * 博客文章来自 getFeedPosts()（文件 + 数据库投稿），异步读取仅在服务端可行。
 *
 * GET /api/spotlight/search?q=关键词&locale=zh
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q')?.trim() ?? '';
  const rawLocale = searchParams.get('locale') ?? 'zh';
  const locale: Locale = rawLocale === 'en' ? 'en' : 'zh';

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  // 获取全部公开博客文章（文件 + 数据库投稿）
  const feedPosts = await getFeedPosts(locale);

  // 转为搜索数据（只传搜索所需的字段）
  const blogPosts: BlogPostSearchData[] = feedPosts.map((post) => ({
    title: post.title,
    excerpt: post.excerpt,
    href: post.href,
    tags: post.tags,
  }));

  const results = searchEntriesWithBlogPosts(query, locale, blogPosts);

  return NextResponse.json({ results });
}
