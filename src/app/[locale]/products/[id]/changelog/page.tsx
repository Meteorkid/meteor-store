import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { SITE_URL } from '@/lib/constants';
import { notFoundTitle, safeJsonLd } from '@/lib/seo';
import { buildBreadcrumbSchema } from '@/lib/structured-data';
import { markdownToHtml } from '@/lib/markdown';
import { localizeProduct, products } from '@/data/products';
import {
  FULL_BODY_LIMIT,
  changelogCopy,
  getProductReleases,
  isChangelogProduct,
  prepareReleaseBody,
  releaseSummary,
  type ReleaseEntry,
} from '@/data/product-changelog';

// 与产品页保持一致：父级 layout 用了 headers()，静态化没有意义。
// 数据本身由 fetch 的 revalidate 缓存，不会每次请求都打 GitHub。
export const dynamic = 'force-dynamic';

interface ChangelogPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: ChangelogPageProps) {
  const { locale, id } = await params;
  // 返回空对象会让页面继承站点默认标题，看上去像首页——软 404 一旦被索引，
  // 就是一个「标题是首页、内容是未找到」的重复页。这里显式给标题并关掉索引。
  if (!isChangelogProduct(id)) return { title: notFoundTitle(locale), robots: { index: false, follow: false } };
  const loc = locale as Locale;
  const raw = products.find((item) => item.id === id);
  if (!raw) return {};
  const product = localizeProduct(raw, loc);
  const { entries } = await getProductReleases(id);
  const copy = changelogCopy[loc];
  return {
    title: copy.title(product.name),
    description: copy.metaDescription(product.name, entries.length),
  };
}

export default async function ChangelogPage({ params }: ChangelogPageProps) {
  const { locale, id } = await params;
  // 白名单之外的产品走 404，而不是渲染一个只有一行版本号的空日志。
  if (!isChangelogProduct(id)) notFound();
  setRequestLocale(locale);

  const loc = locale as Locale;
  const raw = products.find((item) => item.id === id);
  if (!raw) notFound();
  const product = localizeProduct(raw, loc);
  const copy = changelogCopy[loc];
  const tNav = await getTranslations({ locale, namespace: 'Header' });

  const { entries, source } = await getProductReleases(id);
  const latest = entries.slice(0, FULL_BODY_LIMIT);
  const older = entries.slice(FULL_BODY_LIMIT);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: tNav('home'), url: `${SITE_URL}/${locale}` },
    { name: tNav('products'), url: `${SITE_URL}/${locale}/products` },
    { name: product.name, url: `${SITE_URL}/${locale}/products/${id}` },
    { name: copy.eyebrow, url: `${SITE_URL}/${locale}/products/${id}/changelog` },
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
          href={`/products/${id}`}
          className="mb-10 inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
        >
          <span aria-hidden>←</span> {copy.backToProduct}
        </Link>

        <header className="mb-12">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
            {copy.eyebrow}
          </p>
          <h1 className="mb-5 text-3xl font-bold leading-tight text-white md:text-4xl">
            {copy.title(product.name)}
          </h1>
          <p className="mb-3 max-w-2xl leading-relaxed text-gray-300">{copy.intro(entries.length)}</p>
          <p className="text-sm text-gray-500">
            {source === 'github' ? copy.sourceGithub : copy.sourceSnapshot}
          </p>
        </header>

        <section className="mb-14" aria-labelledby="changelog-latest">
          <h2 id="changelog-latest" className="mb-6 text-2xl font-bold text-white">
            {copy.latestLabel}
          </h2>
          <div className="space-y-5">
            {latest.map((entry) => (
              <ReleaseCard key={entry.tag} entry={entry} locale={loc} />
            ))}
          </div>
        </section>

        {older.length > 0 && (
          <section className="mb-14" aria-labelledby="changelog-older">
            <h2 id="changelog-older" className="mb-3 text-2xl font-bold text-white">
              {copy.olderLabel}
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-gray-500">{copy.olderIntro}</p>
            <ul className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03]">
              {older.map((entry) => (
                <li key={entry.tag} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-baseline sm:gap-4">
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 font-mono text-sm font-semibold text-violet-200 transition-colors hover:text-violet-100"
                  >
                    {entry.tag}
                  </a>
                  <span className="shrink-0 text-xs text-gray-500 sm:w-24">
                    {entry.published || copy.noDate}
                  </span>
                  <span className="text-sm leading-relaxed text-gray-400">
                    {releaseSummary(entry.body)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`${raw.github}/releases`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/25 hover:bg-white/10"
          >
            {copy.allReleases} <span aria-hidden>↗</span>
          </a>
          <Link
            href={`/products/${id}`}
            className="text-sm text-gray-400 transition-colors hover:text-white"
          >
            {copy.backToProduct}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/**
 * 单个版本的完整说明。
 *
 * 正文是第三方文本（GitHub Release），渲染前先过 `prepareReleaseBody` 降两级标题，
 * HTML 再经 `markdownToHtml` 的 rehype-sanitize 白名单过滤，所以可以安全地用
 * `dangerouslySetInnerHTML` 注入。
 */
function ReleaseCard({ entry, locale }: { entry: ReleaseEntry; locale: Locale }) {
  const copy = changelogCopy[locale];
  const html = markdownToHtml(prepareReleaseBody(entry.body));

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5">
      <header className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <a
          href={entry.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-lg font-semibold text-violet-200 transition-colors hover:text-violet-100"
        >
          {entry.tag}
        </a>
        <span className="text-sm text-gray-500">{entry.published || copy.noDate}</span>
        {entry.prerelease && (
          <span className="rounded-full border border-amber-300/30 bg-amber-400/10 px-2 py-0.5 text-[11px] text-amber-200">
            {copy.prerelease}
          </span>
        )}
      </header>
      <div
        className="prose prose-invert prose-violet max-w-none prose-headings:font-semibold prose-headings:text-white prose-p:text-gray-300 prose-li:text-gray-300 prose-strong:text-white prose-a:text-violet-200"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
