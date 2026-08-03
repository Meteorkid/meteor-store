import { db } from './db';
import { posts, comments, users, reports } from './db/schema';
import { eq, sql, count } from 'drizzle-orm';
import { getBlogPosts } from '@/data/blog';
import type { Locale } from '@/i18n/routing';
import { getSectionById } from '@/data/blog-sections';

export interface AdminStats {
  totalPosts: number;
  publishedPosts: number;
  pendingPosts: number;
  totalComments: number;
  pendingComments: number;
  totalUsers: number;
  pendingReports: number;
}

export interface AdminPost {
  id: string;
  title: string;
  source: 'file' | 'database';
  author: string | null;
  section: string;
  status: string | null;
  publishedAt: string | null;
  createdAt: string;
  href: string;
}

export async function getAdminStats(): Promise<AdminStats> {
  const [postCounts, commentCounts, userCount, reportCounts] = await Promise.all([
    db
      .select({
        total: count(),
        published: sql<number>`count(*) filter (where ${posts.status} = 'published')`,
        pending: sql<number>`count(*) filter (where ${posts.status} = 'pending')`,
      })
      .from(posts),
    db
      .select({
        total: count(),
        pending: sql<number>`count(*) filter (where ${comments.status} = 'pending')`,
      })
      .from(comments),
    db.select({ count: count() }).from(users),
    db
      .select({
        pending: sql<number>`count(*) filter (where ${reports.status} = 'pending')`,
      })
      .from(reports),
  ]);

  return {
    totalPosts: postCounts[0]?.total ?? 0,
    publishedPosts: postCounts[0]?.published ?? 0,
    pendingPosts: postCounts[0]?.pending ?? 0,
    totalComments: commentCounts[0]?.total ?? 0,
    pendingComments: commentCounts[0]?.pending ?? 0,
    totalUsers: userCount[0]?.count ?? 0,
    pendingReports: reportCounts[0]?.pending ?? 0,
  };
}

export async function getAllPosts(): Promise<AdminPost[]> {
  const [dbPosts, filePosts] = await Promise.all([
    db
      .select({
        id: posts.id,
        title: posts.title,
        author: users.name,
        sectionId: posts.sectionId,
        status: posts.status,
        publishedAt: posts.publishedAt,
        createdAt: posts.createdAt,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id)),
    getBlogPosts('zh' as Locale),
  ]);

  const allPosts: AdminPost[] = [
    ...filePosts.map((p) => ({
      id: p.slug,
      title: p.title,
      source: 'file' as const,
      author: null,
      section: getSectionById(p.section)?.slug ?? p.section,
      status: null,
      publishedAt: p.date,
      createdAt: p.date,
      href: `/blog/${p.slug}`,
    })),
    ...dbPosts.map((p) => ({
      id: p.id,
      title: p.title,
      source: 'database' as const,
      author: p.author ?? null,
      section: getSectionById(p.sectionId)?.slug ?? p.sectionId,
      status: p.status ?? null,
      publishedAt: p.publishedAt ?? null,
      createdAt: p.createdAt,
      href: `/blog/p/${p.id}`,
    })),
  ];

  allPosts.sort((a, b) => {
    const dateA = a.publishedAt ?? a.createdAt;
    const dateB = b.publishedAt ?? b.createdAt;
    return dateB.localeCompare(dateA);
  });

  return allPosts;
}