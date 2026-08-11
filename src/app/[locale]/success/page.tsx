import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { eq } from 'drizzle-orm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MeteorConfetti from '@/components/MeteorConfetti';
import { db } from '@/lib/db';
import { orders, licenseKeys } from '@/lib/db/schema';
import { findPurchasable } from '@/lib/products';
import { SHOW_PRICING } from '@/lib/constants';
import { getSession } from '@/lib/auth';
import { getOrderAccess } from '@/lib/order-access';
import type { Locale } from '@/i18n/routing';

interface SuccessPageProps {
  searchParams: Promise<{ orderId?: string }>;
  params: Promise<{ locale: string }>;
}

export default async function SuccessPage({ searchParams, params }: SuccessPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'SuccessPage' });

  // ICP 备案期间隐藏支付成功页
  if (!SHOW_PRICING) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">{t('maintenanceTitle')}</h1>
          <p className="text-gray-400">{t('maintenanceDescription')}</p>
        </main>
        <Footer />
      </div>
    );
  }

  const { orderId } = await searchParams;

  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const isValidOrderId = orderId && uuidPattern.test(orderId);

  let order = null;
  let license = null;
  if (isValidOrderId) {
    const [session, access, rows] = await Promise.all([
      getSession(),
      getOrderAccess(),
      db.select().from(orders).where(eq(orders.id, orderId)).limit(1),
    ]);
    const result = rows[0];
    const allowed = result && (
      session?.email.toLowerCase() === result.email.toLowerCase() ||
      access?.orderId === result.id
    );
    order = allowed ? result : null;
    if (order) {
      const [keyResult] = await db.select().from(licenseKeys).where(eq(licenseKeys.orderId, orderId)).limit(1);
      license = keyResult || null;
    }
  }

  const product = order ? findPurchasable(order.productId) : null;

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto text-center">
          {order?.status === 'paid' ? (
            <>
              <MeteorConfetti />
              <div className="text-6xl mb-6">🎉</div>
              <h1 className="text-3xl font-bold text-white mb-4">{t('successTitle')}</h1>
              <p className="text-gray-400 mb-4">
                {t('successDescription')}
              </p>
              <p className="text-purple-300/80 text-sm mb-8 leading-relaxed">
                {t('successMessage')}
              </p>

              {/* 订单详情 */}
              <div className="glass-card rounded-lg p-4 mb-8 text-left">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">{t('orderId')}</span>
                  <span className="text-white font-mono">{order.id}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">{t('product')}</span>
                  <span className="text-white">{product?.name[locale as Locale] || order.productId} - {order.planName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{t('amount')}</span>
                  <span className="text-white">¥{order.amountCny}</span>
                </div>
              </div>

              {/* 交付状态 */}
              <div className="text-sm mb-6">
                {order.deliveryStatus === 'emailed' ? (
                  <p className="text-green-400">✅ {t('emailSent')}</p>
                ) : order.deliveryStatus === 'failed' ? (
                  <p className="text-yellow-400">⚠️ {t('emailFailed')}</p>
                ) : (
                  <p className="text-gray-400">⏳ {t('emailSending')}</p>
                )}
              </div>

              {/* License Key */}
              {license && (
                <div className="bg-gray-900 rounded-lg p-4 mb-6">
                  <p className="text-xs text-gray-500 mb-2">{t('licenseKey')}</p>
                  <p className="text-xl font-mono tracking-widest text-green-400 select-all">
                    {license.key}
                  </p>
                </div>
              )}
            </>
          ) : order ? (
            <>
              <div className="text-6xl mb-6">⏳</div>
              <h1 className="text-3xl font-bold text-white mb-4">{t('processingTitle')}</h1>
              <p className="text-gray-400 mb-8">
                {t('processingDescription')}
              </p>
              <div className="glass-card rounded-lg p-4 mb-8 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{t('orderId')}</span>
                  <span className="text-white font-mono">{order.id}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-6xl mb-6">❓</div>
              <h1 className="text-3xl font-bold text-white mb-4">{t('notFoundTitle')}</h1>
              <p className="text-gray-400 mb-8">
                {orderId ? t('invalidOrderId') : t('accessViaPayment')}
              </p>
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
            >
              {t('backToHome')}
            </Link>
            <Link
              href="/products"
              className="px-6 py-3 bg-white/10 rounded-lg text-white font-medium hover:bg-white/20 transition-colors"
            >
              {t('browseMore')}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
