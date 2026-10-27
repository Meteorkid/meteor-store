import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import InviteCodeManager from '@/components/InviteCodeManager';
import { getAdminPageSession } from '@/lib/admin-session';
import { isAdminSession } from '@/lib/admin';
import { Link } from '@/i18n/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AdminInviteCodesPage' });
  const session = await getAdminPageSession();
  const allowed = session && isAdminSession(session);
  return {
    title: allowed ? t('metaTitle') : t('metaNotFound'),
    robots: { index: false, follow: false },
  };
}

export const dynamic = 'force-dynamic';

export default async function InviteCodesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'AdminInviteCodesPage' });
  const session = await getAdminPageSession();
  if (!session || !isAdminSession(session)) notFound();

  return (
    <>
      <header className="mb-8">
        <h1 className="t-title-2">{t('title')}</h1>
        <p className="mt-2 text-sm text-gray-400">
          {t('description')}
        </p>
      </header>
      <aside className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70">
        <p>{t('legacyHint')}</p>
        <Link href="/admin/users" className="mt-3 inline-block text-violet-300 underline underline-offset-4">{t('manageUsers')}</Link>
      </aside>
      <InviteCodeManager />
    </>
  );
}
