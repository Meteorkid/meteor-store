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
 *   R2_BUCKET            bucket 名（如 meteor-store）
 *   R2_PUBLIC_BASE       对象对外公开访问的 base URL，不要带末尾斜杠
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

let cachedClient: S3Client | null = null;

export function getClient(cfg: R2Config): S3Client {
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
