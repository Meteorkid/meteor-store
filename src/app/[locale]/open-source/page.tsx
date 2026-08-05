import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { products, localizeProduct } from '@/data/products';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'OpenSourcePage' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

const languageColors: Record<string, string> = {
  Python: '#3572A5',
  TypeScript: '#3178C6',
  JavaScript: '#F1E05A',
  Swift: '#F05138',
  'C++': '#f34b7d',
  Rust: '#DEA584',
};

const projectMeta: Record<string, { language: string; descKey: string }> = {
  omnicrawl: { language: 'Python', descKey: 'descOmnicrawl' },
  'ex-memory': { language: 'Python', descKey: 'descExMemory' },
  'skeleton-anatomy': { language: 'TypeScript', descKey: 'descSkeletonAnatomy' },
  'ui-design-system': { language: 'TypeScript', descKey: 'descUiDesignSystem' },
  statux: { language: 'TypeScript', descKey: 'descStatux' },
  xisland: { language: 'Swift', descKey: 'descXisland' },
  tollow: { language: 'TypeScript', descKey: 'descTollow' },
  xnook: { language: 'Swift', descKey: 'descXnook' },
  'chakra-visualizer': { language: 'TypeScript', descKey: 'descChakraVisualizer' },
};

export default async function OpenSourcePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'OpenSourcePage' });

  const localizedProducts = products.map((p) => localizeProduct(p, locale as Locale));

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          {/* Hero */}
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">
            Open Source
          </p>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">{t('title')}</h1>
          <p className="mb-6 max-w-2xl text-lg text-gray-400">
            {t('description')}
          </p>

          {/* Stats bar */}
          <div className="mb-14 flex flex-wrap gap-6 text-sm text-gray-500">
            <span><strong className="text-white">{products.length}</strong> {t('projects')}</span>
            <span><strong className="text-white">MIT</strong> {t('license')}</span>
          </div>

          {/* Project grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {localizedProducts.map((product) => {
              const meta = projectMeta[product.id];
              const lang = meta?.language || 'TypeScript';
              const langColor = languageColors[lang] || '#8b949e';
              const desc = meta ? t(meta.descKey) : product.tagline;

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition-all hover:border-white/15 hover:bg-white/[0.04]"
                >
                  <div>
                    <div className="mb-3 flex items-center gap-3">
                      <span className="text-xl" aria-hidden>{product.icon}</span>
                      <h2 className="text-lg font-bold text-white transition-colors group-hover:text-emerald-300">
                        {product.name}
                      </h2>
                    </div>
                    <p className="mb-4 text-sm leading-relaxed text-gray-400">{desc}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    {/* Language dot */}
                    <span className="flex items-center gap-1.5">
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{ backgroundColor: langColor }}
                      />
                      {lang}
                    </span>

                    {/* Platforms */}
                    <span className="flex flex-wrap gap-1">
                      {product.platforms.slice(0, 3).map((p) => (
                        <span
                          key={p}
                          className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[11px]"
                        >
                          {p}
                        </span>
                      ))}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <p className="mb-4 text-gray-400">
              {t('contribute')}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
            >
              {t('followGithub')}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
