import { SignJWT, jwtVerify } from 'jose';

/**
 * 「记住此设备」令牌。
 *
 * 开了两步验证的账号，在已信任的浏览器上登录只要密码，不再挑战 TOTP。
 * 换设备、换浏览器、清 cookie 都会重新要求动态码——攻击者用的本来就是新设备，
 * 这正是这条豁免几乎不损失安全性的原因。
 *
 * 与 session / MFA 挑战 / 邮箱验证严格隔离：独立的派生密钥 + audience，
 * 任何一种令牌都不能拿去冒充另一种。
 *
 * 绑定 tokenVersion，所以**改密码会一次性作废全部受信任设备**——
 * 与全站「改密踢掉其他会话」是同一套语义，也是唯一的批量撤销手段。
 * 注意：重新绑定 TOTP 不会作废已信任设备，需要清空时改一次密码。
 */

export const TRUSTED_DEVICE_COOKIE = 'ms_trusted_device';
export const TRUSTED_DEVICE_MAX_AGE = 60 * 60 * 24 * 30; // 30 天

const ISSUER = 'meteor-store';
const AUDIENCE = 'trusted-device';

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return new TextEncoder().encode(`${secret}:trusted-device`);
}

export function trustedDeviceCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: TRUSTED_DEVICE_MAX_AGE,
    path: '/',
  };
}

export async function createTrustedDeviceToken(
  userId: string,
  tokenVersion: number,
): Promise<string> {
  return new SignJWT({ tokenVersion, typ: AUDIENCE })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${TRUSTED_DEVICE_MAX_AGE}s`)
    .sign(getSecret());
}

/**
 * 该浏览器是否是这个用户已信任的设备。
 * 用户不匹配（同一浏览器换人登录）或 tokenVersion 落后（改过密码）都判为不可信。
 */
export async function isTrustedDeviceToken(
  token: string | undefined,
  userId: string,
  tokenVersion: number,
): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    return (
      payload.typ === AUDIENCE &&
      payload.sub === userId &&
      payload.tokenVersion === tokenVersion
    );
  } catch {
    return false;
  }
}
