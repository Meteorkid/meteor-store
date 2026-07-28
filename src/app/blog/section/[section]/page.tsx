import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogList, { blogScopeStyle } from '@/components/BlogList';
import TopicProposalForm from '@/components/TopicProposalForm';
import { blogSections, getSectionBySlug } from '@/data/blog-sections';

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

  return (
    <div className="blog-scope min-h-screen bg-black text-white" style={blogScopeStyle(section.id)}>
      <Header />
      <main className="relative container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-4xl">
          {/* 分区身份靠色点和工具条里的高亮表达，不需要巨幅标题 */}
          <header className="relative mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h1 className="t-title-2 flex items-center gap-2">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: `rgb(${section.rgb})` }}
                />
                {section.label}
              </h1>
              <span aria-hidden className="t-footnote text-white/20">/</span>
              <p className="t-footnote text-white/45">{section.description}</p>
            </div>
            <a
              href={`/blog/section/${section.slug}/feed.xml`}
              className="t-footnote shrink-0 text-white/30 transition-colors duration-200 hover:text-white/70"
            >
              <span aria-hidden>◉</span> 订阅
            </a>
          </header>

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
