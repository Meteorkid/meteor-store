import { blogSections, getSectionBySlug } from '@/data/blog-sections';
import { getFeedPostsBySection, toFeedSummary } from '@/data/blog-feed';
import { buildRssFeed, FEED_HEADERS } from '@/lib/feed';
import { routing, type Locale } from '@/i18n/routing';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    blogSections.map((s) => ({ locale, section: s.slug }))
  );
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string; section: string }> },
) {
  const { locale, section: slug } = await params;
  const section = getSectionBySlug(slug);
  if (!section) return new Response('Not found', { status: 404 });

  const posts = await getFeedPostsBySection(locale as Locale, section.id);
  const xml = buildRssFeed(posts.map(toFeedSummary), {
    title: `${section.label[locale as Locale]} · Meteor Store 博客`,
    description: section.description[locale as Locale],
    path: `/blog/section/${section.slug}`,
    locale: locale as Locale,
  });

  return new Response(xml, { headers: FEED_HEADERS });
}
