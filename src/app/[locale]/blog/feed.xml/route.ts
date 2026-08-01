import { getFeedPosts, toFeedSummary } from '@/data/blog-feed';
import { buildRssFeed, FEED_HEADERS } from '@/lib/feed';
import type { Locale } from '@/i18n/routing';

// 静态生成，审核通过时由 revalidatePath 刷新
export const dynamic = 'force-static';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  const posts = await getFeedPosts(locale as Locale);
  const xml = buildRssFeed(posts.map(toFeedSummary), {
    title: 'Meteor Store 博客',
    description: '技术与产品在左，情感、文学与辩论在右',
    path: '/blog',
    locale: locale as Locale,
  });

  return new Response(xml, { headers: FEED_HEADERS });
}
