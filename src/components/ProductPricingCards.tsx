"use client";

import PricingCard from "./PricingCard";
import { usePassStatus } from "./usePassStatus";
import PassStatusNotice from "./PassStatusNotice";

interface ProductPricingCardsProps {
  plans: Array<{
    id: string;
    name: string;
    price: number;
    basePrice?: number;
    originalPrice?: number;
    period?: string;
    features: string[];
    isPopular?: boolean;
  }>;
  productId: string;
  productName: string;
  isAnnual?: boolean;
}

export default function ProductPricingCards({ plans, productId, productName, isAnnual }: ProductPricingCardsProps) {
  const pass = usePassStatus();

  return (
    <div className="mx-auto max-w-5xl">
      <PassStatusNotice error={pass.error} onRetry={pass.retry} />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {plans.map((plan, index) => (
        <PricingCard
          key={plan.name}
          name={plan.name}
          price={plan.price}
          basePrice={plan.basePrice}
          originalPrice={plan.originalPrice}
          period={plan.period}
          features={plan.features}
          isPopular={plan.isPopular ?? index === 1}
          productId={productId}
          productName={productName}
          planId={plan.id}
          isAnnual={isAnnual}
          currentPassPlan={pass.status?.currentPlan}
          passStatusState={pass.error ? 'error' : pass.loading ? 'loading' : 'ready'}
        />
      ))}
      </div>
    </div>
  );
}
