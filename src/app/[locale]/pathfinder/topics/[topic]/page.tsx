import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import DirectoryPage from '@/components/pathfinder/DirectoryPage';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic } = await params;
  return { title: decodeURIComponent(topic) };
}

export default async function PathfinderTopicPage({
  params,
}: {
  params: Promise<{ locale: string; topic: string }>;
}) {
  const { locale, topic } = await params;
  setRequestLocale(locale);
  return <DirectoryPage kind="topic" slug={topic} locale={locale} />;
}
