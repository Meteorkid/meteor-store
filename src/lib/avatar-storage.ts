import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { createHash } from 'crypto';

/**
 * 头像对象存储（Cloudflare R2，S3 兼容）。
 *
 * 设计：
 * - 客户端不直接持有 R2 写凭证。客户端先把 base64 上传到我们的 API，
 *   API 校验 + 缩放后再写到 R2，返回公开 URL 写入 users.avatarUrl。
 * - 对象 key 用 userId + 内容哈希，更换头像时新 key 与旧 key 不同，
 *   方便删除旧对象避免堆积。
 * - 未配置 R2 时 isR2Configured() 返回 false，调用方按 data URL 旧逻辑降级。
 *
 * 必要的环境变量：
 *   R2_ACCOUNT_ID        Cloudflare 账户 ID
 *   R2_ACCESS_KEY_ID     R2 token 的 Access Key ID
 *   R2_SECRET_ACCESS_KEY R2 token 的 Secret Access Key
 *   R2_BUCKET            bucket 名（如 meteor-store）
 *   R2_PUBLIC_BASE       对象对外公开访问的 base URL，例如
 *                        https://cdn.imagentx.top（绑定到 bucket 的自定义域名），
 *                        不要带末尾斜杠
 */

interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicBase: string;
}

function readR2Config(): R2Config | null {
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

/** R2 是否已配置。未配置时调用方应降级到 data URL 入库。 */
export function isR2Configured(): boolean {
  return readR2Config() !== null;
}

let cachedClient: S3Client | null = null;
function getClient(cfg: R2Config): S3Client {
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

export interface UploadResult {
  /** 写入 users.avatarUrl 的 URL */
  url: string;
  /** 对象在 bucket 内的 key，删除时用 */
  key: string;
}

/**
 * 上传头像到 R2。
 * 调用方负责：鉴权、限流、MIME 与大小校验、图片缩放。
 *
 * @param userId  用户 ID，作为 key 前缀，便于按用户清理
 * @param bytes   图片字节
 * @param mime    MIME 类型，目前限定 image/webp | image/jpeg | image/png
 */
export async function uploadAvatar(
  userId: string,
  bytes: Uint8Array,
  mime: 'image/webp' | 'image/jpeg' | 'image/png',
): Promise<UploadResult> {
  const cfg = readR2Config();
  if (!cfg) throw new Error('R2 not configured');

  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 16);
  const ext = mime === 'image/webp' ? 'webp' : mime === 'image/jpeg' ? 'jpg' : 'png';
  const key = `avatars/${encodeURIComponent(userId)}/${hash}.${ext}`;

  const client = getClient(cfg);
  await client.send(
    new PutObjectCommand({
      Bucket: cfg.bucket,
      Key: key,
      Body: bytes,
      ContentType: mime,
      // 头像更新频率低但读取频率高，给一年长缓存
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  );

  return {
    url: `${cfg.publicBase}/${key}`,
    key,
  };
}

/** 删除对象。失败仅记录日志——孤儿对象不影响功能，靠后续清理。 */
export async function deleteAvatar(key: string): Promise<void> {
  const cfg = readR2Config();
  if (!cfg) return;
  try {
    const client = getClient(cfg);
    await client.send(
      new DeleteObjectCommand({
        Bucket: cfg.bucket,
        Key: key,
      }),
    );
  } catch (err) {
    console.error('deleteAvatar failed (orphan will need cleanup):', err);
  }
}

/**
 * 从完整 URL 反解出 key，用于删除旧头像。
 * 只识别本 bucket 的 base URL，外链或 data URL 返回 null。
 */
export function keyFromUrl(url: string, fallbackPrefix = 'avatars/'): string | null {
  const cfg = readR2Config();
  if (!cfg) return null;
  const base = cfg.publicBase.endsWith('/') ? cfg.publicBase.slice(0, -1) : cfg.publicBase;
  if (!url.startsWith(`${base}/`)) return null;
  // decodeURIComponent 反转上传时的编码
  const key = url.slice(base.length + 1);
  // 安全兜底：只允许头像前缀，避免误删其他对象
  if (!key.startsWith(fallbackPrefix)) return null;
  return key;
}
