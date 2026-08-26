import { db } from './db';
import { posts, comments, feedbacks, users, reports, orders, inviteRedemptions } from './db/schema';
import { eq, sql, count } from 'drizzle-orm';
import { getBlogPosts } from '@/data/blog';
import type { Locale } from '@/i18n/routing';
import { getSectionById } from '@/data/blog-sections';
import { PASS_PRODUCT_ID } from '@/data/pass';

export interface AdminStats {
  totalPosts: number;
  publishedPosts: number;
  pendingPosts: number;
  totalComments: number;
  pendingComments: number;
  totalUsers: number;
  pendingReports: number;
  pendingFeedback: number;
  activePassCount: number;
  passMonthly: number;
  passAnnual: number;
  passLifetime: number;
  inviteRedemptionCount: number;
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
  const [postCounts, commentCounts, userCount, reportCounts, feedbackCounts, passCounts, inviteCount] = await Promise.all([
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
    db
      .select({
        pending: sql<number>`count(*) filter (where ${feedbacks.status} = 'pending')`,
      })
      .from(feedbacks),
    db
      /*
       * 注意 ${PASS_PRODUCT_ID} 外面不能套引号。
       *
       * drizzle 会把插值变成绑定参数；套上引号后生成的 SQL 里是字符串字面量
       * '$1'，于是语句实际零参数却仍传了 4 个，Postgres 直接报
       * 「bind message supplies 4 parameters, but prepared statement requires 0」，
       * 整个后台首页 500。上面几行的 'published'、'pending' 是写死的字面量，
       * 没有插值，所以带引号是对的——两者容易看混。
       */
      .select({
        total: sql<number>`count(*) filter (where ${orders.productId} = ${PASS_PRODUCT_ID} and ${orders.status} = 'paid')`,
        monthly: sql<number>`count(*) filter (where ${orders.productId} = ${PASS_PRODUCT_ID} and ${orders.status} = 'paid' and ${orders.billingPeriod} = 'monthly')`,
        annual: sql<number>`count(*) filter (where ${orders.productId} = ${PASS_PRODUCT_ID} and ${orders.status} = 'paid' and ${orders.billingPeriod} = 'annual')`,
        lifetime: sql<number>`count(*) filter (where ${orders.productId} = ${PASS_PRODUCT_ID} and ${orders.status} = 'paid' and ${orders.billingPeriod} = 'lifetime')`,
      })
      .from(orders),
    db
      .select({ count: count() })
      .from(inviteRedemptions),
  ]);

  return {
    totalPosts: postCounts[0]?.total ?? 0,
    publishedPosts: postCounts[0]?.published ?? 0,
    pendingPosts: postCounts[0]?.pending ?? 0,
    totalComments: commentCounts[0]?.total ?? 0,
    pendingComments: commentCounts[0]?.pending ?? 0,
    totalUsers: userCount[0]?.count ?? 0,
    pendingReports: reportCounts[0]?.pending ?? 0,
    pendingFeedback: feedbackCounts[0]?.pending ?? 0,
    activePassCount: passCounts[0]?.total ?? 0,
    passMonthly: passCounts[0]?.monthly ?? 0,
    passAnnual: passCounts[0]?.annual ?? 0,
    passLifetime: passCounts[0]?.lifetime ?? 0,
    inviteRedemptionCount: inviteCount[0]?.count ?? 0,
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

/** 侧边栏徽标用的待办计数。 */
export interface AdminBadgeCounts {
  pendingPosts: number;
  pendingComments: number;
  pendingReports: number;
  pendingFeedback: number;
}

/**
 * 侧边栏徽标计数。
 *
 * 四张表的 count 压成单条 SQL 子查询：Neon HTTP 下每个 count 都是一次网络往返，
 * 而这个查询挂在 admin 布局上、每次进后台都要跑一遍。别拆回四个 Promise.all。
 * 失败时返回全 0——徽标是辅助信息，不该让整个后台 500。
 */
export async function getAdminBadgeCounts(): Promise<AdminBadgeCounts> {
  interface BadgeRow {
    pending_posts: number;
    pending_comments: number;
    pending_reports: number;
    pending_feedback: number;
  }
  try {
    const result = await db.execute(sql<BadgeRow>`
      SELECT
        (SELECT count(*)::int FROM posts WHERE status = 'pending') AS pending_posts,
        (SELECT count(*)::int FROM comments WHERE status = 'pending') AS pending_comments,
        (SELECT count(*)::int FROM reports WHERE status = 'pending') AS pending_reports,
        (SELECT count(*)::int FROM feedbacks WHERE status = 'pending') AS pending_feedback
    `);
    const row = result.rows[0];
    return {
      pendingPosts: Number(row?.pending_posts ?? 0),
      pendingComments: Number(row?.pending_comments ?? 0),
      pendingReports: Number(row?.pending_reports ?? 0),
      pendingFeedback: Number(row?.pending_feedback ?? 0),
    };
  } catch (err) {
    console.error('admin badge counts query failed:', err);
    return { pendingPosts: 0, pendingComments: 0, pendingReports: 0, pendingFeedback: 0 };
  }
}
