import { authenticateBlogApiRequest } from '@/lib/blog-api-auth';
import { blogApiAuthError, blogApiError, blogApiSuccess } from '@/lib/blog-api-response';
import { markdownToHtml } from '@/lib/markdown';
import { getPostByAuthor } from '@/lib/posts';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

type RouteContext = { params: Promise<{ id: string }> };

function retryAfter(resetAt: number): number {
  return Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
}

export async function GET(request: Request, { params }: RouteContext) {
  const ip = getClientIp(request);
  const preAuthLimit = await rateLimit(`blog-api-auth:${ip}`, 300, 60_000, {
    fallback: 'memory',
  });
  if (preAuthLimit.limited) {
    return blogApiError(429, 'rate_limited', '请求过于频繁', {
      retryAfter: retryAfter(preAuthLimit.resetAt),
    });
  }

  const auth = await authenticateBlogApiRequest(request, 'blog:read');
  if (!auth.ok) return blogApiAuthError(auth.reason);

  const readLimit = await rateLimit(`blog-api-read:${auth.actor.userId}`, 120, 60_000, {
    fallback: 'memory',
  });
  if (readLimit.limited) {
    return blogApiError(429, 'rate_limited', '请求过于频繁', {
      retryAfter: retryAfter(readLimit.resetAt),
    });
  }

  try {
    const { id } = await params;
    const post = await getPostByAuthor(id, auth.actor.userId);
    if (!post) return blogApiError(404, 'post_not_found', '文章不存在');

    return blogApiSuccess({
      html: markdownToHtml(post.content),
      updatedAt: post.updatedAt,
      previewUrls: {
        zh: `/zh/blog/p/${post.id}`,
        en: `/en/blog/p/${post.id}`,
      },
    });
  } catch (error) {
    console.error('blog api preview post failed:', error);
    return blogApiError(500, 'internal_error', '生成预览失败');
  }
}
