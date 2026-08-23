import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import ExMemoryExperienceFrame from '@/components/ExMemoryExperienceFrame';
import { redirect } from '@/i18n/navigation';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ExMemoryExperiencePage' });
  return { title: `${t('title')} | Meteor Store`, description: t('description') };
}

export default async function ExMemoryExperiencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'ExMemoryExperiencePage' });
  const session = await getSession();

  if (!session) {
    redirect({
      href: { pathname: '/login', query: { next: '/apps/ex-memory' } },
      locale,
    });
  }

  return (
    <main className="h-dvh w-screen overflow-hidden bg-black">
      <ExMemoryExperienceFrame
        loadingLabel={t('loading')}
        title={t('frameTitle')}
        unavailableLabel={t('unavailable')}
        retryLabel={t('retry')}
      />
    </main>
  );
}
