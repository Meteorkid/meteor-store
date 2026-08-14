import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { eq, and, desc, sql } from 'drizzle-orm';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { db } from '@/lib/db';
import { users, posts, postFavorites } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso
    : `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const [u] = await db.select({ name: users.name, bio: users.bio })
    .from(users).where(eq(users.id, id)).limit(1);
  if (!u) return { title: '用户不存在' };
  return {
    title: `${u.name || '用户'} 的个人主页`,
    description: u.bio ?? undefined,
    robots: { index: false, follow: false },
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      avatarUrl: users.avatarUrl,
      bio: users.bio,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  if (!user) notFound();

  const [publishedPosts, favoritesResult] = await Promise.all([
    db.select({
      id: posts.id,
      title: posts.title,
      excerpt: posts.excerpt,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
    })
      .from(posts)
      .where(and(eq(posts.authorId, user.id), eq(posts.status, 'published')))
      .orderBy(desc(posts.publishedAt)),
    db.select({ count: sql<number>`count(*)::int` })
      .from(postFavorites)
      .where(eq(postFavorites.userId, user.id)),
  ]);

  const displayName = user.name || '用户';
  const initial = displayName[0]?.toUpperCase() ?? '?';
  const favoritesCount = favoritesResult[0]?.count ?? 0;

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-2xl">
          <section className="glass-card mb-10 rounded-3xl p-7 md:p-9 text-center">
            {user.avatarUrl ? (
              <Image src={user.avatarUrl} alt="" width={80} height={80} unoptimized
                className="mx-auto h-20 w-20 rounded-full object-cover" />
            ) : (
              <span aria-hidden className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-violet-600 text-3xl font-bold text-white">
                {initial}
              </span>
            )}
            <p className="t-title-2 mt-4">{displayName}</p>
            {user.bio && <p className="t-footnote mt-2 text-white/60 max-w-md mx-auto">{user.bio}</p>}

            <dl className="mt-6 inline-flex flex-wrap justify-center gap-x-8 gap-y-3">
              <div className="text-center">
                <dt className="text-[10px] text-white/35 uppercase tracking-widest">加入于</dt>
                <dd className="t-footnote mt-1 tabular-nums text-white/70">{formatDate(user.createdAt)}</dd>
              </div>
              <div className="text-center">
                <dt className="text-[10px] text-white/35 uppercase tracking-widest">文章</dt>
                <dd className="t-footnote mt-1 tabular-nums text-white/70">{publishedPosts.length}</dd>
              </div>
              <div className="text-center">
                <dt className="text-[10px] text-white/35 uppercase tracking-widest">收藏</dt>
                <dd className="t-footnote mt-1 tabular-nums text-white/70">{favoritesCount}</dd>
              </div>
            </dl>
          </section>

          {publishedPosts.length > 0 ? (
            <section>
              <h2 className="t-title-3 mb-5 text-white/80">发布的文章</h2>
              <div className="space-y-3">
                {publishedPosts.map((p) => (
                  <Link key={p.id} href={`/blog/p/${p.id}`}
                    className="block rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition-colors hover:border-white/15 hover:bg-white/[0.04]">
                    <p className="font-medium text-white/85">{p.title}</p>
                    {p.excerpt && (
                      <p className="t-footnote mt-1 text-white/45 line-clamp-2">{p.excerpt}</p>
                    )}
                    <p className="t-footnote mt-3 text-white/30">
                      {formatDate(p.publishedAt ?? p.createdAt)}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ) : (
            <div className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-10 text-center">
              <p className="text-white/40">还没有发布过文章</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
