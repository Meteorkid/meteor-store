import crypto from 'crypto';
import { and, eq } from 'drizzle-orm';
import { db } from './db';
import {
  inviteCodes,
  inviteRedemptions,
  licenseKeys,
  orders,
  passReminders,
  users,
} from './db/schema';
import { PASS_PRODUCT_ID } from '@/data/pass';
import { accumulatePass, type Grant } from './entitlements';
import { sendPassExpiryReminder } from './email';

/**
 * Meteor Pass 到期提醒。
 *
 * Pass 只有月付 / 年付会到期，买断（lifetime）是永久的。支付宝走的是单次付款
 * 不是代扣，到期是**静默失效**——用户不会收到任何提示，等发现时访问权已经没了。
 * 这个服务在到期前一段时间（默认 7 天）给用户发一封提醒邮件，把「还剩几天、怎么续费」
 * 说清楚，避免到期后才发现引发纠纷。
 *
 * 幂等性由 pass_reminders 表保证：按 (email, expiresAt) 唯一索引去重，同一个到期日
 * 只发一次。续费后到期日顺延，才会触发新的提醒。
 *
 * 只提醒「还有效但即将到期」的 Pass；已过期的（静默失效已发生）不在这里补发——
 * 那是另一种通知，且可能已过期多日，补发反而像骚扰。
 */
export interface PassExpiryReminderResult {
  checked: number;
  reminded: number;
  skipped: number;
}

/** 找出所有「即将到期」且「还没提醒过」的候选，按 (email, expiresAt) 去重 */
async function findPendingCandidates(
  now: Date,
  windowMs: number,
): Promise<{ ordersChecked: number; candidates: Array<{ email: string; expiresAt: string }> }> {
  const passOrders = await db
    .select({
      id: orders.id,
      email: orders.email,
      grantedAt: orders.paidAt,
      billingPeriod: orders.billingPeriod,
      licenseStatus: licenseKeys.status,
      deliveryStatus: orders.deliveryStatus,
    })
    .from(orders)
    .leftJoin(licenseKeys, eq(licenseKeys.orderId, orders.id))
    .where(and(eq(orders.productId, PASS_PRODUCT_ID), eq(orders.status, 'paid')));

  // 邀请码兑换的 Pass 不写 orders（orderId 是 INV-{redemptionId}），
  // 只落 license_keys + invite_redemptions。不查这里，兑换的月付/年付 Pass
  // 到期就会静默失效、没有任何提醒。档位在 invite_codes.plan_id，起算时间用 redeemedAt。
  const passInvites = await db
    .select({
      id: inviteRedemptions.id,
      email: users.email,
      grantedAt: inviteRedemptions.redeemedAt,
      planId: inviteCodes.planId,
      licenseStatus: licenseKeys.status,
    })
    .from(inviteRedemptions)
    .innerJoin(inviteCodes, eq(inviteRedemptions.inviteCodeId, inviteCodes.id))
    .innerJoin(users, eq(inviteRedemptions.userId, users.id))
    .innerJoin(licenseKeys, eq(licenseKeys.key, inviteRedemptions.licenseKey))
    .where(and(eq(inviteCodes.productId, PASS_PRODUCT_ID), eq(licenseKeys.status, 'active')));

  const byEmail = new Map<string, Map<string, Grant>>();
  const nowTime = now.getTime();

  const collect = (id: string, email: string, planKey: string | null, grantedAt: string | null) => {
    const owner = email.trim().toLowerCase();
    const grants = byEmail.get(owner) ?? new Map<string, Grant>();
    grants.set(id, { productId: PASS_PRODUCT_ID, planName: planKey ?? '', planId: planKey,
      billingPeriod: planKey ?? '', grantedAt, passPlanKey: planKey });
    byEmail.set(owner, grants);
  };

  for (const order of passOrders) {
    // 与 entitlements 保持相同的交付窗口规则。
    if (order.deliveryStatus === 'emailed' && order.licenseStatus !== 'active') continue;
    collect(`order:${order.id}`, order.email, order.billingPeriod, order.grantedAt);
  }

  for (const invite of passInvites) {
    if (invite.licenseStatus !== 'active') continue;
    collect(`invite:${invite.id}`, invite.email, invite.planId, invite.grantedAt);
  }

  const candidates: Array<{ email: string; expiresAt: string }> = [];
  for (const [email, grants] of byEmail) {
    const coverage = accumulatePass([...grants.values()]);
    if (!coverage || coverage.lifetime || !coverage.expiresAt) continue;
    const expiresAt = new Date(coverage.expiresAt).getTime();
    if (expiresAt > nowTime && expiresAt <= nowTime + windowMs) candidates.push({ email, expiresAt: coverage.expiresAt });
  }
  return { ordersChecked: passOrders.length + passInvites.length, candidates };
}

/**
 * 扫描所有仍有效的 Pass 订单，找出到期日在 [now, now+windowMs] 内的，
 * 对每个用户去重后发提醒邮件。返回本轮检查/提醒/跳过的数量。
 *
 * @param now 基准时间（便于测试注入）
 * @param windowMs 到期时间窗，默认 7 天
 */
export async function notifyExpiringPasses(
  now: Date = new Date(),
  windowMs: number = 7 * 24 * 60 * 60 * 1000,
): Promise<PassExpiryReminderResult> {
  const { ordersChecked, candidates } = await findPendingCandidates(now, windowMs);

  // 已提醒过的 (email, expiresAt)，避免重复插入
  if (candidates.length === 0) {
    return { checked: ordersChecked, reminded: 0, skipped: 0 };
  }

  const existing = await db
    .select({ email: passReminders.email, expiresAt: passReminders.expiresAt })
    .from(passReminders);
  const existingSet = new Set(
    existing.map((row) => `${row.email.toLowerCase()}::${row.expiresAt}`),
  );

  let reminded = 0;
  let skipped = 0;

  for (const candidate of candidates) {
    const key = `${candidate.email.toLowerCase()}::${candidate.expiresAt}`;
    if (existingSet.has(key)) {
      skipped += 1;
      continue;
    }

    await sendPassExpiryReminder({ email: candidate.email, expiresAt: candidate.expiresAt });
    await db.insert(passReminders).values({
      id: crypto.randomUUID(),
      email: candidate.email,
      expiresAt: candidate.expiresAt,
      sentAt: now.toISOString(),
    });
    reminded += 1;
  }

  return { checked: ordersChecked, reminded, skipped };
}
