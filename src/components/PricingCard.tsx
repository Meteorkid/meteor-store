'use client';

import { useState } from 'react';
import { ANNUAL_DISCOUNT } from '@/lib/constants';
import { CheckIconSm } from './CheckIcon';
import PaymentModal from './PaymentModal';

interface PricingCardProps {
  name: string;
  price: number;
  basePrice?: number;
  period?: string;
  features: string[];
  isPopular?: boolean;
  productId?: string;
  productName?: string;
  href?: string;
  isAnnual?: boolean;
}

export default function PricingCard({
  name,
  price,
  basePrice,
  period,
  features,
  isPopular,
  productId,
  productName,
  href,
  isAnnual,
}: PricingCardProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handlePurchase = () => {
    if (price === 0) {
      window.open('https://github.com/Meteorkid', '_blank');
      return;
    }

    if (href) {
      const url = isAnnual ? `${href}?annual=true` : href;
      window.location.href = url;
      return;
    }

    setShowPaymentModal(true);
  };

  return (
    <>
      <div
        className={`group relative rounded-2xl border p-6 transition-all duration-300 ${
          isPopular
            ? 'border-primary/50 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent shadow-xl shadow-primary/10 scale-[1.02]'
            : 'border-white/[0.06] bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'
        }`}
      >
        {/* Popular Badge */}
        {isPopular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-[11px] font-semibold text-white tracking-wide uppercase">
              推荐
            </span>
          </div>
        )}

        {/* Plan Name */}
        <h3 className={`text-sm font-medium mb-4 ${isPopular ? 'text-primary' : 'text-muted-foreground'}`}>
          {name}
        </h3>

        {/* Price */}
        <div className="mb-6">
          {price === 0 ? (
            <span className="text-3xl font-bold text-emerald-400">免费</span>
          ) : (
            <>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">¥{price}</span>
                {period && <span className="text-sm text-white/40">/{period}</span>}
              </div>
              {isAnnual && basePrice && (
                <p className="text-sm text-emerald-400 mt-1">
                  = ¥{Math.floor(basePrice * ANNUAL_DISCOUNT * 12)}/年
                </p>
              )}
            </>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <CheckIconSm className={isPopular ? 'text-primary' : 'text-emerald-400'} />
              <span className="text-white/60">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <button
          onClick={handlePurchase}
          className={`w-full py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
            isPopular
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 shadow-lg shadow-primary/20'
              : 'bg-white/[0.06] text-white hover:bg-white/[0.1] border border-white/[0.06]'
          }`}
        >
          {price === 0 ? '免费开始' : '立即购买'}
        </button>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        productId={productId || ''}
        productName={productName || ''}
        planName={name}
        price={price}
        basePrice={basePrice ?? price}
        period={period}
        isAnnual={isAnnual}
      />
    </>
  );
}
