/**
 * 微信公众号（订阅号 / 服务号）草稿箱能力的服务端配置。
 *
 * 刻意不复用 WECHAT_APPID / WECHAT_WEB_APPSECRET：
 * - WECHAT_APPID 是微信支付商户号关联的 AppID，没有配套的公众号 AppSecret；
 * - WECHAT_WEB_APPSECRET 属于开放平台「网站应用」扫码登录，与公众号 API 不通用。
 * 拿错凭据的典型症状是 40001 / 40125，且报错信息不会告诉你拿错了。
 */

export interface WechatMpConfig {
  appId: string;
  appSecret: string;
}

export function readWechatMpConfig(): WechatMpConfig | null {
  const appId = process.env.WECHAT_MP_APPID?.trim();
  const appSecret = process.env.WECHAT_MP_APPSECRET?.trim();
  if (!appId || !appSecret) return null;
  return { appId, appSecret };
}

/**
 * 构造换取 access_token 的查询参数。
 * 凭据只在这个文件里从 env 取出，HTTP 层不接触原始 AppSecret。
 */
export function buildTokenParams(): URLSearchParams | null {
  const config = readWechatMpConfig();
  if (!config) return null;
  return new URLSearchParams({
    grant_type: 'client_credential',
    appid: config.appId,
    secret: config.appSecret,
  });
}

export function isWechatMpConfigured(): boolean {
  return readWechatMpConfig() !== null;
}

/**
 * 当前只走草稿箱，不调用 freepublish/submit。
 *
 * 微信官方《发布能力》文档（最后编辑 2026-03-05）：
 * 「2025 年 7 月起，个人主体账号、企业主体未认证账号及不支持认证的账号
 * 将被回收以上接口的调用权限」（调用返回 48001）。
 * 草稿箱 draft/add 对这些账号仍然开放，因此自动化边界是：
 * 排版 / 封面 / 图片转存全自动，最后一下「发表」在公众号后台人工完成。
 */
export const WECHAT_MP_MODE = 'draft-only' as const;
export type WechatMpMode = typeof WECHAT_MP_MODE;

/** 建好草稿后让管理员去这里点发表 */
export const WECHAT_MP_BACKEND_URL = 'https://mp.weixin.qq.com/';

/** 正文里图片的占位符前缀；上传成功后按序号整串替换，不做 HTML 解析 */
export const IMAGE_PLACEHOLDER_PREFIX = 'WECHAT_MP_IMAGE_';

export function imagePlaceholder(index: number): string {
  return `${IMAGE_PLACEHOLDER_PREFIX}${index}_`;
}
