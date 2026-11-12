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
    // 通配符 Allow 已经等于「对所有 AI 爬虫放行」（GPTBot / OAI-SearchBot /
    // ClaudeBot / PerplexityBot 等都遵守 robots.txt），不需要逐个 UA 分组。
    // 实测 34 天内 AI 爬虫共抓取 3 万余次、99.3% 返回 200，通道本就畅通。
    // 这里不额外加 UA 规则：加了反而容易在将来某个改动里误封检索型爬虫
    // （OAI-SearchBot / PerplexityBot），而它们才决定 AI 回答里引不引用本站。
  };
}
