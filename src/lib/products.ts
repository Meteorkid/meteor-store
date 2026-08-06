/**
 * 产品查询工具 — 从 src/data/products.ts 派生所有产品数据。
 * 支付 API、前端定价、订单验证统一从这里获取数据。
 */
import { products, type Product } from '@/data/products';
import { PASS_NAME, PASS_PRODUCT_ID } from '@/data/pass';
import type { LocalizedText } from '@/data/blog-sections';

/**
 * 根据产品 ID 查找产品
 *
 * 只认真实产品，**不认 Meteor Pass**：产品列表页、产品详情页、sitemap、
 * /apps/{id} 都走这里，Pass 混进来会凭空多出一个打不开的「产品」。
 * 需要覆盖订单里可能出现的 id 时用 findPurchasable。
 */
export function findProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

/** 订单/授权码里可能出现的售卖对象：真实产品，或全站会员 Meteor Pass */
export interface Purchasable {
  id: string;
  name: LocalizedText;
}

/**
 * 按订单里的 productId 查名字，覆盖真实产品与 Meteor Pass。
 * 订单页、成功页、确认邮件用这个——它们要展示的是「买了什么」，Pass 也是其中一种。
 */
export function findPurchasable(id: string): Purchasable | undefined {
  if (id === PASS_PRODUCT_ID) return { id: PASS_PRODUCT_ID, name: PASS_NAME };
  return findProduct(id);
}
