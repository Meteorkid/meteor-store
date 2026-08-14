import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { createHash } from 'crypto';
import { readR2Config, isR2Configured, getClient } from './r2-client';

export { isR2Configured };

/**
 * 头像对象存储（Cloudflare R2，S3 兼容）。
 *
 * 设计：
 * - 客户端不直接持有 R2 写凭证。客户端先把 base64 上传到我们的 API，
 *   API 校验 + 缩放后再写到 R2，返回公开 URL 写入 users.avatarUrl。
 * - 对象 key 用 userId + 内容哈希，更换头像时新 key 与旧 key 不同，
 *   方便删除旧对象避免堆积。
 * - 未配置 R2 时 isR2Configured() 返回 false，调用方按 data URL 旧逻辑降级。
 */

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
 *
 * @param ownerUserId 头像归属人。key 必须落在 avatars/{ownerUserId}/ 前缀下，
 *   否则返回 null——profile 接口曾接受任意 https 头像地址，若不校验归属，
 *   把头像设成别人的 URL 再清空/替换，就会删掉别人的头像对象
 */
export function keyFromUrl(url: string, ownerUserId: string): string | null {
  const cfg = readR2Config();
  if (!cfg) return null;
  const base = cfg.publicBase.endsWith('/') ? cfg.publicBase.slice(0, -1) : cfg.publicBase;
  if (!url.startsWith(`${base}/`)) return null;
  const key = url.slice(base.length + 1);
  // 与 uploadAvatar 的 key 构造保持同一编码方式
  const ownerPrefix = `avatars/${encodeURIComponent(ownerUserId)}/`;
  if (!key.startsWith(ownerPrefix)) return null;
  return key;
}
