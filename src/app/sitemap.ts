import type { MetadataRoute } from 'next';
import { products } from '@/data/products';
import { blogSections } from '@/data/blog-sections';
import { getFeedPosts, getFeedTags } from '@/data/blog-feed';
import { helpArticles } from '@/data/help-articles';
import { SHOW_PRICING, SITE_URL } from '@/lib/constants';

const BASE_URL = SITE_URL;
const LOCALES = ['zh', 'en'] as const;

export function getHelpSitemapEntries(): MetadataRoute.Sitemap {
  return helpArticles.flatMap((article) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/docs/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
      alternates: {
        languages: {
          zh: `${BASE_URL}/zh/docs/${article.slug}`,
          en: `${BASE_URL}/en/docs/${article.slug}`,
        },
      },
    }))
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();
  const [feedPosts, feedTags] = await Promise.all([getFeedPosts('zh'), getFeedTags('zh')]);

  const staticPages = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${BASE_URL}/products`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    ...(SHOW_PRICING
      ? [{ url: `${BASE_URL}/pricing`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 }]
      : []),
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${BASE_URL}/blog/stars`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${BASE_URL}/story`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.5 },
    { url: `${BASE_URL}/support`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${BASE_URL}/docs`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${BASE_URL}/feedback`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.2 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.2 },
    { url: `${BASE_URL}/eula`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.2 },
    { url: `${BASE_URL}/refund`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.2 },
  ];

  // 为每个静态页面生成双语版本
  const localizedStaticPages = staticPages.flatMap((page) => {
    // 跳过根路径（已经有重定向）
    if (page.url === BASE_URL) {
      return LOCALES.map((locale) => ({
        ...page,
        url: `${BASE_URL}/${locale}`,
        alternates: {
          languages: {
            zh: `${BASE_URL}/zh`,
            en: `${BASE_URL}/en`,
          },
        },
      }));
    }

    // 提取路径部分（去掉 BASE_URL）
    const path = page.url.replace(BASE_URL, '');

    return LOCALES.map((locale) => ({
      ...page,
      url: `${BASE_URL}/${locale}${path}`,
      alternates: {
        languages: {
          zh: `${BASE_URL}/zh${path}`,
          en: `${BASE_URL}/en${path}`,
        },
      },
    }));
  });

  // 产品页面双语版本
  const productPages = products.flatMap((product) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/products/${product.id}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          zh: `${BASE_URL}/zh/products/${product.id}`,
          en: `${BASE_URL}/en/products/${product.id}`,
        },
      },
    }))
  );

  const helpPages = getHelpSitemapEntries();

  // 博客分区页面双语版本
  const blogSectionPages = blogSections.flatMap((section) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/blog/section/${section.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
      alternates: {
        languages: {
          zh: `${BASE_URL}/zh/blog/section/${section.slug}`,
          en: `${BASE_URL}/en/blog/section/${section.slug}`,
        },
      },
    }))
  );

  // 博客文章页面（暂时只生成中文版本）
  const blogPostPages = feedPosts.map((post) => ({
    url: `${BASE_URL}/zh${post.href}`,
    lastModified: post.date,
    changeFrequency: 'yearly' as const,
    priority: 0.6,
    alternates: {
      languages: {
        zh: `${BASE_URL}/zh${post.href}`,
        en: `${BASE_URL}/en${post.href}`,
      },
    },
  }));

  // 标签页面双语版本
  const tagPages = [
    ...LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/blog/tags`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.4,
      alternates: {
        languages: {
          zh: `${BASE_URL}/zh/blog/tags`,
          en: `${BASE_URL}/en/blog/tags`,
        },
      },
    })),
    ...feedTags.flatMap((tag) =>
      LOCALES.map((locale) => ({
        url: `${BASE_URL}/${locale}${tag.href}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.3,
        alternates: {
          languages: {
            zh: `${BASE_URL}/zh${tag.href}`,
            en: `${BASE_URL}/en${tag.href}`,
          },
        },
      }))
    ),
  ];

  return [
    ...localizedStaticPages,
    ...productPages,
    ...helpPages,
    ...blogSectionPages,
    ...blogPostPages,
    ...tagPages,
  ];
}
