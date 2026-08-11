"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import PricingCard from "./PricingCard";
import type { PassPlanId } from "@/data/pass";

interface ProductPricingCardsProps {
  plans: Array<{
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
  const { user } = useAuth();
  const [currentPassPlan, setCurrentPassPlan] = useState<PassPlanId | null>(null);

  useEffect(() => {
    if (!user) { setCurrentPassPlan(null); return; }
    fetch("/api/pass/status")
      .then((r) => r.json())
      .then((d) => setCurrentPassPlan(d.hasPass ? d.currentPlan : null))
      .catch(() => setCurrentPassPlan(null));
  }, [user]);

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
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
          isAnnual={isAnnual}
          currentPassPlan={currentPassPlan}
        />
      ))}
    </div>
  );
}
