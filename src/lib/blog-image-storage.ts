import { PutObjectCommand } from '@aws-sdk/client-s3';
import { createHash } from 'crypto';
import { readR2Config, getClient } from './r2-client';

/**
 * 博客图片对象存储（Cloudflare R2，S3 兼容）。
 *
 * 设计：
 * - 复用头像存储的 R2 客户端（r2-client.ts），key 前缀用 blog/ 区分
 * - key = blog/{userId}/{内容哈希}.{ext}，同一用户上传相同图片幂等覆盖
 * - 不做删除接口：博客图片 URL 写进 Markdown 后就和文章绑定，
 *   替换/删除图片会导致历史文章裂图。孤儿对象靠后续清理脚本处理
 * - 站主文章（content/blog/*.md）也可以通过同一接口上传图片，拿到 URL 后在本地写
 */

export interface BlogImageUploadResult {
  /** 写入 Markdown 的公开 URL */
  url: string;
  /** 对象在 bucket 内的 key */
  key: string;
}

export type BlogImageMime = 'image/webp' | 'image/jpeg' | 'image/png' | 'image/gif';

const EXT_MAP: Record<BlogImageMime, string> = {
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
};

/**
 * 上传博客图片到 R2。
 * 调用方负责：鉴权、限流、MIME 与大小校验。
 *
 * @param userId  用户 ID，作为 key 前缀，便于按用户清理
 * @param bytes   图片字节
 * @param mime    MIME 类型
 */
export async function uploadBlogImage(
  userId: string,
  bytes: Uint8Array,
  mime: BlogImageMime,
): Promise<BlogImageUploadResult> {
  const cfg = readR2Config();
  if (!cfg) throw new Error('R2 not configured');

  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 16);
  const ext = EXT_MAP[mime];
  const key = `blog/${encodeURIComponent(userId)}/${hash}.${ext}`;

  const client = getClient(cfg);
  await client.send(
    new PutObjectCommand({
      Bucket: cfg.bucket,
      Key: key,
      Body: bytes,
      ContentType: mime,
      // 博客图片读取频率低但更新后需要快速生效，给 1 小时缓存
      CacheControl: 'public, max-age=3600',
    }),
  );

  return {
    url: `${cfg.publicBase}/${key}`,
    key,
  };
}
