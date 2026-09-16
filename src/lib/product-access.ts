import { isAppId } from '@/data/app-manifest';
import type { Product } from '@/data/products';

/** 已获取产品的入口由真实交付方式决定，桌面产品不能进入站内应用挂载页。 */
export function getProductAccess(
  product: Pick<Product, 'id' | 'experienceUrl' | 'downloads'>,
): { href: string; action: 'launch' | 'download' | 'viewProduct' } {
  if (product.experienceUrl) {
    return { href: product.experienceUrl, action: 'launch' };
  }
  if (isAppId(product.id)) {
    return { href: `/apps/${product.id}`, action: 'launch' };
  }
  if (product.downloads?.some((download) => download.icon !== 'github')) {
    return { href: `/products/${product.id}#download`, action: 'download' };
  }
  return { href: `/products/${product.id}`, action: 'viewProduct' };
}
