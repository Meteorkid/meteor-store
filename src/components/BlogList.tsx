import { getFeedPosts, getFeedPostsBySection, getFeedTags, getSectionCounts, toFeedSummary } from '@/data/blog-feed';
import type { BlogSectionId } from '@/data/blog-sections';
import BlogListClient from './BlogListClient';

interface BlogListProps {
  /** 传入则只展示该分区的文章 */
  sectionId?: BlogSectionId;
}

/**
 * 文章列表的服务端外壳：取数、算分区计数与热门标签，
 * 只把摘要字段交给客户端组件。文件文章与读者投稿已在 blog-feed 合并。
 */
export default async function BlogList({ sectionId }: BlogListProps) {
  const [source, counts, tags] = await Promise.all([
    sectionId ? getFeedPostsBySection(sectionId) : getFeedPosts(),
    getSectionCounts(),
    getFeedTags(),
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
