import { getFeedPosts, getFeedPostsBySection, getFeedTags, getSectionCounts, toFeedSummary } from '@/data/blog-feed';
import type { BlogSectionId } from '@/data/blog-sections';
import type { Locale } from '@/i18n/routing';
import BlogListClient from './BlogListClient';

interface BlogListProps {
  /** 传入则只展示该分区的文章 */
  sectionId?: BlogSectionId;
  /** 当前页面 locale，决定加载哪种语言的文章 */
  locale: Locale;
}

/**
 * 文章列表的服务端外壳：取数、算分区计数与热门标签，
 * 只把摘要字段交给客户端组件。文件文章与读者投稿已在 blog-feed 合并。
 */
export default async function BlogList({ sectionId, locale }: BlogListProps) {
  const [source, counts, tags] = await Promise.all([
    sectionId ? getFeedPostsBySection(locale, sectionId) : getFeedPosts(locale),
    getSectionCounts(locale),
    getFeedTags(locale),
  ]);

  return (
    <BlogListClient
      posts={source.map(toFeedSummary)}
      counts={counts}
      activeSectionId={sectionId}
      // 分区页聚焦在该分区，不再铺一层全站热门标签
      hotTags={sectionId ? undefined : tags.slice(0, 8)}
      totalTagCount={tags.length}
    />
  );
}
