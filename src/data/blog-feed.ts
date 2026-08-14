import { cache } from 'react';
import { getBlogPosts, estimateReadingTime, type BlogPost } from './blog';
import { buildTagIndex, normalizeTag, type TagSummary } from './blog-tags';
import { getPublishedUserPosts } from '@/lib/posts';
import type { BlogSectionId } from './blog-sections';
import { type Locale } from '@/i18n/routing';

/**
 * 两条内容来源的合并读取层。
 *
 * 站主的文章在 content/blog/*.md，读者投稿在数据库。让七个消费者
 * （列表、分区页、标签页、标签目录、两个 RSS、sitemap）各自去认识两种来源，
 * 等于把合并逻辑抄七遍；这里合并一次，上面只看到一种文章。
 *
 * 全部是 async：数据库那一路必须等。页面仍是静态渲染的，
 * 审核通过时 revalidatePath 让它重新生成——见 api/posts/review。
 */

export interface FeedPost extends BlogPost {
  /** 文章地址。投稿是 /blog/p/{id}；文件文章已迁库（content/blog 为空），fromFile 分支是历史残留的死分支 */
  href: string;
  /** 投稿的作者名；站主自己的文章为 null */
  author: string | null;
  /** 事件时间，两条来源都已在各自的合并层兜底为非空 */
  eventDate: string;
}

export type FeedPostSummary = Omit<FeedPost, 'content'>;

function fromFile(post: BlogPost): FeedPost {
  return { ...post, href: `/blog/${post.slug}`, author: null };
}

/** 显式列出会到达客户端的字段，避免以后新增字段被无意带过去 */
export function toFeedSummary(post: FeedPost): FeedPostSummary {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    section: post.section,
    sections: post.sections,
    readingTime: post.readingTime,
    tags: post.tags,
    draft: post.draft,
    href: post.href,
    author: post.author,
    eventDate: post.eventDate,
  };
}

/**
 * 全部公开文章，按日期倒序。
 *
 * 数据库读失败时降级为只有文件文章：投稿看不见比整个博客 500 好。
 *
 * 按当前语言版本加载对应投稿。
 *
 * 用 React cache() 包裹：同一请求内多次调用（BlogList 的 Promise.all、
 * sitemap.ts、tag 页等）只打一次数据库。不跨请求——审核通过 revalidatePath
 * 后下一次请求重新填充。
 */
export const getFeedPosts = cache(async (locale: Locale): Promise<FeedPost[]> => {
  let userPosts: FeedPost[] = [];

  try {
    const rows = await getPublishedUserPosts(locale);
      userPosts = rows.map((p) => ({
        slug: p.id,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        // publishedAt 是 ISO 时间戳，列表和排序都只用到日期部分
        date: (p.publishedAt ?? p.createdAt).slice(0, 10),
        section: p.sectionId,
        sections: p.sections,
        readingTime: estimateReadingTime(p.content),
        tags: p.tags,
        draft: false,
        href: `/blog/p/${p.id}`,
        author: p.authorName,
        // 事件时间缺省回落到发布时间
        eventDate: p.eventDate ?? (p.publishedAt ?? p.createdAt).slice(0, 10),
      }));
  } catch (err) {
    console.error('读取投稿失败，本次只展示文件文章', err);
  }

  return [...getBlogPosts(locale).map(fromFile), ...userPosts].sort((a, b) => b.date.localeCompare(a.date));
});

export async function getFeedPostsBySection(
  locale: Locale,
  sectionId: BlogSectionId | undefined,
): Promise<FeedPost[]> {
  const posts = await getFeedPosts(locale);
  return sectionId ? posts.filter((p) => p.sections.includes(sectionId)) : posts;
}

/** 各分区文章数：跨区文章计入它所属的每个分区 */
export async function getSectionCounts(locale: Locale): Promise<Record<string, number>> {
  const posts = await getFeedPosts(locale);
  return posts.reduce<Record<string, number>>((acc, p) => {
    for (const sectionId of p.sections) {
      acc[sectionId] = (acc[sectionId] ?? 0) + 1;
    }
    return acc;
  }, {});
}

/**
 * 标签索引：两条来源汇总后按热度降序。
 * 计数规则（同篇去重、展示写法取最常见的那种）复用 buildTagIndex。
 */
export async function getFeedTags(locale: Locale): Promise<TagSummary[]> {
  return buildTagIndex(await getFeedPosts(locale));
}

export async function findFeedTag(locale: Locale, input: string): Promise<TagSummary | undefined> {
  const key = normalizeTag(input);
  return (await getFeedTags(locale)).find((t) => t.key === key);
}

export async function getFeedPostsByTag(locale: Locale, input: string): Promise<FeedPost[]> {
  const key = normalizeTag(input);
  return (await getFeedPosts(locale)).filter((p) => p.tags.some((t) => normalizeTag(t) === key));
}

/**
 * 多标签解析：把 URL 里的多个标签输入统一解析成 TagSummary。
 * 找不到的输入直接跳过（不抛错），返回顺序与输入一致。
 */
export async function findFeedTags(locale: Locale, inputs: string[]): Promise<TagSummary[]> {
  const tags = await getFeedTags(locale);
  return inputs
    .map((input) => normalizeTag(input))
    .map((key) => tags.find((t) => t.key === key))
    .filter((t): t is TagSummary => Boolean(t));
}
