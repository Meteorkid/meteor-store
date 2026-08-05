import { and, eq, or } from 'drizzle-orm';
import { db } from './db';
import { orders } from './db/schema';
import { findProduct } from './products';

/**
 * 付费门控 / 「我的产品」共用：查询某用户已获得访问权的产品列表。
 *
 * 匹配规则：
 * - 优先按 userId（登录账号）匹配已支付订单；
 * - 兼容按下单邮箱匹配（历史订单没有 userId，或游客下单后绑定同邮箱账号），
 *   避免老用户/游客下单后登录账号看不到产品。
 *
 * 返回的每个条目含生效方案与产品元数据，供前端渲染「可直接使用」的入口。
 */
export type Entitlement = {
  productId: string;
  productName: string;
  planName: string;
  billingPeriod: string;
  paidAt: string | null;
};

export async function getUserEntitlements(userId: string, email: string): Promise<Entitlement[]> {
  const rows = await db
    .select({
      productId: orders.productId,
      planName: orders.planName,
      billingPeriod: orders.billingPeriod,
      paidAt: orders.paidAt,
    })
    .from(orders)
    .where(
      and(
        eq(orders.status, 'paid'),
        or(eq(orders.userId, userId), eq(orders.email, email)),
      ),
    );

  // 去重：同一产品的多个订单取最新一次，避免重复展示
  const latest = new Map<string, Entitlement>();
  for (const row of rows) {
    const product = findProduct(row.productId);
    const existing = latest.get(row.productId);
    if (!existing || (row.paidAt ?? '') > (existing.paidAt ?? '')) {
      latest.set(row.productId, {
        productId: row.productId,
        productName: product?.name.zh ?? row.productId,
        planName: row.planName,
        billingPeriod: row.billingPeriod,
        paidAt: row.paidAt,
      });
    }
  }

  return Array.from(latest.values());
}