import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { isAdminSession } from '@/lib/admin';
import { isR2Configured } from '@/lib/r2-client';
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

const MAX_BYTES = 5_000_000; // 5MB
const MAX_MULTIPART_BYTES = MAX_BYTES + 256_000;

const ALLOWED_MIMES: BlogImageMime[] = [
  'image/webp',
  'image/jpeg',
  'image/png',
  'image/gif',
];

/**
 * 博客图片上传接口。
 *
 * 接受 multipart/form-data，field name 为 "file"。
 * 返回 { url, quota }，其中 url 供前端拼入 Markdown。
 *
 * 安全：
 * - 必须登录
 * - 限流：两条上传入口合计每用户每分钟 10 次、全站每分钟 30 次
 * - 单实例最多同时处理 4 张图片，避免 multipart 与 Sharp 并发挤爆内存
 * - MIME 与大小校验在服务端做，不信任客户端
 */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  const uploadLimit = await checkBlogImageUploadRateLimit(session.userId);
  if (uploadLimit.limited) {
    const retryAfter = Math.max(1, Math.ceil((uploadLimit.resetAt - Date.now()) / 1000));
    return NextResponse.json(
      { error: '上传太频繁，请稍后再试', code: 'rate_limited' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    );
  }

  if (!isR2Configured()) {
    return NextResponse.json(
      { error: '对象存储未配置，请联系管理员', code: 'storage_unavailable' },
      { status: 503 },
    );
  }

  const releaseUploadSlot = acquireBlogImageUploadSlot();
  if (!releaseUploadSlot) {
    return NextResponse.json(
      { error: '图片上传服务繁忙，请稍后再试', code: 'upload_busy' },
      { status: 429, headers: { 'Retry-After': '1' } },
    );
  }

  try {
    const parsedForm = await readLimitedFormData(req, MAX_MULTIPART_BYTES);
    if (!parsedForm.ok) {
      return NextResponse.json(
        { error: parsedForm.reason === 'too_large' ? '图片大小不能超过 5MB' : '请求格式不正确' },
        { status: parsedForm.reason === 'too_large' ? 413 : 400 },
      );
    }

    const file = parsedForm.formData.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: '请选择图片文件' }, { status: 400 });
    }

    if (!ALLOWED_MIMES.includes(file.type as BlogImageMime)) {
      return NextResponse.json(
        { error: '仅支持 WebP / JPEG / PNG / GIF 格式' },
        { status: 400 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: '图片大小不能超过 5MB' },
        { status: 413 },
      );
    }

    let bytes: Uint8Array;
    try {
      bytes = new Uint8Array(await file.arrayBuffer());
      if (!(await validateBlogImageBytes(bytes, file.type as BlogImageMime))) {
        return NextResponse.json({ error: '文件内容与图片格式不匹配' }, { status: 400 });
      }
    } catch (error) {
      console.error('blog image processing failed:', error);
      return NextResponse.json({ error: '图片处理失败，请稍后重试' }, { status: 500 });
    }

    try {
      const result = await uploadBlogImage(
        session.userId,
        bytes,
        file.type as BlogImageMime,
        { isAdmin: isAdminSession(session) },
      );
      return NextResponse.json({ url: result.url, quota: result.quota });
    } catch (error) {
      if (error instanceof BlogImageUploadError) {
        if (error.code === 'storage_quota_exceeded') {
          return NextResponse.json(
            { error: '账户图片存储空间已用完', code: error.code, details: error.details ?? {} },
            { status: 413 },
          );
        }
        if (error.code === 'image_upload_in_progress') {
          const retryAfter = error.details?.retryAfter ?? 2;
          return NextResponse.json(
            { error: '相同图片正在上传，请稍后重试', code: error.code, details: error.details ?? {} },
            { status: 409, headers: { 'Retry-After': String(retryAfter) } },
          );
        }
      }
      console.error('blog image upload failed:', error);
      return NextResponse.json(
        { error: '图片存储暂不可用，请稍后重试', code: 'storage_unavailable' },
        { status: 503 },
      );
    }
  } finally {
    releaseUploadSlot();
  }
}
