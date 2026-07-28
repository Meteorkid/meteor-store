import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogList, { blogScopeStyle } from '@/components/BlogList';
import TopicProposalForm from '@/components/TopicProposalForm';
import { blogChannels, blogSections, getSectionBySlug } from '@/data/blog-sections';

interface SectionPageProps {
  params: Promise<{ section: string }>;
}

export function generateStaticParams() {
  return blogSections.map((s) => ({ section: s.slug }));
}

export async function generateMetadata({ params }: SectionPageProps): Promise<Metadata> {
  const { section: slug } = await params;
  const section = getSectionBySlug(slug);
  return section
    ? {
        title: `${section.label} - Meteor Store 博客`,
        description: section.description,
        alternates: {
          types: { 'application/rss+xml': `/blog/section/${section.slug}/feed.xml` },
        },
      }
    : { title: '分区未找到 - Meteor Store' };
}

export default async function BlogSectionPage({ params }: SectionPageProps) {
  const { section: slug } = await params;
  const section = getSectionBySlug(slug);
  if (!section) notFound();

  const channel = blogChannels.find((c) => c.id === section.channelId);

  return (
    <div className="blog-scope min-h-screen bg-black text-white" style={blogScopeStyle(section.id)}>
      <Header />
      <main className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <header className="relative mb-16">
            <div aria-hidden className="blog-glow" />
            <p className="relative mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/35">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: `rgb(${section.rgb})` }}
              />
              {channel?.label ?? 'Journal'}
            </p>
            <h1 className="relative mb-5 text-5xl font-bold tracking-tight md:text-7xl">
              {section.label}
            </h1>
            <p className="relative max-w-xl text-lg leading-relaxed text-white/45">
              {section.description}
            </p>
            <a
              href={`/blog/section/${section.slug}/feed.xml`}
              className="relative mt-6 inline-flex items-center gap-1.5 text-xs text-white/30 transition-colors duration-200 hover:text-white/70"
            >
              <span aria-hidden>◉</span> 订阅这个分区
            </a>
          </header>

          <BlogList sectionId={section.id} />

          {section.allowProposals && (
            <div className="mt-24">
              <TopicProposalForm sectionId={section.id} sectionLabel={section.label} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
