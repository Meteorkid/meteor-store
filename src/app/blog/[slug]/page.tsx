import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { blogPosts } from '@/data/blog';
import { getSectionById } from '@/data/blog-sections';
import { markdownToHtml } from '@/lib/markdown';
import BlogReadingProgress from '@/components/BlogReadingProgress';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  return post
    ? { title: `${post.title} | Meteor Store 博客`, description: post.excerpt }
    : { title: '文章未找到 - Meteor Store' };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const section = getSectionById(post.section);

  // 同分区的其他文章，最新 3 篇
  const related = blogPosts
    .filter((p) => p.section === post.section && p.slug !== post.slug)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  return (
    <div
      className="blog-scope min-h-screen bg-black text-white"
      style={section ? ({ '--accent': section.rgb } as React.CSSProperties) : undefined}
    >
      <BlogReadingProgress />
      <Header />
      <main className="relative container mx-auto px-4 py-12 md:py-16">
        <article className="mx-auto max-w-2xl">
          <Link
            href={section ? `/blog/section/${section.slug}` : '/blog'}
            className="group mb-14 inline-flex items-center gap-2 text-sm text-white/35 transition-colors duration-200 hover:text-white"
          >
            <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            回到{section?.label ?? '博客'}
          </Link>

          {/* 文章头：分区色作为唯一的彩色元素 */}
          <header className="relative mb-12">
            <div aria-hidden className="blog-glow" />
            <div className="relative mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              {section && (
                <span className="font-medium" style={{ color: `rgb(${section.rgb})` }}>
                  {section.label}
                </span>
              )}
              <span aria-hidden className="text-white/15">·</span>
              <time className="tabular-nums text-white/35" dateTime={post.date}>
                {post.date.replace(/-/g, '.')}
              </time>
              <span aria-hidden className="text-white/15">·</span>
              <span className="text-white/25">{post.readingTime} min</span>
            </div>

            <h1 className="relative mb-8 text-3xl font-bold leading-[1.2] tracking-tight md:text-5xl">
              {post.title}
            </h1>

            <p
              className="relative border-l-2 pl-5 text-lg leading-relaxed text-white/50"
              style={section ? { borderColor: `rgb(${section.rgb} / 0.5)` } : undefined}
            >
              {post.excerpt}
            </p>
          </header>

          <div className="prose-invert prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white prose-h2:mt-14 prose-h2:text-2xl prose-h3:text-xl prose-p:leading-[1.85] prose-p:text-white/70 prose-a:text-white prose-a:underline prose-a:decoration-white/25 prose-a:underline-offset-4 hover:prose-a:decoration-white prose-blockquote:border-l-2 prose-blockquote:border-white/15 prose-blockquote:not-italic prose-blockquote:text-white/45 prose-strong:text-white prose-code:rounded prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-emerald-300 prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-xl prose-pre:border prose-pre:border-white/10 prose-pre:bg-zinc-950 prose-hr:border-white/10 prose-table:text-sm prose-th:text-white prose-td:text-white/70 prose-td:border-white/10 prose-th:border-white/10 prose-img:rounded-xl">
            <BlogContent content={post.content} />
          </div>

          <div className="mt-16 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/[0.08] pt-6 text-xs text-white/30">
            {post.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>

          {related.length > 0 && (
            <section className="mt-20">
              <h2 className="mb-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/30">
                继续读
              </h2>
              <div className="mt-5">
                {related.map((item, i) => (
                  <Link key={item.slug} href={`/blog/${item.slug}`} className="blog-row group">
                    <div className="blog-row__inner flex items-baseline gap-5 py-5">
                      <span className="blog-row__index shrink-0 text-xs text-white/20">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="mb-1 font-medium leading-snug text-white/85 transition-colors duration-200 group-hover:text-white">
                          {item.title}
                        </h3>
                        <p className="line-clamp-1 text-sm text-white/30">{item.excerpt}</p>
                      </div>
                      <span aria-hidden className="blog-row__arrow hidden shrink-0 text-white/50 sm:block">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-8 text-sm">
            <Link href="/blog" className="text-white/40 transition-colors duration-200 hover:text-white">
              ← 全部文章
            </Link>
            <Link href="/products" className="text-white/40 transition-colors duration-200 hover:text-white">
              看看这些工具 →
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
