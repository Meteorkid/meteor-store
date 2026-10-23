import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DailyHub from '@/components/daily/DailyHub';
import { dailyText } from '@/components/daily/text';
import { getSession } from '@/lib/auth';
import { dailyDate, isDailyHistoryDate } from '@/lib/daily/types';
import { getDailyEditions, getDailyPreferences, getLatestPublishedDailyDates } from '@/lib/daily/service';
import { getMastersSummary } from '@/lib/masters/service';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = dailyText[locale === 'en' ? 'en' : 'zh'];
  return { title: copy.title, description: copy.description };
}

export default async function DailyPage({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ date?: string | string[]; view?: string | string[] }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const query = await searchParams;
  const today = dailyDate();
  const date = query.date ?? today;
  if (typeof date !== 'string' || !isDailyHistoryDate(date, today)) notFound();
  const session = await getSession();
  const [editionResult, preferencesResult, mastersResult, historyResult] = await Promise.allSettled([
    getDailyEditions(date),
    session ? getDailyPreferences(session.userId) : Promise.resolve(null),
    getMastersSummary(),
    getLatestPublishedDailyDates(date),
  ]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 pb-12 pt-10 sm:pb-16 sm:pt-14">
        <DailyHub date={date} today={today} viewAll={query.view === 'all'} userId={session?.userId ?? null}
          editions={editionResult.status === 'fulfilled' ? editionResult.value : []}
          initialPreferences={preferencesResult.status === 'fulfilled' ? preferencesResult.value : null}
          mastersSummary={mastersResult.status === 'fulfilled' ? mastersResult.value : null}
          previousPublishedDates={historyResult.status === 'fulfilled' ? historyResult.value : {}}
          previousPublishedDatesFailed={historyResult.status === 'rejected'}
          mastersSummaryFailed={mastersResult.status === 'rejected'}
          loadFailed={editionResult.status === 'rejected'} preferencesFailed={preferencesResult.status === 'rejected'} />
      </main>
      <Footer />
    </div>
  );
}
