import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from '@/i18n/navigation';
import { appComponents } from '@/components/apps/registry';
import { findProduct } from '@/lib/products';
import { getSession } from '@/lib/auth';
import { getUserEntitlements } from '@/lib/entitlements';

interface AppPageProps {
  params: Promise<{ locale: string; id: string }>;
}

/**
 * 站内应用挂载点。
 * 已购用户在这里直接使用应用；未购用户看到付费引导。
 * 新应用接入：将应用组件注册进 appComponents 即可。
 *
 * **门控必须在服务端做，不要再退回客户端组件**：以前是一个客户端 PaywallGate
 * 拉 /api/entitlements 后决定渲不渲染，但应用本体照样被服务端塞进 RSC 负载，
 * 扒一眼网络响应就能拿到。Pass 会过期，是全站第一个真正需要「收回已授予访问权」
 * 的场景，客户端隐藏这个强度不够——现在没权限就根本不渲染应用组件。
 * 代价是这个页面从静态变为按请求渲染；它本来就因人而异，可以接受。
 */
export default async function AppPage({ params }: AppPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'AppPage' });
  const tPaywall = await getTranslations({ locale, namespace: 'Paywall' });

  const product = findProduct(id);
  if (!product) notFound();

  const session = await getSession();
  const entitlements = session
    ? await getUserEntitlements(session.userId, session.email)
    : [];
  const hasAccess = entitlements.some((e) => e.productId === id);

  const renderApp = appComponents[id];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold">{product.name.zh}</h1>
        <p className="mb-10 text-white/50">{product.tagline.zh}</p>

        {hasAccess ? (
          renderApp ? (
            renderApp()
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
              <div className="mb-4 text-4xl">🚧</div>
              <p className="text-white/60">
                {t('placeholder', { name: product.name.zh })}
              </p>
            </div>
          )
        ) : (
          <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <div className="mb-4 text-4xl">🔒</div>
            <h2 className="mb-2 text-xl font-bold text-white">{tPaywall('lockedTitle')}</h2>
            <p className="mb-6 text-sm text-white/50">{tPaywall('lockedDesc')}</p>
            <Link
              href={session ? `/products/${id}` : '/login'}
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
            >
              {session ? tPaywall('buyNow') : tPaywall('loginToContinue')}
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
