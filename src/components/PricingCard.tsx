'use client';

import { useState } from 'react';
import PaymentModal from './PaymentModal';

interface PricingCardProps {
  name: string;
  price: number;
  period?: string;
  features: string[];
  isPopular?: boolean;
  productId?: string;
  productName?: string;
  /** 提供 href 时点击跳转到产品页，不弹支付窗口 */
  href?: string;
}

export default function PricingCard({
  name,
  price,
  period,
  features,
  isPopular,
  productId,
  productName,
  href,
}: PricingCardProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handlePurchase = () => {
    if (price === 0) {
      window.open('https://github.com/Meteorkid', '_blank');
      return;
    }

    // 有 href 时跳转到产品页
    if (href) {
      window.location.href = href;
      return;
    }

    setShowPaymentModal(true);
  };

  return (
    <>
      <div
        className={`relative rounded-2xl border p-6 transition-all duration-300 ${
          isPopular
            ? 'border-primary bg-gradient-to-br from-primary/10 to-pink-500/10 scale-105 shadow-lg'
            : 'border-border bg-card hover:border-primary/50'
        }`}
      >
        {isPopular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-primary to-pink-500 rounded-full text-xs font-medium text-primary-foreground">
            最受欢迎
          </div>
        )}

        <h3 className="text-lg font-semibold text-card-foreground mb-2">{name}</h3>

        <div className="flex items-baseline gap-1 mb-6">
          {price === 0 ? (
            <span className="text-3xl font-bold text-success">免费</span>
          ) : (
            <>
              <span className="text-3xl font-bold text-card-foreground">${price}</span>
              {period && <span className="text-muted-foreground">/{period}</span>}
            </>
          )}
        </div>

        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <svg
                className={`w-5 h-5 flex-shrink-0 ${isPopular ? 'text-primary' : 'text-success'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        <button
          onClick={handlePurchase}
          className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
            isPopular
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          {price === 0 ? '开始使用' : '立即购买'}
        </button>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        productName={productName || ''}
        planName={name}
        price={price}
        period={period}
      />
    </>
  );
}
