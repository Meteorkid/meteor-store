import { products, type Product } from '@/data/products';
import type { Locale } from '@/i18n/routing';
import { isSoftwareLicensingEnabled } from './config';
import { SOFTWARE_PRODUCT_IDS } from './types';

type OfferProduct = Pick<Product, 'id' | 'status'> & {
  pricing: Pick<Product['pricing'][number], 'price' | 'originalPrice' | 'period'>[];
};

export function hasLimitedFreeLicense(product: OfferProduct): boolean {
  return isSoftwareLicensingEnabled() && product.status !== 'coming_soon'
    && SOFTWARE_PRODUCT_IDS.some(id => id === product.id)
    && product.pricing.some(plan => plan.price === 0 && (plan.originalPrice ?? 0) > 0 && plan.period === '买断');
}

export function currentFreeLicenseOffers(locale: Locale) {
  return products.filter(hasLimitedFreeLicense).map(product => ({ id: product.id, name: product.name[locale] }));
}
