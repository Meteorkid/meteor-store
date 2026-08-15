// 微信 OAuth 的 state 与绑定凭证。
//
// state：防 CSRF。签名 JWT 而非 Redis 存储——攻击者伪造不了签名，
// 一次性的 code 又天然防重放，无状态实现不引入 Redis 依赖。
// 绑定凭证：回调后新 openid 尚未归属任何账号时签发，短期有效（15 分钟），
// 只在绑定页消费；它只携带 openid 资料，单独持有它绑定不了任何账号。

import { SignJWT, jwtVerify } from 'jose';

const STATE_AUDIENCE = 'wechat-oauth-state';
const STATE_EXPIRY = 10 * 60;
const BIND_AUDIENCE = 'wechat-bind';
const BIND_EXPIRY = 15 * 60;

function getSecret(purpose: string): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return new TextEncoder().encode(`${secret}:${purpose}`);
}

export async function createWechatState(locale: 'zh' | 'en'): Promise<string> {
  return new SignJWT({ typ: STATE_AUDIENCE, locale })
    .setProtectedHeader({ alg: 'HS256' })
    .setAudience(STATE_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${STATE_EXPIRY}s`)
    .sign(getSecret('wechat-oauth-state'));
}

export async function consumeWechatState(state: string): Promise<'zh' | 'en' | null> {
  try {
    const { payload } = await jwtVerify(state, getSecret('wechat-oauth-state'), {
      audience: STATE_AUDIENCE,
    });
    if (payload.typ !== STATE_AUDIENCE || (payload.locale !== 'zh' && payload.locale !== 'en')) {
      return null;
    }
    return payload.locale;
  } catch {
    return null;
  }
}

export interface WechatBindIdentity {
  openid: string;
  unionid?: string;
  nickname?: string;
}

export async function createWechatBindToken(identity: WechatBindIdentity): Promise<string> {
  return new SignJWT({
    typ: BIND_AUDIENCE,
    openid: identity.openid,
    unionid: identity.unionid,
    nickname: identity.nickname,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setAudience(BIND_AUDIENCE)
    .setSubject(identity.openid)
    .setIssuedAt()
    .setExpirationTime(`${BIND_EXPIRY}s`)
    .sign(getSecret('wechat-bind'));
}

export async function readWechatBindToken(token: string): Promise<WechatBindIdentity | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret('wechat-bind'), {
      audience: BIND_AUDIENCE,
    });
    if (
      payload.typ !== BIND_AUDIENCE ||
      typeof payload.openid !== 'string' ||
      payload.openid !== payload.sub
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
