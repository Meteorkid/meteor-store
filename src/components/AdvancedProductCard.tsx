'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/data/products';
import { SHOW_PRICING, categoryColors, categoryLabels } from '@/lib/constants';
import ProductMark from './ProductMark';

interface AdvancedProductCardProps {
  product: Product;
}

export default function AdvancedProductCard({ product }: AdvancedProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const minPrice = SHOW_PRICING ? Math.min(...product.pricing.map((p) => p.price)) : 0;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <Link href={`/products/${product.id}`} className="group relative block">
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/10 hover:shadow-2xl hover:shadow-primary/5"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Glow effect */}
        <div className="card-glow" />

        {/* Background gradient on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500`}
        />

        <div className="relative">
          {/* 产品标识：与评论区头像统一的渐变缩写方块 */}
          <div className="mb-4 group-hover:scale-110 transition-transform duration-300 w-fit">
            <ProductMark product={product} size="md" />
          </div>

          {/* Category badge */}
          <div
            className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-medium mb-3 ${
              categoryColors[product.category] || 'text-white/60 bg-white/5'
            }`}
          >
            {categoryLabels[product.category] || product.category}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-white mb-1.5 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Tagline */}
          <p className="text-sm text-white/40 mb-4 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>

          {/* Price + CTA row */}
          <div className="flex items-center justify-between">
            {SHOW_PRICING && (
              <div className="flex items-baseline gap-1">
                {minPrice === 0 ? (
                  <span className="text-emerald-400 font-semibold text-sm">免费</span>
                ) : (
                  <>
                    <span className="text-xl font-bold text-white">¥{minPrice}</span>
                    <span className="text-xs text-white/30">起</span>
                  </>
                )}
              </div>
            )}

            <span className="text-xs text-white/30 group-hover:text-primary transition-colors flex items-center gap-1">
              详情
              <svg
                className="w-3 h-3 group-hover:translate-x-0.5 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
