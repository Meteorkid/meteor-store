import {
  DeleteObjectsCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { createHash } from 'crypto';
import sharp from 'sharp';
import {
  BLOG_IMAGE_RESERVATION_STALE_MS,
  confirmBlogImageReservation,
  discardBlogImageAllocation,
  getBlogImageLimitBytes,
  prepareBlogImageReservation,
  releaseBlogImageReservation,
  type BlogImageQuotaSnapshot,
} from './blog-image-quota';
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
  /** 上传后账户的最新配额快照 */
  quota: BlogImageQuotaSnapshot;
}

export type BlogImageUploadErrorCode =
  | 'storage_quota_exceeded'
  | 'image_upload_in_progress'
  | 'storage_unavailable';

export interface BlogImageUploadErrorDetails {
  usedBytes?: number;
  limitBytes?: number;
  requestedBytes?: number;
  retryAfter?: number;
}

const UPLOAD_ERROR_MESSAGES: Record<BlogImageUploadErrorCode, string> = {
  storage_quota_exceeded: 'Blog image storage quota exceeded',
  image_upload_in_progress: 'The same blog image is already being uploaded',
  storage_unavailable: 'Blog image storage is unavailable',
};

export class BlogImageUploadError extends Error {
  constructor(
    public readonly code: BlogImageUploadErrorCode,
    public readonly details?: BlogImageUploadErrorDetails,
  ) {
    super(UPLOAD_ERROR_MESSAGES[code]);
    this.name = 'BlogImageUploadError';
  }
}

export type BlogImageMime = 'image/webp' | 'image/jpeg' | 'image/png' | 'image/gif';

const EXT_MAP: Record<BlogImageMime, string> = {
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
};

const MIME_BY_FORMAT: Partial<Record<string, BlogImageMime>> = {
  webp: 'image/webp',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
};

function isMissingObject(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const candidate = error as { name?: string; $metadata?: { httpStatusCode?: number } };
  return candidate.name === 'NotFound'
    || candidate.name === 'NoSuchKey'
    || candidate.$metadata?.httpStatusCode === 404;
}

type BlogImageObjectState = 'matching' | 'missing' | 'mismatch' | 'unknown';

async function inspectBlogImageObject(
  client: ReturnType<typeof getClient>,
  bucket: string,
  key: string,
  expectedSizeBytes: number,
): Promise<BlogImageObjectState> {
  try {
    const object = await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return object.ContentLength === expectedSizeBytes ? 'matching' : 'mismatch';
  } catch (error) {
    return isMissingObject(error) ? 'missing' : 'unknown';
  }
}

/**
 * 校验图片字节本身，而不是信任 multipart 中可伪造的 Content-Type。
 * 40MP 上限用于拦截小体积、超大像素的解压炸弹；原始字节仍保留上传。
 */
export async function validateBlogImageBytes(
  bytes: Uint8Array,
  declaredMime: BlogImageMime,
): Promise<boolean> {
  if (bytes.byteLength === 0) return false;
  try {
    const metadata = await sharp(bytes, {
      animated: true,
      limitInputPixels: 40_000_000,
    }).metadata();
    return Boolean(
      metadata.width
      && metadata.height
      && metadata.format
      && MIME_BY_FORMAT[metadata.format] === declaredMime,
    );
  } catch {
    return false;
  }
}

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
  options: { isAdmin: boolean },
): Promise<BlogImageUploadResult> {
  const cfg = readR2Config();
  if (!cfg) throw new BlogImageUploadError('storage_unavailable');

  const ext = EXT_MAP[mime];
  const prefix = `blog/${encodeURIComponent(userId)}/`;
  const fullHash = createHash('sha256').update(bytes).digest('hex');
  const key = `${prefix}${fullHash}.${ext}`;
  const legacyKey = `${prefix}${fullHash.slice(0, 16)}.${ext}`;
  const limitBytes = getBlogImageLimitBytes(options.isAdmin);
  const client = getClient(cfg);

  let prepared: Awaited<ReturnType<typeof prepareBlogImageReservation>> | undefined;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      prepared = await prepareBlogImageReservation({
        userId,
        objectKey: key,
        legacyObjectKey: legacyKey,
        sizeBytes: bytes.byteLength,
        limitBytes,
      });
      const updatedAt = prepared.kind === 'in_progress'
        ? Date.parse(prepared.reservation.updatedAt)
        : Number.NaN;
      const stale = Number.isFinite(updatedAt)
        && updatedAt <= Date.now() - BLOG_IMAGE_RESERVATION_STALE_MS;
      if (
        attempt === 0
        && prepared.kind === 'in_progress'
        && stale
      ) {
        if (prepared.reservation.status === 'allocating') {
          await discardBlogImageAllocation({
            reservationId: prepared.reservation.id,
            userId,
            expectedUpdatedAt: prepared.reservation.updatedAt,
          });
          continue;
        } else {
          const objectState = await inspectBlogImageObject(
            client,
            cfg.bucket,
            prepared.reservation.key,
            prepared.reservation.sizeBytes,
          );
          if (objectState === 'matching') {
            const quota = await confirmBlogImageReservation({
              reservationId: prepared.reservation.id,
              userId,
              limitBytes,
            });
            if (!quota) throw new Error('Blog image reservation confirmation failed');
            return {
              url: `${cfg.publicBase}/${prepared.reservation.key}`,
              key: prepared.reservation.key,
              quota,
            };
          }
          if (objectState === 'missing') {
            const released = await releaseBlogImageReservation({
              reservationId: prepared.reservation.id,
              userId,
              limitBytes,
            });
            if (released) continue;
          }
          throw new Error('Blog image object state could not be verified');
        }
      }
      break;
    } catch (error) {
      console.error('blog image quota reservation failed:', error);
      throw new BlogImageUploadError('storage_unavailable');
    }
  }

  if (!prepared) throw new BlogImageUploadError('storage_unavailable');

  if (prepared.kind === 'ready') {
    return {
      url: `${cfg.publicBase}/${prepared.key}`,
      key: prepared.key,
      quota: prepared.quota,
    };
  }
  if (prepared.kind === 'quota_exceeded') {
    throw new BlogImageUploadError('storage_quota_exceeded', {
      usedBytes: prepared.quota.usedBytes,
      limitBytes: prepared.quota.limitBytes,
      requestedBytes: prepared.requestedBytes,
    });
  }
  if (prepared.kind === 'in_progress') {
    throw new BlogImageUploadError('image_upload_in_progress', {
      retryAfter: prepared.retryAfter,
    });
  }

  let objectReadyForConfirmation = false;
  try {
    await client.send(
      new PutObjectCommand({
        Bucket: cfg.bucket,
        Key: prepared.reservation.key,
        Body: bytes,
        ContentType: mime,
        // 博客图片读取频率低但更新后需要快速生效，给 1 小时缓存
        CacheControl: 'public, max-age=3600',
      }),
    );
    objectReadyForConfirmation = true;
  } catch {
    const objectState = await inspectBlogImageObject(
      client,
      cfg.bucket,
      prepared.reservation.key,
      prepared.reservation.sizeBytes,
    );
    if (objectState === 'matching') {
      objectReadyForConfirmation = true;
    }
  }
  if (!objectReadyForConfirmation) {
    throw new BlogImageUploadError('storage_unavailable');
  }

  let quota: BlogImageQuotaSnapshot | null;
  try {
    quota = await confirmBlogImageReservation({
      reservationId: prepared.reservation.id,
      userId,
      limitBytes,
    });
  } catch (error) {
    console.error('blog image upload confirmation failed:', error);
    throw new BlogImageUploadError('storage_unavailable');
  }
  if (!quota) throw new BlogImageUploadError('storage_unavailable');

  return {
    url: `${cfg.publicBase}/${prepared.reservation.key}`,
    key: prepared.reservation.key,
    quota,
  };
}

/** 账户注销时删除该用户前缀下的博客图片；失败保留孤儿对象供后续清理。 */
export async function deleteUserBlogImages(userId: string): Promise<void> {
  const cfg = readR2Config();
  if (!cfg) return;

  const client = getClient(cfg);
  const prefix = `blog/${encodeURIComponent(userId)}/`;
  let continuationToken: string | undefined;

  try {
    do {
      const page = await client.send(new ListObjectsV2Command({
        Bucket: cfg.bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      }));
      const objects = (page.Contents ?? [])
        .flatMap((object) => object.Key ? [{ Key: object.Key }] : []);
      if (objects.length > 0) {
        const deleted = await client.send(new DeleteObjectsCommand({
          Bucket: cfg.bucket,
          Delete: { Objects: objects },
        }));
        if ((deleted.Errors?.length ?? 0) > 0) {
          console.error('deleteUserBlogImages partial failure:', {
            failedObjects: deleted.Errors?.length ?? 0,
          });
        }
      }
      continuationToken = page.IsTruncated ? page.NextContinuationToken : undefined;
    } while (continuationToken);
  } catch (error) {
    console.error('deleteUserBlogImages failed (orphan cleanup needed):', error);
  }
}
