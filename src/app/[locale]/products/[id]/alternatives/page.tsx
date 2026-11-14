import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { SITE_URL } from '@/lib/constants';
import { safeJsonLd } from '@/lib/seo';
import { buildBreadcrumbSchema } from '@/lib/structured-data';
import {
  ALTERNATIVES_VERIFIED_ON,
  alternativeProducts,
  alternativesPageCopy,
  type AlternativeProduct,
} from '@/data/xisland-alternatives';

// 与产品页保持一致：父级 layout 用了 headers()，静态化没有意义。
export const dynamic = 'force-dynamic';

interface AlternativesPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: AlternativesPageProps) {
  const { locale, id } = await params;
  if (id !== 'xisland') return {};
  const loc = locale as Locale;
  return {
    title: alternativesPageCopy.title[loc],
    description: alternativesPageCopy.metaDescription[loc],
  };
}

export default async function AlternativesPage({ params }: AlternativesPageProps) {
  const { locale, id } = await params;
  // 只有 XIsland 有对应的同类工具清单。别的产品走 404，
  // 而不是渲染一个没有内容的对比页——空页面比 404 更糟。
  if (id !== 'xisland') notFound();
  setRequestLocale(locale);

  const loc = locale as Locale;
  const copy = alternativesPageCopy;
  const tNav = await getTranslations({ locale, namespace: 'Header' });

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: tNav('home'), url: `${SITE_URL}/${locale}` },
    { name: tNav('products'), url: `${SITE_URL}/${locale}/products` },
    { name: 'XIsland', url: `${SITE_URL}/${locale}/products/xisland` },
    { name: copy.eyebrow[loc], url: `${SITE_URL}/${locale}/products/xisland/alternatives` },
  ]);

  // 这一页本身就是一个「清单」，用 ItemList 描述它比硬套 Product 更准确。
  // 刻意不给竞品下发 Product/Review 标记：我们不是它们的评测方，声明评分会被判 spammy markup。
  const listSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: copy.title[loc],
    numberOfItems: alternativeProducts.length,
    itemListElement: alternativeProducts.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: item.self ? `${SITE_URL}/${locale}${item.href}` : item.href,
    })),
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd([listSchema, breadcrumbSchema]) }}
      />
      <Header />
      <main className="container mx-auto px-4 py-12">
        <Link
          href="/products/xisland"
          className="mb-10 inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
        >
          <span aria-hidden>←</span> {copy.backToProduct[loc]}
        </Link>

        <section className="mb-14 max-w-3xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
            {copy.eyebrow[loc]}
          </p>
          <h1 className="mb-5 text-3xl font-bold leading-tight text-white md:text-4xl">
            {copy.title[loc]}
          </h1>
          <p className="mb-4 leading-relaxed text-gray-300">{copy.intro[loc]}</p>
          <p className="rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 text-sm leading-relaxed text-gray-400">
            {copy.disclosure[loc]}
            <span className="mt-2 block text-xs text-gray-500">
              {ALTERNATIVES_VERIFIED_ON}
            </span>
          </p>
        </section>

        <section className="mb-16">
          <ComparisonTable locale={loc} />
          <ul className="grid grid-cols-1 gap-3 md:hidden">
            {alternativeProducts.map((item) => (
              <AlternativeCard key={item.id} item={item} locale={loc} />
            ))}
          </ul>
        </section>

        <section className="mb-16 max-w-3xl">
          <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
            {copy.limitationsTitle[loc]}
          </h2>
          <p className="mb-5 leading-relaxed text-gray-400">{copy.limitationsIntro[loc]}</p>
          <ul className="space-y-3">
            {copy.limitations.map((entry) => (
              <li
                key={entry.zh}
                className="rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 text-sm leading-relaxed text-gray-300"
              >
                {entry[loc]}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-16 max-w-3xl">
          <h2 className="mb-5 text-2xl font-bold text-white md:text-3xl">{copy.pickerTitle[loc]}</h2>
          <ul className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.035]">
            {copy.picker.map((entry) => (
              <li key={entry.pick.zh} className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-4">
                <span className="text-sm leading-relaxed text-gray-300">{entry.need[loc]}</span>
                <span className="text-sm font-semibold text-violet-200">{entry.pick[loc]}</span>
              </li>
            ))}
          </ul>
        </section>

        <Link
          href="/products/xisland"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/25 hover:bg-white/10"
        >
          {copy.backToProduct[loc]} <span aria-hidden>→</span>
        </Link>
      </main>
      <Footer />
    </div>
  );
}

/** 桌面表格。手机用 AlternativeCard，见下方。 */
function ComparisonTable({ locale }: { locale: Locale }) {
  const copy = alternativesPageCopy;
  const head = copy.tableHead;
  return (
    <div className="hidden overflow-x-auto rounded-2xl border border-white/10 md:block">
      <table className="w-full min-w-[880px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.04] text-xs uppercase tracking-wider text-gray-400">
            {[head.product, head.agents, head.license, head.pricing, head.version, head.bestFor].map(
              (cell) => (
                <th key={cell.zh} scope="col" className="px-4 py-3 font-semibold">
                  {cell[locale]}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {alternativeProducts.map((item) => (
            <tr
              key={item.id}
              className={`border-b border-white/[0.07] align-top last:border-0 ${
                item.self ? 'bg-violet-500/[0.07]' : ''
              }`}
            >
              <th scope="row" className="px-4 py-4 font-normal">
                <ProductName item={item} />
                {item.self && <SelfBadge locale={locale} />}
              </th>
              <td className="px-4 py-4 text-white">
                <span className="text-base font-semibold">{item.agents}</span>
                {item.agentsNote && (
                  <span className="mt-1 block text-xs leading-snug text-gray-500">
                    {item.agentsNote[locale]}
                  </span>
                )}
              </td>
              <td className="px-4 py-4 text-gray-300">{item.license[locale]}</td>
              <td className="px-4 py-4 text-gray-300">{item.pricing[locale]}</td>
              <td className="whitespace-nowrap px-4 py-4 text-gray-300">
                v{item.version}
                <span className="mt-1 block text-xs text-gray-500">
                  {item.released ?? copy.noDate[locale]}
                </span>
              </td>
              <td className="px-4 py-4 text-gray-300">
                {item.bestFor[locale]}
                <span className="mt-1 block text-xs leading-snug text-gray-500">
                  {item.tradeoff[locale]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** 手机卡片：六个字段在窄屏上没法横排，改成逐项列出。 */
function AlternativeCard({ item, locale }: { item: AlternativeProduct; locale: Locale }) {
  const copy = alternativesPageCopy;
  const head = copy.tableHead;
  return (
    <li
      className={`rounded-2xl border p-5 ${
        item.self ? 'border-violet-300/30 bg-violet-500/[0.08]' : 'border-white/10 bg-white/[0.035]'
      }`}
    >
      <div className="mb-3">
        <ProductName item={item} />
        {item.self && <SelfBadge locale={locale} />}
      </div>
      <dl className="space-y-2 text-sm">
        <Field label={head.agents[locale]} value={`${item.agents}`} note={item.agentsNote?.[locale]} />
        <Field label={head.license[locale]} value={item.license[locale]} />
        <Field label={head.pricing[locale]} value={item.pricing[locale]} />
        <Field
          label={head.version[locale]}
          value={`v${item.version}`}
          note={item.released ?? copy.noDate[locale]}
        />
        <Field label={head.bestFor[locale]} value={item.bestFor[locale]} note={item.tradeoff[locale]} />
      </dl>
    </li>
  );
}

function Field({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="flex gap-3">
      <dt className="w-20 shrink-0 text-xs uppercase tracking-wider text-gray-500">{label}</dt>
      <dd className="flex-1 text-gray-300">
        {value}
        {note && <span className="mt-1 block text-xs leading-snug text-gray-500">{note}</span>}
      </dd>
    </div>
  );
}

function ProductName({ item }: { item: AlternativeProduct }) {
  const name = <span className="font-semibold text-white">{item.name}</span>;
  const cls = 'transition-colors hover:text-violet-200';
  // 竞品名指向站内的两两对比子页（承接「XIsland vs X」这类具体查询），
  // 官网地址另开一个小链接，读者要核对原文时仍然点得到。
  const href = item.self ? item.href : `/products/xisland/alternatives/${item.id}`;
  return (
    <span className="block">
      <Link href={href} className={cls}>
        {name}
      </Link>
      <span className="mt-1 flex gap-3">
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-500 underline underline-offset-2 transition-colors hover:text-gray-300"
        >
          {item.self ? 'GitHub' : '官网'}
        </a>
        {item.repo && (
          <a
            href={item.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 underline underline-offset-2 transition-colors hover:text-gray-300"
          >
            GitHub
          </a>
        )}
      </span>
    </span>
  );
}

function SelfBadge({ locale }: { locale: Locale }) {
  return (
    <span className="mt-2 inline-block rounded-full border border-violet-300/30 bg-violet-500/15 px-2 py-0.5 text-[11px] text-violet-200">
      {alternativesPageCopy.selfLabel[locale]}
    </span>
  );
}
