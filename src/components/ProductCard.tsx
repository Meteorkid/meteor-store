import Link from 'next/link';
import { Product } from '@/data/products';
import { SHOW_PRICING } from '@/lib/constants';
import ProductVisual from '@/components/ProductVisual';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const minPrice = SHOW_PRICING ? Math.min(...product.pricing.map(p => p.price)) : 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-3 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_24px_70px_rgba(91,33,182,0.22)]"
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

      <ProductVisual product={product} demoOnHover priority={priority} />

      <div className="relative px-3 pb-3 pt-5">
        {/* Title */}
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-white">{product.name}</h3>
            <p className="mt-1 text-sm text-gray-400">{product.tagline}</p>
          </div>
          <span className="text-2xl">{product.icon}</span>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {product.platforms.slice(0, 3).map((platform) => (
            <span key={platform} className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-gray-400">
              {platform}
            </span>
          ))}
        </div>

        {/* Price */}
        {SHOW_PRICING && (
          <div className="flex items-baseline gap-1 border-t border-white/10 pt-4">
            {minPrice === 0 ? (
              <span className="text-success font-semibold">免费</span>
            ) : (
              <>
                <span className="text-2xl font-bold text-card-foreground">¥{minPrice}</span>
                <span className="text-muted-foreground text-sm">起</span>
              </>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="mt-4 flex items-center gap-2 text-violet-300 transition-colors group-hover:text-violet-200">
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
