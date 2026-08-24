import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { appComponents } from '@/components/apps/registry';
import { redirect } from '@/i18n/navigation';
import { getSession } from '@/lib/auth';
import { findProduct } from '@/lib/products';

interface TrialPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: TrialPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const product = findProduct(id);
  if (!product) return {};

  const name = locale === 'zh' ? product.name.zh : product.name.en;
  return {
    title: locale === 'zh' ? `${name} · 在线体验` : `${name} · Live Demo`,
    description: locale === 'zh' ? product.tagline.zh : product.tagline.en,
  };
}

/**
 * 独立全屏体验路由：不带全站 Header/Footer，也不要求购买授权。
 * 三个展示应用公开体验；Tollow 需要登录，以便把进度与收藏同步到账户。
 */
export default async function TrialPage({ params }: TrialPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const product = findProduct(id);
  const renderApp = appComponents[id];
  if (!product || !renderApp) notFound();

  const session = id === 'tollow' ? await getSession() : null;
  if (id === 'tollow') {
    if (!session) {
      redirect({
        href: { pathname: '/login', query: { next: '/apps/tollow/trial' } },
        locale,
      });
    }
  }

  return (
    <main className="h-dvh w-screen overflow-hidden bg-black text-white">
      {renderApp({
        userId: session?.userId,
        tollowAccessLevel: id === 'tollow' ? 'free' : undefined,
      })}
    </main>
  );
}
