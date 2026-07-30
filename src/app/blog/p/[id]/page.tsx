import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogReadingProgress from '@/components/BlogReadingProgress';
import { getPostById } from '@/lib/posts';
import { blogScopeStyle, getSectionById } from '@/data/blog-sections';
import { tagHref } from '@/data/blog-tags';
import { markdownToHtml } from '@/lib/markdown';

interface UserPostPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: UserPostPageProps): Promise<Metadata> {
  const post = await getPostById((await params).id);
  return post && post.status === 'published'
    ? { title: `${post.title} | Meteor Store 博客`, description: post.excerpt }
    : { title: '文章未找到 - Meteor Store' };
}

export default async function UserPostPage({ params }: UserPostPageProps) {
  const post = await getPostById((await params).id);
  // 未通过审核的文章不公开可见
  if (!post || post.status !== 'published') notFound();

  const section = getSectionById(post.sectionId);

  return (
    <div className="blog-scope min-h-screen bg-black text-white" style={blogScopeStyle(post.sectionId)}>
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

          <header className="relative mb-10">
            <div aria-hidden className="blog-glow" />
            <div className="t-footnote relative mb-6 flex flex-wrap items-center gap-x-3 gap-y-1">
              {section && (
                <span className="font-semibold" style={{ color: `rgb(${section.rgb})` }}>
                  {section.label}
                </span>
              )}
              <span aria-hidden className="text-white/20">·</span>
              <span className="text-white/70">{post.authorName || '匿名'}</span>
              {post.publishedAt && (
                <>
                  <span aria-hidden className="text-white/20">·</span>
                  <time className="tabular-nums text-white/60" dateTime={post.publishedAt}>
                    {post.publishedAt.slice(0, 10).replace(/-/g, '.')}
                  </time>
                </>
              )}
              <span aria-hidden className="text-white/20">·</span>
              <span className="text-white/60">读者投稿</span>
            </div>

            <h1 className="t-title-1 relative mb-8">{post.title}</h1>

            <p
              className="t-body relative border-l-2 pl-5 text-white/55"
              style={section ? { borderColor: `rgb(${section.rgb} / 0.5)` } : undefined}
            >
              {post.excerpt}
            </p>
          </header>

          <div
            className="blog-prose prose-invert prose max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white prose-h2:mt-16 prose-h2:mb-5 prose-h2:text-[1.625rem] prose-h3:mt-10 prose-h3:text-[1.125rem] prose-h3:text-white/75 prose-p:text-[1.0625rem] prose-p:leading-[1.8] prose-p:text-white/70 prose-li:text-[1.0625rem] prose-li:text-white/70 prose-a:text-white prose-a:underline prose-a:decoration-white/25 prose-a:underline-offset-4 prose-blockquote:border-l-2 prose-blockquote:border-white/15 prose-blockquote:not-italic prose-blockquote:text-white/50 prose-strong:text-white prose-code:rounded prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-emerald-300 prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-2xl prose-pre:border prose-pre:border-white/10 prose-pre:bg-white/[0.03] prose-hr:border-white/10 prose-img:rounded-2xl"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
          />

          {post.tags.length > 0 && (
            <div className="t-footnote mt-16 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/[0.07] pt-6">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={tagHref(tag)}
                  className="text-white/60 transition-colors duration-200 hover:text-white"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}
