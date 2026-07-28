import { blogPosts, toSummary } from '@/data/blog';
import { blogSections, type BlogSectionId } from '@/data/blog-sections';
import BlogListClient from './BlogListClient';

interface BlogListProps {
  /** 传入则只展示该分区的文章 */
  sectionId?: BlogSectionId;
}

/**
 * 服务端组件：负责取数与裁剪字段，
 * 只把摘要和计数传给客户端，文章正文不进 JS bundle。
 */
export default function BlogList({ sectionId }: BlogListProps) {
  const posts = (sectionId ? blogPosts.filter((p) => p.section === sectionId) : blogPosts).map(toSummary);

  const counts = Object.fromEntries(
    blogSections.map((s) => [s.id, blogPosts.filter((p) => p.section === s.id).length]),
  );

  return <BlogListClient posts={posts} counts={counts} activeSectionId={sectionId} />;
}
