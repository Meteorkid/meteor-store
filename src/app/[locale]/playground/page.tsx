import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PlaygroundTabs from '@/components/PlaygroundTabs';
import { getBrowserExperience } from '@/data/app-manifest';
import { localizeProducts } from '@/data/products';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PlaygroundPage' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function PlaygroundPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'PlaygroundPage' });
  const apps = localizeProducts(locale as Locale).flatMap(product => {
    const experience = getBrowserExperience(product);
    return experience ? [{ id: product.id, name: product.name, tagline: product.tagline, ...experience }] : [];
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-16 md:py-20">
        <div className="mx-auto max-w-4xl">
          <h1 className="t-title-1 mb-3">{t('title')}</h1>
          <p className="t-body mb-6 text-white/70">{t('description')}</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {apps.map(app => (
              <li key={app.id}>
                <Link href={app.href} target="_blank" rel="noopener noreferrer" prefetch={false}
                  aria-label={t('openNamedApp', { name: app.name })}
                  aria-describedby={`about-${app.id} access-${app.id}`}
                  className="glass-card flex h-full flex-col gap-2 rounded-2xl p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300">
                  <span className="t-title-3">{app.name}</span>
                  <span id={`about-${app.id}`} className="text-sm leading-relaxed text-white/75">{app.tagline}</span>
                  <span className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2 text-sm">
                    <span id={`access-${app.id}`} className="text-white/65">{t(app.id === 'ex-memory' ? 'needsApiKey' : app.requiresLogin ? 'needsAccount' : 'guestAccess')}</span>
                    <span className="font-medium text-violet-200">{t('openApp')} <span aria-hidden>↗</span></span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <section id="demos" aria-labelledby="demo-heading" className="mt-12 border-t border-white/10 pt-8">
            <h2 id="demo-heading" className="t-title-2 mb-2">{t('demos')}</h2>
            <p className="mb-6 text-sm leading-relaxed text-white/70">{t('demoDescription')}</p>
            <PlaygroundTabs />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
