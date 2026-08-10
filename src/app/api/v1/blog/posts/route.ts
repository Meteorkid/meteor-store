import { authenticateBlogApiRequest } from '@/lib/blog-api-auth';
import { blogApiAuthError, blogApiError, blogApiSuccess } from '@/lib/blog-api-response';
import { BlogApiCreatePostSchema } from '@/lib/post-validation';
import { createPost, getPostSummariesByAuthor } from '@/lib/posts';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

function retryAfter(resetAt: number): number {
  return Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
}

function previewUrls(id: string) {
  return {
    zh: `/zh/blog/p/${id}`,
    en: `/en/blog/p/${id}`,
  };
}

export async function GET(request: Request) {
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
    const posts = await getPostSummariesByAuthor(auth.actor.userId);
    return blogApiSuccess({
      posts: posts.map((post) => ({ ...post, previewUrls: previewUrls(post.id) })),
    });
  } catch (error) {
    console.error('blog api list posts failed:', error);
    return blogApiError(500, 'internal_error', '读取文章失败');
  }
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
  const parsed = BlogApiCreatePostSchema.safeParse(body);
  if (!parsed.success) {
    return blogApiError(400, 'invalid_request', parsed.error.issues[0].message);
  }

  try {
    const created = await createPost({
      authorId: auth.actor.userId,
      ...parsed.data,
      eventDate: parsed.data.eventDate ?? null,
      status: 'draft',
    });

    return blogApiSuccess({
      post: {
        id: created.id,
        status: 'draft',
        updatedAt: created.updatedAt,
        previewUrls: previewUrls(created.id),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('blog api create post failed:', error);
    return blogApiError(500, 'internal_error', '创建文章失败');
  }
}
