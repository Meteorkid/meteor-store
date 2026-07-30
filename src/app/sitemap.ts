import type { MetadataRoute } from 'next';
import { products } from '@/data/products';
import { blogPosts } from '@/data/blog';
import { blogSections } from '@/data/blog-sections';
import { allTags } from '@/data/blog-tags';
import { SITE_URL } from '@/lib/constants';

const BASE_URL = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticPages = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${BASE_URL}/products`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${BASE_URL}/story`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.5 },
    { url: `${BASE_URL}/docs`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${BASE_URL}/feedback`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.2 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.2 },
  ];

  const productPages = products.map((product) => ({
    url: `${BASE_URL}/products/${product.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const blogSectionPages = blogSections.map((section) => ({
    url: `${BASE_URL}/blog/section/${section.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  const blogPostPages = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  const tagPages = [
    {
      url: `${BASE_URL}/blog/tags`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.4,
    },
    ...allTags.map((tag) => ({
      url: `${BASE_URL}${tag.href}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.3,
    })),
  ];

  return [...staticPages, ...productPages, ...blogSectionPages, ...blogPostPages, ...tagPages];
}
