import { and, eq, or } from 'drizzle-orm';
import { db } from './db';
import { inviteCodes, inviteRedemptions, licenseKeys, orders } from './db/schema';
import { products } from '@/data/products';
import {
  PASS_NAME,
  PASS_PRODUCT_ID,
  findPassPlan,
  getPassCoverage,
  type PassPlanId,
} from '@/data/pass';
import { findProduct } from './products';
import { isAdminEmail } from './admin';

/**
 * 付费门控 / 「我的产品」共用：查询某用户已获得访问权的产品列表。
 *
 * 授权有三个来源：
 * - 管理员直接拥有全部产品的访问权（无需购买），用于站长/管理员自测与内部使用；
 * - 已支付订单：优先按 userId（登录账号）匹配，同时兼容按下单邮箱匹配
 *   （历史订单没有 userId，或游客下单后绑定同邮箱账号），避免老用户看不到产品；
 * - 已兑换的邀请码：邀请码发的是授权码而不是订单，只查 orders 会让兑换过的用户
 *   拿到 key 却打不开应用。这里按 userId 关联兑换记录。
 *
 * **撤销授权码对两条来源都生效**：邀请码来源要求授权码 status='active'；
 * 订单来源仅在**已交付**（deliveryStatus='emailed'）时才要求，用交付状态区分出
 * 下单到发码之间的窗口期——卡在窗口期会把刚付完钱的人挡在门外。
 * 没有这一条的话，¥899 买断 Pass 的用户退款后，后台没有任何手段收回访问权。
 *
 * 其中 Meteor Pass（PASS_PRODUCT_ID）是全站会员：一条有效的 Pass 授权展开成
 * 全部产品的访问权，且**按档位计算有效期**（月付 1 个月、年付 12 个月、买断永久）。
 * 多条 Pass 授权会**按时间顺序叠加**，续费从「现有到期时间」起算而不是从付款时间起算，
 * 否则提前一周续费就白白吞掉那一周。单品授权优先于 Pass——自己买断的产品
 * 不该显示成「靠会员在用」。
 *
 * 注意：单品订单没有到期概念（历史行为，付了就一直可用），只有 Pass 会过期。
 */
export type Entitlement = {
  productId: string;
  productName: string;
  planName: string;
  billingPeriod: string;
  paidAt: string | null;
  /** 授权到期时间；null 表示不过期（单品购买、买断 Pass、管理员） */
  expiresAt: string | null;
  /** 该产品是靠全站会员放行的（UI 不要再追加计费周期后缀） */
  viaPass: boolean;
  /** Pass 档位；供 UI 本地化展示，非 Pass 来源为 null */
  passPlanId: PassPlanId | null;
};

export type EntitlementSummary = {
  entitlements: Entitlement[];
  /**
   * 曾经有过 Pass 但已经过期，值为到期时间；否则为 null。
   * 支付宝走的是单次付款不是代扣，到期是静默失效，
   * 「我的产品」靠这个字段把空态说成「Pass 已过期」而不是「你还没买过东西」。
   */
  passExpiredAt: string | null;
};

/** 归一化后的授权来源，订单与邀请码兑换共用一种形状 */
type Grant = {
  productId: string;
  planName: string;
  billingPeriod: string;
  grantedAt: string | null;
  /** 仅当 productId 是 Pass 时有意义：用于算有效期的档位键 */
  passPlanKey: string | null;
};

/** 累加后的 Pass 覆盖范围 */
type AccumulatedPass = {
  planId: PassPlanId | null;
  /** null 且 lifetime 为 false 表示每条授权都算不出覆盖范围 */
  expiresAt: string | null;
  lifetime: boolean;
  billingPeriod: string;
  grantedAt: string | null;
};

/**
 * 把多条 Pass 授权按发放时间顺序叠加成一段连续的有效期。
 * 续费的起算点取「现有到期时间」与「本次发放时间」里更晚的那个：
 * 提前续费应该顺延，过期后再买则从当次算起。
 */
function accumulatePass(grants: Grant[]): AccumulatedPass | null {
  if (grants.length === 0) return null;

  const sorted = [...grants].sort((a, b) => {
    const left = a.grantedAt ?? '';
    const right = b.grantedAt ?? '';
    return left < right ? -1 : left > right ? 1 : 0;
  });

  let expiresAt: string | null = null;
  let lifetime = false;
  let planId: PassPlanId | null = null;
  const last = sorted[sorted.length - 1];

  for (const grant of sorted) {
    const plan = findPassPlan(grant.passPlanKey);
    if (plan) planId = plan.id;
    if (lifetime) continue;

    const grantedAt = grant.grantedAt ?? '';
    const base = expiresAt !== null && grantedAt < expiresAt ? expiresAt : grant.grantedAt;
    const coverage = getPassCoverage(grant.passPlanKey, base);

    if (coverage.kind === 'lifetime') {
      lifetime = true;
      expiresAt = null;
      planId = 'lifetime';
    } else if (coverage.kind === 'until') {
      expiresAt = coverage.expiresAt;
    }
    // kind === 'unknown'：这条授权算不出覆盖范围，不叠加也不放行
  }

  return {
    planId,
    expiresAt,
    lifetime,
    billingPeriod: last.billingPeriod,
    grantedAt: last.grantedAt,
  };
}

export async function getUserEntitlementSummary(
  userId: string,
  email: string,
): Promise<EntitlementSummary> {
  // 管理员：所有产品全部放行，不需要购买
  if (isAdminEmail(email)) {
    return {
      entitlements: products.map((p) => ({
        productId: p.id,
        productName: p.name.zh,
        planName: '管理员',
        billingPeriod: 'lifetime',
        paidAt: null,
        expiresAt: null,
        viaPass: false,
        passPlanId: null,
      })),
      passExpiredAt: null,
    };
  }

  const [orderRows, inviteRows] = await Promise.all([
    db
      .select({
        productId: orders.productId,
        planName: orders.planName,
        billingPeriod: orders.billingPeriod,
        paidAt: orders.paidAt,
        deliveryStatus: orders.deliveryStatus,
        licenseStatus: licenseKeys.status,
      })
      .from(orders)
      // license_keys.order_id 有 unique 约束，leftJoin 保持 1:1，不会放大行数
      .leftJoin(licenseKeys, eq(licenseKeys.orderId, orders.id))
      .where(
        and(
          eq(orders.status, 'paid'),
          or(eq(orders.userId, userId), eq(orders.email, email)),
        ),
      ),
    db
      .select({
        productId: inviteCodes.productId,
        planId: inviteCodes.planId,
        planName: inviteCodes.planName,
        redeemedAt: inviteRedemptions.redeemedAt,
      })
      .from(inviteRedemptions)
      .innerJoin(inviteCodes, eq(inviteRedemptions.inviteCodeId, inviteCodes.id))
      .innerJoin(licenseKeys, eq(licenseKeys.key, inviteRedemptions.licenseKey))
      .where(
        and(
          eq(inviteRedemptions.userId, userId),
          eq(licenseKeys.status, 'active'),
        ),
      ),
  ]);

  const grants: Grant[] = [
    ...orderRows
      // 已发出授权码的订单，撤销授权码就等于收回访问权（退款场景）；
      // 尚未交付的订单处于窗口期，不能因为还没发码就把人挡在门外
      .filter((row) => row.deliveryStatus !== 'emailed' || row.licenseStatus === 'active')
      .map((row) => ({
        productId: row.productId,
        planName: row.planName,
        billingPeriod: row.billingPeriod,
        grantedAt: row.paidAt,
        // Pass 订单把档位存在 billing_period 里（monthly | annual | lifetime）
        passPlanKey: row.billingPeriod,
      })),
    ...inviteRows.map((row) => ({
      productId: row.productId,
      planName: row.planName,
      // 邀请码不产生计费；Pass 则沿用档位，好让「年付」等信息照常展示
      billingPeriod: row.productId === PASS_PRODUCT_ID ? row.planId : 'invite',
      grantedAt: row.redeemedAt,
      passPlanKey: row.planId,
    })),
  ];

  // 单品授权：同一产品的多条授权取最新一次
  const owned = new Map<string, Entitlement>();
  const passGrants: Grant[] = [];

  for (const grant of grants) {
    if (grant.productId === PASS_PRODUCT_ID) {
      passGrants.push(grant);
      continue;
    }
    const existing = owned.get(grant.productId);
    if (existing && (existing.paidAt ?? '') >= (grant.grantedAt ?? '')) continue;

    // 产品可能已下架/改名，此时保留原始 id 展示，不要整条丢掉
    const product = findProduct(grant.productId);
    owned.set(grant.productId, {
      productId: grant.productId,
      productName: product?.name.zh ?? grant.productId,
      planName: grant.planName,
      billingPeriod: grant.billingPeriod,
      paidAt: grant.grantedAt,
      expiresAt: null,
      viaPass: false,
      passPlanId: null,
    });
  }

  // Pass：叠加成一段连续有效期，展开成尚未被单品授权覆盖的全部产品
  const pass = accumulatePass(passGrants);
  const passActive =
    pass !== null &&
    (pass.lifetime ||
      (pass.expiresAt !== null && new Date(pass.expiresAt).getTime() > Date.now()));

  if (pass && passActive) {
    for (const product of products) {
      if (owned.has(product.id)) continue;
      owned.set(product.id, {
        productId: product.id,
        productName: product.name.zh,
        planName: PASS_NAME.zh,
        billingPeriod: pass.billingPeriod,
        paidAt: pass.grantedAt,
        expiresAt: pass.expiresAt,
        viaPass: true,
        passPlanId: pass.planId,
      });
    }
  }

  return {
    entitlements: Array.from(owned.values()),
    passExpiredAt: pass && !passActive ? pass.expiresAt : null,
  };
}

export async function getUserEntitlements(userId: string, email: string): Promise<Entitlement[]> {
  const { entitlements } = await getUserEntitlementSummary(userId, email);
  return entitlements;
}
