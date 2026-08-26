import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import FeedbackManager from '@/components/FeedbackManager';
import { isAdminSession } from '@/lib/admin';
import { listFeedback } from '@/lib/admin-feedback';
import { getAdminPageSession } from '@/lib/admin-session';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AdminFeedbackPage' });
  const session = await getAdminPageSession();
  return {
    title: session && isAdminSession(session) ? t('metaTitle') : t('metaNotFound'),
    robots: { index: false, follow: false },
  };
}

export default async function AdminFeedbackPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'AdminFeedbackPage' });
  const session = await getAdminPageSession();
  if (!session || !isAdminSession(session)) notFound();

  const feedback = await listFeedback();
  return (
    <>
      <header className="mb-8">
        <h1 className="t-title-2">{t('title')}</h1>
        <p className="mt-2 text-sm text-white/55">{t('description')}</p>
      </header>
      <div className="mt-8">
        <FeedbackManager initialFeedback={feedback} />
      </div>
    </>
  );
}
