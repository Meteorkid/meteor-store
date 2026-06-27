import Link from 'next/link';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const minPrice = Math.min(...product.pricing.map(p => p.price));

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 hover:border-white/20 transition-all duration-300"
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

      <div className="relative">
        {/* Icon */}
        <div className="text-4xl mb-4">{product.icon}</div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>

        {/* Tagline */}
        <p className="text-gray-400 text-sm mb-4">{product.tagline}</p>

        {/* Price */}
        <div className="flex items-baseline gap-1">
          {minPrice === 0 ? (
            <span className="text-green-400 font-semibold">免费</span>
          ) : (
            <>
              <span className="text-2xl font-bold text-white">${minPrice}</span>
              <span className="text-gray-400 text-sm">起</span>
            </>
          )}
        </div>

        {/* CTA */}
        <div className="mt-4 flex items-center gap-2 text-purple-400 group-hover:text-purple-300 transition-colors">
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
    </Link>
  );
}
