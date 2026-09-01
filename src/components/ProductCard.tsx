import { LocalizedProduct } from '@/data/products';
import { SHOW_PRICING } from '@/lib/constants';
import ProductVisual from '@/components/ProductVisual';
import TransitionLink from '@/components/TransitionLink';
import { getTranslations } from 'next-intl/server';

interface ProductCardProps {
  product: LocalizedProduct;
  priority?: boolean;
  /**
   * 二十八宿标记（见 src/data/celestial.ts）。纯装饰，故 aria-hidden。
   * 放在标题行**内部**而不是探出卡片上沿——`.glass-card` 有 overflow: hidden，
   * 负偏移的徽标会被裁掉一半（要探出得加 .glass-card-badge-safe）。
   */
  mansion?: string;
  /** 该宿所属四象的配色，形如 "94 234 212" */
  mansionRgb?: string;
}

export default async function ProductCard({ product, priority = false, mansion, mansionRgb }: ProductCardProps) {
  const t = await getTranslations('ProductsPage');
  const minPrice = SHOW_PRICING ? Math.min(...product.pricing.map(p => p.price)) : 0;

  return (
    <TransitionLink
      href={`/products/${product.id}`}
      className="glass-card group relative rounded-[1.75rem] p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(91,33,182,0.22)]"
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

      <ProductVisual product={product} showDemo priority={priority} transitionName={`product-visual-${product.id}`} />

      <div className="relative px-3 pb-3 pt-5">
        {/* Title */}
        <div className="mb-2 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-white" style={{ viewTransitionName: `product-title-${product.id}` }}>{product.name}</h3>
            <p className="mt-1 text-sm text-gray-400">{product.tagline}</p>
          </div>
          {mansion && mansionRgb && (
            <span
              aria-hidden="true"
              className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border text-[13px] font-medium tracking-normal"
              style={{
                borderColor: `rgb(${mansionRgb} / 0.3)`,
                color: `rgb(${mansionRgb} / 0.9)`,
                background: `rgb(${mansionRgb} / 0.07)`,
              }}
            >
              {mansion}
            </span>
          )}
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {product.platforms.slice(0, 3).map((platform) => (
            <span key={platform} className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-gray-400">
              {platform}
            </span>
          ))}
        </div>

        {/* Price / Coming soon */}
        {SHOW_PRICING && (
          <div className="flex items-baseline gap-1 border-t border-white/10 pt-4">
            {product.status === 'coming_soon' ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/15 px-3 py-1 text-xs font-semibold text-violet-300">
                <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-violet-400" />
                {t('comingSoon')}
              </span>
            ) : minPrice === 0 ? (
              <span className="text-success font-semibold">{t('free')}</span>
            ) : (
              <>
                <span className="text-2xl font-bold text-card-foreground">¥{minPrice}</span>
                <span className="text-muted-foreground text-sm">{t('from')}</span>
              </>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="mt-4 flex items-center gap-2 text-violet-300 transition-colors group-hover:text-violet-200">
          <span className="text-sm font-medium">{t('viewDetails')}</span>
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
