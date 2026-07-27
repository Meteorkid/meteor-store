import { blogPosts, toSummary } from '@/data/blog';
import { buildRssFeed, FEED_HEADERS } from '@/lib/feed';

export const dynamic = 'force-static';

export function GET() {
  const xml = buildRssFeed(blogPosts.map(toSummary), {
    title: 'Meteor Store 博客',
    description: '技术与产品在左，情感、文学与辩论在右',
    path: '/blog',
  });

  return new Response(xml, { headers: FEED_HEADERS });
}
