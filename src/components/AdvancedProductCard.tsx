'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/data/products';

interface AdvancedProductCardProps {
  product: Product;
}

export default function AdvancedProductCard({ product }: AdvancedProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const minPrice = Math.min(...product.pricing.map(p => p.price));
  
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
      
      // Update glow position
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
    <Link
      href={`/products/${product.id}`}
      className="group relative block"
    >
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Glow effect */}
        <div className="card-glow" />
        
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
        
        {/* Content */}
        <div className="relative">
          {/* Icon with animation */}
          <div className="text-5xl mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
            {product.icon}
          </div>
          
          {/* Category badge */}
          <div className="inline-block px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium mb-3">
            {product.category}
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          {/* Tagline */}
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {product.tagline}
          </p>
          
          {/* Price */}
          <div className="flex items-baseline gap-1 mb-4">
            {minPrice === 0 ? (
              <span className="text-success font-semibold">免费</span>
            ) : (
              <>
                <span className="text-2xl font-bold text-card-foreground">${minPrice}</span>
                <span className="text-muted-foreground text-sm">起</span>
              </>
            )}
          </div>
          
          {/* CTA */}
          <div className="flex items-center gap-2 text-primary group-hover:text-primary/80 transition-colors">
            <span className="text-sm font-medium">查看详情</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        
        {/* Hover border effect */}
        <div className="absolute inset-0 rounded-2xl border-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </Link>
  );
}
