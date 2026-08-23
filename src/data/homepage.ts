import { productDisplayOrderIds } from './product-order';

export const homeFeaturedProductIds = productDisplayOrderIds.slice(0, 6);

export function selectHomeFeaturedProducts<T extends { id: string }>(
  allProducts: readonly T[],
): T[] {
  const productsById = new Map(allProducts.map((product) => [product.id, product]));

  return homeFeaturedProductIds.map((id) => {
    const product = productsById.get(id);
    if (!product) {
      throw new Error(`未找到首页精选产品：${id}`);
    }
    return product;
  });
}
