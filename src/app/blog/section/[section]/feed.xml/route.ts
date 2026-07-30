import { blogSections, getSectionBySlug } from '@/data/blog-sections';
import { getFeedPostsBySection, toFeedSummary } from '@/data/blog-feed';
import { buildRssFeed, FEED_HEADERS } from '@/lib/feed';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return blogSections.map((s) => ({ section: s.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ section: string }> }) {
  const { section: slug } = await params;
  const section = getSectionBySlug(slug);
  if (!section) return new Response('Not found', { status: 404 });

  const posts = await getFeedPostsBySection(section.id);
  const xml = buildRssFeed(posts.map(toFeedSummary), {
    title: `${section.label} · Meteor Store 博客`,
    description: section.description,
    path: `/blog/section/${section.slug}`,
  });

  return new Response(xml, { headers: FEED_HEADERS });
}
