import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { SITE_URL } from '@/lib/constants';
import { notFoundTitle, safeJsonLd } from '@/lib/seo';
import { buildBreadcrumbSchema } from '@/lib/structured-data';
import { alternativeProducts, alternativesPageCopy } from '@/data/xisland-alternatives';
import {
  ALTERNATIVE_DETAILS_VERIFIED_ON,
  alternativeDetails,
  findAlternativeRow,
} from '@/data/xisland-alternative-details';
import { ChoiceCard, ComparisonTable, DetailSections } from './parts';

// 与产品页一致：父级 layout 用了 headers()，静态化没有意义。
export const dynamic = 'force-dynamic';

interface CompetitorPageProps {
  params: Promise<{ locale: string; id: string; competitor: string }>;
}

/** 三个条件同时成立才渲染：产品是 xisland、slug 在详情数据里、总表也有这一行。 */
function resolve(locale: string, id: string, competitor: string) {
  if (id !== 'xisland') return null;
  const detail = alternativeDetails.find((item) => item.id === competitor);
  const row = findAlternativeRow(competitor);
  const self = alternativeProducts.find((item) => item.self);
  if (!detail || !row || !self) return null;
  return { detail, row, self, loc: locale as Locale };
}

export async function generateMetadata({ params }: CompetitorPageProps) {
  const { locale, id, competitor } = await params;
  const found = resolve(locale, id, competitor);
  // 同 changelog：不给标题会继承站点默认标题，形成软 404 重复页
  if (!found) return { title: notFoundTitle(locale), robots: { index: false, follow: false } };
  return {
    title: found.detail.title[found.loc],
    description: found.detail.metaDescription[found.loc],
  };
}

export default async function CompetitorPage({ params }: CompetitorPageProps) {
  const { locale, id, competitor } = await params;
  const found = resolve(locale, id, competitor);
  // 不存在的 slug 走 404，而不是渲染一个只有标题的空壳页。
  if (!found) notFound();
  setRequestLocale(locale);

  const { detail, row, self, loc } = found;
  const copy = alternativesPageCopy;
  const tNav = await getTranslations({ locale, namespace: 'Header' });

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: tNav('home'), url: `${SITE_URL}/${locale}` },
    { name: tNav('products'), url: `${SITE_URL}/${locale}/products` },
    { name: 'XIsland', url: `${SITE_URL}/${locale}/products/xisland` },
    { name: copy.eyebrow[loc], url: `${SITE_URL}/${locale}/products/xisland/alternatives` },
    { name: detail.title[loc], url: `${SITE_URL}/${locale}/products/xisland/alternatives/${row.id}` },
  ]);

  return (
    <div className="min-h-screen bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
      />
      <Header />
      <main className="container mx-auto max-w-4xl px-4 py-12">
        <Link
          href="/products/xisland/alternatives"
          className="mb-10 inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
        >
          <span aria-hidden>←</span> {copy.eyebrow[loc]}
        </Link>

        <header className="mb-12">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
            {copy.eyebrow[loc]}
          </p>
          <h1 className="mb-5 text-3xl font-bold leading-tight text-white md:text-4xl">
            {detail.title[loc]}
          </h1>
          <p className="max-w-3xl rounded-2xl border border-violet-300/20 bg-violet-500/[0.07] px-5 py-4 leading-relaxed text-gray-200">
            {detail.verdict[loc]}
          </p>
        </header>

        <section className="mb-14" aria-labelledby="side-by-side">
          <h2 id="side-by-side" className="mb-5 text-2xl font-bold text-white">
            {loc === 'zh' ? '逐项对照' : 'Side by side'}
          </h2>
          <ComparisonTable
            head={{
              product: copy.tableHead.product[loc],
              agents: copy.tableHead.agents[loc],
              license: copy.tableHead.license[loc],
              pricing: copy.tableHead.pricing[loc],
            }}
            rows={[
              {
                name: self.name,
                agents: self.agents,
                agentsNote: self.agentsNote?.[loc],
                license: self.license[loc],
                pricing: self.pricing[loc],
                highlight: true,
              },
              {
                name: row.name,
                agents: row.agents,
                agentsNote: row.agentsNote?.[loc],
                license: row.license[loc],
                pricing: row.pricing[loc],
              },
            ]}
          />
        </section>

        <DetailSections sections={detail.sections} locale={loc} />

        <section className="mb-12 grid gap-4 md:grid-cols-2">
          <ChoiceCard
            title={loc === 'zh' ? `选 ${row.name}` : `Choose ${row.name}`}
            body={detail.chooseThem[loc]}
          />
          <ChoiceCard
            title={loc === 'zh' ? '选 XIsland' : 'Choose XIsland'}
            body={detail.chooseUs[loc]}
            highlight
          />
        </section>

        <p className="mb-10 rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 text-sm leading-relaxed text-gray-400">
          {copy.disclosure[loc]}
          <span className="mt-2 block text-xs text-gray-500">{ALTERNATIVE_DETAILS_VERIFIED_ON}</span>
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/products/xisland/alternatives"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/25 hover:bg-white/10"
          >
            {loc === 'zh' ? '看全部同类工具' : 'See all alternatives'}
          </Link>
          <Link
            href="/products/xisland"
            className="text-sm text-gray-400 transition-colors hover:text-white"
          >
            {copy.backToProduct[loc]}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
