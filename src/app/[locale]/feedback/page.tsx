import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { findLocalizedHelpArticle } from '@/data/help-articles';
import type { Locale } from '@/i18n/routing';
import FeedbackForm from './FeedbackForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'FeedbackPage' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function FeedbackPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; slug?: string }>;
}) {
  const { locale } = await params;
  const { type, slug } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'FeedbackPage' });
  const currentLocale = locale as Locale;

  // 安全地生成预填内容：只从已知帮助文章 slug 生成
  let prefillContent = '';
  if (slug && typeof slug === 'string') {
    const article = findLocalizedHelpArticle(slug, currentLocale);
    if (article) {
      prefillContent = currentLocale === 'zh'
        ? `我正在阅读「${article.title}」帮助文档，但仍有以下问题：\n\n`
        : `I was reading the "${article.title}" help article, but I still have the following questions:\n\n`;
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">{t('title')}</h1>
          <p className="text-gray-400 mb-10">
            {t('description')}
          </p>
          <FeedbackForm initialType={type === 'question' ? 'question' : ''} prefillContent={prefillContent} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
