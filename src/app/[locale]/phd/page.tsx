import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MastersHub from '@/components/masters/MastersHub';
import { phdText } from '@/components/masters/text';
import { getSession } from '@/lib/auth';
import { defaultMastersYear } from '@/lib/masters/types';
import { getPhdRoundsByIds, getPhdWatches, listPhdRounds } from '@/lib/phd/service';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = phdText[locale === 'en' ? 'en' : 'zh'];
  return { title: copy.title, description: copy.description };
}

export default async function PhdPage({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ year?: string | string[] }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const query = await searchParams;
  const now = new Date();
  const yearText = query.year ?? String(defaultMastersYear(now));
  if (typeof yearText !== 'string' || !/^\d{4}$/.test(yearText)) notFound();
  const year = Number(yearText);
  if (year < 2020 || year > 2100) notFound();
  const session = await getSession();
  const [roundsResult, watchesResult] = await Promise.allSettled([
    listPhdRounds(year), session ? getPhdWatches(session.userId) : Promise.resolve([]),
  ]);
  const watches = watchesResult.status === 'fulfilled' ? watchesResult.value : [];
  const [watchedRoundsResult] = await Promise.allSettled([
    watches.length ? getPhdRoundsByIds(watches.map(watch => watch.roundId)) : Promise.resolve([]),
  ]);

  return <div className="min-h-screen bg-black text-white">
    <Header />
    <main className="container mx-auto px-4 pb-12 pt-10 sm:pb-16 sm:pt-14">
      <MastersHub kind="phd" year={year} nowIso={now.toISOString()} userId={session?.userId ?? null}
        rounds={roundsResult.status === 'fulfilled' ? roundsResult.value : []}
        initialWatches={watches} watchedRounds={watchedRoundsResult.status === 'fulfilled' ? watchedRoundsResult.value : []}
        loadFailed={roundsResult.status === 'rejected'} watchesFailed={watchesResult.status === 'rejected' || watchedRoundsResult.status === 'rejected'} />
    </main>
    <Footer />
  </div>;
}
