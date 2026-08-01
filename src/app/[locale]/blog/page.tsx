import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogList from '@/components/BlogList';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'BlogPage' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      types: { 'application/rss+xml': '/blog/feed.xml' },
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'BlogPage' });

  return (
    <div className="blog-scope min-h-screen bg-black text-white">
      <Header />
      <main className="relative container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-4xl">
          {/* 当前位置由导航栏表达，这里只留一句上下文，把版面还给文章 */}
          <header className="relative mb-8 flex items-baseline justify-between gap-6">
            <h1 className="sr-only">{t('title')}</h1>
            <p className="t-footnote text-white/60">
              {t('description')}
            </p>
            <a
              href="/blog/feed.xml"
              className="t-footnote shrink-0 text-white/60 transition-colors duration-200 hover:text-white/70"
            >
              <span aria-hidden>◉</span> RSS
            </a>
          </header>

          <BlogList locale={locale as Locale} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
