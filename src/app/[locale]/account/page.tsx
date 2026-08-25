import type { Metadata } from 'next';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { eq, desc, sql } from 'drizzle-orm';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AccountForms from '@/components/AccountForms';
import BlogApiTokenManager from '@/components/BlogApiTokenManager';
import GlassPreference from '@/components/GlassPreference';
import WechatAccountBinding from '@/components/WechatAccountBinding';
import { db } from '@/lib/db';
import { users, licenseKeys, posts, orders, postFavorites } from '@/lib/db/schema';
import { isAdminSession } from '@/lib/admin';
import { getSession } from '@/lib/auth';
import { findPurchasable } from '@/lib/products';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AccountPage' });
  return { title: t('metaTitle'), robots: { index: false, follow: false } };
}

export const dynamic = 'force-dynamic';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso
    : `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function profileCompleteness(user: { name: string | null; bio: string | null; avatarUrl: string | null; emailVerified: boolean }) {
  const missing: string[] = [];
  if (!user.name) missing.push('昵称');
  if (!user.bio) missing.push('个性签名');
  if (!user.avatarUrl) missing.push('头像');
  if (!user.emailVerified) missing.push('邮箱验证');
  const total = 4;
  const done = total - missing.length;
  return { pct: Math.round((done / total) * 100), missing };
}

export default async function AccountPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ wechat?: string }>;
}) {
  const { locale } = await params;
  const { wechat } = await searchParams;
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
    .select({ id: users.id, email: users.email, name: users.name, avatarUrl: users.avatarUrl,
      bio: users.bio, emailVerified: users.emailVerified, isStudent: users.isStudent, createdAt: users.createdAt, wechatOpenid: users.wechatOpenid })
    .from(users).where(eq(users.id, session.userId)).limit(1);
  if (!user) redirect('/login');

  const [keys, userPosts, favRes, ordRes] = await Promise.all([
    user.emailVerified ? db.select().from(licenseKeys).where(eq(licenseKeys.email, user.email)).orderBy(desc(licenseKeys.createdAt)) : Promise.resolve([]),
    db.select({ id: posts.id, title: posts.title, status: posts.status, createdAt: posts.createdAt, publishedAt: posts.publishedAt, reviewNote: posts.reviewNote })
      .from(posts).where(eq(posts.authorId, user.id)).orderBy(desc(posts.createdAt)),
    db.select({ count: sql<number>`count(*)::int` }).from(postFavorites).where(eq(postFavorites.userId, user.id)),
    db.select({ count: sql<number>`count(*)::int` }).from(orders).where(eq(orders.email, user.email)),
  ]);

  const favCount = favRes[0]?.count ?? 0;
  const ordCount = ordRes[0]?.count ?? 0;
  const comp = profileCompleteness(user);
  const displayName = user.name || user.email.split('@')[0];
  const initial = displayName[0]?.toUpperCase() ?? '?';

  const isAdmin = isAdminSession(session);

  const quickLinks = [
    { label: t('quickApps'), desc: t('quickAppsDesc'), href: '/apps', badge: null,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/> },
    { label: t('quickPosts'), desc: t('quickPostsDesc'), href: '/blog/my-posts', badge: userPosts.length,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/> },
    { label: t('quickFavorites'), desc: t('quickFavoritesDesc'), href: '/blog/favorites', badge: favCount,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/> },
    { label: t('quickOrders'), desc: t('quickOrdersDesc'), href: '/orders', badge: ordCount,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/> },
    { label: t('quickRedeem'), desc: t('quickRedeemDesc'), href: '/redeem', badge: null,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/> },
    /*
     * 管理入口只给管理员看，且只放一条通往总入口的链接。
     *
     * 不在这里罗列各个后台页面：后台已经从 2 个长到 12 个，而用户菜单里那两条
     * 深链接（待审核、邀请码）就是当年只有两个页面时加的，此后再没跟上——
     * 入口一旦分散成清单，就必然与实际页面漂移。总入口页自带完整导航，
     * 新增后台页不需要再回来改这里。
     */
    ...(isAdmin ? [{
      label: t('quickAdmin'), desc: t('quickAdminDesc'), href: '/admin', badge: null,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>,
    }] : []),
  ];

  // 活动时间线：投稿 + 订单
  const orderRows = user.emailVerified
    ? await db.select({ createdAt: orders.createdAt, productId: orders.productId, planName: orders.planName, id: orders.id })
        .from(orders).where(eq(orders.email, user.email)).orderBy(desc(orders.createdAt)).limit(5)
    : [];
  const timeline: Array<{ type: 'post' | 'order'; date: string; text: string; href?: string }> = [];
  for (const p of userPosts.slice(0, 5)) {
    timeline.push({ type: 'post', date: p.createdAt, text: `${t('timelinePost')}「${p.title}」`, href: p.status === 'published' ? `/blog/p/${p.id}` : undefined });
  }
  for (const o of orderRows) {
    const product = findPurchasable(o.productId);
    timeline.push({ type: 'order', date: o.createdAt, text: `${t('timelineOrder')} ${product?.name[locale as Locale] ?? o.productId} · ${o.planName}`, href: `/orders/${o.id}` });
  }
  timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-10 md:py-14">
        {wechat === 'linked' && (
          <p className="mb-6 rounded-xl bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-400" role="status">
            {t('wechatLinkedSuccess')}
          </p>
        )}

        <div className="mx-auto max-w-2xl">
          <h1 className="sr-only">{t('srTitle')}</h1>

          <section className="glass-card mb-8 rounded-3xl p-7 md:p-9">
            <div className="flex flex-wrap items-center gap-5">
              {user.avatarUrl ? (
                <Image src={user.avatarUrl} alt="" width={64} height={64} unoptimized className="h-16 w-16 shrink-0 rounded-full object-cover" />
              ) : (
                <span aria-hidden className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-violet-600 text-2xl font-bold text-white">{initial}</span>
              )}
              <div className="min-w-0 flex-1">
                <p className="t-title-2 t-on-glass truncate">{displayName}</p>
                {user.bio && <p className="t-footnote mt-1 text-white/70">{user.bio}</p>}
                <p className="t-footnote mt-1 truncate text-white/50">{user.email}</p>
                <Link href={`/profile/${user.id}`} className="inline-block mt-2 text-xs text-violet-400 hover:text-violet-300 transition-colors">
                  {t('viewProfile')} &rarr;
                </Link>
              </div>
            </div>

            {comp.pct < 100 && (
              <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] px-4 py-2.5">
                <p className="text-xs text-amber-300/80">资料完善度 {comp.pct}% &mdash; 建议补充：{comp.missing.join('、')}</p>
              </div>
            )}

            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/[0.08] pt-6 sm:grid-cols-4">
              <div><dt className="t-eyebrow text-white/45">{t('joinTime')}</dt><dd className="t-footnote mt-1.5 tabular-nums text-white/80">{formatDate(user.createdAt)}</dd></div>
              <div><dt className="t-eyebrow text-white/45">{t('emailStatus')}</dt><dd className="t-footnote mt-1.5 text-white/80">{user.emailVerified ? t('verified') : t('unverified')}</dd></div>
              <div><dt className="t-eyebrow text-white/45">{t('postsCount')}</dt><dd className="t-footnote mt-1.5 tabular-nums text-white/80">{userPosts.length}</dd></div>
              <div><dt className="t-eyebrow text-white/45">{t('favoritesCount')}</dt><dd className="t-footnote mt-1.5 tabular-nums text-white/80">{favCount}</dd></div>
              <div><dt className="t-eyebrow text-white/45">{t('ordersCount')}</dt><dd className="t-footnote mt-1.5 tabular-nums text-white/80">{ordCount}</dd></div>
              <div><dt className="t-eyebrow text-white/45">{t('keysCount')}</dt><dd className="t-footnote mt-1.5 tabular-nums text-white/80">{keys.length}</dd></div>
              <div><dt className="t-eyebrow text-white/45">{t('studentStatus')}</dt><dd className="t-footnote mt-1.5 text-white/80">{user.isStudent ? t('verifiedStudent') : t('unverifiedStudent')}</dd></div>
              <div><dt className="t-eyebrow text-white/45">{t('favoritesCountLabel')}</dt><dd className="t-footnote mt-1.5 tabular-nums text-white/80">{favCount}</dd></div>
            </dl>

            {!user.isStudent && (
              <p className="t-footnote mt-5 text-white/60">
                {t('studentPrompt')}<Link href="/student" className="text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white">{t('verifyNow')}</Link>{t('verifySuffix')}
              </p>
            )}
          </section>

          <section className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="group relative flex flex-col gap-1.5 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 transition-all hover:border-white/15 hover:bg-white/[0.05]">
                <svg className="w-5 h-5 text-white/45 group-hover:text-white/70 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">{link.icon}</svg>
                <span className="text-sm font-medium text-white/85">{link.label}</span>
                <span className="text-[11px] text-white/40">{link.desc}</span>
                {link.badge != null && link.badge > 0 && (
                  <span className="absolute right-3 top-3 rounded-full bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-medium text-violet-300 tabular-nums">{link.badge}</span>
                )}
              </Link>
            ))}
          </section>

          {timeline.length > 0 && (
            <section className="mb-8 rounded-3xl border border-white/[0.07] bg-white/[0.02] p-7 md:p-9">
              <h2 className="t-title-3 mb-4 text-white/90">{t('timelineTitle')}</h2>
              <div className="space-y-3">
                {timeline.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className={`shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full ${item.type === 'post' ? 'bg-blue-400/60' : item.type === 'order' ? 'bg-emerald-400/60' : 'bg-amber-400/60'}`} />
                    <div className="min-w-0 flex-1">
                      {item.href ? (
                        <Link href={item.href} className="text-sm text-white/70 hover:text-white transition-colors truncate block">{item.text}</Link>
                      ) : (
                        <span className="text-sm text-white/70 truncate block">{item.text}</span>
                      )}
                      <span className="text-[10px] text-white/30">{formatDate(item.date)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {user.emailVerified && ordCount > 0 && (
            <section className="mb-8 rounded-3xl border border-white/[0.07] bg-white/[0.02] p-7 md:p-9">
              <h2 className="t-title-3 mb-1.5 text-white/90">{t('myOrders')}</h2>
              <p className="t-footnote mb-5 text-white/60">{t('myOrdersDesc')}</p>
              <Link href="/orders" className="inline-flex rounded-xl bg-white px-5 py-2.5 text-[0.9375rem] font-semibold text-black transition-opacity hover:opacity-90">{t('viewOrders')}</Link>
            </section>
          )}

          {keys.length > 0 && (
            <section className="mb-8 rounded-3xl border border-white/[0.07] bg-white/[0.02] p-7 md:p-9">
              <h2 className="t-title-3 mb-1.5 text-white/90">{t('myLicenseKeys')}</h2>
              <p className="t-footnote mb-5 text-white/60">{t('licenseKeysDesc')}</p>
              <div className="space-y-3">
                {keys.map((k) => {
                  const product = findPurchasable(k.productId);
                  const st = statusLabel[k.status] ?? statusLabel.active;
                  return (
                    <div key={k.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-[0.9375rem] font-medium text-white/90 truncate">{product?.name[locale as Locale] ?? k.productId}<span className="ml-2 text-white/50 font-normal">{k.planName}</span></p>
                        <p className="t-footnote mt-0.5 font-mono text-white/40 truncate select-all">{k.key}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${st.cls}`}>{st.text}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {userPosts.length > 0 && (
            <section className="mb-8 rounded-3xl border border-white/[0.07] bg-white/[0.02] p-7 md:p-9">
              <h2 className="t-title-3 mb-1.5 text-white/90">{t('myPosts')}</h2>
              <p className="t-footnote mb-5 text-white/60">{t('myPostsDesc')}</p>
              <div className="space-y-3">
                {userPosts.map((p) => {
                  const st = statusLabel[p.status] ?? statusLabel.draft;
                  const date = p.publishedAt ?? p.createdAt;
                  return (
                    <a key={p.id} href={p.status === 'published' ? `/blog/p/${p.id}` : undefined}
                      className={`flex flex-wrap items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 ${p.status === 'published' ? 'transition-colors hover:border-white/12 hover:bg-white/[0.04]' : ''}`}>
                      <div className="min-w-0 flex-1"><p className="text-[0.9375rem] font-medium text-white/90 truncate">{p.title}</p>
                        <p className="t-footnote mt-0.5 text-white/45">{formatDate(date)}{p.status === 'rejected' && p.reviewNote && <span className="ml-2 text-red-400/80">{p.reviewNote}</span>}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${st.cls}`}>{st.text}</span>
                    </a>
                  );
                })}
              </div>
            </section>
          )}

          {user.emailVerified && <BlogApiTokenManager />}

          <AccountForms initialName={user.name ?? ''} initialBio={user.bio ?? ''} initialAvatar={user.avatarUrl ?? null} email={user.email} />

          <GlassPreference />

          <WechatAccountBinding bound={!!user.wechatOpenid} email={user.email} />

          <section className="mt-8 rounded-3xl border border-white/[0.07] bg-white/[0.02] p-7 md:p-9">
            <h2 className="t-title-3 mb-1.5 text-white/90">{t('dataRights')}</h2>
            <p className="t-footnote mb-5 text-white/60">{t('dataRightsDesc')}</p>
            <a href="/api/auth/export" download className="inline-flex rounded-xl border border-white/15 px-5 py-2.5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-white/[0.06]">{t('exportData')}</a>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

