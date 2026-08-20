import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /offline.html 是 Service Worker 的断网兜底页，页面里已经有 noindex，
        // 但它对搜索引擎完全没有价值，不如直接别让爬虫花预算去抓
        disallow: ['/api/', '/success', '/offline.html'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
