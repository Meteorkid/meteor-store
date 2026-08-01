import { revalidatePath } from 'next/cache';
import { blogSections } from '@/data/blog-sections';

/**
 * 失效所有 blog 公开静态路径。用于文章发布、下架、删除时，
 * 让首页/分区页/标签页/RSS/sitemap 立即反映变化。分区页数量少（< 10），
 * 全失效一次开销可接受，且避免漏失效旧分区。
 */
export function revalidatePublishedPaths() {
  for (const locale of ['zh', 'en'] as const) {
    revalidatePath(`/${locale}/blog`);
    revalidatePath(`/${locale}/blog/feed.xml`);
    revalidatePath(`/${locale}/blog/tags`);
    revalidatePath(`/${locale}/blog/tag/[tag]`, 'page');
    for (const section of blogSections) {
      revalidatePath(`/${locale}/blog/section/${section.slug}`);
      revalidatePath(`/${locale}/blog/section/${section.slug}/feed.xml`);
    }
  }
  revalidatePath('/sitemap.xml');
}