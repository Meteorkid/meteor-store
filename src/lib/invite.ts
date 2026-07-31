import { randomInt, randomUUID } from 'crypto';
import { eq, and, sql } from 'drizzle-orm';
import { db } from './db';
import { inviteCodes, inviteRedemptions } from './db/schema';
import { createLicenseKey } from './license';

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const group = () =>
    Array.from({ length: 4 }, () => chars[randomInt(chars.length)]).join('');
  return `INV-${group()}-${group()}-${group()}`;
}

export async function createInviteCode(data: {
  productId: string;
  planName: string;
  maxUses?: number;
  memo?: string;
  expiresAt?: string;
  createdBy: string;
}): Promise<{ id: string; code: string }> {
  const id = randomUUID();
  let code = generateCode();

  let attempts = 0;
  while (attempts < 5) {
    const dup = await db
      .select({ id: inviteCodes.id })
      .from(inviteCodes)
      .where(eq(inviteCodes.code, code))
      .limit(1);
    if (dup.length === 0) break;
    code = generateCode();
    attempts++;
  }
  if (attempts >= 5) throw new Error('Invite code generation failed: too many collisions');

  await db.insert(inviteCodes).values({
    id,
    code,
    productId: data.productId,
    planName: data.planName,
    maxUses: data.maxUses ?? 1,
    usedCount: 0,
    memo: data.memo || null,
    expiresAt: data.expiresAt || null,
    createdBy: data.createdBy,
    status: 'active',
    createdAt: new Date().toISOString(),
  });

  return { id, code };
}

export async function listInviteCodes() {
  return db
    .select()
    .from(inviteCodes)
    .orderBy(sql`${inviteCodes.createdAt} DESC`);
}

export async function revokeInviteCode(id: string): Promise<boolean> {
  const result = await db
    .update(inviteCodes)
    .set({ status: 'revoked' })
    .where(and(eq(inviteCodes.id, id), eq(inviteCodes.status, 'active')));
  return (result.rowCount ?? 0) > 0;
}

/**
 * 原子释放之前已经 +1 的 usedCount。Neon HTTP 驱动不支持事务，
 * 失败步骤靠这个补偿函数尽量回滚，避免用户白白丢一次名额。
 * 补偿本身失败时不再抛错——属于运维侧通过日志关注的情况。
 */
async function releaseQuota(inviteCodeId: string) {
  try {
    await db
      .update(inviteCodes)
      .set({ usedCount: sql`GREATEST(${inviteCodes.usedCount} - 1, 0)` })
      .where(and(eq(inviteCodes.id, inviteCodeId)));
  } catch (err) {
    console.error('releaseQuota failed (manual review needed):', err);
  }
}

export async function redeemInviteCode(
  code: string,
  userId: string,
  userEmail: string,
): Promise<{
  success: boolean;
  error?: string;
  licenseKey?: string;
  productId?: string;
  planName?: string;
}> {
  const [invite] = await db
    .select()
    .from(inviteCodes)
    .where(eq(inviteCodes.code, code.trim().toUpperCase()))
    .limit(1);

  if (!invite) return { success: false, error: '邀请码不存在' };
  if (invite.status !== 'active') return { success: false, error: '该邀请码不可用' };
  if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
    return { success: false, error: '该邀请码已过期' };
  }

  const [existing] = await db
    .select()
    .from(inviteRedemptions)
    .where(
      and(
        eq(inviteRedemptions.inviteCodeId, invite.id),
        eq(inviteRedemptions.userId, userId),
      ),
    )
    .limit(1);
  if (existing) return { success: false, error: '你已经使用过该邀请码' };

  // 1) 占用名额：原子条件更新，防止并发兑换超出 maxUses
  const occupy = await db
    .update(inviteCodes)
    .set({
      usedCount: sql`${inviteCodes.usedCount} + 1`,
      status: sql`CASE WHEN ${inviteCodes.usedCount} + 1 >= ${inviteCodes.maxUses} THEN 'exhausted' ELSE 'active' END`,
    })
    .where(
      and(
        eq(inviteCodes.id, invite.id),
        eq(inviteCodes.status, 'active'),
        sql`${inviteCodes.usedCount} < ${inviteCodes.maxUses}`,
      ),
    );

  if ((occupy.rowCount ?? 0) === 0) {
    // 这里可能是并发竞态：另一个请求刚好用完名额；也可能是真的已用完。
    // 重新查一次 redemption，看是不是本用户其实已经兑换过了。
    const [race] = await db
      .select()
      .from(inviteRedemptions)
      .where(
        and(
          eq(inviteRedemptions.inviteCodeId, invite.id),
          eq(inviteRedemptions.userId, userId),
        ),
      )
      .limit(1);
    if (race) return { success: false, error: '你已经使用过该邀请码' };
    return { success: false, error: '该邀请码已用完或被撤销' };
  }

  // 2) 创建 License Key。失败时必须释放名额，否则用户拿不到 key 又丢了名额。
  const redemptionId = randomUUID();
  let key: string;
  try {
    key = await createLicenseKey({
      orderId: `INV-${redemptionId}`,
      productId: invite.productId,
      planName: invite.planName,
      email: userEmail,
    });
  } catch (err) {
    console.error('createLicenseKey failed during redeem:', err);
    await releaseQuota(invite.id);
    return { success: false, error: '激活码生成失败，请稍后重试' };
  }

  // 3) 写入 redemption。unique(invite_code_id, user_id) 是并发保证——
  //    如果两个请求同时通过上面的 existing 检查，DB 在这里只允许一个成功。
  try {
    await db.insert(inviteRedemptions).values({
      id: redemptionId,
      inviteCodeId: invite.id,
      userId,
      licenseKey: key,
      redeemedAt: new Date().toISOString(),
    });
  } catch (err) {
    // unique 冲突（错误码 23505）说明并发赢了别人，把名额让出来
    console.error('insert redemption failed:', err);
    await releaseQuota(invite.id);
    return { success: false, error: '你已经使用过该邀请码' };
  }

  return {
    success: true,
    licenseKey: key,
    productId: invite.productId,
    planName: invite.planName,
  };
}
