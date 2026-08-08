import { S3Client } from '@aws-sdk/client-s3';

/**
 * Cloudflare R2 共享客户端（S3 兼容）。
 *
 * 被头像存储（avatar-storage）和博客图片存储（blog-image-storage）复用。
 * 客户端单例缓存：模块级 cachedClient，同一进程复用连接。
 *
 * 必要的环境变量：
 *   R2_ACCOUNT_ID        Cloudflare 账户 ID
 *   R2_ACCESS_KEY_ID     R2 token 的 Access Key ID
 *   R2_SECRET_ACCESS_KEY R2 token 的 Secret Access Key
 *   R2_BUCKET            公开 bucket 名（头像/博客图片，如 meteor-store）
 *   R2_PUBLIC_BASE       公开对象对外访问的 base URL，不要带末尾斜杠
 *
 * 安装包（releases/）不在公开 bucket，而是独立的私有 bucket
 * （R2_RELEASE_BUCKET），只通过预签名 URL 下载，见 readReleaseR2Config。
 */

export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicBase: string;
}

export function readR2Config(): R2Config | null {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;
  const publicBase = process.env.R2_PUBLIC_BASE;
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicBase) {
    return null;
  }
  return { accountId, accessKeyId, secretAccessKey, bucket, publicBase };
}

/** R2 是否已配置。未配置时调用方应降级到 data URL 入库或其他备用逻辑。 */
export function isR2Configured(): boolean {
  return readR2Config() !== null;
}

/**
 * 安装包（releases/）专用私有 bucket 配置。
 *
 * 复用公开 bucket 的同一账号凭证（S3 endpoint 相同），但指向独立的
 * R2_RELEASE_BUCKET。该 bucket 必须保持私有、不绑定公开域名、不开 r2.dev，
 * 否则预签名门控会被「对象本身公开」绕过。
 */
export interface ReleaseR2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
}

export function readReleaseR2Config(): ReleaseR2Config | null {
  const base = readR2Config();
  const releaseBucket = process.env.R2_RELEASE_BUCKET?.trim();
  if (!base || !releaseBucket) return null;
  return {
    accountId: base.accountId,
    accessKeyId: base.accessKeyId,
    secretAccessKey: base.secretAccessKey,
    bucket: releaseBucket,
  };
}

/** S3 客户端只需凭证与 endpoint，bucket 名在使用时按对象所属传入。 */
type R2Creds = Pick<R2Config, 'accountId' | 'accessKeyId' | 'secretAccessKey'>;

let cachedClient: S3Client | null = null;

export function getClient(cfg: R2Creds): S3Client {
  if (!cachedClient) {
    cachedClient = new S3Client({
      region: 'auto',
      endpoint: `https://${cfg.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: cfg.accessKeyId,
        secretAccessKey: cfg.secretAccessKey,
      },
    });
  }
  return cachedClient;
}
