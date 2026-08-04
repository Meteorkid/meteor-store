import { eq, inArray, or } from 'drizzle-orm';
import { db } from './db';
import {
  comments,
  feedbacks,
  inviteRedemptions,
  licenseKeys,
  likes,
  orders,
  postFavorites,
  posts,
  postTags,
  reports,
  topicProposals,
  users,
} from './db/schema';

export async function exportUserData(userId: string, email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const [
    accountRows,
    orderRows,
    licenseRows,
    postRows,
    commentRows,
    favoriteRows,
    likeRows,
    reportRows,
    redemptionRows,
    proposalRows,
    feedbackRows,
  ] = await Promise.all([
    db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      avatarUrl: users.avatarUrl,
      bio: users.bio,
      emailVerified: users.emailVerified,
      isStudent: users.isStudent,
      createdAt: users.createdAt,
    }).from(users).where(eq(users.id, userId)),
    db.select({
      id: orders.id,
      productId: orders.productId,
      planName: orders.planName,
      amountCny: orders.amountCny,
      paymentMethod: orders.paymentMethod,
      status: orders.status,
      alipayTradeNo: orders.alipayTradeNo,
      paidAt: orders.paidAt,
      billingPeriod: orders.billingPeriod,
      deliveryStatus: orders.deliveryStatus,
      createdAt: orders.createdAt,
    }).from(orders).where(eq(orders.email, normalizedEmail)),
    db.select({
      orderId: licenseKeys.orderId,
      productId: licenseKeys.productId,
      planName: licenseKeys.planName,
      key: licenseKeys.key,
      status: licenseKeys.status,
      createdAt: licenseKeys.createdAt,
    }).from(licenseKeys).where(eq(licenseKeys.email, normalizedEmail)),
    db.select({
      id: posts.id,
      title: posts.title,
      excerpt: posts.excerpt,
      content: posts.content,
      sectionId: posts.sectionId,
      status: posts.status,
      reviewNote: posts.reviewNote,
      reviewedAt: posts.reviewedAt,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
    }).from(posts).where(eq(posts.authorId, userId)),
    db.select({
      id: comments.id,
      targetId: comments.targetId,
      content: comments.content,
      parentId: comments.parentId,
      status: comments.status,
      reviewedAt: comments.reviewedAt,
      createdAt: comments.createdAt,
    }).from(comments).where(eq(comments.authorId, userId)),
    db.select({
      targetId: postFavorites.targetId,
      createdAt: postFavorites.createdAt,
    }).from(postFavorites).where(eq(postFavorites.userId, userId)),
    db.select({
      targetId: likes.targetId,
      createdAt: likes.createdAt,
    }).from(likes).where(eq(likes.userId, userId)),
    db.select({
      id: reports.id,
      targetType: reports.targetType,
      targetId: reports.targetId,
      reason: reports.reason,
      detail: reports.detail,
      status: reports.status,
      resolvedAt: reports.resolvedAt,
      createdAt: reports.createdAt,
    }).from(reports).where(or(
      eq(reports.reporterId, userId),
      eq(reports.resolverId, userId),
    )),
    db.select({
      inviteCodeId: inviteRedemptions.inviteCodeId,
      licenseKey: inviteRedemptions.licenseKey,
      redeemedAt: inviteRedemptions.redeemedAt,
    }).from(inviteRedemptions).where(eq(inviteRedemptions.userId, userId)),
    db.select().from(topicProposals).where(eq(topicProposals.submitterEmail, normalizedEmail)),
    db.select({
      id: feedbacks.id,
      type: feedbacks.type,
      content: feedbacks.content,
      status: feedbacks.status,
      resolvedAt: feedbacks.resolvedAt,
      createdAt: feedbacks.createdAt,
    }).from(feedbacks).where(eq(feedbacks.email, normalizedEmail)),
  ]);

  const postIds = postRows.map((post) => post.id);
  const tagRows = postIds.length > 0
    ? await db.select().from(postTags).where(inArray(postTags.postId, postIds))
    : [];

  return {
    exportedAt: new Date().toISOString(),
    account: accountRows[0] ?? null,
    commerce: {
      orders: orderRows,
      licenses: licenseRows,
      inviteRedemptions: redemptionRows,
    },
    content: {
      posts: postRows,
      postTags: tagRows,
      comments: commentRows,
      topicProposals: proposalRows,
      feedback: feedbackRows,
    },
    activity: {
      favorites: favoriteRows,
      likes: likeRows,
      reports: reportRows,
    },
  };
}
