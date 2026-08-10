import { blogSections } from '@/data/blog-sections';
import { authenticateBlogApiRequest } from '@/lib/blog-api-auth';
import { blogApiAuthError, blogApiError, blogApiSuccess } from '@/lib/blog-api-response';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

function retryAfter(resetAt: number): number {
  return Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
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

  return blogApiSuccess({
    sections: blogSections,
    constraints: {
      title: { min: 4, max: 80 },
      excerpt: { min: 10, max: 200 },
      content: { min: 200, max: 50_000 },
      sections: { maxItems: 8 },
      tags: { maxItems: 8, maxLength: 24 },
      eventDate: { format: 'YYYY-MM-DD', nullable: true },
    },
  });
}
