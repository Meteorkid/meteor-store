import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { blogPosts } from '@/data/blog';
import { blogScopeStyle, getSectionById } from '@/data/blog-sections';
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
      style={blogScopeStyle(post.section)}
    >
      <BlogReadingProgress />
      <Header />
      <main className="relative container mx-auto px-4 py-8 md:py-10">
        <article className="mx-auto max-w-2xl">
          <Link
            href={section ? `/blog/section/${section.slug}` : '/blog'}
            className="t-footnote group mb-8 inline-flex items-center gap-2 text-white/60 transition-colors duration-200 hover:text-white"
          >
            <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            回到{section?.label ?? '博客'}
          </Link>

          {/* 文章头：分区色作为唯一的彩色元素 */}
          <header className="relative mb-10">
            <div aria-hidden className="blog-glow" />
            <div className="t-footnote relative mb-6 flex flex-wrap items-center gap-x-3 gap-y-1">
              {section && (
                <span className="font-semibold" style={{ color: `rgb(${section.rgb})` }}>
                  {section.label}
                </span>
              )}
              <span aria-hidden className="text-white/15">·</span>
              <time className="tabular-nums text-white/60" dateTime={post.date}>
                {post.date.replace(/-/g, '.')}
              </time>
              <span aria-hidden className="text-white/15">·</span>
              <span className="text-white/60">{post.readingTime} 分钟</span>
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

          {related.length > 0 && (
            <section className="mt-20">
              <h2 className="t-eyebrow mb-1 text-white/60">继续读</h2>
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

          <div className="t-footnote mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.07] pt-8">
            <Link href="/blog" className="text-white/60 transition-colors duration-200 hover:text-white">
              ← 全部文章
            </Link>
            <Link href="/products" className="text-white/60 transition-colors duration-200 hover:text-white">
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
