import { LocalizedProduct } from '@/data/products';
import { SHOW_PRICING } from '@/lib/constants';
import ProductVisual from '@/components/ProductVisual';
import TransitionLink from '@/components/TransitionLink';
import { getTranslations } from 'next-intl/server';
import { hasLimitedFreeLicense } from '@/lib/software-licenses/offers';

interface ProductCardProps {
  product: LocalizedProduct;
  priority?: boolean;
  /**
   * 二十八宿标记（见 src/data/celestial.ts）。
   * 宿名现在是有语义的内容：产品页会在地图上解释它属于哪一象、第几宿。
   * 仍放在封面右上角，而不是标题行，避免挤占较长的产品名。
   */
  mansion?: string;
  /** 完整宿名标签；客星之类不在二十八宿正位时使用 */
  mansionLabel?: string;
  /** 该宿所属四象的短名，例如「青龙」「玄武」 */
  mansionSymbol?: string;
  /** 该宿在本象中的序号（从 1 开始） */
  mansionPosition?: number;
  /** 本象共几宿，通常为 7 */
  mansionTotal?: number;
  /** 该宿所属四象的配色，形如 "94 234 212" */
  mansionRgb?: string;
}

export default async function ProductCard({
  product,
  priority = false,
  mansion,
  mansionLabel,
  mansionSymbol,
  mansionPosition,
  mansionTotal = 7,
  mansionRgb,
}: ProductCardProps) {
  const t = await getTranslations('ProductsPage');
  const minPrice = SHOW_PRICING ? Math.min(...product.pricing.map(p => p.price)) : 0;

  return (
    <TransitionLink
      href={`/products/${product.id}`}
      className="glass-card group relative rounded-[1.75rem] p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgb(var(--site-glass-shadow)/0.22)]"
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

      <ProductVisual product={product} showDemo priority={priority} transitionName={`product-visual-${product.id}`} />

      {(mansion || mansionLabel) && mansionRgb && (
        <span
          className="absolute right-5 top-5 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/65 px-2.5 py-1.5 text-white shadow-lg shadow-black/20 backdrop-blur-md"
          style={{ borderColor: `rgb(${mansionRgb} / 0.32)` }}
          title={mansionLabel
            ? `${mansionSymbol ? `${mansionSymbol} · ` : ''}${mansionLabel}；星区标记，不是等级`
            : `${mansionSymbol ? `${mansionSymbol} · ` : ''}${mansion}宿${mansionPosition ? `（第 ${mansionPosition} 宿 / 共 ${mansionTotal} 宿）` : ''}；星区标记，不是等级`}
        >
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: `rgb(${mansionRgb})`, boxShadow: `0 0 8px rgb(${mansionRgb} / 0.6)` }}
          />
          {mansionSymbol && <span className="text-[10px] text-white/55">{mansionSymbol}</span>}
          <span className="text-[12px] font-semibold" style={{ color: `rgb(${mansionRgb})` }}>{mansionLabel ?? `${mansion}宿`}</span>
        </span>
      )}

      <div className="relative px-3 pb-3 pt-5">
        {/* Title */}
        <div className="mb-2 min-w-0">
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

        {/* Price / Coming soon */}
        {SHOW_PRICING && (
          <div className="flex items-baseline gap-1 border-t border-white/10 pt-4">
            {product.status === 'coming_soon' ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/15 px-3 py-1 text-xs font-semibold text-violet-300">
                <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-violet-400" />
                {t(product.experienceUrl ? 'trialAvailable' : 'comingSoon')}
              </span>
            ) : minPrice === 0 ? (
              <span className="text-success font-semibold">{t(hasLimitedFreeLicense(product) ? 'freeLifetimeClaim' : 'free')}</span>
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
