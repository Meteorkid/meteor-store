import { authenticateBlogApiRequest } from '@/lib/blog-api-auth';
import { blogApiAuthError, blogApiError, blogApiSuccess } from '@/lib/blog-api-response';
import {
  BlogImageUploadError,
  uploadBlogImage,
  validateBlogImageBytes,
  type BlogImageMime,
} from '@/lib/blog-image-storage';
import {
  acquireBlogImageUploadSlot,
  checkBlogImageUploadRateLimit,
} from '@/lib/blog-image-upload-guard';
import { readLimitedFormData } from '@/lib/limited-form-data';
import { isR2Configured } from '@/lib/r2-client';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

const MAX_BYTES = 5_000_000;
const MAX_MULTIPART_BYTES = MAX_BYTES + 256_000;
const ALLOWED_MIMES: BlogImageMime[] = [
  'image/webp',
  'image/jpeg',
  'image/png',
  'image/gif',
];

function retryAfter(resetAt: number): number {
  return Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const preAuthLimit = await rateLimit(`blog-api-auth:${ip}`, 300, 60_000, {
    fallback: 'memory',
  });
  if (preAuthLimit.limited) {
    return blogApiError(429, 'rate_limited', '请求过于频繁', {
      retryAfter: retryAfter(preAuthLimit.resetAt),
    });
  }

  const auth = await authenticateBlogApiRequest(request, 'blog:image');
  if (!auth.ok) return blogApiAuthError(auth.reason);

  const imageLimit = await checkBlogImageUploadRateLimit(auth.actor.userId);
  if (imageLimit.limited) {
    return blogApiError(429, 'rate_limited', '图片上传过于频繁', {
      retryAfter: retryAfter(imageLimit.resetAt),
    });
  }

  if (!isR2Configured()) {
    return blogApiError(503, 'storage_unavailable', '图片存储暂不可用');
  }

  const releaseUploadSlot = acquireBlogImageUploadSlot();
  if (!releaseUploadSlot) {
    return blogApiError(429, 'upload_busy', '图片上传服务繁忙，请稍后再试', {
      retryAfter: 1,
    });
  }

  try {
    const parsedForm = await readLimitedFormData(request, MAX_MULTIPART_BYTES);
    if (!parsedForm.ok) {
      if (parsedForm.reason === 'too_large') {
        return blogApiError(413, 'invalid_image', '图片大小不能超过 5MB');
      }
      return blogApiError(400, 'invalid_request', '请求格式不正确');
    }

    const file = parsedForm.formData.get('file');
    if (!(file instanceof File)) {
      return blogApiError(400, 'invalid_request', '请选择图片文件');
    }
    if (!ALLOWED_MIMES.includes(file.type as BlogImageMime)) {
      return blogApiError(415, 'invalid_image', '仅支持 WebP / JPEG / PNG / GIF 格式');
    }
    if (file.size > MAX_BYTES) {
      return blogApiError(413, 'invalid_image', '图片大小不能超过 5MB');
    }

    let bytes: Uint8Array;
    try {
      bytes = new Uint8Array(await file.arrayBuffer());
      if (!(await validateBlogImageBytes(bytes, file.type as BlogImageMime))) {
        return blogApiError(415, 'invalid_image', '文件内容与图片格式不匹配');
      }
    } catch (error) {
      console.error('blog api image processing failed:', error);
      return blogApiError(500, 'internal_error', '图片上传失败');
    }

    try {
      const result = await uploadBlogImage(
        auth.actor.userId,
        bytes,
        file.type as BlogImageMime,
        { isAdmin: auth.actor.isAdmin },
      );
      return blogApiSuccess({ url: result.url, quota: result.quota }, { status: 201 });
    } catch (error) {
      if (error instanceof BlogImageUploadError) {
        if (error.code === 'storage_quota_exceeded') {
          return blogApiError(413, error.code, '账户图片存储空间已用完', {
            details: error.details ? { ...error.details } : undefined,
          });
        }
        if (error.code === 'image_upload_in_progress') {
          return blogApiError(409, error.code, '相同图片正在上传，请稍后重试', {
            details: error.details ? { ...error.details } : undefined,
            retryAfter: error.details?.retryAfter ?? 2,
          });
        }
      }
      console.error('blog api image storage failed:', error);
      return blogApiError(503, 'storage_unavailable', '图片存储暂不可用');
    }
  } finally {
    releaseUploadSlot();
  }
}
