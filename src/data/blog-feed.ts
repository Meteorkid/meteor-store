import { blogPosts, estimateReadingTime, type BlogPost } from './blog';
import { buildTagIndex, normalizeTag, type TagSummary } from './blog-tags';
import { getPublishedUserPosts } from '@/lib/posts';
import type { BlogSectionId } from './blog-sections';

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
  /** 文章地址。文件文章是 /blog/{slug}，投稿是 /blog/p/{id} */
  href: string;
  /** 投稿的作者名；站主自己的文章为 null */
  author: string | null;
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
    readingTime: post.readingTime,
    tags: post.tags,
    draft: post.draft,
    href: post.href,
    author: post.author,
  };
}

/**
 * 全部公开文章，按日期倒序。
 *
 * 数据库读失败时降级为只有文件文章：投稿看不见比整个博客 500 好。
 */
export async function getFeedPosts(): Promise<FeedPost[]> {
  let userPosts: FeedPost[] = [];

  try {
    const rows = await getPublishedUserPosts();
    userPosts = rows.map((p) => ({
      slug: p.id,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      // publishedAt 是 ISO 时间戳，列表和排序都只用到日期部分
      date: (p.publishedAt ?? p.createdAt).slice(0, 10),
      section: p.sectionId,
      readingTime: estimateReadingTime(p.content),
      tags: p.tags,
      draft: false,
      href: `/blog/p/${p.id}`,
      author: p.authorName,
    }));
  } catch (err) {
    console.error('读取投稿失败，本次只展示文件文章', err);
  }

  return [...blogPosts.map(fromFile), ...userPosts].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getFeedPostsBySection(sectionId: BlogSectionId): Promise<FeedPost[]> {
  return (await getFeedPosts()).filter((p) => p.section === sectionId);
}

/** 各分区文章数 */
export async function getSectionCounts(): Promise<Record<string, number>> {
  const posts = await getFeedPosts();
  return posts.reduce<Record<string, number>>((acc, p) => {
    acc[p.section] = (acc[p.section] ?? 0) + 1;
    return acc;
  }, {});
}

/**
 * 标签索引：两条来源汇总后按热度降序。
 * 计数规则（同篇去重、展示写法取最常见的那种）复用 buildTagIndex。
 */
export async function getFeedTags(): Promise<TagSummary[]> {
  return buildTagIndex(await getFeedPosts());
}

export async function findFeedTag(input: string): Promise<TagSummary | undefined> {
  const key = normalizeTag(input);
  return (await getFeedTags()).find((t) => t.key === key);
}

export async function getFeedPostsByTag(input: string): Promise<FeedPost[]> {
  const key = normalizeTag(input);
  return (await getFeedPosts()).filter((p) => p.tags.some((t) => normalizeTag(t) === key));
}
