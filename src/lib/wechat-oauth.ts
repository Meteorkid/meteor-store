// 微信开放平台「网站应用」OAuth 扫码登录。
//
// 与微信支付（lib/wechat.ts）刻意分离：扫码登录必须用开放平台网站应用的
// appid/secret，而支付的 WECHAT_APPID 可能是公众号/小程序的，混用会直接登录失败。
// appid 未单独配置时回退 WECHAT_APPID，secret 必须显式配 WECHAT_WEB_APPSECRET。

const AUTHORIZE_URL = 'https://open.weixin.qq.com/connect/qrconnect';
const ACCESS_TOKEN_URL = 'https://api.weixin.qq.com/sns/oauth2/access_token';
const USERINFO_URL = 'https://api.weixin.qq.com/sns/userinfo';

export function getWechatOAuthAppId(): string {
  return (process.env.WECHAT_WEB_APPID || process.env.WECHAT_APPID || '').trim();
}

export function isWechatOAuthConfigured(): boolean {
  return Boolean(getWechatOAuthAppId() && process.env.WECHAT_WEB_APPSECRET);
}

export function buildWechatAuthorizeUrl(state: string, redirectUri: string): string {
  const params = new URLSearchParams({
    appid: getWechatOAuthAppId(),
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'snsapi_login',
    state,
  });
  return `${AUTHORIZE_URL}?${params.toString()}#wechat_redirect`;
}

export interface WechatOAuthToken {
  openid: string;
  unionid?: string;
  accessToken: string;
}

export async function exchangeWechatCode(
  code: string,
): Promise<{ data: WechatOAuthToken | null; error: string | null }> {
  const params = new URLSearchParams({
    appid: getWechatOAuthAppId(),
    secret: (process.env.WECHAT_WEB_APPSECRET || '').trim(),
    code,
    grant_type: 'authorization_code',
  });

  let body: Record<string, unknown> | null = null;
  try {
    const res = await fetch(`${ACCESS_TOKEN_URL}?${params.toString()}`, { cache: 'no-store' });
    body = (await res.json()) as Record<string, unknown>;
  } catch {
    return { data: null, error: '微信登录服务不可用，请稍后再试' };
  }

  // 微信错误也返回 HTTP 200，成功与否要看 errcode / openid 是否存在
  if (!body || typeof body.openid !== 'string' || typeof body.errcode === 'number') {
    return { data: null, error: String(body?.errmsg || '微信登录失败，请重试') };
  }

  return {
    data: {
      openid: body.openid,
      unionid: typeof body.unionid === 'string' && body.unionid ? body.unionid : undefined,
      accessToken: typeof body.access_token === 'string' ? body.access_token : '',
    },
    error: null,
  };
}

export interface WechatUserInfo {
  nickname: string;
  headimgurl: string;
}

/**
 * 尽力而为地拉取昵称/头像，失败不阻断登录（openid 已足够完成身份识别）。
 * 注意：头像目前只取不用——头像落库要过 R2，外链微信 CDN 会被 CSP 拦下。
 */
export async function fetchWechatUserInfo(
  accessToken: string,
  openid: string,
): Promise<WechatUserInfo | null> {
  if (!accessToken) return null;
  try {
    const params = new URLSearchParams({ access_token: accessToken, openid, lang: 'zh_CN' });
    const res = await fetch(`${USERINFO_URL}?${params.toString()}`, { cache: 'no-store' });
    const body = (await res.json()) as Record<string, unknown>;
    if (!body || typeof body.nickname !== 'string') return null;
    return {
      nickname: body.nickname,
      headimgurl: typeof body.headimgurl === 'string' ? body.headimgurl : '',
    };
  } catch {
    return null;
  }
}
