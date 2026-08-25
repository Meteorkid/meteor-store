import { revalidatePath } from 'next/cache';
import { blogSections } from '@/data/blog-sections';
import { SITE_URL } from './constants';
import { pingSearchEngines } from './search-ping';

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
  // 使文章详情页失效（新投稿发布后，旧文章的"小星官"同步刷新）
  revalidatePath('/[locale]/blog/[slug]', 'page');
  revalidatePath('/[locale]/blog/p/[id]', 'page');
  revalidatePath('/sitemap.xml');

  // 顺手告诉 Bing / 百度「博客列表变了」，别干等下一次自然抓取。
  //
  // **只推列表页，不推刚发布的那篇的地址**：文章地址是 /{post.locale}/blog/p/{id}，
  // 而这个函数的六个调用点没有一个同时拿着 id 和 locale，为了推送再查一次库不划算；
  // 猜错 locale 则会把一个 404 塞进百度每天的推送配额里。列表页和 sitemap 都已更新，
  // 爬虫进来一次就能顺藤摸到新文章。要精确推某批地址用 scripts/submit-urls.mjs。
  //
  // 不 await：调用方刚刚成功发布完内容，不该为一次推送多等一个 RTT，
  // 更不该因为推送失败把成功的发布变成 500（pingSearchEngines 内部已兜住所有异常）。
  void pingSearchEngines(['zh', 'en'].map((locale) => `${SITE_URL}/${locale}/blog`));
}