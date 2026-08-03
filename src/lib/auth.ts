import { SignJWT, jwtVerify } from 'jose';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { db } from './db';
import { users } from './db/schema';

const COOKIE_NAME = 'ms_session';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  userId: string;
  email: string;
  name?: string;
  /** 只有邮箱已验证的账户才允许签发正式会话。 */
  emailVerified: true;
  /** 写入 JWT 的 token 版本号。改密等"踢掉其他会话"操作会递增它，
   *  getSession 比对 session 内的 tokenVersion 与数据库当前值，
   *  不一致则视为过期——所有旧设备上持有的 token 立即失效。 */
  tokenVersion?: number;
}

type DecodedSessionPayload = Omit<SessionPayload, 'emailVerified'> & {
  /** 兼容邮箱验证上线前签发的旧会话。 */
  emailVerified?: true;
};

export async function createSession(payload: SessionPayload): Promise<string> {
  if (payload.emailVerified !== true) {
    throw new Error('Cannot create a session for an unverified email');
  }

  const token = await new SignJWT({
    ...payload,
    tokenVersion: payload.tokenVersion ?? 0,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getSecret());

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  });

  return token;
}

/**
 * 读取会话。每次都校验数据库中的 tokenVersion 是否与会话内一致——
 * 这是"改密踢掉其他会话"的核心：旧 token 的 tokenVersion 落后于 DB，
 * 直接当作未登录处理。代价是每次 getSession 多一次主键查询，可接受。
 *
 * 数据库不可达时，只允许带 emailVerified 声明的新会话降级使用；
 * 不带该声明的旧会话 fail closed，避免未验证账户恢复正式身份。
 */
export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;

  let payload: DecodedSessionPayload;
  try {
    const verified = await jwtVerify(token, getSecret());
    payload = verified.payload as unknown as DecodedSessionPayload;
  } catch {
    return null;
  }

  // 校验 tokenVersion：与数据库当前值不一致则视为过期
  try {
    const [row] = await db
      .select({
        tokenVersion: users.tokenVersion,
        emailVerified: users.emailVerified,
      })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);
    if (!row) return null;
    if (payload.tokenVersion !== row.tokenVersion) return null;
    if (!row.emailVerified) return null;
    return { ...payload, emailVerified: true };
  } catch {
    // 身份边界必须 fail closed：旧 token 没有 emailVerified 声明时，
    // 数据库故障期间不能仅凭邮箱字符串恢复正式身份。
    if (payload.emailVerified !== true) return null;
    return payload as SessionPayload;
  }
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}
