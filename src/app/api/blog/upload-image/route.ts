import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { isR2Configured } from '@/lib/r2-client';
import { uploadBlogImage, type BlogImageMime } from '@/lib/blog-image-storage';

const MAX_BYTES = 5_000_000; // 5MB

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
 * 返回 { url } 供前端拼入 Markdown。
 *
 * 安全：
 * - 必须登录
 * - 限流：每用户每分钟 10 次（一篇博客可能有多张图）
 * - MIME 与大小校验在服务端做，不信任客户端
 */
export async function POST(req: NextRequest) {
  if (!isR2Configured()) {
    return NextResponse.json(
      { error: '对象存储未配置，请联系管理员' },
      { status: 503 },
    );
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  const ip = getClientIp(req);
  const { limited } = await rateLimit(
    `blog-image-upload:${session.userId}:${ip}`,
    10,
    60_000,
    { fallback: 'memory' },
  );
  if (limited) {
    return NextResponse.json({ error: '上传太频繁，请稍后再试' }, { status: 429 });
  }

  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: '请求格式不正确' }, { status: 400 });
  }

  const file = formData.get('file');
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
      { status: 400 },
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());

  try {
    const result = await uploadBlogImage(
      session.userId,
      bytes,
      file.type as BlogImageMime,
    );
    return NextResponse.json({ url: result.url });
  } catch (err) {
    console.error('blog image upload failed:', err);
    return NextResponse.json(
      { error: '图片上传失败，请稍后重试' },
      { status: 500 },
    );
  }
}
