'use client';

import { useState } from 'react';
import AdvancedProductCard from './AdvancedProductCard';
import { products } from '@/data/products';

const categories = ['全部', '爬虫', 'AI', '设计', '工具', '游戏'];

export default function ProductShowcase() {
  const [activeCategory, setActiveCategory] = useState('全部');

  const filteredProducts = activeCategory === '全部'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <section id="products" className="py-20">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12 scroll-animate">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            精选产品
          </h2>
          <p className="text-muted-foreground text-lg">
            选择适合你的工具
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 scroll-animate" style={{ animationDelay: '0.1s' }}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="scroll-animate"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <AdvancedProductCard product={product} />
            </div>
          ))}
        </div>

        {/* View all button */}
        <div className="text-center mt-12 scroll-animate" style={{ animationDelay: '0.5s' }}>
          <a
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            查看全部产品
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
