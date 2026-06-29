import { eq } from 'drizzle-orm';
import { db } from './db';
import { licenseKeys } from './db/schema';

/**
 * 生成 License Key
 * 格式：MC-XXXX-XXXX-XXXX-XXXX（前缀 + 4组4字符）
 */
function generateKey(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 去掉 I/O/0/1 避免混淆
  const group = () =>
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `MC-${group()}-${group()}-${group()}-${group()}`;
}

/** 创建唯一 License Key（保证不重复） */
export async function createLicenseKey(data: {
  orderId: string;
  productId: string;
  planName: string;
  email: string;
}): Promise<string> {
  let key = generateKey();
  let attempts = 0;

  // 极小概率碰撞，重试
  while (attempts < 5) {
    const existing = await db.select().from(licenseKeys).where(eq(licenseKeys.key, key)).limit(1);
    if (existing.length === 0) break;
    key = generateKey();
    attempts++;
  }

  const id = `LK${Date.now()}${Math.random().toString(36).slice(2, 6)}`;
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
