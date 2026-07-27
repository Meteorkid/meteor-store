import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { blogPosts } from '@/data/blog';
import { getSectionById } from '@/data/blog-sections';
import { markdownToHtml } from '@/lib/markdown';

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
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <article className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="mb-10 inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
          >
            <span aria-hidden>←</span> 返回博客
          </Link>

          <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
            <Link
              href={`/blog/section/${section?.slug ?? ''}`}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-opacity hover:opacity-80 ${
                section?.accent ?? 'bg-white/[0.06] text-gray-400'
              }`}
            >
              {section?.label ?? post.section}
            </Link>
            <time className="text-gray-500" dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
            <span className="text-gray-600">{post.readingTime} 分钟阅读</span>
          </div>

          <h1 className="mb-6 text-3xl font-bold leading-tight md:text-4xl">{post.title}</h1>
          <p className="mb-10 text-lg leading-relaxed text-gray-400">{post.excerpt}</p>

          <div className="prose-invert prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-violet-300 prose-strong:text-white prose-code:rounded prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-emerald-300 prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-xl prose-pre:border prose-pre:border-white/10 prose-pre:bg-zinc-950 prose-table:text-sm prose-th:text-white prose-td:text-gray-300 prose-td:border-white/10 prose-th:border-white/10">
            <BlogContent content={post.content} />
          </div>

          <div className="mt-12 flex flex-wrap gap-2 border-t border-white/10 pt-8">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-white/[0.06] px-3 py-1 text-sm text-gray-400">
                {tag}
              </span>
            ))}
          </div>

          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
                {section?.label ?? '博客'}里的其他文章
              </h2>
              <div className="space-y-3">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/blog/${item.slug}`}
                    className="group block rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
                  >
                    <h3 className="mb-1 font-medium text-white transition-colors group-hover:text-violet-200">
                      {item.title}
                    </h3>
                    <p className="line-clamp-2 text-sm text-gray-500">{item.excerpt}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <p className="mb-4 text-gray-400">喜欢这篇文章？</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/products"
                className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
              >
                看看我们的产品
              </Link>
              <Link
                href="/blog"
                className="rounded-full border border-white/15 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                更多文章
              </Link>
            </div>
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
