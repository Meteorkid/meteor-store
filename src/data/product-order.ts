export const productDisplayOrderIds = [
  'ex-memory',
  'xisland',
  'xnook',
  'statux',
  'tollow',
  'skeleton-anatomy',
  'webgl-fluid-sim',
  'omnicrawl',
  'ui-design-system',
  'chakra-visualizer',
  'claude-phone-control',
  'cursor-source-analyzer',
] as const;

export function selectProductsInDisplayOrder<T extends { id: string }>(
  allProducts: readonly T[],
): T[] {
  const productsById = new Map(allProducts.map((product) => [product.id, product]));

  return productDisplayOrderIds.map((id) => {
    const product = productsById.get(id);
    if (!product) {
      throw new Error(`未找到展示产品：${id}`);
    }
    return product;
  });
}
