import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { products, localizeProduct, type LocalizedProduct } from '@/data/products';
import { categoryLabels } from '@/lib/constants';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'DocsPage' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

const categoryOrder = ['developer', 'ai', 'design', 'utility'] as const;

export default async function DocsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'DocsPage' });

  const localizedProducts = products.map((p) => localizeProduct(p, locale as Locale));

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          {/* Hero */}
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-violet-300">
            Documentation
          </p>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">{t('title')}</h1>
          <p className="mb-6 max-w-2xl text-lg text-gray-400">
            {t('description')}
          </p>

          {/* Quick nav */}
          <nav className="mb-14 flex flex-wrap gap-2">
            {categoryOrder.map((cat) => {
              const label = categoryLabels[cat];
              if (!label) return null;
              return (
                <a
                  key={cat}
                  href={`#cat-${cat}`}
                  className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-gray-400 transition-colors hover:border-violet-500/40 hover:text-white"
                >
                  {label}
                </a>
              );
            })}
          </nav>

          {/* Per-category sections */}
          {categoryOrder.map((category) => {
            const label = categoryLabels[category];
            const items = localizedProducts.filter((p) => p.category === category);
            if (!items.length || !label) return null;

            return (
              <section key={category} id={`cat-${category}`} className="mb-16 scroll-mt-24">
                <h2 className="mb-8 text-2xl font-bold text-white">{label}</h2>
                <div className="space-y-6">
                  {items.map((product) => (
                    <DocCard key={product.id} product={product} t={t} />
                  ))}
                </div>
              </section>
            );
          })}

          {/* Bottom CTA */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <p className="mb-1 text-lg font-semibold text-white">{t('notFound')}</p>
            <p className="mb-6 text-gray-400">{t('checkReadme')}</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
            >
              {t('browseGithub')}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function DocCard({ product, t }: { product: LocalizedProduct; t: Awaited<ReturnType<typeof getTranslations>> }) {
  const qs = product.quickstart;

  return (
    <div className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] transition-colors hover:border-white/15">
      {/* Header row */}
      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <span className="text-2xl" aria-hidden>{product.icon}</span>
            <Link
              href={`/products/${product.id}`}
              className="text-xl font-bold text-white transition-colors hover:text-violet-300"
            >
              {product.name}
            </Link>
            {/* Platform badges */}
            <div className="flex flex-wrap gap-1.5">
              {product.platforms.map((p) => (
                <span
                  key={p}
                  className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[11px] font-medium text-gray-500"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">{product.tagline}</p>
        </div>

        {/* Action links */}
        <div className="flex shrink-0 items-center gap-3">
          <Link
            href={`/products/${product.id}`}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:border-violet-500/40 hover:text-violet-300"
          >
            {t('detailsLink')}
          </Link>
        </div>
      </div>

      {/* Terminal / Download block */}
      {qs && (
        <div className="border-t border-white/[0.06] bg-zinc-950/60">
          {qs.command ? (
            <div className="flex items-center gap-4 px-6 py-3">
              <div className="flex items-center gap-1.5" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm text-emerald-300/80">
                <span className="select-none text-white/25">$ </span>
                {qs.command}
              </code>
            </div>
          ) : qs.download ? (
            <div className="flex items-center justify-between px-6 py-3">
              <span className="text-sm text-gray-500">{t('macAppHint')}</span>
              <a
                href={qs.download}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/20"
              >
                {t('download')}
              </a>
            </div>
          ) : null}
          {qs.note && (
            <p className="border-t border-white/[0.04] px-6 py-2.5 text-xs text-white/30">
              {qs.note}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
