import { blogPosts, toSummary } from '@/data/blog';
import { getSectionById, type BlogSectionId } from '@/data/blog-sections';
import BlogSectionNav from './BlogSectionNav';
import BlogListClient from './BlogListClient';

interface BlogListProps {
  /** 传入则只展示该分区的文章 */
  sectionId?: BlogSectionId;
}

/**
 * 服务端组件：负责取数与裁剪字段，
 * 只把摘要传给客户端，文章正文不进 JS bundle。
 */
export default function BlogList({ sectionId }: BlogListProps) {
  const posts = (sectionId ? blogPosts.filter((p) => p.section === sectionId) : blogPosts).map(toSummary);

  return (
    <>
      <BlogSectionNav activeSectionId={sectionId} />
      <BlogListClient posts={posts} showSectionLabel={!sectionId} />
    </>
  );
}

/** 页面级主题色作用域：分区页用分区色，全部页用品牌紫 */
export function blogScopeStyle(sectionId?: BlogSectionId): React.CSSProperties {
  const rgb = sectionId ? getSectionById(sectionId)?.rgb : undefined;
  return rgb ? ({ '--accent': rgb } as React.CSSProperties) : {};
}
