// OAuth state 与绑定凭证都必须匹配发起浏览器的短期 HttpOnly 事务 cookie。
// URL 中只携带随机事务的哈希，转发签名凭证不能复制浏览器的绑定权限。

import { createHash, randomBytes } from 'node:crypto';
import { SignJWT, jwtVerify } from 'jose';
import { normalizeLoginReturn } from '@/lib/login-return';

const STATE_AUDIENCE = 'wechat-oauth-state';
const STATE_EXPIRY = 10 * 60;
const BIND_AUDIENCE = 'wechat-bind';
const BIND_EXPIRY = 15 * 60;

export const WECHAT_STATE_COOKIE = 'ms_wechat_state';
export const WECHAT_BIND_COOKIE = 'ms_wechat_bind';

export function createWechatTransaction(): string {
  return randomBytes(32).toString('base64url');
}

export function wechatTransactionCookieOptions(stage: 'state' | 'bind') {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: stage === 'state' ? STATE_EXPIRY : BIND_EXPIRY,
    path: '/',
  };
}

function transactionHash(transaction: string): string {
  return createHash('sha256').update(transaction).digest('base64url');
}

function matchesTransaction(hash: unknown, transaction?: string): boolean {
  return typeof transaction === 'string' && /^[A-Za-z0-9_-]{43}$/.test(transaction) &&
    typeof hash === 'string' && hash === transactionHash(transaction);
}

function getSecret(purpose: string): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return new TextEncoder().encode(`${secret}:${purpose}`);
}

export interface WechatOAuthState {
  locale: 'zh' | 'en';
  next: string;
}

export async function createWechatState(
  locale: 'zh' | 'en',
  next: string | null | undefined,
  transaction: string,
): Promise<string> {
  return new SignJWT({
    typ: STATE_AUDIENCE,
    locale,
    next: normalizeLoginReturn(next),
    transactionHash: transactionHash(transaction),
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setAudience(STATE_AUDIENCE)
    .setJti(createWechatTransaction())
    .setIssuedAt()
    .setExpirationTime(`${STATE_EXPIRY}s`)
    .sign(getSecret('wechat-oauth-state'));
}

export async function consumeWechatState(state: string, transaction?: string): Promise<WechatOAuthState | null> {
  try {
    const { payload } = await jwtVerify(state, getSecret('wechat-oauth-state'), {
      audience: STATE_AUDIENCE,
    });
    if (
      payload.typ !== STATE_AUDIENCE || (payload.locale !== 'zh' && payload.locale !== 'en') ||
      typeof payload.jti !== 'string' || !matchesTransaction(payload.transactionHash, transaction)
    ) {
      return null;
    }
    return {
      locale: payload.locale,
      next: normalizeLoginReturn(typeof payload.next === 'string' ? payload.next : null),
    };
  } catch {
    return null;
  }
}

export interface WechatBindIdentity {
  openid: string;
  unionid?: string;
  nickname?: string;
}

export async function createWechatBindToken(identity: WechatBindIdentity, transaction: string): Promise<string> {
  return new SignJWT({
    typ: BIND_AUDIENCE,
    transactionHash: transactionHash(transaction),
    openid: identity.openid,
    unionid: identity.unionid,
    nickname: identity.nickname,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setAudience(BIND_AUDIENCE)
    .setJti(createWechatTransaction())
    .setSubject(identity.openid)
    .setIssuedAt()
    .setExpirationTime(`${BIND_EXPIRY}s`)
    .sign(getSecret('wechat-bind'));
}

export async function readWechatBindToken(token: string, transaction?: string): Promise<WechatBindIdentity | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret('wechat-bind'), {
      audience: BIND_AUDIENCE,
    });
    if (
      payload.typ !== BIND_AUDIENCE ||
      typeof payload.openid !== 'string' ||
      payload.openid !== payload.sub ||
      typeof payload.jti !== 'string' || !matchesTransaction(payload.transactionHash, transaction)
    ) {
      return null;
    }
    return {
      openid: payload.openid,
      unionid: typeof payload.unionid === 'string' && payload.unionid ? payload.unionid : undefined,
      nickname: typeof payload.nickname === 'string' && payload.nickname ? payload.nickname : undefined,
    };
  } catch {
    return null;
  }
}
