import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getClient, readR2Config } from './r2-client';

/**
 * 安装包分发（Cloudflare R2）—— 复用头像/博客图片那套 R2 配置与共享客户端。
 *
 * **付费产品的安装包不能走公开 URL**，也不能让 route handler 把文件读出来再吐给浏览器：
 * Vercel 的 serverless 响应体上限约 4.5MB，而 dmg 动辄几十 MB，代理转发必然失败。
 * 正确做法是服务端校验授权后签发一条**短时效预签名 URL**，让浏览器直连 R2 下载。
 * R2 出网流量免费，分发二进制的带宽成本为零。
 *
 * 免费公开的产品不用签名，直接挂 `R2_PUBLIC_BASE` 下的固定地址即可。
 */

/** 预签名链接有效期。够点一次下载，短到捡到链接也很快失效 */
const SIGNED_URL_TTL_SECONDS = 300;

/**
 * 安装包在 bucket 里的 key。带版本号，历史版本不会被新版覆盖——
 * 老用户手上的链接失效是另一回事，但已发布的构建产物不该被悄悄替换。
 */
export function releaseObjectKey(productId: string, version: string, fileName: string): string {
  return `releases/${productId}/${version}/${fileName}`;
}

/** 公开下载地址：免费产品用，无需签名 */
export function publicReleaseUrl(key: string): string | null {
  const cfg = readR2Config();
  if (!cfg) return null;
  return `${cfg.publicBase}/${key}`;
}

/**
 * 签发一条限时下载链接。
 *
 * `downloadFileName` 会写进 Content-Disposition，否则浏览器会拿 key 里那串路径当文件名。
 * 返回 null 表示 R2 未配置——调用方应当据此返回 503，而不是把错误当成「没有权限」。
 */
export async function createSignedReleaseUrl(
  key: string,
  downloadFileName: string,
): Promise<string | null> {
  const cfg = readR2Config();
  if (!cfg) return null;

  const command = new GetObjectCommand({
    Bucket: cfg.bucket,
    Key: key,
    ResponseContentDisposition: `attachment; filename="${encodeURIComponent(downloadFileName)}"`,
  });

  return getSignedUrl(getClient(cfg), command, { expiresIn: SIGNED_URL_TTL_SECONDS });
}

/** 上传安装包。只给 scripts/upload-release.mjs 用，网站本身不提供上传入口 */
export async function uploadRelease(
  key: string,
  body: Uint8Array,
  contentType: string,
): Promise<void> {
  const cfg = readR2Config();
  if (!cfg) throw new Error('R2 未配置，无法上传安装包');

  await getClient(cfg).send(
    new PutObjectCommand({
      Bucket: cfg.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
}

/** 按扩展名给出 Content-Type，主要是让 .dmg 带上 Apple 磁盘映像的正确类型 */
export function releaseContentType(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.dmg')) return 'application/x-apple-diskimage';
  if (lower.endsWith('.pkg')) return 'application/octet-stream';
  if (lower.endsWith('.zip')) return 'application/zip';
  if (lower.endsWith('.tar.gz') || lower.endsWith('.tgz')) return 'application/gzip';
  return 'application/octet-stream';
}
