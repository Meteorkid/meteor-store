import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-white mb-4">支付成功！</h1>
          <p className="text-gray-400 mb-8">
            感谢你的购买！你的订单已成功处理。
          </p>
          <p className="text-gray-400 mb-8">
            我们已向你的邮箱发送了确认邮件和产品访问信息。
          </p>
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
