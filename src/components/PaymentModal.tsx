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
  const [paymentMethod, setPaymentMethod] = useState<'alipay' | 'wechat'>('alipay');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');

  if (!isOpen) return null;

  // 计算人民币价格（按 1:7 汇率）
  const priceCNY = Math.round(price * 7);

  const handleSubmit = async () => {
    if (!email) {
      alert('请输入邮箱地址');
      return;
    }

    setLoading(true);
    setStep('processing');

    try {
      // 调用支付 API
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName,
          planName,
          price,
          period,
          paymentMethod,
          email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStep('success');
        // 这里可以跳转到支付页面或显示二维码
        alert(`订单创建成功！\n\n订单号: ${data.orderId}\n\n${data.message}`);
      } else {
        alert(`支付失败: ${data.error}`);
        setStep('form');
      }
    } catch (error) {
      alert('网络错误，请重试');
      setStep('form');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('form');
    setEmail('');
    onClose();
  };

  return (
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

        {step === 'form' && (
          <>
            {/* Header */}
            <h2 className="text-xl font-bold text-white mb-2">选择支付方式</h2>
            <p className="text-gray-400 text-sm mb-6">
              {productName} - {planName}
            </p>

            {/* Price Display */}
            <div className="bg-white/5 rounded-lg p-4 mb-6">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-white">¥{priceCNY}</span>
                {period && <span className="text-gray-400">/{period}</span>}
              </div>
              <p className="text-center text-gray-500 text-sm mt-1">
                原价 ${price} USD
              </p>
            </div>

            {/* Payment Method Toggle */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setPaymentMethod('alipay')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  paymentMethod === 'alipay'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                💙 支付宝
              </button>
              <button
                onClick={() => setPaymentMethod('wechat')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  paymentMethod === 'wechat'
                    ? 'bg-green-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                💚 微信支付
              </button>
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
              onClick={handleSubmit}
              disabled={loading || !email}
              className={`w-full py-3 rounded-lg font-medium transition-all ${
                paymentMethod === 'alipay'
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? '处理中...' : `使用${paymentMethod === 'alipay' ? '支付宝' : '微信支付'}支付`}
            </button>

            {/* Footer */}
            <p className="text-center text-gray-500 text-xs mt-6">
              安全支付 · 支持花呗/信用卡
            </p>
          </>
        )}

        {step === 'processing' && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">正在创建支付订单...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-white text-lg mb-2">订单创建成功</p>
            <p className="text-gray-400">请在弹出的支付页面完成支付</p>
          </div>
        )}
      </div>
    </div>
  );
}
