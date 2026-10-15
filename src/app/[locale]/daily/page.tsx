import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DailyHub from '@/components/daily/DailyHub';
import { dailyText } from '@/components/daily/text';
import { getSession } from '@/lib/auth';
import { dailyDate, isDailyHistoryDate } from '@/lib/daily/types';
import { getDailyEditions, getDailyPreferences } from '@/lib/daily/service';
import { getMastersSummary } from '@/lib/masters/service';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = dailyText[locale === 'en' ? 'en' : 'zh'];
  return { title: copy.title, description: copy.description };
}

export default async function DailyPage({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ date?: string | string[] }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const query = await searchParams;
  const today = dailyDate();
  const date = query.date ?? today;
  if (typeof date !== 'string' || !isDailyHistoryDate(date, today)) notFound();
  const session = await getSession();
  const [editionResult, preferencesResult, mastersResult] = await Promise.allSettled([
    getDailyEditions(date),
    session ? getDailyPreferences(session.userId) : Promise.resolve(null),
    getMastersSummary(),
  ]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 pb-12 pt-28 sm:pb-16 sm:pt-32">
        <DailyHub date={date} today={today} userId={session?.userId ?? null}
          editions={editionResult.status === 'fulfilled' ? editionResult.value : []}
          initialPreferences={preferencesResult.status === 'fulfilled' ? preferencesResult.value : null}
          mastersSummary={mastersResult.status === 'fulfilled' ? mastersResult.value : null}
          mastersSummaryFailed={mastersResult.status === 'rejected'}
          loadFailed={editionResult.status === 'rejected'} preferencesFailed={preferencesResult.status === 'rejected'} />
      </main>
      <Footer />
    </div>
  );
}
