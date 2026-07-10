import { Product } from '@/data/products';
import { SHOW_PRICING } from '@/lib/constants';
import ProductVisual from '@/components/ProductVisual';
import TransitionLink from '@/components/TransitionLink';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const minPrice = SHOW_PRICING ? Math.min(...product.pricing.map(p => p.price)) : 0;

  return (
    <TransitionLink
      href={`/products/${product.id}`}
      className="group relative overflow-hidden rounded-[1.75rem] p-3 transition-all duration-300 hover:-translate-y-1 backdrop-blur-xl bg-linear-to-br from-white/[0.06] via-white/[0.03] to-white/[0.01] border-t border-l border-r border-b border-t-white/[0.12] border-l-white/[0.06] border-r-white/[0.04] border-b-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_4px_24px_rgba(0,0,0,0.3)] hover:border-t-white/[0.22] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_24px_70px_rgba(91,33,182,0.22)]"
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

      <ProductVisual product={product} demoOnHover priority={priority} transitionName={`product-visual-${product.id}`} />

      <div className="relative px-3 pb-3 pt-5">
        {/* Title */}
        <div className="mb-2">
          <h3 className="text-xl font-bold text-white" style={{ viewTransitionName: `product-title-${product.id}` }}>{product.name}</h3>
          <p className="mt-1 text-sm text-gray-400">{product.tagline}</p>
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
    </TransitionLink>
  );
}
