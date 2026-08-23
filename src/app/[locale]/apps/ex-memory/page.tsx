import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ExMemoryExperienceFrame from '@/components/ExMemoryExperienceFrame';
import { Link } from '@/i18n/navigation';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ExMemoryExperiencePage' });
  return { title: `${t('title')} | Meteor Store`, description: t('description') };
}

export default async function ExMemoryExperiencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'ExMemoryExperiencePage' });
  const session = await getSession();

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-10 md:py-14">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="t-eyebrow mb-3 text-violet-300">{t('eyebrow')}</p>
            <h1 className="t-title-1 text-white">{t('title')}</h1>
            <p className="mt-3 text-white/60">{t('subtitle')}</p>
          </div>
          <Link href="/products/ex-memory" className="text-sm text-white/60 transition-colors hover:text-white">
            <span aria-hidden>←</span> {t('backToProduct')}
          </Link>
        </div>

        {session ? (
          <ExMemoryExperienceFrame
            loadingLabel={t('loading')}
            title={t('frameTitle')}
            unavailableLabel={t('unavailable')}
            retryLabel={t('retry')}
          />
        ) : (
          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] px-6 py-20 text-center md:px-12 md:py-28">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/15 blur-3xl" aria-hidden />
            <div className="relative mx-auto max-w-lg">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-2xl" aria-hidden>✦</div>
              <h2 className="t-title-2 text-white">{t('loginTitle')}</h2>
              <p className="mt-4 t-body text-white/60">{t('loginDescription')}</p>
              <Link
                href={{ pathname: '/login', query: { next: '/apps/ex-memory' } }}
                className="mt-8 inline-flex rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
              >
                {t('loginButton')}
              </Link>
              <p className="mx-auto mt-5 max-w-md t-footnote text-white/60">{t('privacyHint')}</p>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
