import type { Metadata } from 'next';
import { desc, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from '@/i18n/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { findProduct } from '@/lib/products';
import type { Locale } from '@/i18n/routing';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'OrdersPage' });
  return { title: t('metaTitle'), robots: { index: false, follow: false } };
}

function formatDate(iso: string, locale: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleString(locale === 'zh' ? 'zh-CN' : 'en-US');
}

export default async function OrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'OrdersPage' });
  const session = await getSession();
  if (!session) redirect('/login');

  const rows = await db
    .select({
      id: orders.id,
      productId: orders.productId,
      planName: orders.planName,
      amountCny: orders.amountCny,
      status: orders.status,
      deliveryStatus: orders.deliveryStatus,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(eq(orders.email, session.email))
    .orderBy(desc(orders.createdAt));

  const statusLabels: Record<string, string> = {
    paid: t('statusPaid'),
    pending: t('statusPending'),
    failed: t('statusFailed'),
    refunded: t('statusRefunded'),
  };
  const deliveryLabels: Record<string, string> = {
    emailed: t('deliveryEmailed'),
    processing: t('deliveryProcessing'),
    pending: t('deliveryPending'),
    failed: t('deliveryFailed'),
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="t-title-2">{t('title')}</h1>
              <p className="mt-2 text-sm text-white/60">{t('description')}</p>
            </div>
            <Link href="/account" className="text-sm text-violet-400 transition-colors hover:text-violet-300">
              {t('backToAccount')}
            </Link>
          </div>

          {rows.length === 0 ? (
            <div className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-10 text-center">
              <p className="text-sm text-white/55">{t('empty')}</p>
              <Link href="/products" className="mt-5 inline-block text-sm text-violet-400 transition-colors hover:text-violet-300">
                {t('browseProducts')}
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {rows.map((order) => {
                const product = findProduct(order.productId);
                return (
                  <Link
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className="block rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition-colors hover:border-white/15 hover:bg-white/[0.04]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-white/90">
                          {product?.name[locale as Locale] ?? order.productId}
                          <span className="ml-2 font-normal text-white/50">{order.planName}</span>
                        </p>
                        <p className="t-footnote mt-1 truncate font-mono text-white/35">{order.id}</p>
                      </div>
                      <span className="text-sm font-medium text-white/80">¥{order.amountCny}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-white/50">
                      <span>{statusLabels[order.status] ?? order.status}</span>
                      <span>{t('delivery')}: {deliveryLabels[order.deliveryStatus] ?? order.deliveryStatus}</span>
                      <span>{formatDate(order.createdAt, locale)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
