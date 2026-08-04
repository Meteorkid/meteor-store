import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getBlogPosts } from '@/data/blog';
import { blogScopeStyle, getSectionById } from '@/data/blog-sections';
import { markdownToHtml } from '@/lib/markdown';
import BlogReadingProgress from '@/components/BlogReadingProgress';
import CommentSection from '@/components/CommentSection';
import PostStats from '@/components/PostStats';
import PostSignature from '@/components/PostSignature';
import AdminGithubEditLink from '@/components/AdminGithubEditLink';
import { routing, type Locale } from '@/i18n/routing';
import { safeJsonLd } from '@/lib/seo';

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  // 为每个 locale × slug 生成静态页面
  return routing.locales.flatMap((locale) =>
    getBlogPosts(locale).map((post) => ({ locale, slug: post.slug }))
  );
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const posts = getBlogPosts(locale as Locale);
  const post = posts.find((p) => p.slug === slug);
  const t = await getTranslations({ locale, namespace: 'BlogPostPage' });
  if (!post) return { title: t('notFound') };
  const section = getSectionById(post.section);
  return {
    title: `${post.title} | ${t('blogSuffix')}`,
    description: post.excerpt,
    alternates: section
      ? { types: { 'application/rss+xml': `/blog/section/${section.slug}/feed.xml` } }
      : undefined,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'BlogPostPage' });

  const posts = getBlogPosts(locale as Locale);
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const section = getSectionById(post.section);

  const editHref = `https://github.com/Meteorkid/meteor-store/edit/main/content/blog/${locale}/${
    post.slug
  }.md`;

  // 同分区的其他文章，最新 3 篇
  const related = posts
    .filter((p) => p.section === post.section && p.slug !== post.slug)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  return (
    <div
      className="blog-scope min-h-screen bg-black text-white"
      style={blogScopeStyle(post.section)}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            author: { '@type': 'Person', name: 'meteor' },
            articleSection: section?.label[locale as Locale],
            keywords: post.tags.join(', '),
            url: `https://imagentx.top/${locale}/blog/${post.slug}`,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://imagentx.top/${locale}/blog/${post.slug}`,
            },
          }),
        }}
      />
      <BlogReadingProgress />
      <Header />
      <main className="relative container mx-auto px-4 py-8 md:py-10">
        <article className="mx-auto max-w-2xl">
          <Link
            href={section ? `/blog/section/${section.slug}` : '/blog'}
            className="t-footnote group mb-8 inline-flex items-center gap-2 text-white/60 transition-colors duration-200 hover:text-white"
          >
            <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            {t('backTo', { section: section?.label[locale as Locale] ?? t('blog') })}
          </Link>

          {/* 文章头：分区色作为唯一的彩色元素 */}
          <header className="relative mb-10">
            <div aria-hidden className="blog-glow" />
            <div className="t-footnote relative mb-6 flex flex-wrap items-center gap-x-3 gap-y-1">
              {section && (
                <span className="font-semibold" style={{ color: `rgb(${section.rgb})` }}>
                  {section.label[locale as Locale]}
                </span>
              )}
              <span aria-hidden className="text-white/20">·</span>
              <span className="text-white/70">meteor</span>
              <span aria-hidden className="text-white/20">·</span>
              <time className="tabular-nums text-white/60" dateTime={post.date}>
                {post.date.replace(/-/g, '.')}
              </time>
              <span aria-hidden className="text-white/20">·</span>
              <span className="text-white/60">{t('minutes', { count: post.readingTime })}</span>
              <span aria-hidden className="text-white/20">·</span>
              <span className="text-white/60">{t('siteOwner')}</span>
              <AdminGithubEditLink href={editHref} label={t('editOnGithub')} />
            </div>

            <h1 className="t-title-1 relative mb-8">{post.title}</h1>

            <p
              className="t-body relative border-l-2 pl-5 text-white/55"
              style={section ? { borderColor: `rgb(${section.rgb} / 0.5)` } : undefined}
            >
              {post.excerpt}
            </p>
          </header>

          <div className="blog-prose prose-invert prose max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white prose-h2:mt-16 prose-h2:mb-5 prose-h2:text-[1.625rem] prose-h2:leading-tight prose-h3:mt-10 prose-h3:mb-3 prose-h3:text-[1.125rem] prose-h3:font-semibold prose-h3:text-white/75 prose-p:text-[1.0625rem] prose-p:leading-[1.8] prose-p:text-white/70 prose-li:text-[1.0625rem] prose-li:leading-[1.8] prose-li:text-white/70 prose-a:text-white prose-a:underline prose-a:decoration-white/25 prose-a:underline-offset-4 hover:prose-a:decoration-white prose-blockquote:border-l-2 prose-blockquote:border-white/15 prose-blockquote:not-italic prose-blockquote:text-white/50 prose-strong:text-white prose-strong:font-semibold prose-code:rounded prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.9375rem] prose-code:text-emerald-300 prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-2xl prose-pre:border prose-pre:border-white/10 prose-pre:bg-white/[0.03] prose-hr:border-white/10 prose-table:text-[0.9375rem] prose-th:text-white prose-td:text-white/70 prose-td:border-white/10 prose-th:border-white/10 prose-img:rounded-2xl">
            <BlogContent content={post.content} />
          </div>

          <div className="t-footnote mt-16 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/[0.07] pt-6 text-white/60">
            {post.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>

          <PostSignature />

          <PostStats targetId={post.slug} />

          {related.length > 0 && (
            <section className="mt-20">
              <h2 className="t-eyebrow mb-1 text-white/60">{t('continueReading')}</h2>
              <div className="mt-5">
                {related.map((item, i) => (
                  <Link key={item.slug} href={`/blog/${item.slug}`} className="blog-row group">
                    <div className="blog-row__inner flex items-baseline gap-5 py-5">
                      <span className="blog-row__index t-footnote shrink-0 text-white/60">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="t-title-4 mb-1 text-white/90 transition-colors duration-200 group-hover:text-white">
                          {item.title}
                        </h3>
                        <p className="t-footnote line-clamp-1 text-white/60">{item.excerpt}</p>
                      </div>
                      <span aria-hidden className="blog-row__arrow hidden shrink-0 text-white/50 sm:block">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <CommentSection targetId={post.slug} />

          <div className="t-footnote mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.07] pt-8">
            <Link href="/blog" className="text-white/60 transition-colors duration-200 hover:text-white">
              ← {t('allArticles')}
            </Link>
            <Link href="/products" className="text-white/60 transition-colors duration-200 hover:text-white">
              {t('checkTools')} →
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

function BlogContent({ content }: { content: string }) {
  const html = markdownToHtml(content);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
