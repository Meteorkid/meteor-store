import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import DailyManager from '@/components/admin/DailyManager';
import { isAdminSession } from '@/lib/admin';
import { getAdminPageSession } from '@/lib/admin-session';
import { dailyDate } from '@/lib/daily/types';
import { listDailyEditions } from '@/lib/daily/service';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const session = await getAdminPageSession();
  const allowed = session && isAdminSession(session);
  return {
    title: allowed ? (locale === 'en' ? 'Daily Fresh · Admin' : '每日一新 · 管理后台') : 'Not found',
    robots: { index: false, follow: false },
  };
}

export default async function DailyAdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getAdminPageSession();
  if (!session || !isAdminSession(session)) notFound();
  const date = dailyDate();
  const editions = await listDailyEditions(date);
  return (
    <>
      <header className="mb-8">
        <h1 className="t-title-2">{locale === 'en' ? 'Daily Fresh' : '每日一新'}</h1>
        <p className="mt-2 text-sm text-white/60">
          {locale === 'en' ? 'Review daily editions, confirm sources and publish. Dates follow Beijing time.' : '审核每日内容、核对来源后发布。期次按北京时间划分。'}
        </p>
      </header>
      <DailyManager initialDate={date} initialEditions={editions} />
    </>
  );
}
