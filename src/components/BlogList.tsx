import {
  getFeedPostsBySection,
  getFeedTags,
  getSectionCounts,
  toFeedSummary,
} from '@/data/blog-feed';
import { getFavoriteCounts } from '@/lib/favorites';
import type { BlogSectionId } from '@/data/blog-sections';
import type { TagSummary } from '@/data/blog-tags';
import type { Locale } from '@/i18n/routing';
import BlogListClient from './BlogListClient';

interface BlogListProps {
  /** 传入则只展示该分区的文章 */
  sectionId?: BlogSectionId;
  /** 初始选中的标签（来自 URL 等外部入口），客户端可继续增删 */
  initialTags?: TagSummary[];
  /** 当前页面 locale，决定加载哪种语言的文章 */
  locale: Locale;
}

/**
 * 文章列表的服务端外壳：取数、算分区计数与热门标签，
 * 只把摘要字段交给客户端组件。文件文章与读者投稿已在 blog-feed 合并。
 *
 * 标签筛选放在客户端：从 URL 带入 initialTags，用户在原位增删/清除，
 * 不必为每个标签跳一次页。分区仍由服务端过滤（分区是导航骨架）。
 *
 * 收藏数走批量查询：列表页 N 篇文章一次 SELECT，避免每条都打一次数据库。
 * targetId 复用 views/likes 约定：文件文章用 slug，投稿用 post.id。
 * 在 blog-feed 里 FeedPost.slug 字段对投稿已经写入 post.id，可直接作为 targetId。
 */
export default async function BlogList({ sectionId, initialTags, locale }: BlogListProps) {
  const [source, counts, tags] = await Promise.all([
    getFeedPostsBySection(locale, sectionId),
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
      initialTags={initialTags ?? []}
      // 热门标签在所有博客列表页都展示，作为第一屏的多选入口
      hotTags={tags.slice(0, 8)}
      totalTagCount={tags.length}
      favoriteCounts={favoriteCounts}
    />
  );
}
