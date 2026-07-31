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
  /** 写入 JWT 的 token 版本号。改密等"踢掉其他会话"操作会递增它，
   *  getSession 比对 session 内的 tokenVersion 与数据库当前值，
   *  不一致则视为过期——所有旧设备上持有的 token 立即失效。 */
  tokenVersion?: number;
}

export async function createSession(payload: SessionPayload): Promise<string> {
  const token = await new SignJWT({ ...payload })
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
 * 数据库不可达时（如 build 期占位 URL）回退为只解 token：开发者本地
 * 仍能登录，生产 DB 故障属于更严重的问题，由健康检查兜底。
 */
export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;

  let payload: SessionPayload;
  try {
    const verified = await jwtVerify(token, getSecret());
    payload = verified.payload as unknown as SessionPayload;
  } catch {
    return null;
  }

  // 校验 tokenVersion：与数据库当前值不一致则视为过期
  try {
    const [row] = await db
      .select({ tokenVersion: users.tokenVersion })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);
    if (!row) return null;
    if (payload.tokenVersion !== row.tokenVersion) return null;
  } catch {
    // DB 不可达：保留原 token 信息，避免运行环境故障期间误判全部下线
  }

  return payload;
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}
