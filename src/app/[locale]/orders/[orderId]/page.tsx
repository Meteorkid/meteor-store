import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import { eq, and } from 'drizzle-orm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { db } from '@/lib/db';
import { orders, licenseKeys } from '@/lib/db/schema';
import { findProduct } from '@/lib/products';
import { SHOW_PRICING } from '@/lib/constants';
import { getSession } from '@/lib/auth';

interface OrderDetailPageProps {
  params: Promise<{ orderId: string; locale: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function OrderDetailPage({ params, searchParams }: OrderDetailPageProps) {
  const { orderId, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'OrderPage' });

  // ICP 备案期间隐藏订单详情页
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

  const { token } = await searchParams;

  // 校验 orderId 格式（UUID）
  const isValidOrderId = orderId && /^[0-9a-f-]{36}$/i.test(orderId);
  if (!isValidOrderId) notFound();

  // 访问鉴权：两种通道任一即可
  //   1) 登录用户的邮箱与订单邮箱一致（推荐路径：用户中心 → 我的订单）
  //   2) URL 携带订单 accessToken（用于支付完成后的同步跳转）
  // 邮件不再附带 accessToken 链接，避免邮件预抓取/转发导致 license key 外泄。
  let order: typeof orders.$inferSelect | null = null;

  const session = await getSession();
  if (session) {
    [order] = await db.select().from(orders).where(
      and(eq(orders.id, orderId), eq(orders.email, session.email))
    ).limit(1);
  }

  if (!order && token && /^[0-9a-f-]{36}$/i.test(token)) {
    [order] = await db.select().from(orders).where(
      and(eq(orders.id, orderId), eq(orders.accessToken, token))
    ).limit(1);
  }

  if (!order) notFound();

  const product = findProduct(order.productId);
  const [license] = await db.select().from(licenseKeys).where(eq(licenseKeys.orderId, orderId)).limit(1);

  const statusMap: Record<string, { label: string; color: string }> = {
    paid: { label: t('statusPaid'), color: 'text-green-400' },
    pending: { label: t('statusPending'), color: 'text-yellow-400' },
    failed: { label: t('statusFailed'), color: 'text-red-400' },
    refunded: { label: t('statusRefunded'), color: 'text-gray-400' },
  };
  const status = statusMap[order.status] || { label: order.status, color: 'text-gray-400' };

  const deliveryMap: Record<string, { label: string; color: string }> = {
    emailed: { label: t('deliveryEmailed'), color: 'text-green-400' },
    pending: { label: t('deliveryPending'), color: 'text-yellow-400' },
    failed: { label: t('deliveryFailed'), color: 'text-red-400' },
  };
  const delivery = deliveryMap[order.deliveryStatus] || { label: order.deliveryStatus, color: 'text-gray-400' };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-white mb-8">{t('title')}</h1>

          {/* 订单信息 */}
          <div className="bg-white/5 rounded-lg p-6 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{t('orderId')}</span>
                <span className="text-white font-mono text-xs">{order.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{t('product')}</span>
                <span className="text-white">{product?.name || order.productId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{t('plan')}</span>
                <span className="text-white">{order.planName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{t('amount')}</span>
                <span className="text-white">¥{order.amountCny}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{t('paymentMethod')}</span>
                <span className="text-white">{t('alipay')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{t('paymentStatus')}</span>
                <span className={status.color}>{status.label}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{t('emailStatus')}</span>
                <span className={delivery.color}>{delivery.label}</span>
              </div>
              {order.paidAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{t('paidAt')}</span>
                  <span className="text-white">{new Date(order.paidAt).toLocaleString(locale === 'zh' ? 'zh-CN' : 'en-US')}</span>
                </div>
              )}
            </div>
          </div>

          {/* License Key */}
          {license && (
            <div className="bg-white/5 rounded-lg p-6 mb-6">
              <h2 className="text-sm font-medium text-gray-400 mb-3">{t('licenseKey')}</h2>
              <div className="bg-gray-900 rounded-lg p-4 text-center">
                <p className="text-2xl font-mono tracking-widest text-green-400 select-all">
                  {license.key}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {t('status')}：{license.status === 'active' ? '✅' : '❌'}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                {t('keepSafe')}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium text-center hover:opacity-90 transition-opacity"
            >
              {t('backToHome')}
            </Link>
            <Link
              href="/products"
              className="px-6 py-3 bg-white/10 rounded-lg text-white font-medium text-center hover:bg-white/20 transition-colors"
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
