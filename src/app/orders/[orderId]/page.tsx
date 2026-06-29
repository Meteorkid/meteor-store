import Link from 'next/link';
import { notFound } from 'next/navigation';
import { eq, and } from 'drizzle-orm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { db } from '@/lib/db';
import { orders, licenseKeys } from '@/lib/db/schema';
import { findProduct } from '@/lib/products';
import { SHOW_PRICING } from '@/lib/constants';

interface OrderDetailPageProps {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function OrderDetailPage({ params, searchParams }: OrderDetailPageProps) {
  // ICP 备案期间隐藏订单详情页
  if (!SHOW_PRICING) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">页面维护中</h1>
          <p className="text-gray-400">该功能暂不可用，请稍后再试。</p>
        </main>
        <Footer />
      </div>
    );
  }

  const { orderId } = await params;
  const { token } = await searchParams;

  // 校验 orderId 格式（UUID）+ 必须携带 token
  const isValidOrderId = orderId && /^[0-9a-f-]{36}$/i.test(orderId);
  if (!isValidOrderId || !token) notFound();

  // 同时校验 orderId 和 token
  const [order] = await db.select().from(orders).where(
    and(eq(orders.id, orderId), eq(orders.accessToken, token))
  ).limit(1);
  if (!order) notFound();

  const product = findProduct(order.productId);
  const [license] = await db.select().from(licenseKeys).where(eq(licenseKeys.orderId, orderId)).limit(1);

  const statusMap: Record<string, { label: string; color: string }> = {
    paid: { label: '已支付', color: 'text-green-400' },
    pending: { label: '待支付', color: 'text-yellow-400' },
    failed: { label: '支付失败', color: 'text-red-400' },
    refunded: { label: '已退款', color: 'text-gray-400' },
  };
  const status = statusMap[order.status] || { label: order.status, color: 'text-gray-400' };

  const deliveryMap: Record<string, { label: string; color: string }> = {
    emailed: { label: '已发送', color: 'text-green-400' },
    pending: { label: '发送中', color: 'text-yellow-400' },
    failed: { label: '发送失败', color: 'text-red-400' },
  };
  const delivery = deliveryMap[order.deliveryStatus] || { label: order.deliveryStatus, color: 'text-gray-400' };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-white mb-8">订单详情</h1>

          {/* 订单信息 */}
          <div className="bg-white/5 rounded-lg p-6 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">订单号</span>
                <span className="text-white font-mono text-xs">{order.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">产品</span>
                <span className="text-white">{product?.name || order.productId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">方案</span>
                <span className="text-white">{order.planName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">金额</span>
                <span className="text-white">¥{order.amountCny}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">支付方式</span>
                <span className="text-white">支付宝</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">支付状态</span>
                <span className={status.color}>{status.label}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">邮件状态</span>
                <span className={delivery.color}>{delivery.label}</span>
              </div>
              {order.paidAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">支付时间</span>
                  <span className="text-white">{new Date(order.paidAt).toLocaleString('zh-CN')}</span>
                </div>
              )}
            </div>
          </div>

          {/* License Key */}
          {license && (
            <div className="bg-white/5 rounded-lg p-6 mb-6">
              <h2 className="text-sm font-medium text-gray-400 mb-3">激活码</h2>
              <div className="bg-gray-900 rounded-lg p-4 text-center">
                <p className="text-2xl font-mono tracking-widest text-green-400 select-all">
                  {license.key}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  状态：{license.status === 'active' ? '✅ 有效' : '❌ 已失效'}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                请妥善保管，这是使用产品的唯一凭证
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium text-center hover:opacity-90 transition-opacity"
            >
              返回首页
            </Link>
            <Link
              href="/products"
              className="px-6 py-3 bg-white/10 rounded-lg text-white font-medium text-center hover:bg-white/20 transition-colors"
            >
              浏览更多产品
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
