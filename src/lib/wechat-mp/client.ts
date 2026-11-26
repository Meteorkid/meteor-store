import { buildTokenParams } from './config';

const API_BASE = 'https://api.weixin.qq.com';
const REQUEST_TIMEOUT_MS = 20_000;
const TOKEN_REFRESH_MARGIN_MS = 5 * 60 * 1000;

export class WechatMpError extends Error {
  constructor(
    message: string,
    readonly code: number | string,
    readonly hint?: string,
  ) {
    super(message);
    this.name = 'WechatMpError';
  }
}

export class WechatMpConfigError extends WechatMpError {
  constructor(message: string) {
    super(message, 'config_missing', '在服务器环境变量里配置公众号凭据，并把出口 IP 加入白名单。');
    this.name = 'WechatMpConfigError';
  }
}

const ERROR_HINTS: Record<number, string> = {
  40001: '凭据不正确，或误用了开放平台网站应用 / 微信支付的凭据。',
  40013: 'AppID 无效，请核对公众号后台的 AppID。',
  40125: '凭据无效，请在公众号后台重置后再试。',
  40164: '调用服务器的公网出口 IP 不在白名单里，请到公众号后台添加。',
  41001: '缺少调用凭证。',
  42001: '调用凭证已过期，重试一次即可。',
  48001: '接口未授权，个人主体 / 未认证账号无法调用发布类接口。',
  45009: '接口调用超过频率限制，请稍后重试。',
  40007: 'media_id 无效，封面永久素材可能已被删除。',
  40005: '文件类型不合法，封面和正文图片请只用 jpg / png / webp。',
  53404: '账号需要在公众号后台完成一次人工保存后才能使用草稿。',
};

function describeError(errcode: number, errmsg: string): WechatMpError {
  const hint = ERROR_HINTS[errcode];
  const message = `微信接口返回 ${errcode}${errmsg ? `：${errmsg}` : ''}`;
  return new WechatMpError(hint ? `${message}。${hint}` : message, errcode, hint);
}

interface TokenCache {
  token: string;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;
let tokenInFlight: Promise<string> | null = null;

export function resetAccessTokenCache(): void {
  tokenCache = null;
  tokenInFlight = null;
}

export async function getAccessToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now() + TOKEN_REFRESH_MARGIN_MS) {
    return tokenCache.token;
  }
  if (tokenInFlight) return tokenInFlight;
  const params = buildTokenParams();
  if (!params) throw new WechatMpConfigError('微信公众号草稿箱未配置');
  const url = new URL('/cgi-bin/token', API_BASE);
  url.search = params.toString();
  tokenInFlight = requestToken(url);
  try {
    return await tokenInFlight;
  } catch (error) {
    if (error instanceof WechatMpError && (error.code === 42001 || error.code === 40014)) {
      tokenCache = null;
    }
    throw error;
  } finally {
    tokenInFlight = null;
  }
}

async function requestToken(url: URL): Promise<string> {
  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  const data = await response.json() as { access_token?: string; expires_in?: number; errcode?: number; errmsg?: string };
  if (data.errcode) throw describeError(data.errcode, data.errmsg ?? '');
  if (!data.access_token) {
    throw new WechatMpError('微信未返回调用凭证', 'token_missing', '检查公众号后台的 AppID / AppSecret 是否一致。');
  }
  const ttl = Number.isFinite(data.expires_in) ? Number(data.expires_in) : 7200;
  tokenCache = { token: data.access_token, expiresAt: Date.now() + ttl * 1000 };
  return data.access_token;
}

interface CallOptions {
  method?: 'GET' | 'POST';
  query?: Record<string, string>;
  json?: unknown;
  form?: FormData;
  timeoutMs?: number;
}

const TOKEN_ERROR_CODES = new Set([40001, 40014, 42001]);

function isTokenError(error: unknown): error is WechatMpError {
  return error instanceof WechatMpError
    && typeof error.code === 'number'
    && TOKEN_ERROR_CODES.has(error.code);
}

/** 统一处理「HTTP 200 但 errcode 非 0」的微信响应 */
async function callApi<T>(path: string, options: CallOptions = {}): Promise<T> {
  const { method = 'GET', query, json, form, timeoutMs = REQUEST_TIMEOUT_MS } = options;

  const headers: Record<string, string> = {};
  let body: BodyInit | undefined;
  if (json !== undefined) {
    headers['Content-Type'] = 'application/json; charset=utf-8';
    body = JSON.stringify(json);
  } else if (form) {
    // 不要手动设置 Content-Type，fetch 需要自己带 multipart boundary
    body = form;
  }

  let token = await getAccessToken();

  // access_token 是全局唯一的：别的脚本刷新、或微信侧提前失效后，
  // 缓存里的旧 token 会让所有调用一起 401/40001。只重试一次，避免掩盖
  // 真正的凭据错误（40001 若来自错误 AppSecret，第二次仍会失败）。
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const url = new URL(path, API_BASE);
    url.searchParams.set('access_token', token);
    if (query) {
      for (const [key, value] of Object.entries(query)) url.searchParams.set(key, value);
    }

    try {
      let response: Response;
      try {
        response = await fetch(url, {
          method,
          headers,
          body,
          cache: 'no-store',
          signal: AbortSignal.timeout(timeoutMs),
        });
      } catch (error) {
        throw new WechatMpError(
          `请求微信接口失败：${error instanceof Error ? error.message : String(error)}`,
          'network_error',
          '确认服务器能访问 api.weixin.qq.com（443 出站），以及出口 IP 已加白名单。',
        );
      }

      let data: Record<string, unknown>;
      try {
        data = await response.json() as Record<string, unknown>;
      } catch {
        throw new WechatMpError(
          `微信接口返回了非 JSON 内容（HTTP ${response.status}）`,
          'invalid_response',
          '通常是网络被拦截或接口路径写错。',
        );
      }
      if (!response.ok) {
        throw new WechatMpError(`微信接口 HTTP ${response.status}`, response.status);
      }
      const errcode = typeof data.errcode === 'number' ? data.errcode : 0;
      if (errcode !== 0) {
        throw describeError(errcode, typeof data.errmsg === 'string' ? data.errmsg : '');
      }
      return data as T;
    } catch (error) {
      if (attempt === 0 && isTokenError(error)) {
        resetAccessTokenCache();
        token = await getAccessToken();
        continue;
      }
      throw error;
    }
  }

  throw new WechatMpError('微信调用凭证刷新后仍不可用', 'token_retry_exhausted');
}

export interface UploadedImage {
  bytes: Uint8Array;
  mime: string;
  filename: string;
}

function toFormData(image: UploadedImage): FormData {
  const form = new FormData();
  form.append('media', new Blob([new Uint8Array(image.bytes)], { type: image.mime }), image.filename);
  return form;
}

/** 正文图片：上传后返回微信域名下的 URL，不占永久素材配额 */
export async function uploadContentImage(image: UploadedImage): Promise<string> {
  const data = await callApi<{ url?: string }>('/cgi-bin/media/uploadimg', {
    method: 'POST',
    form: toFormData(image),
    timeoutMs: 30_000,
  });
  if (!data.url) throw new WechatMpError('正文图片上传成功但未返回 url', 'upload_no_url');
  return data.url;
}

/** 封面图：上传为永久素材，返回 draft/add 需要的 thumb_media_id */
export async function uploadPermanentImage(image: UploadedImage): Promise<string> {
  const data = await callApi<{ media_id?: string }>('/cgi-bin/material/add_material', {
    method: 'POST',
    query: { type: 'image' },
    form: toFormData(image),
    timeoutMs: 30_000,
  });
  if (!data.media_id) throw new WechatMpError('封面上传成功但未返回 media_id', 'upload_no_media_id');
  return data.media_id;
}

export interface WechatDraftArticle {
  title: string;
  author: string;
  digest: string;
  content: string;
  content_source_url: string;
  thumb_media_id: string;
  need_open_comment?: 0 | 1;
  only_fans_can_comment?: 0 | 1;
}

/** 新建图文草稿，返回草稿 media_id。个人主体账号也有此接口权限。 */
export async function addDraft(article: WechatDraftArticle): Promise<string> {
  const data = await callApi<{ media_id?: string }>('/cgi-bin/draft/add', {
    method: 'POST',
    json: { articles: [article] },
    timeoutMs: 30_000,
  });
  if (!data.media_id) throw new WechatMpError('草稿创建成功但未返回 media_id', 'draft_no_media_id');
  return data.media_id;
}
