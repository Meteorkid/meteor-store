import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import DirectoryPage from '@/components/pathfinder/DirectoryPage';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: decodeURIComponent(slug) };
}

export default async function PathfinderOrganizationPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  return <DirectoryPage kind="organization" slug={slug} locale={locale} />;
}
