import { randomInt, randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';
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

  let key = generateKey();
  let attempts = 0;

  // 碰撞重试（极小概率）
  while (attempts < 5) {
    const dup = await db.select().from(licenseKeys).where(eq(licenseKeys.key, key)).limit(1);
    if (dup.length === 0) break;
    key = generateKey();
    attempts++;
  }
  if (attempts >= 5) throw new Error('License key generation failed: too many collisions');

  const id = randomUUID();
  await db.insert(licenseKeys).values({
    id,
    orderId: data.orderId,
    productId: data.productId,
    planName: data.planName,
    email: data.email,
    key,
    status: 'active',
    createdAt: new Date().toISOString(),
  });

  return key;
}

/** 通过订单 ID 查询 License Key */
export async function getLicenseKeyByOrderId(orderId: string) {
  const [result] = await db.select().from(licenseKeys).where(eq(licenseKeys.orderId, orderId)).limit(1);
  return result || null;
}
