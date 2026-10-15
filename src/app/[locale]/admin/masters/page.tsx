import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import MastersManager from '@/components/admin/MastersManager';
import { getAdminPageSession } from '@/lib/admin-session';
import { isAdminSession } from '@/lib/admin';
import { defaultMastersYear } from '@/lib/masters/types';
import { listAdminMastersRounds } from '@/lib/masters/service';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const session = await getAdminPageSession();
  return {
    title: session && isAdminSession(session) ? (locale === 'en' ? 'Masters applications · Admin' : '硕士申请日历 · 管理后台') : 'Not found',
    robots: { index: false, follow: false },
  };
}

export default async function MastersAdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getAdminPageSession();
  if (!session || !isAdminSession(session)) notFound();
  const year = defaultMastersYear();
  const rounds = await listAdminMastersRounds(year);
  return (
    <>
      <header className="mb-8">
        <h1 className="t-title-2">{locale === 'en' ? 'Masters application calendar' : '硕士申请日历'}</h1>
        <p className="mt-2 text-sm text-white/60">{locale === 'en'
          ? 'Verify official programme dates, applicant groups and intake years before publishing. Unannounced dates stay unknown.'
          : '按项目、申请群体和入学年份核验官方日期，再审核发布。未公布的日期保持未知。'}</p>
      </header>
      <MastersManager initialYear={year} initialRounds={rounds} />
    </>
  );
}
