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

  const updated = await db
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

  if ((updated.rowCount ?? 0) === 0) {
    return { success: false, error: '该邀请码已用完或被撤销' };
  }

  const redemptionId = randomUUID();
  const key = await createLicenseKey({
    orderId: `INV-${redemptionId}`,
    productId: invite.productId,
    planName: invite.planName,
    email: userEmail,
  });

  await db.insert(inviteRedemptions).values({
    id: redemptionId,
    inviteCodeId: invite.id,
    userId,
    licenseKey: key,
    redeemedAt: new Date().toISOString(),
  });

  return {
    success: true,
    licenseKey: key,
    productId: invite.productId,
    planName: invite.planName,
  };
}
