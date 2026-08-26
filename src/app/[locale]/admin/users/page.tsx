import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import UserManager from '@/components/UserManager';
import { getAdminPageSession } from '@/lib/admin-session';
import { isAdminSession } from '@/lib/admin';
import { getAdminRoster, listAdminUsers } from '@/lib/admin-users';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AdminUsersPage' });
  const session = await getAdminPageSession();
  const allowed = session && isAdminSession(session);
  return {
    title: allowed ? t('metaTitle') : t('metaNotFound'),
    robots: { index: false, follow: false },
  };
}

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'AdminUsersPage' });
  const session = await getAdminPageSession();
  if (!session || !isAdminSession(session)) notFound();

  const [initial, roster] = await Promise.all([listAdminUsers(), getAdminRoster()]);

  return (
    <>
      <header className="mb-8">
        <h1 className="t-title-2">{t('title')}</h1>
        <p className="mt-2 text-sm text-white/55">{t('description')}</p>
      </header>
      <UserManager initial={initial} roster={roster} />
    </>
  );
}
