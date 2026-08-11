import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getSession } from '@/lib/auth';
import { getUserEntitlementSummary } from '@/lib/entitlements';
import type { PassPlanId } from '@/data/pass';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from '@/i18n/navigation';

interface MyAppsPageProps {
  params: Promise<{ locale: string }>;
}

/**
 * 我的产品 — 已购应用的统一入口。
 * 列出当前用户获得访问权的产品，未登录/无产品时给出购买引导。
 */
export default async function MyAppsPage({ params }: MyAppsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'MyAppsPage' });

  const session = await getSession();
  const summary = session
    ? await getUserEntitlementSummary(session.userId, session.email)
    : null;
  const entitlements = summary?.entitlements ?? [];
  const passExpiredAt = summary?.passExpiredAt ?? null;

  const passPlanLabels: Record<PassPlanId, string> = {
    monthly: t('passPlanMonthly'),
    annual: t('passPlanAnnual'),
    lifetime: t('passPlanLifetime'),
  };

  /**
   * 到期日固定按东八区渲染。这段在服务端跑，Vercel 上是 UTC，
   * 不指定时区的话到期时间落在日界附近时中国用户会看到早一天的日期。
   * 计费是人民币、主体在广州，用东八区比用服务器时区可预期。
   */
  const formatExpiry = (iso: string) =>
    new Date(iso).toLocaleDateString(locale, {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-2 text-3xl font-bold">{t('title')}</h1>
          <p className="mb-10 text-white/50">{t('description')}</p>

          {!session ? (
            <div className="glass-card rounded-2xl p-10 text-center">
              <svg className="mx-auto mb-4 w-10 h-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
              <p className="mb-6 text-white/60">{t('loginHint')}</p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
              >
                {t('loginToContinue')}
              </Link>
            </div>
          ) : entitlements.length === 0 ? (
            /* Pass 到期是静默失效（支付宝是单次付款不是代扣），
               不单独说明的话用户会以为是 bug */
            passExpiredAt ? (
              <div className="glass-card !border-amber-500/20 !bg-amber-500/[0.05] rounded-2xl p-10 text-center">
                <svg className="mx-auto mb-4 w-10 h-10 text-amber-400/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="mb-2 text-white/80">{t('passExpiredTitle')}</p>
                <p className="mb-6 text-sm text-white/50">
                  {t('passExpiredHint', { date: formatExpiry(passExpiredAt) })}
                </p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
                >
                  {t('passRenew')}
                </Link>
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-10 text-center">
                <svg className="mx-auto mb-4 w-10 h-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                <p className="mb-6 text-white/60">{t('emptyHint')}</p>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
                >
                  {t('browseProducts')}
                </Link>
              </div>
            )
          ) : (
            <ul className="space-y-4">
              {entitlements.map((e) => (
                <li
                  key={e.productId}
                  className="glass-card flex items-center justify-between rounded-2xl p-5"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-white">{e.productName}</h2>
                    <p className="mt-1 text-sm text-white/50">
                      {/* Pass 的档位由 passPlanId 本地化渲染，
                          planName 里不再塞中文，否则英文站会冒出「年付」 */}
                      {e.viaPass && e.passPlanId
                        ? `${e.planName} · ${passPlanLabels[e.passPlanId]}`
                        : e.planName}
                      {!e.viaPass && e.billingPeriod === 'annual' ? ' · ' + t('annual') : ''}
                      {e.expiresAt ? ' · ' + t('passExpires', { date: formatExpiry(e.expiresAt) }) : ''}
                    </p>
                  </div>
                  <Link
                    href={`/apps/${e.productId}`}
                    className="shrink-0 rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
                  >
                    {t('launch')}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
