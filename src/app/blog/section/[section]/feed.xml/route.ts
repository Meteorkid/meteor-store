import { blogPosts, toSummary } from '@/data/blog';
import { blogSections, getSectionBySlug } from '@/data/blog-sections';
import { buildRssFeed, FEED_HEADERS } from '@/lib/feed';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return blogSections.map((s) => ({ section: s.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ section: string }> }) {
  const { section: slug } = await params;
  const section = getSectionBySlug(slug);
  if (!section) return new Response('Not found', { status: 404 });

  const posts = blogPosts.filter((p) => p.section === section.id).map(toSummary);
  const xml = buildRssFeed(posts, {
    title: `${section.label} · Meteor Store 博客`,
    description: section.description,
    path: `/blog/section/${section.slug}`,
  });

  return new Response(xml, { headers: FEED_HEADERS });
}
