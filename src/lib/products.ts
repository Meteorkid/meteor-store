/**
 * 产品查询工具 — 从 src/data/products.ts 派生所有产品数据。
 * 支付 API、前端定价、订单验证统一从这里获取数据。
 */
import { products, type Product } from '@/data/products';

/**
 * 根据产品 ID 查找产品
 */
export function findProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

/**
 * 根据产品 ID 和方案名查找价格（返回元）
 */
export function findPrice(productId: string, planName: string): number | undefined {
  const product = findProduct(productId);
  if (!product) return undefined;
  const tier = product.pricing.find(
    (t) => t.name.toLowerCase() === planName.toLowerCase()
  );
  return tier?.price;
}

/**
 * 获取所有产品（供前端 API 使用）
 */
export function getAllProducts(): Product[] {
  return products;
}

/**
 * 根据产品 ID 获取所有方案名
 */
export function getPlanNames(productId: string): string[] {
  const product = findProduct(productId);
  if (!product) return [];
  return product.pricing.map((t) => t.name);
}
