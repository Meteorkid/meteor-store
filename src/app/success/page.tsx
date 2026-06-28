import Link from 'next/link';
import { eq } from 'drizzle-orm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { findProduct } from '@/lib/products';

interface SuccessPageProps {
  searchParams: Promise<{ orderId?: string; tradeNo?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { orderId } = await searchParams;

  let order = null;
  if (orderId) {
    const [result] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    order = result || null;
  }

  const product = order ? findProduct(order.productId) : null;

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto text-center">
          {order?.status === 'paid' ? (
            <>
              <div className="text-6xl mb-6">🎉</div>
              <h1 className="text-3xl font-bold text-white mb-4">支付成功！</h1>
              <p className="text-gray-400 mb-8">
                感谢你的购买！你的订单已成功处理。
              </p>

              {/* 订单详情 */}
              <div className="bg-white/5 rounded-lg p-4 mb-8 text-left">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">订单号</span>
                  <span className="text-white font-mono">{order.id}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">产品</span>
                  <span className="text-white">{product?.name || order.productId} - {order.planName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">金额</span>
                  <span className="text-white">¥{order.amountCny}</span>
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-8">
                确认邮件已发送至你的邮箱，请注意查收。
              </p>
            </>
          ) : order ? (
            <>
              <div className="text-6xl mb-6">⏳</div>
              <h1 className="text-3xl font-bold text-white mb-4">支付处理中</h1>
              <p className="text-gray-400 mb-8">
                你的订单正在处理中，请稍后刷新查看状态。
              </p>
              <div className="bg-white/5 rounded-lg p-4 mb-8 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">订单号</span>
                  <span className="text-white font-mono">{order.id}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-6xl mb-6">❓</div>
              <h1 className="text-3xl font-bold text-white mb-4">未找到订单</h1>
              <p className="text-gray-400 mb-8">
                {orderId ? `订单 ${orderId} 不存在` : '请通过支付完成后的链接访问此页面'}
              </p>
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
            >
              返回首页
            </Link>
            <Link
              href="/products"
              className="px-6 py-3 bg-white/10 rounded-lg text-white font-medium hover:bg-white/20 transition-colors"
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
