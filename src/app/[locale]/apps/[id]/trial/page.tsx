import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';
import { appComponents } from '@/components/apps/registry';
import { findProduct } from '@/lib/products';

interface TrialPageProps {
  params: Promise<{ locale: string; id: string }>;
}

/**
 * 免门控试用路由：直接渲染应用本体，不做授权判定、不带全站 Header/Footer。
 * 供产品详情页的「免费试用」内嵌 iframe 使用，未购用户也能体验完整功能。
 */
export default async function TrialPage({ params }: TrialPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const product = findProduct(id);
  if (!product) notFound();

  const renderApp: ReactNode = appComponents[id] ? appComponents[id]() : notFound();

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-8">{renderApp}</main>
    </div>
  );
}