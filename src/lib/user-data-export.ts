import { eq, inArray, or } from 'drizzle-orm';
import { isAdminSession } from './admin';
import { getBlogImageLimitBytes } from './blog-image-quota';
import { db } from './db';
import {
  blogImages,
  comments,
  feedbacks,
  inviteRedemptions,
  licenseKeys,
  likes,
  orders,
  personalAccessTokens,
  postFavorites,
  postSections,
  posts,
  postTags,
  reports,
  tollowBookProgress,
  tollowPracticeSessions,
  tollowTextFavorites,
  topicProposals,
  users,
} from './db/schema';
import { deriveTokenStatus } from './personal-access-tokens';

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
    tokenRows,
    imageRows,
    tollowProgressRows,
    tollowSessionRows,
    tollowFavoriteRows,
  ] = await Promise.all([
    db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      avatarUrl: users.avatarUrl,
      bio: users.bio,
      emailVerified: users.emailVerified,
      isStudent: users.isStudent,
      studentEmail: users.studentEmail,
      studentVerifiedAt: users.studentVerifiedAt,
      tokenVersion: users.tokenVersion,
      blogImageBytes: users.blogImageBytes,
      createdAt: users.createdAt,
    }).from(users).where(eq(users.id, userId)),
    db.select({
      id: orders.id,
      productId: orders.productId,
      planName: orders.planName,
      planId: orders.planId,
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
      eventDate: posts.eventDate,
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
    db.select({
      name: personalAccessTokens.name,
      tokenPrefix: personalAccessTokens.tokenPrefix,
      scopes: personalAccessTokens.scopes,
      tokenVersion: personalAccessTokens.tokenVersion,
      expiresAt: personalAccessTokens.expiresAt,
      lastUsedAt: personalAccessTokens.lastUsedAt,
      revokedAt: personalAccessTokens.revokedAt,
      createdAt: personalAccessTokens.createdAt,
    }).from(personalAccessTokens).where(eq(personalAccessTokens.userId, userId)),
    db.select({
      objectKey: blogImages.objectKey,
      sizeBytes: blogImages.sizeBytes,
      status: blogImages.status,
      createdAt: blogImages.createdAt,
      updatedAt: blogImages.updatedAt,
      uploadedAt: blogImages.uploadedAt,
    }).from(blogImages).where(eq(blogImages.userId, userId)),
    db.select({
      bookId: tollowBookProgress.bookId,
      sectionId: tollowBookProgress.sectionId,
      segmentIndex: tollowBookProgress.segmentIndex,
      offset: tollowBookProgress.offset,
      updatedAt: tollowBookProgress.updatedAt,
    }).from(tollowBookProgress).where(eq(tollowBookProgress.userId, userId)),
    db.select({
      id: tollowPracticeSessions.id,
      clientRecordId: tollowPracticeSessions.clientRecordId,
      bookId: tollowPracticeSessions.bookId,
      bookTitle: tollowPracticeSessions.bookTitle,
      startedAt: tollowPracticeSessions.startedAt,
      endedAt: tollowPracticeSessions.endedAt,
      durationMs: tollowPracticeSessions.durationMs,
      wordsTyped: tollowPracticeSessions.wordsTyped,
      wpm: tollowPracticeSessions.wpm,
      accuracy: tollowPracticeSessions.accuracy,
      errorCount: tollowPracticeSessions.errorCount,
      createdAt: tollowPracticeSessions.createdAt,
    }).from(tollowPracticeSessions).where(eq(tollowPracticeSessions.userId, userId)),
    db.select({
      id: tollowTextFavorites.id,
      clientRecordId: tollowTextFavorites.clientRecordId,
      bookId: tollowTextFavorites.bookId,
      bookTitle: tollowTextFavorites.bookTitle,
      sectionId: tollowTextFavorites.sectionId,
      sectionTitle: tollowTextFavorites.sectionTitle,
      segmentIndex: tollowTextFavorites.segmentIndex,
      startOffset: tollowTextFavorites.startOffset,
      endOffset: tollowTextFavorites.endOffset,
      quote: tollowTextFavorites.quote,
      note: tollowTextFavorites.note,
      tags: tollowTextFavorites.tags,
      createdAt: tollowTextFavorites.createdAt,
      updatedAt: tollowTextFavorites.updatedAt,
    }).from(tollowTextFavorites).where(eq(tollowTextFavorites.userId, userId)),
  ]);

  const postIds = postRows.map((post) => post.id);
  const [tagRows, sectionRows] = postIds.length > 0
    ? await Promise.all([
        db.select().from(postTags).where(inArray(postTags.postId, postIds)),
        db.select().from(postSections).where(inArray(postSections.postId, postIds)),
      ])
    : [[], []];

  const account = accountRows[0] ?? null;
  const imageLimitBytes = getBlogImageLimitBytes(isAdminSession(account ? {
    email: account.email,
    emailVerified: account.emailVerified,
  } : null));
  const imageUsedBytes = account?.blogImageBytes ?? 0;
  const publicAccount = account ? {
    id: account.id,
    email: account.email,
    name: account.name,
    avatarUrl: account.avatarUrl,
    bio: account.bio,
    emailVerified: account.emailVerified,
    isStudent: account.isStudent,
    studentEmail: account.studentEmail,
    studentVerifiedAt: account.studentVerifiedAt,
    createdAt: account.createdAt,
  } : null;

  return {
    exportedAt: new Date().toISOString(),
    account: publicAccount,
    commerce: {
      orders: orderRows,
      licenses: licenseRows,
      inviteRedemptions: redemptionRows,
    },
    content: {
      posts: postRows,
      postTags: tagRows,
      postSections: sectionRows,
      comments: commentRows,
      topicProposals: proposalRows,
      feedback: feedbackRows,
      blogImages: {
        count: imageRows.length,
        quota: {
          usedBytes: imageUsedBytes,
          limitBytes: imageLimitBytes,
          remainingBytes: Math.max(0, imageLimitBytes - imageUsedBytes),
        },
        items: imageRows,
      },
    },
    activity: {
      favorites: favoriteRows,
      likes: likeRows,
      reports: reportRows,
    },
    tollow: {
      bookProgress: tollowProgressRows,
      practiceSessions: tollowSessionRows,
      textFavorites: tollowFavoriteRows,
    },
    security: {
      personalAccessTokens: tokenRows.map((token) => {
        return {
          name: token.name,
          tokenPrefix: token.tokenPrefix,
          scopes: token.scopes,
          expiresAt: token.expiresAt,
          lastUsedAt: token.lastUsedAt,
          revokedAt: token.revokedAt,
          createdAt: token.createdAt,
          status: deriveTokenStatus(token, account?.tokenVersion ?? token.tokenVersion),
        };
      }),
    },
  };
}
