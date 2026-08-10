import { authenticateBlogApiRequest } from '@/lib/blog-api-auth';
import { blogApiAuthError, blogApiError, blogApiSuccess } from '@/lib/blog-api-response';
import { withdrawPost } from '@/lib/posts';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

type RouteContext = { params: Promise<{ id: string }> };

function retryAfter(resetAt: number): number {
  return Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
}

function previewUrls(id: string) {
  return { zh: `/zh/blog/p/${id}`, en: `/en/blog/p/${id}` };
}

export async function POST(request: Request, { params }: RouteContext) {
  const ip = getClientIp(request);
  const preAuthLimit = await rateLimit(`blog-api-auth:${ip}`, 300, 60_000, {
    fallback: 'memory',
  });
  if (preAuthLimit.limited) {
    return blogApiError(429, 'rate_limited', '请求过于频繁', {
      retryAfter: retryAfter(preAuthLimit.resetAt),
    });
  }

  const auth = await authenticateBlogApiRequest(request, 'blog:submit');
  if (!auth.ok) return blogApiAuthError(auth.reason);

  const submitLimit = await rateLimit(
    `blog-api-submit:${auth.actor.userId}`,
    10,
    3_600_000,
    { fallback: 'memory' },
  );
  if (submitLimit.limited) {
    return blogApiError(429, 'rate_limited', '操作过于频繁', {
      retryAfter: retryAfter(submitLimit.resetAt),
    });
  }

  try {
    const { id } = await params;
    const result = await withdrawPost({ postId: id, authorId: auth.actor.userId });
    if (!result.ok) {
      if (result.reason === 'notFound' || result.reason === 'notAuthor') {
        return blogApiError(404, 'post_not_found', '文章不存在');
      }
      return blogApiError(409, 'invalid_state', '只有待审核文章可以撤回');
    }

    return blogApiSuccess({
      post: {
        id,
        status: 'draft',
        updatedAt: result.updatedAt,
        previewUrls: previewUrls(id),
      },
    });
  } catch (error) {
    console.error('blog api withdraw post failed:', error);
    return blogApiError(500, 'internal_error', '撤回文章失败');
  }
}
