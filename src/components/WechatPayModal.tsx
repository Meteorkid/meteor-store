'use client';

import { useState, useLayoutEffect } from 'react';

interface WechatPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  planName: string;
  priceCNY: number;
  orderId: string;
}

export default function WechatPayModal({
  isOpen,
  onClose,
  productName,
  planName,
  priceCNY,
  orderId,
}: WechatPayModalProps) {
  const [step, setStep] = useState<'qrcode' | 'confirm'>('qrcode');

  // 每次 modal 打开时重置到二维码步骤（useLayoutEffect 在绘制前同步执行，避免一帧闪烁）
  /* eslint-disable react-hooks/set-state-in-effect -- intentionally reset state on open */
  useLayoutEffect(() => {
    if (isOpen) {
      setStep('qrcode');
    }
  }, [isOpen]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!isOpen) return null;

  const handleConfirm = () => {
    setStep('confirm');
  };

  const handleClose = () => {
    setStep('qrcode');
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

        {step === 'qrcode' && (
          <>
            {/* Header */}
            <h2 className="text-xl font-bold text-white mb-2">微信支付</h2>
            <p className="text-gray-400 text-sm mb-6">
              {productName} - {planName}
            </p>

            {/* QR Code */}
            <div className="bg-white rounded-lg p-4 mb-6 flex justify-center">
              {/* 这里放你的微信收款码图片 */}
              <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500 text-sm text-center">
                  微信收款码<br />
                  请替换为你的收款码
                </p>
              </div>
            </div>

            {/* 金额 */}
            <div className="text-center mb-6">
              <p className="text-gray-400 text-sm">请扫码支付</p>
              <p className="text-3xl font-bold text-white">¥{priceCNY}</p>
            </div>

            {/* 订单信息 */}
            <div className="bg-white/5 rounded-lg p-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">订单号</span>
                <span className="text-white font-mono">{orderId}</span>
              </div>
            </div>

            {/* 提示 */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <p className="text-yellow-400 text-sm">
                ⚠️ 请在支付完成后，将订单号发送到以下邮箱确认：
              </p>
              <p className="text-white text-sm mt-2">
                📧 meteor@stu.gpnu.edu.cn
              </p>
            </div>

            {/* 确认按钮 */}
            <button
              onClick={handleConfirm}
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
            >
              我已完成支付
            </button>
          </>
        )}

        {step === 'confirm' && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-white mb-2">支付确认中</h3>
            <p className="text-gray-400 mb-4">
              我们会在 24 小时内确认你的支付
            </p>
            <p className="text-gray-400 text-sm mb-6">
              确认后会发送激活码到你的邮箱
            </p>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              关闭
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
