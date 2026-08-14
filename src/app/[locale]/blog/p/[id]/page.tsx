import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogReadingProgress from '@/components/BlogReadingProgress';
import RelatedPosts from '@/components/RelatedPosts';
import { getRelatedPosts } from '@/lib/related-posts';
import { getFeedPosts } from '@/data/blog-feed';
import { getPostById } from '@/lib/posts';
import { getSession } from '@/lib/auth';
import { blogScopeStyle, getSectionById } from '@/data/blog-sections';
import type { Locale } from '@/i18n/routing';
import { tagHref } from '@/data/blog-tags';
import { markdownToHtml } from '@/lib/markdown';
import CommentSection from '@/components/CommentSection';
import PostStats from '@/components/PostStats';
import PostReportButton from '@/components/PostReportButton';
import { isAdminSession } from '@/lib/admin';
import { safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/constants';

interface UserPostPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: UserPostPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const post = await getPostById(id);
  const t = await getTranslations({ locale, namespace: 'BlogPostPage' });
  if (!post) return { title: t('notFound') };

  const session = await getSession();
  const isAuthor = !!session && session.userId === post.authorId;
  if (post.status !== 'published' && !isAuthor) return { title: t('notFound') };

  const section = getSectionById(post.sectionId);
  return {
    title: `${post.title} | ${t('blogSuffix')}`,
    description: post.excerpt,
    // 作者预览非 published 文章时不索引
    robots: post.status === 'published' ? undefined : { index: false, follow: false },
    alternates: section
      ? { types: { 'application/rss+xml': `/blog/section/${section.slug}/feed.xml` } }
      : undefined,
  };
}

export default async function UserPostPage({ params }: UserPostPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'BlogPostPage' });
  const post = await getPostById(id);
  const session = await getSession();
  const isAuthor = !!session && !!post && session.userId === post.authorId;
  // 未通过审核的文章不公开可见；作者本人可预览自己的草稿/待审/驳回稿
  if (!post || (post.status !== 'published' && !isAuthor)) notFound();

  const isPreview = post.status !== 'published';
  const section = getSectionById(post.sectionId);
  const isAdmin = !!session && isAdminSession(session);
  // 管理员或作者本人可编辑；管理员走 admin=1 路径有越权编辑能力
  const canEdit = isAdmin || isAuthor;

  // 相关阅读：已发布文章才计算
  let relatedFeedPosts: Awaited<ReturnType<typeof getRelatedPosts>> = [];
  if (post.status === 'published') {
    const feed = await getFeedPosts(locale as Locale);
    relatedFeedPosts = getRelatedPosts(
      { href: `/blog/p/${post.id}`, sections: [post.sectionId], tags: post.tags },
      feed,
      3,
    );
  }
  const editHref = `/blog/submit?id=${post.id}${isAdmin ? '&admin=1' : ''}`;

  return (
    <div className="blog-scope min-h-screen bg-black text-white" style={blogScopeStyle(post.sectionId)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            datePublished: post.publishedAt,
            author: { '@type': 'Person', name: post.authorName || 'Anonymous' },
            articleSection: section?.label[locale as Locale],
            url: `${SITE_URL}/${locale}/blog/p/${post.id}`,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${SITE_URL}/${locale}/blog/p/${post.id}`,
            },
          }),
        }}
      />
      <BlogReadingProgress />
      <Header />
      {isPreview && (
        <div className="border-b border-amber-500/20 bg-amber-500/[0.06] px-4 py-3 text-center">
          <p className="t-footnote text-amber-200/90">
            {post.status === 'pending' && t('previewPending')}
            {post.status === 'draft' && t('previewDraft')}
            {post.status === 'rejected' && t('previewRejected')}
          </p>
          {post.status === 'rejected' && post.reviewNote && (
            <p className="t-footnote mt-1 text-amber-200/70">
              {t('rejectedReason', { reason: post.reviewNote })}
            </p>
          )}
          <Link
            href="/blog/my-posts"
            className="t-footnote mt-1 inline-block text-amber-200/70 underline decoration-amber-200/30 underline-offset-4 transition-colors hover:text-amber-100"
          >
            {t('backToMyPosts')}
          </Link>
        </div>
      )}
      <main className="relative container mx-auto px-4 py-8 md:py-10">
        <article className="mx-auto max-w-2xl">
          <Link
            href={section ? `/blog/section/${section.slug}` : '/blog'}
            className="t-footnote group mb-8 inline-flex items-center gap-2 text-white/60 transition-colors duration-200 hover:text-white"
          >
            <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            {t('backTo', { section: section?.label[locale as Locale] ?? t('blog') })}
          </Link>

          <header className="relative mb-10">
            <div aria-hidden className="blog-glow" />
            <div className="t-footnote relative mb-6 flex flex-wrap items-center gap-x-3 gap-y-1">
              {section && (
                <span className="font-semibold" style={{ color: `rgb(${section.rgb})` }}>
                  {section.label[locale as Locale]}
                </span>
              )}
              <span aria-hidden className="text-white/20">·</span>
              <span className="text-white/70">{post.authorName || t('anonymous')}</span>
              {post.publishedAt && (
                <>
                  <span aria-hidden className="text-white/20">·</span>
                  <time className="tabular-nums text-white/60" dateTime={post.publishedAt}>
                    {post.publishedAt.slice(0, 10).replace(/-/g, '.')}
                  </time>
                </>
              )}
              {post.eventDate && post.eventDate !== post.publishedAt?.slice(0, 10) && (
                <>
                  <span aria-hidden className="text-white/20">·</span>
                  <time className="tabular-nums text-white/60" dateTime={post.eventDate}>
                    {post.eventDate.replace(/-/g, '.')}
                  </time>
                </>
              )}
              <span aria-hidden className="text-white/20">·</span>
              <span className="text-white/60">{t('readerSubmission')}</span>
              {canEdit && (
                <>
                  <span aria-hidden className="text-white/20">·</span>
                  <Link
                    href={editHref}
                    className="text-white/50 underline decoration-white/20 underline-offset-4 transition-colors duration-200 hover:text-white hover:decoration-white"
                  >
                    {t('editPost')}
                  </Link>
                </>
              )}
              {/* 已发布文章才显示举报入口:预览模式（未发布）不需要举报 */}
              {!isPreview && (
                <>
                  <span aria-hidden className="text-white/20">·</span>
                  <PostReportButton postId={post.id} />
                </>
              )}
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
            className="bg-black/30 backdrop-blur-sm rounded-2xl blog-prose prose-invert prose max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white prose-h2:mt-16 prose-h2:mb-5 prose-h2:text-[1.625rem] prose-h3:mt-10 prose-h3:text-[1.125rem] prose-h3:text-white/75 prose-p:text-[1.0625rem] prose-p:leading-[1.8] prose-p:text-white/70 prose-li:text-[1.0625rem] prose-li:text-white/70 prose-a:text-white prose-a:underline prose-a:decoration-white/25 prose-a:underline-offset-4 prose-blockquote:border-l-2 prose-blockquote:border-white/15 prose-blockquote:not-italic prose-blockquote:text-white/50 prose-strong:text-white prose-code:rounded prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-emerald-300 prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-2xl prose-pre:border prose-pre:border-white/10 prose-pre:bg-white/[0.03] prose-hr:border-white/10 prose-img:rounded-2xl"
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

          {/* 作者落款：头像 + 名字 + 个性签名（bio） */}
          <div className="mt-10 flex items-start gap-4 border-t border-white/[0.07] pt-8">
            {post.authorAvatarUrl ? (
              <Image
                src={post.authorAvatarUrl}
                alt={post.authorName || t('anonymous')}
                width={48}
                height={48}
                unoptimized
                className="h-12 w-12 shrink-0 rounded-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-lg font-semibold text-white/70">
                {(post.authorName || '?')[0]?.toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-[0.9375rem] font-semibold text-white/90">
                {post.authorName || t('anonymous')}
              </p>
              {post.authorBio && (
                <p className="t-footnote mt-1 text-white/60">{post.authorBio}</p>
              )}
            </div>
          </div>

          {/* 相关阅读：仅已发布文章展示 */}
          {!isPreview && (
            <RelatedPosts
              posts={relatedFeedPosts}
              accentRgb={section?.rgb}
            />
          )}

          {/* 预览模式（非 published）不显示统计和评论：文章还没公开 */}
          {!isPreview && (
            <>
              <PostStats targetId={post.id} />
              <CommentSection targetId={post.id} />
            </>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}
