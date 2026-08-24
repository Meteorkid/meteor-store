import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { DirectoryIndex } from '@/components/pathfinder/DirectoryPage';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PathfinderHub.directory' });
  return { title: t('index.organization'), description: t('indexDescription.organization') };
}

export default async function PathfinderOrganizationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <DirectoryIndex kind="organization" locale={locale} />;
}
