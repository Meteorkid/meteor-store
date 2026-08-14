'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import QRCode from 'qrcode';
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

type PaymentMethod = 'alipay' | 'wechat';

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
  const t = useTranslations('PaymentModal');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('alipay');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; });

  // 打开弹窗时重置为初始状态（渲染期调整派生状态，避免上次二维码残留）
  const [prevOpen, setPrevOpen] = useState(isOpen);
  if (isOpen !== prevOpen) {
    setPrevOpen(isOpen);
    if (isOpen) {
      setQrDataUrl('');
      setError('');
    }
  }

  // Focus trap + Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCloseRef.current();
      return;
    }
    if (e.key !== 'Tab' || !modalRef.current) return;
    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'input, button, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setTimeout(() => emailInputRef.current?.focus(), 100);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const stopPolling = () => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  };

  // 微信 Native 扫码后轮询订单状态，支付成功跳转订单页
  const startPolling = (orderIdToPoll: string, token: string) => {
    stopPolling();
    pollTimerRef.current = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/payment?orderId=${encodeURIComponent(orderIdToPoll)}&token=${encodeURIComponent(token)}`
        );
        const data = await response.json();
        if (data.status === 'paid') {
          stopPolling();
          window.location.href = `/orders/${orderIdToPoll}`;
        } else if (data.status === 'failed') {
          stopPolling();
          setLoading(false);
          setError(t('paymentFailed', { error: t('orderFailed') }));
        }
      } catch {
        // 轮询失败静默，下一次再试
      }
    }, 3000);
  };

  const handlePayment = async () => {
    if (!email) {
      setError(t('emailRequired'));
      return;
    }
    setError('');
    setLoading(true);

    try {
      const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: productId,
          planName,
          paymentMethod,
          email,
          isMobile,
          isAnnual,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(t('paymentFailed', { error: data.error }));
        setLoading(false);
        return;
      }

      if (paymentMethod === 'wechat') {
        if (data.channel === 'h5' && data.h5Url) {
          // 手机：拉起微信
          window.location.href = data.h5Url;
          return;
        }
        if (data.codeUrl) {
          // 桌面：渲染二维码 + 轮询
          const dataUrl = await QRCode.toDataURL(data.codeUrl, { margin: 1, width: 240 });
          setQrDataUrl(dataUrl);
          setLoading(false);
          startPolling(data.orderId, data.accessToken);
          return;
        }
      }

      // 支付宝：直接跳转
      if (data.payUrl) {
        window.location.href = data.payUrl;
        return;
      }
      setError(t('paymentFailed', { error: t('noPaymentUrl') }));
    } catch {
      setError(t('networkError'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    stopPolling();
    setEmail('');
    setError('');
    setQrDataUrl('');
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain">
        {/* Backdrop：fixed，不随弹窗内容滚动 */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        />

        <div className="flex min-h-full items-center justify-center p-4">
        {/* Modal */}
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label={t('dialogAriaLabel')}
          className="glass-lg relative w-full max-w-md bg-[rgba(20,16,34,0.8)] rounded-2xl p-6 animate-spotlight-in"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            aria-label={t('closeAriaLabel')}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <h2 className="text-xl font-bold text-white mb-2">{t('selectPaymentMethod')}</h2>
          <p className="text-gray-400 text-sm mb-6">
            {productName} - {planName}
          </p>

          {/* Price Display */}
          <div className="bg-white/5 rounded-lg p-4 mb-6">
            {isAnnual ? (
              <div className="text-center">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl font-bold text-white">¥{price}</span>
                  <span className="text-gray-400">{t('perMonthTimes12')}</span>
                </div>
                <div className="mt-1 text-lg font-semibold text-green-400">
                  = ¥{Math.floor(basePrice * ANNUAL_DISCOUNT * 12)}{t('perYear')}
                </div>
              </div>
            ) : (
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-white">¥{price}</span>
                {period && <span className="text-gray-400">/{period}</span>}
              </div>
            )}
          </div>

          {/* 支付方式选择 */}
          <div className="mb-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('alipay')}
              className={`py-3 px-4 rounded-lg border text-center transition-colors ${
                paymentMethod === 'alipay'
                  ? 'bg-blue-500/15 border-blue-500/50 text-blue-300'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              <span className="inline-flex items-center justify-center gap-2">
                <svg viewBox="0 0 20 20" className="h-5 w-5 flex-shrink-0" aria-hidden="true">
                  <rect width="20" height="20" rx="4.5" fill="#1677FF" />
                  <text x="10" y="14.3" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff" fontFamily="'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif">支</text>
                </svg>
                <span className="font-medium">{t('alipay')}</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('wechat')}
              className={`py-3 px-4 rounded-lg border text-center transition-colors ${
                paymentMethod === 'wechat'
                  ? 'bg-green-500/15 border-green-500/50 text-green-300'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              <span className="inline-flex items-center justify-center gap-2">
                <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0" fill="#07C160" aria-hidden="true">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.032zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
                </svg>
                <span className="font-medium">{t('wechat')}</span>
              </span>
            </button>
          </div>

          {/* 微信 Native 二维码 */}
          {qrDataUrl && (
            <div className="mb-6 flex flex-col items-center gap-3">
              <Image
                src={qrDataUrl}
                alt={t('wechatQrAlt')}
                width={240}
                height={240}
                unoptimized
                className="h-60 w-60 rounded-lg bg-white p-2"
              />
              <p className="text-center text-sm text-gray-300">{t('wechatScanHint')}</p>
            </div>
          )}

          {/* Email Input */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              {t('emailLabel')}
            </label>
            <input
              ref={emailInputRef}
              type="email"
              id="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handlePayment}
            disabled={loading || !email || !!qrDataUrl}
            className="w-full py-3 rounded-lg font-medium transition-all bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('processing') : paymentMethod === 'wechat' ? t('payWithWechat') : t('payWithAlipay')}
          </button>

          {/* Footer */}
          <p className="text-center text-gray-500 text-xs mt-6">
            {t('securePayment')}
          </p>
        </div>
        </div>
      </div>
    </>
  );
}