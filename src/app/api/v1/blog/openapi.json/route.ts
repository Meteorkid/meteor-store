import { blogPublishingOpenApi } from '@/lib/blog-api-openapi';

export function GET() {
  return Response.json(blogPublishingOpenApi, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
