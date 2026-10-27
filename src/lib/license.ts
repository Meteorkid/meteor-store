import { randomInt, randomUUID } from 'crypto';
import { and, eq } from 'drizzle-orm';
import { db } from './db';
import { licenseKeys } from './db/schema';

/**
 * 生成 License Key
 * 格式：MC-XXXX-XXXX-XXXX-XXXX（前缀 + 4组4字符）
 * 使用 crypto.randomInt 保证密码学安全
 */
function generateKey(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 去掉 I/O/0/1 避免混淆
  const group = () =>
    Array.from({ length: 4 }, () => chars[randomInt(chars.length)]).join('');
  return `MC-${group()}-${group()}-${group()}-${group()}`;
}

/** 创建唯一 License Key（幂等：同一订单只创建一个） */
export async function createLicenseKey(data: {
  orderId: string;
  productId: string;
  planName: string;
  email: string;
}): Promise<string> {
  // 先查已有 key（幂等保护）
  const existing = await db.select().from(licenseKeys).where(eq(licenseKeys.orderId, data.orderId)).limit(1);
  if (existing.length > 0) return existing[0].key;

  for (let attempt = 0; attempt < 5; attempt++) {
    const [created] = await db.insert(licenseKeys).values({
      id: randomUUID(), ...data, key: generateKey(), status: 'active', createdAt: new Date().toISOString(),
    }).onConflictDoNothing().returning({ key: licenseKeys.key });
    if (created) return created.key;
    // 付款回调和账户补码可能同时创建同一父授权；唯一约束决定赢家，重读其码即可。
    const [winner] = await db.select({ key: licenseKeys.key }).from(licenseKeys).where(eq(licenseKeys.orderId, data.orderId)).limit(1);
    if (winner) return winner.key;
    // 没有同订单记录说明只是随机码/主键碰撞，重新生成，不能覆盖既有授权。
  }
  throw new Error('License key generation failed: too many collisions');
}

/** 通过订单 ID 查询 License Key */
export async function getLicenseKeyByOrderId(orderId: string) {
  const [result] = await db.select().from(licenseKeys).where(eq(licenseKeys.orderId, orderId)).limit(1);
  return result || null;
}

/** 仅删除调用方刚创建且尚未交付的授权码，用于无事务流程的失败补偿。 */
export async function removeLicenseKey(orderId: string, expectedKey: string): Promise<boolean> {
  const result = await db
    .delete(licenseKeys)
    .where(and(eq(licenseKeys.orderId, orderId), eq(licenseKeys.key, expectedKey)));
  return (result.rowCount ?? 0) > 0;
}
