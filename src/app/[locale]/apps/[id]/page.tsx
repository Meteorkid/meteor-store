import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PaywallGate from '@/components/PaywallGate';
import { appComponents } from '@/components/apps/registry';
import { findProduct } from '@/lib/products';

interface AppPageProps {
  params: Promise<{ locale: string; id: string }>;
}

/**
 * 站内应用挂载点。
 * 已购用户在这里直接使用应用；未购用户看到付费引导。
 * 新应用接入：将应用组件注册进 appComponents 即可。
 */
export default async function AppPage({ params }: AppPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'AppPage' });

  const product = findProduct(id);
  if (!product) notFound();

  const renderApp = appComponents[id];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold">{product.name.zh}</h1>
        <p className="mb-10 text-white/50">{product.tagline.zh}</p>

        <PaywallGate productId={id}>
          {renderApp ? (
            renderApp()
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
              <div className="mb-4 text-4xl">🚧</div>
              <p className="text-white/60">
                {t('placeholder', { name: product.name.zh })}
              </p>
            </div>
          )}
        </PaywallGate>
      </main>
      <Footer />
    </div>
  );
}