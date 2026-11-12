import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NationalCompetitionPlanner from '@/components/competitions/NationalCompetitionPlanner';
import { competitionCalendarText } from '@/components/competitions/text';
import {
  competitionCalendarYears,
  competitionCalendarSources,
  nationalCompetitionClassNotes,
  nationalCompetitions,
} from '@/data/national-competitions';
import type { CompetitionFilters, CompetitionSort, CompetitionStatus } from '@/lib/national-competitions';
import type { Locale } from '@/i18n/routing';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = competitionCalendarText[locale === 'en' ? 'en' : 'zh'];
  return { title: copy.title, description: copy.description };
}

export default async function CompetitionsPage({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: SearchParams;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const query = await searchParams;
  const requestedYear = Number(first(query.year) || competitionCalendarYears[0]);
  const year = competitionCalendarYears.find((option) => option === requestedYear);
  if (!year) notFound();
  const requestedStatus = first(query.status);
  const status: CompetitionFilters['status'] = ['open', 'upcoming', 'ended', 'pending'].includes(requestedStatus)
    ? requestedStatus as CompetitionStatus
    : 'all';
  const sort: CompetitionSort = first(query.sort) === 'source' ? 'source' : 'soon';
  const filters: CompetitionFilters = {
    query: first(query.q).slice(0, 100),
    field: first(query.field).slice(0, 80),
    status,
    sort,
  };
  const typedLocale = (locale === 'en' ? 'en' : 'zh') as Locale;

  return <div className="min-h-screen bg-black text-white">
    <Header />
    <NationalCompetitionPlanner
      locale={typedLocale}
      year={year}
      years={competitionCalendarYears}
      nowIso={new Date().toISOString()}
      competitions={nationalCompetitions}
      filters={filters}
      bClassNote={nationalCompetitionClassNotes.b[typedLocale]}
      sources={competitionCalendarSources}
    />
    <Footer />
  </div>;
}
