'use client';

import { useState } from 'react';
import { ANNUAL_DISCOUNT } from '@/lib/constants';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  planName: string;
  price: number;
  /** 方案原价（未打折），用于年付总额计算，避免前端取整口径与后端不一致 */
  basePrice: number;
  period?: string;
  isAnnual?: boolean;
}

export default function PaymentModal({
  isOpen,
  onClose,
  productId,
  productName,
  planName,
  price,
  basePrice,
  period,
  isAnnual,
}: PaymentModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAlipayPayment = async () => {
    if (!email) {
      alert('请输入邮箱地址');
      return;
    }

    setLoading(true);

    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: productId,  // 传产品 ID 而非展示名
          planName,
          paymentMethod: 'alipay',
          email,
          isMobile,
          isAnnual,
        }),
      });

      const data = await response.json();

      if (data.success && data.payUrl) {
        window.location.href = data.payUrl;
      } else {
        alert(`支付创建失败: ${data.error}`);
      }
    } catch {
      alert('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-md mx-4 bg-gray-900 rounded-2xl border border-white/10 p-6 shadow-2xl">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <h2 className="text-xl font-bold text-white mb-2">选择支付方式</h2>
          <p className="text-gray-400 text-sm mb-6">
            {productName} - {planName}
          </p>

          {/* Price Display */}
          <div className="bg-white/5 rounded-lg p-4 mb-6">
            {isAnnual ? (
              <div className="text-center">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl font-bold text-white">¥{price}</span>
                  <span className="text-gray-400">/月 × 12</span>
                </div>
                <div className="mt-1 text-lg font-semibold text-green-400">
                  = ¥{Math.floor(basePrice * ANNUAL_DISCOUNT * 12)}/年
                </div>
              </div>
            ) : (
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-white">¥{price}</span>
                {period && <span className="text-gray-400">/{period}</span>}
              </div>
            )}
          </div>

          {/* 支付方式（仅支付宝） */}
          <div className="mb-6">
            <div className="py-3 px-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-center">
              <span className="text-blue-400 font-medium">💙 支付宝</span>
            </div>
          </div>

          {/* Email Input */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              邮箱地址（用于接收购买凭证）
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleAlipayPayment}
            disabled={loading || !email}
            className="w-full py-3 rounded-lg font-medium transition-all bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '处理中...' : '使用支付宝支付'}
          </button>

          {/* Footer */}
          <p className="text-center text-gray-500 text-xs mt-6">
            安全支付 · 支持花呗/信用卡
          </p>
        </div>
      </div>
    </>
  );
}
