import { getFeedPosts, getFeedPostsBySection, getFeedTags, getSectionCounts, toFeedSummary } from '@/data/blog-feed';
import { getFavoriteCounts } from '@/lib/favorites';
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
 *
 * 收藏数走批量查询：列表页 N 篇文章一次 SELECT，避免每条都打一次数据库。
 * targetId 复用 views/likes 约定：文件文章用 slug，投稿用 post.id。
 * 在 blog-feed 里 FeedPost.slug 字段对投稿已经写入 post.id，可直接作为 targetId。
 */
export default async function BlogList({ sectionId, locale }: BlogListProps) {
  const [source, counts, tags] = await Promise.all([
    sectionId ? getFeedPostsBySection(locale, sectionId) : getFeedPosts(locale),
    getSectionCounts(locale),
    getFeedTags(locale),
  ]);

  // 批量取收藏数；数据库不可用时降级为空对象（列表照常展示，只是没有收藏数）
  let favoriteCounts: Record<string, number> = {};
  try {
    const map = await getFavoriteCounts(source.map((p) => p.slug));
    favoriteCounts = Object.fromEntries(map);
  } catch (err) {
    console.error('读取收藏数失败，列表页照常展示但不显示收藏数', err);
  }

  return (
    <BlogListClient
      posts={source.map(toFeedSummary)}
      counts={counts}
      activeSectionId={sectionId}
      // 分区页聚焦在该分区，不再铺一层全站热门标签
      hotTags={sectionId ? undefined : tags.slice(0, 8)}
      totalTagCount={tags.length}
      favoriteCounts={favoriteCounts}
    />
  );
}
