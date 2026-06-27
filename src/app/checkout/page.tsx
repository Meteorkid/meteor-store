'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CheckoutPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Here you would typically:
    // 1. Create a checkout session with Lemon Squeezy
    // 2. Redirect to the checkout URL

    // For now, show a message
    alert('支付功能配置中！请先设置 Lemon Squeezy 环境变量。');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回产品列表
          </Link>

          <h1 className="text-3xl font-bold text-white mb-8">结账</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                邮箱地址
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                placeholder="your@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? '处理中...' : '继续支付'}
            </button>
          </form>

          <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-sm font-medium text-gray-300 mb-2">支付方式</h3>
            <p className="text-sm text-gray-400">
              我们使用 Lemon Squeezy 处理支付，支持信用卡、PayPal 等多种支付方式。
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
