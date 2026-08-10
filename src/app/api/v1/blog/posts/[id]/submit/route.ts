import { authenticateBlogApiRequest } from '@/lib/blog-api-auth';
import { blogApiAuthError, blogApiError, blogApiSuccess } from '@/lib/blog-api-response';
import { sendAdminAlert } from '@/lib/email';
import { BlogApiVersionSchema } from '@/lib/post-validation';
import { getPostByAuthor, submitPostVersioned } from '@/lib/posts';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { revalidatePublishedPaths } from '@/lib/revalidate';

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
    return blogApiError(429, 'rate_limited', '提交过于频繁', {
      retryAfter: retryAfter(submitLimit.resetAt),
    });
  }

  const body = await request.json().catch(() => null);
  const parsed = BlogApiVersionSchema.safeParse(body);
  if (!parsed.success) {
    return blogApiError(400, 'invalid_request', parsed.error.issues[0].message);
  }

  try {
    const { id } = await params;
    const before = await getPostByAuthor(id, auth.actor.userId);
    if (!before) return blogApiError(404, 'post_not_found', '文章不存在');

    const result = await submitPostVersioned({
      postId: id,
      authorId: auth.actor.userId,
      expectedUpdatedAt: parsed.data.expectedUpdatedAt,
      publish: auth.actor.isAdmin,
    });

    if (!result.ok) {
      if (result.reason === 'notFound') {
        return blogApiError(404, 'post_not_found', '文章不存在');
      }
      if (result.reason === 'invalidState') {
        return blogApiError(409, 'invalid_state', '当前文章状态不允许提交');
      }
      return blogApiError(409, 'version_conflict', '文章已被其他客户端修改');
    }

    if (result.status === 'published') {
      try {
        revalidatePublishedPaths();
      } catch (error) {
        console.error('published post cache revalidation failed:', error);
      }
    } else {
      void sendAdminAlert('新的投稿待审核', {
        标题: before.title,
        分区: before.sectionId,
        作者: auth.actor.name || auth.actor.email,
        查看: '/admin/review',
      });
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
    console.error('blog api submit post failed:', error);
    return blogApiError(500, 'internal_error', '提交文章失败');
  }
}
