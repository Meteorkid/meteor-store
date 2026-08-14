import { SignJWT, jwtVerify } from 'jose';
import { eq } from 'drizzle-orm';
import { db } from './db';
import { users } from './db/schema';
import {
  decryptTotpSecret,
  encryptTotpSecret,
  generateRecoveryCodes,
  generateTotpSecret,
  hashRecoveryCode,
  verifyTotp,
} from './totp';

/**
 * 管理端 MFA 的服务层：
 * - 登录挑战 ticket：密码验证通过但 TOTP 未过时签发的短期 JWT（5 分钟），
 *   audience 与正式 session / 邮箱验证派生密钥严格隔离
 * - 恢复码存 SHA-256 哈希数组，验证成功即从数组中移除（一次性）
 */

const ISSUER = 'meteor-store';
const CHALLENGE_AUDIENCE = 'mfa-challenge';
const CHALLENGE_EXPIRY = 5 * 60;

interface MfaChallengePayload {
  userId: string;
  email: string;
  name?: string;
  tokenVersion: number;
}

function getChallengeSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return new TextEncoder().encode(`${secret}:mfa-challenge`);
}

export async function createMfaChallengeTicket(payload: MfaChallengePayload): Promise<string> {
  return new SignJWT({
    email: payload.email,
    name: payload.name,
    tokenVersion: payload.tokenVersion,
    typ: CHALLENGE_AUDIENCE,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(ISSUER)
    .setAudience(CHALLENGE_AUDIENCE)
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime(`${CHALLENGE_EXPIRY}s`)
    .sign(getChallengeSecret());
}

export async function readMfaChallengeTicket(token: string): Promise<MfaChallengePayload | null> {
  try {
    const { payload } = await jwtVerify(token, getChallengeSecret(), {
      issuer: ISSUER,
      audience: CHALLENGE_AUDIENCE,
    });
    if (
      payload.typ !== CHALLENGE_AUDIENCE ||
      typeof payload.sub !== 'string' ||
      typeof payload.email !== 'string' ||
      typeof payload.tokenVersion !== 'number'
    ) {
      return null;
    }
    return {
      userId: payload.sub,
      email: payload.email,
      name: typeof payload.name === 'string' ? payload.name : undefined,
      tokenVersion: payload.tokenVersion,
    };
  } catch {
    return null;
  }
}

export async function getUserTotpState(userId: string): Promise<{
  enabled: boolean;
  hasPendingSecret: boolean;
}> {
  const [row] = await db
    .select({
      totpEnabled: users.totpEnabled,
      totpSecretEnc: users.totpSecretEnc,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!row) return { enabled: false, hasPendingSecret: false };
  return { enabled: row.totpEnabled, hasPendingSecret: Boolean(row.totpSecretEnc) };
}

/** 写入待验证的 secret（未启用）。返回明文 secret 供前端展示二维码，仅此一次。 */
export async function setupTotp(userId: string): Promise<string> {
  const secret = generateTotpSecret();
  await db
    .update(users)
    .set({ totpSecretEnc: encryptTotpSecret(secret), totpEnabled: false })
    .where(eq(users.id, userId));
  return secret;
}

/**
 * 启用 TOTP：验证码必须匹配当前存储的 secret。
 * 成功后生成 10 个恢复码（明文仅此一次返回），库里只存哈希。
 */
export async function enableTotp(
  userId: string,
  code: string,
): Promise<{ recoveryCodes: string[] } | null> {
  const [row] = await db
    .select({ totpSecretEnc: users.totpSecretEnc, totpEnabled: users.totpEnabled })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!row?.totpSecretEnc) return null;

  const secret = decryptTotpSecret(row.totpSecretEnc);
  if (!secret) return null;
  if (!verifyTotp(secret, code)) return null;

  const recoveryCodes = generateRecoveryCodes();
  const hashed = recoveryCodes.map((c) => hashRecoveryCode(c));

  // 条件更新：仍处于「有 secret 且未启用」状态才生效，防并发重复启用
  const updated = await db
    .update(users)
    .set({
      totpEnabled: true,
      totpRecoveryCodes: JSON.stringify(hashed),
    })
    .where(eq(users.id, userId))
    .returning({ id: users.id });
  if (updated.length === 0) return null;

  return { recoveryCodes };
}

/** 关闭 TOTP：需要当前有效的 TOTP 码或一个未用过的恢复码。 */
export async function disableTotp(userId: string, code: string): Promise<boolean> {
  const ok = await verifyUserTotpOrRecoveryCode(userId, code);
  if (!ok) return false;

  await db
    .update(users)
    .set({
      totpEnabled: false,
      totpSecretEnc: null,
      totpRecoveryCodes: null,
    })
    .where(eq(users.id, userId));
  return true;
}

/**
 * 验证用户的 TOTP 码或恢复码。
 * 恢复码命中即消耗（从数组移除）；TOTP 命中不动恢复码。
 */
export async function verifyUserTotpOrRecoveryCode(
  userId: string,
  code: string,
): Promise<boolean> {
  const [row] = await db
    .select({
      totpEnabled: users.totpEnabled,
      totpSecretEnc: users.totpSecretEnc,
      totpRecoveryCodes: users.totpRecoveryCodes,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!row?.totpEnabled || !row.totpSecretEnc) return false;

  const secret = decryptTotpSecret(row.totpSecretEnc);
  if (secret && verifyTotp(secret, code)) return true;

  // 尝试恢复码（大小写/空格不敏感，规范形 XXXX-XXXX）
  const normalized = code.trim().toUpperCase().replace(/\s+/g, '');
  if (!/^[A-Z2-9]{4}-?[A-Z2-9]{4}$/.test(normalized)) return false;
  const canonical = normalized.includes('-')
    ? normalized
    : `${normalized.slice(0, 4)}-${normalized.slice(4)}`;
  const hash = hashRecoveryCode(canonical);

  if (row.totpRecoveryCodes) {
    let hashes: string[] = [];
    try {
      hashes = JSON.parse(row.totpRecoveryCodes) as string[];
    } catch {
      return false;
    }
    const idx = hashes.indexOf(hash);
    if (idx !== -1) {
      hashes.splice(idx, 1);
      await db
        .update(users)
        .set({ totpRecoveryCodes: JSON.stringify(hashes) })
        .where(eq(users.id, userId));
      return true;
    }
  }
  return false;
}
