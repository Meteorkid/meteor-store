'use client';

import { useState } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  planName: string;
  price: number;
  period?: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  productName,
  planName,
  price,
  period,
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'international' | 'domestic'>('international');

  if (!isOpen) return null;

  const handleInternationalPayment = () => {
    // Lemon Squeezy 支付
    const checkoutUrl = `https://store.lemonsqueezy.com/checkout/buy/YOUR_VARIANT_ID`;
    alert(`国际支付功能配置中！\n\n产品: ${productName}\n方案: ${planName}\n价格: $${price}/${period || '买断'}\n\n请配置 Lemon Squeezy 环境变量后即可使用。`);
  };

  const handleDomesticPayment = () => {
    // 国内支付（支付宝/微信）
    alert(`国内支付功能配置中！\n\n产品: ${productName}\n方案: ${planName}\n价格: ¥${price * 7}/${period || '买断'}\n\n请配置支付宝/微信支付后即可使用。`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-gray-900 rounded-2xl border border-white/10 p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <h2 className="text-xl font-bold text-white mb-2">选择支付方式</h2>
        <p className="text-gray-400 text-sm mb-6">
          {productName} - {planName} - ${price}/{period || '买断'}
        </p>

        {/* Payment Method Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setPaymentMethod('international')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              paymentMethod === 'international'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            🌍 国际支付
          </button>
          <button
            onClick={() => setPaymentMethod('domestic')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              paymentMethod === 'domestic'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            🇨🇳 国内支付
          </button>
        </div>

        {/* Payment Options */}
        {paymentMethod === 'international' ? (
          <div className="space-y-3">
            <button
              onClick={handleInternationalPayment}
              className="w-full py-4 px-4 bg-white/10 rounded-lg text-white font-medium hover:bg-white/20 transition-colors flex items-center gap-3"
            >
              <span className="text-2xl">💳</span>
              <div className="text-left">
                <div>信用卡 / 借记卡</div>
                <div className="text-sm text-gray-400">Visa, Mastercard, AMEX</div>
              </div>
            </button>
            <button
              onClick={handleInternationalPayment}
              className="w-full py-4 px-4 bg-white/10 rounded-lg text-white font-medium hover:bg-white/20 transition-colors flex items-center gap-3"
            >
              <span className="text-2xl">🅿️</span>
              <div className="text-left">
                <div>PayPal</div>
                <div className="text-sm text-gray-400">安全便捷的国际支付</div>
              </div>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handleDomesticPayment}
              className="w-full py-4 px-4 bg-white/10 rounded-lg text-white font-medium hover:bg-white/20 transition-colors flex items-center gap-3"
            >
              <span className="text-2xl">💙</span>
              <div className="text-left">
                <div>支付宝</div>
                <div className="text-sm text-gray-400">推荐国内用户使用</div>
              </div>
            </button>
            <button
              onClick={handleDomesticPayment}
              className="w-full py-4 px-4 bg-white/10 rounded-lg text-white font-medium hover:bg-white/20 transition-colors flex items-center gap-3"
            >
              <span className="text-2xl">💚</span>
              <div className="text-left">
                <div>微信支付</div>
                <div className="text-sm text-gray-400">扫码支付</div>
              </div>
            </button>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          安全支付由 Lemon Squeezy / 支付宝 / 微信支付提供
        </p>
      </div>
    </div>
  );
}
