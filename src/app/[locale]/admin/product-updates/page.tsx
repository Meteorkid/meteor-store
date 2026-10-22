import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getAdminPageSession } from '@/lib/admin-session';
import { isAdminSession } from '@/lib/admin';
import { getProductUpdateState } from '@/lib/product-updates/service';
import ProductUpdatesPanel from './ProductUpdatesPanel';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const session = await getAdminPageSession();
  return {
    title: session && isAdminSession(session) ? locale === 'en' ? 'Product updates' : '产品更新' : 'Not found',
    robots: { index: false, follow: false },
  };
}

export default async function ProductUpdatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getAdminPageSession();
  if (!session || !isAdminSession(session)) notFound();
  const state = await getProductUpdateState();
  return <ProductUpdatesPanel userId={session.userId} initialState={state} />;
}
