import type { Metadata } from 'next';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { eq, desc } from 'drizzle-orm';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AccountForms from '@/components/AccountForms';
import { db } from '@/lib/db';
import { users, licenseKeys, posts } from '@/lib/db/schema';
import { getSession } from '@/lib/auth';
import { findPurchasable } from '@/lib/products';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AccountPage' });
  return {
    title: t('metaTitle'),
    robots: { index: false, follow: false },
  };
}

export const dynamic = 'force-dynamic';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'AccountPage' });

  const statusLabel: Record<string, { text: string; cls: string }> = {
    active: { text: t('statusActive'), cls: 'bg-emerald-500/15 text-emerald-400' },
    revoked: { text: t('statusRevoked'), cls: 'bg-red-500/15 text-red-400' },
    draft: { text: t('statusDraft'), cls: 'bg-white/10 text-white/60' },
    pending: { text: t('statusPending'), cls: 'bg-amber-500/15 text-amber-400' },
    published: { text: t('statusPublished'), cls: 'bg-emerald-500/15 text-emerald-400' },
    rejected: { text: t('statusRejected'), cls: 'bg-red-500/15 text-red-400' },
  };

  const session = await getSession();
  if (!session) redirect('/login');

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      avatarUrl: users.avatarUrl,
      bio: users.bio,
      emailVerified: users.emailVerified,
      isStudent: users.isStudent,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);
  if (!user) redirect('/login');

  const [keys, userPosts] = await Promise.all([
    user.emailVerified
      ? db
          .select()
          .from(licenseKeys)
          .where(eq(licenseKeys.email, user.email))
          .orderBy(desc(licenseKeys.createdAt))
      : Promise.resolve([]),
    db
      .select({
        id: posts.id,
        title: posts.title,
        status: posts.status,
        createdAt: posts.createdAt,
        publishedAt: posts.publishedAt,
        reviewNote: posts.reviewNote,
      })
      .from(posts)
      .where(eq(posts.authorId, user.id))
      .orderBy(desc(posts.createdAt)),
  ]);

  const displayName = user.name || user.email.split('@')[0];
  const initial = displayName[0]?.toUpperCase() ?? '?';

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-2xl">
          <h1 className="sr-only">{t('srTitle')}</h1>

          {/* 身份卡 */}
          <section className="glass-card mb-10 rounded-3xl p-7 md:p-9">
            <div className="flex flex-wrap items-center gap-5">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt=""
                  width={64}
                  height={64}
                  unoptimized
                  className="h-16 w-16 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span
                  aria-hidden
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-violet-600 text-2xl font-bold text-white"
                >
                  {initial}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="t-title-2 t-on-glass truncate">{displayName}</p>
                {user.bio && (
                  <p className="t-footnote mt-1 text-white/70">{user.bio}</p>
                )}
                <p className="t-footnote mt-1 truncate text-white/50">{user.email}</p>
              </div>
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/[0.08] pt-6 sm:grid-cols-4">
              <div>
                <dt className="t-eyebrow text-white/45">{t('joinTime')}</dt>
                <dd className="t-footnote mt-1.5 tabular-nums text-white/80">
                  {formatDate(user.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="t-eyebrow text-white/45">{t('emailStatus')}</dt>
                <dd className="t-footnote mt-1.5 text-white/80">
                  {user.emailVerified ? t('verified') : t('unverified')}
                </dd>
              </div>
              <div>
                <dt className="t-eyebrow text-white/45">{t('studentStatus')}</dt>
                <dd className="t-footnote mt-1.5 text-white/80">
                  {user.isStudent ? t('verifiedStudent') : t('unverifiedStudent')}
                </dd>
              </div>
              <div>
                <dt className="t-eyebrow text-white/45">{t('postsCount')}</dt>
                <dd className="t-footnote mt-1.5 tabular-nums text-white/80">
                  {t('postsUnit', { count: userPosts.length })}
                </dd>
              </div>
            </dl>

            {!user.isStudent && (
              <p className="t-footnote mt-6 text-white/60">
                {t('studentPrompt')}
                <Link
                  href="/student"
                  className="text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
                >
                  {t('verifyNow')}
                </Link>
                {t('verifySuffix')}
              </p>
            )}
          </section>

          {user.emailVerified && (
            <section className="mb-10 rounded-3xl border border-white/[0.07] bg-white/[0.02] p-7 md:p-9">
              <h2 className="t-title-3 mb-1.5 text-white/90">{t('myOrders')}</h2>
              <p className="t-footnote mb-5 text-white/60">{t('myOrdersDesc')}</p>
              <Link
                href="/orders"
                className="inline-flex rounded-xl bg-white px-5 py-2.5 text-[0.9375rem] font-semibold text-black transition-opacity hover:opacity-90"
              >
                {t('viewOrders')}
              </Link>
            </section>
          )}

          {/* 授权码 */}
          {keys.length > 0 && (
            <section className="mb-10 rounded-3xl border border-white/[0.07] bg-white/[0.02] p-7 md:p-9">
              <h2 className="t-title-3 mb-1.5 text-white/90">{t('myLicenseKeys')}</h2>
              <p className="t-footnote mb-5 text-white/60">
                {t('licenseKeysDesc')}
              </p>
              <div className="space-y-3">
                {keys.map((k) => {
                  // 用 findPurchasable 而不是 products：Pass 的授权码也会出现在这里，
                  // 只查 products 会把它显示成原始 id「meteor-pass」
                  const product = findPurchasable(k.productId);
                  const st = statusLabel[k.status] ?? statusLabel.active;
                  return (
                    <div
                      key={k.id}
                      className="flex flex-wrap items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-[0.9375rem] font-medium text-white/90 truncate">
                          {product?.name[locale as Locale] ?? k.productId}
                          <span className="ml-2 text-white/50 font-normal">{k.planName}</span>
                        </p>
                        <p className="t-footnote mt-0.5 font-mono text-white/40 truncate select-all">
                          {k.key}
                        </p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${st.cls}`}>
                        {st.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 投稿记录 */}
          {userPosts.length > 0 && (
            <section className="mb-10 rounded-3xl border border-white/[0.07] bg-white/[0.02] p-7 md:p-9">
              <h2 className="t-title-3 mb-1.5 text-white/90">{t('myPosts')}</h2>
              <p className="t-footnote mb-5 text-white/60">
                {t('myPostsDesc')}
              </p>
              <div className="space-y-3">
                {userPosts.map((p) => {
                  const st = statusLabel[p.status] ?? statusLabel.draft;
                  const date = p.publishedAt ?? p.createdAt;
                  return (
                    <a
                      key={p.id}
                      href={p.status === 'published' ? `/blog/p/${p.id}` : undefined}
                      className={`flex flex-wrap items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 ${
                        p.status === 'published'
                          ? 'transition-colors hover:border-white/12 hover:bg-white/[0.04]'
                          : ''
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-[0.9375rem] font-medium text-white/90 truncate">
                          {p.title}
                        </p>
                        <p className="t-footnote mt-0.5 text-white/45">
                          {formatDate(date)}
                          {p.status === 'rejected' && p.reviewNote && (
                            <span className="ml-2 text-red-400/80">
                              {p.reviewNote}
                            </span>
                          )}
                        </p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${st.cls}`}>
                        {st.text}
                      </span>
                    </a>
                  );
                })}
              </div>
            </section>
          )}

          {/* 个人资料表单 + 密码修改 */}
          <AccountForms
            initialName={user.name ?? ''}
            initialBio={user.bio ?? ''}
            initialAvatar={user.avatarUrl ?? null}
            email={user.email}
          />

          <section className="mt-10 rounded-3xl border border-white/[0.07] bg-white/[0.02] p-7 md:p-9">
            <h2 className="t-title-3 mb-1.5 text-white/90">{t('dataRights')}</h2>
            <p className="t-footnote mb-5 text-white/60">{t('dataRightsDesc')}</p>
            <a
              href="/api/auth/export"
              download
              className="inline-flex rounded-xl border border-white/15 px-5 py-2.5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-white/[0.06]"
            >
              {t('exportData')}
            </a>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
