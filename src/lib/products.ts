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
