import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StoryLetter from '@/components/StoryLetter';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'StoryPage' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="relative overflow-hidden">
        {/* 暖色夜空背景 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#12081f] to-black" aria-hidden="true" />
        <div className="absolute top-[-10%] left-[20%] w-[50%] h-[40%] bg-purple-700/10 rounded-full blur-[120px]" aria-hidden="true" />
        <div className="absolute bottom-[10%] right-[10%] w-[35%] h-[30%] bg-amber-600/8 rounded-full blur-[100px]" aria-hidden="true" />

        <StoryLetter />
      </main>

      <Footer />
    </div>
  );
}
