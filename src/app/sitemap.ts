import type { MetadataRoute } from 'next';
import { products } from '@/data/products';
import { blogSections } from '@/data/blog-sections';
import { getFeedPosts, getFeedTags } from '@/data/blog-feed';
import { helpArticles, isHelpArticleVisible } from '@/data/help-articles';
import { SHOW_PRICING, SITE_URL } from '@/lib/constants';
import { listCatalogItems } from '@/lib/pathfinder/catalog';
import { listIeltsPairs } from '@/lib/ielts/catalog';
import { CHANGELOG_PRODUCT_IDS } from '@/data/product-changelog';
import { alternativeDetails } from '@/data/xisland-alternative-details';

const BASE_URL = SITE_URL;
const LOCALES = ['zh', 'en'] as const;

export function getHelpSitemapEntries(): MetadataRoute.Sitemap {
  return helpArticles.filter((article) => isHelpArticleVisible(article, true)).flatMap((article) =>
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
  const [localizedFeeds, pathfinderItems, ieltsPairs] = await Promise.all([
    Promise.all(LOCALES.map(async locale => {
      const [posts, tags] = await Promise.all([getFeedPosts(locale), getFeedTags(locale)]);
      return { locale, posts, tags };
    })),
    // 只取「可上手」条目，见下方 pathfinderItemPages 的说明。
    listCatalogItems({ learningEligible: true }),
    // 雅思写作对照：公开的范文页，正文是共享内容，可以进搜索
    listIeltsPairs(),
  ]);

  const staticPages = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${BASE_URL}/products`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    ...['/playground', '/open-source', '/student', '/blog/api-guide'].map(path => ({
      url: `${BASE_URL}${path}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6,
    })),
    ...(SHOW_PRICING
      ? [{ url: `${BASE_URL}/pricing`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 }]
      : []),
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${BASE_URL}/blog/stars`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${BASE_URL}/story`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.5 },
    { url: `${BASE_URL}/support`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${BASE_URL}/docs`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE_URL}/pathfinder`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${BASE_URL}/daily`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.7 },
    { url: `${BASE_URL}/masters`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.7 },
    { url: `${BASE_URL}/phd`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.7 },
    { url: `${BASE_URL}/competitions`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${BASE_URL}/study/ielts`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${BASE_URL}/pathfinder/opportunities`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.7 },
    { url: `${BASE_URL}/pathfinder/plan`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${BASE_URL}/pathfinder/topics`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.5 },
    { url: `${BASE_URL}/pathfinder/organizations`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.5 },
    { url: `${BASE_URL}/pathfinder/weekly`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.6 },
    // /pathfinder/saved 是因人而异的私有页面，不进 sitemap
    ...['ai', 'frontend', 'backend', 'data'].map((direction) => ({
      url: `${BASE_URL}/pathfinder/directions/${direction}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
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

  // 只有 XIsland 有同类工具对比页（其余产品走页面里的 notFound 分支）。
  // 它不依赖品牌名——搜「Vibe Island alternative」这类词时才有机会命中，
  // 所以值得单独收录，尽管优先级低于产品页本身。
  const alternativesPages = LOCALES.map((locale) => ({
    url: `${BASE_URL}/${locale}/products/xisland/alternatives`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
    alternates: {
      languages: {
        zh: `${BASE_URL}/zh/products/xisland/alternatives`,
        en: `${BASE_URL}/en/products/xisland/alternatives`,
      },
    },
  }));

  // 更新日志：版本号每周都可能变，用 weekly 而不是 monthly。
  // 这是站内唯一会「自己长大」的页面，靠它维持抓取频率。
  const changelogPages = CHANGELOG_PRODUCT_IDS.flatMap((productId) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/products/${productId}/changelog`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
      alternates: {
        languages: {
          zh: `${BASE_URL}/zh/products/${productId}/changelog`,
          en: `${BASE_URL}/en/products/${productId}/changelog`,
        },
      },
    })),
  );

  // 两两对比子页。总表承接「有哪些替代品」，子页承接「XIsland vs X」，
  // 是两类不同的查询，必须各有自己的地址。
  const alternativeDetailPages = alternativeDetails.flatMap((detail) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/products/xisland/alternatives/${detail.id}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
      alternates: {
        languages: {
          zh: `${BASE_URL}/zh/products/xisland/alternatives/${detail.id}`,
          en: `${BASE_URL}/en/products/xisland/alternatives/${detail.id}`,
        },
      },
    })),
  );

  const helpPages = getHelpSitemapEntries();
  // 雅思写作对照的每一组详情页：左右对照 + 逐句说明，是站内少见的原创长文，
  // 值得单独收录；slug 稳定，下架后这里自然消失（listIeltsPairs 只返回公开的）。
  const ieltsPairPages = ieltsPairs.flatMap((pair) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/study/ielts/${pair.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      alternates: {
        languages: {
          zh: `${BASE_URL}/zh/study/ielts/${pair.slug}`,
          en: `${BASE_URL}/en/study/ielts/${pair.slug}`,
        },
      },
    }))
  );

  // 只收录「可上手」的条目（`learningEligible`）。
  //
  // 2026-11-05：这里原本无条件输出全部目录条目，sitemap 因此有 1352 条，其中 1098 条
  // （81%）是这些详情页。实测百度爬虫把 1354 个唯一地址全抓了一遍、4868 个 200，
  // 但 `site:` 查不到任何结果——**抓取不是瓶颈，收录才是**。
  //
  // 原因是这些条目本质是 GitHub issue / 博客 RSS 的转载：正文平均只有 104 字符摘要
  // （最长 320），详情页可见文本约 1800 字符且大半是导航。697 条里 567 条
  // `learningEligible=false`，即「只作方向参考，不进学习路径」——它们对站内导航有价值，
  // 但对搜索用户没有增量信息，百度据此判定整站为低质聚合。
  //
  // 收口后 sitemap 降到约 250 条，抓取预算集中到真正有内容的页面上。
  // 详情页本身仍可访问（`generateMetadata` 里对同类条目输出 noindex），
  // 站内链接与用户收藏都不受影响。
  const pathfinderItemPages = pathfinderItems.flatMap((item) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/pathfinder/items/${item.id}`,
      lastModified: item.verifiedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
      alternates: {
        languages: {
          zh: `${BASE_URL}/zh/pathfinder/items/${item.id}`,
          en: `${BASE_URL}/en/pathfinder/items/${item.id}`,
        },
      },
    })),
  );

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

  // 正文语言由来源集合决定，另一种界面语言不代表新增了一篇翻译。
  const blogPostPages = localizedFeeds.flatMap(({ locale, posts }) => posts.map((post) => ({
    url: `${BASE_URL}/${locale}${post.href}`,
    lastModified: post.date,
    changeFrequency: 'yearly' as const,
    priority: 0.6,
    alternates: {
      languages: {
        [locale]: `${BASE_URL}/${locale}${post.href}`,
      },
    },
  })));

  const tagLanguages = new Map<string, Record<string, string>>();
  for (const { locale, tags } of localizedFeeds) {
    for (const tag of tags) {
      const languages = tagLanguages.get(tag.key) ?? {};
      languages[locale] = `${BASE_URL}/${locale}${tag.href}`;
      tagLanguages.set(tag.key, languages);
    }
  }

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
    ...localizedFeeds.flatMap(({ locale, tags }) =>
      tags.map((tag) => ({
        url: `${BASE_URL}/${locale}${tag.href}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.3,
        alternates: {
          languages: tagLanguages.get(tag.key),
        },
      }))
    ),
  ];

  return [
    ...localizedStaticPages,
    ...productPages,
    ...alternativesPages,
    ...alternativeDetailPages,
    ...changelogPages,
    ...helpPages,
    ...ieltsPairPages,
    ...pathfinderItemPages,
    ...blogSectionPages,
    ...blogPostPages,
    ...tagPages,
  ];
}
