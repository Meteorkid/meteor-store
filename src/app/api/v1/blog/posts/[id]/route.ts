import { authenticateBlogApiRequest } from '@/lib/blog-api-auth';
import { blogApiAuthError, blogApiError, blogApiSuccess } from '@/lib/blog-api-response';
import { BlogApiUpdatePostSchema } from '@/lib/post-validation';
import { getPostByAuthor, updatePostDraftVersioned } from '@/lib/posts';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

type RouteContext = { params: Promise<{ id: string }> };

function retryAfter(resetAt: number): number {
  return Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
}

function previewUrls(id: string) {
  return { zh: `/zh/blog/p/${id}`, en: `/en/blog/p/${id}` };
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
      post: { ...post, previewUrls: previewUrls(post.id) },
    });
  } catch (error) {
    console.error('blog api get post failed:', error);
    return blogApiError(500, 'internal_error', '读取文章失败');
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const ip = getClientIp(request);
  const preAuthLimit = await rateLimit(`blog-api-auth:${ip}`, 300, 60_000, {
    fallback: 'memory',
  });
  if (preAuthLimit.limited) {
    return blogApiError(429, 'rate_limited', '请求过于频繁', {
      retryAfter: retryAfter(preAuthLimit.resetAt),
    });
  }

  const auth = await authenticateBlogApiRequest(request, 'blog:write');
  if (!auth.ok) return blogApiAuthError(auth.reason);

  const writeLimit = await rateLimit(`blog-api-write:${auth.actor.userId}`, 30, 60_000, {
    fallback: 'memory',
  });
  if (writeLimit.limited) {
    return blogApiError(429, 'rate_limited', '草稿操作过于频繁', {
      retryAfter: retryAfter(writeLimit.resetAt),
    });
  }

  const body = await request.json().catch(() => null);
  const parsed = BlogApiUpdatePostSchema.safeParse(body);
  if (!parsed.success) {
    return blogApiError(400, 'invalid_request', parsed.error.issues[0].message);
  }

  try {
    const { id } = await params;
    const result = await updatePostDraftVersioned({
      postId: id,
      authorId: auth.actor.userId,
      ...parsed.data,
    });

    if (!result.ok) {
      if (result.reason === 'notFound') {
        return blogApiError(404, 'post_not_found', '文章不存在');
      }
      if (result.reason === 'invalidState') {
        return blogApiError(409, 'invalid_state', '当前文章状态不允许修改');
      }
      return blogApiError(409, 'version_conflict', '文章已被其他客户端修改');
    }

    return blogApiSuccess({
      post: {
        id,
        status: result.status,
        updatedAt: result.updatedAt,
        previewUrls: previewUrls(id),
      },
    });
  } catch (error) {
    console.error('blog api update post failed:', error);
    return blogApiError(500, 'internal_error', '修改文章失败');
  }
}
