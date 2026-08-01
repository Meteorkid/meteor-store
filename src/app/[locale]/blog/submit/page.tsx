import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostSubmitForm from '@/components/PostSubmitForm';
import { getSession } from '@/lib/auth';
import { markdownToHtml } from '@/lib/markdown';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'BlogSubmitPage' });
  return {
    title: t('metaTitle'),
    robots: { index: false, follow: false },
  };
}

export const dynamic = 'force-dynamic';

export default async function SubmitPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'BlogSubmitPage' });
  const session = await getSession();
  if (!session) redirect('/login');

  /**
   * 预览在服务端渲染。用的是和正式文章完全相同的那条管线
   * （remark + rehype-sanitize），所以作者看到的就是发布后的样子，
   * 也不必把渲染器打进客户端包。
   */
  async function renderPreview(markdown: string): Promise<string> {
    'use server';
    return markdownToHtml(markdown.slice(0, 50_000));
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-3xl">
          <header className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h1 className="t-title-2">{t('title')}</h1>
            <Link
              href="/blog/my-posts"
              className="t-footnote text-white/60 transition-colors duration-200 hover:text-white"
            >
              {t('myPostsLink')}
            </Link>
          </header>

          <PostSubmitForm renderPreview={renderPreview} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
