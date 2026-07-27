import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogList from '@/components/BlogList';
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
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-16 md:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-violet-300">
            {channel?.label ?? 'Blog'}
          </p>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">{section.label}</h1>
          <p className="mb-10 text-lg text-gray-400">{section.description}</p>
          <BlogList sectionId={section.id} />

          {section.allowProposals && (
            <div className="mt-16">
              <TopicProposalForm sectionId={section.id} sectionLabel={section.label} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
