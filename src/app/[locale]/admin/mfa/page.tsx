import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import AdminMfaManager from '@/components/AdminMfaManager';
import { getAdminPageSession } from '@/lib/admin-session';
import { isAdminSession } from '@/lib/admin';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AdminMfaPage' });
  const session = await getAdminPageSession();
  const allowed = session && isAdminSession(session);
  return {
    title: allowed ? t('metaTitle') : t('metaNotFound'),
    robots: { index: false, follow: false },
  };
}

export const dynamic = 'force-dynamic';

export default async function AdminMfaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'AdminMfaPage' });
  const session = await getAdminPageSession();
  if (!session || !isAdminSession(session)) notFound();

  return (
    <>
      <header className="mb-8">
        <h1 className="t-title-2">{t('title')}</h1>
        <p className="t-footnote mt-2 text-white/50">{t('subtitle')}</p>
      </header>

      <AdminMfaManager />
    </>
  );
}
