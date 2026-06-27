'use client';

interface PricingCardProps {
  name: string;
  price: number;
  period?: string;
  features: string[];
  isPopular?: boolean;
  productId?: string;
}

export default function PricingCard({ name, price, period, features, isPopular, productId }: PricingCardProps) {
  const handlePurchase = () => {
    if (price === 0) {
      // Free tier - redirect to GitHub or docs
      window.open('https://github.com/Meteorkid', '_blank');
      return;
    }

    // For paid tiers, redirect to Lemon Squeezy checkout
    // You'll need to set up your Lemon Squeezy store and create products
    // Then replace the checkout URL with your actual Lemon Squeezy checkout link

    // Option 1: Direct checkout link (recommended)
    // Replace with your actual Lemon Squeezy checkout URL
    const checkoutUrl = `https://store.lemonsqueezy.com/checkout/buy/YOUR_VARIANT_ID`;

    // Option 2: Use a custom checkout page
    // window.location.href = `/checkout?product=${productId}&plan=${name.toLowerCase()}`;

    // For now, show an alert with instructions
    alert(`支付功能配置中！\n\n产品: ${productId}\n方案: ${name}\n价格: $${price}/${period || '买断'}\n\n请配置 Lemon Squeezy 支付系统后即可使用。`);
  };

  return (
    <div
      className={`relative rounded-2xl border p-6 transition-all duration-300 ${
        isPopular
          ? 'border-purple-500 bg-gradient-to-br from-purple-500/10 to-pink-500/10 scale-105'
          : 'border-white/10 bg-white/5 hover:border-white/20'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-medium text-white">
          最受欢迎
        </div>
      )}

      <h3 className="text-lg font-semibold text-white mb-2">{name}</h3>

      <div className="flex items-baseline gap-1 mb-6">
        {price === 0 ? (
          <span className="text-3xl font-bold text-green-400">免费</span>
        ) : (
          <>
            <span className="text-3xl font-bold text-white">${price}</span>
            {period && <span className="text-gray-400">/{period}</span>}
          </>
        )}
      </div>

      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
            <svg
              className={`w-5 h-5 flex-shrink-0 ${isPopular ? 'text-purple-400' : 'text-green-400'}`}
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
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'
            : 'bg-white/10 text-white hover:bg-white/20'
        }`}
      >
        {price === 0 ? '开始使用' : '立即购买'}
      </button>
    </div>
  );
}
