import { and, eq, inArray, or } from 'drizzle-orm';
import { db } from './db';
import {
  blogImages,
  comments,
  feedbacks,
  inviteRedemptions,
  likes,
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
import { deleteAvatar, keyFromUrl } from './avatar-storage';
import { deleteUserBlogImages } from './blog-image-storage';
import { revalidatePublishedPaths } from './revalidate';

interface DeleteUserAccountInput {
  userId: string;
  email: string;
  avatarUrl: string | null;
}

export async function deleteUserAccount(input: DeleteUserAccountInput): Promise<void> {
  const normalizedEmail = input.email.trim().toLowerCase();
  const userPosts = await db
    .select({ id: posts.id, status: posts.status })
    .from(posts)
    .where(eq(posts.authorId, input.userId));
  const postIds = userPosts.map((post) => post.id);

  const cleanup: Promise<unknown>[] = [
    db.delete(blogImages).where(eq(blogImages.userId, input.userId)),
    db.delete(personalAccessTokens).where(eq(personalAccessTokens.userId, input.userId)),
    db.delete(comments).where(eq(comments.authorId, input.userId)),
    db.delete(posts).where(eq(posts.authorId, input.userId)),
    db.delete(inviteRedemptions).where(eq(inviteRedemptions.userId, input.userId)),
    db.delete(tollowBookProgress).where(eq(tollowBookProgress.userId, input.userId)),
    db.delete(tollowPracticeSessions).where(eq(tollowPracticeSessions.userId, input.userId)),
    db.delete(tollowTextFavorites).where(eq(tollowTextFavorites.userId, input.userId)),
    db.delete(likes).where(
      postIds.length > 0
        ? or(eq(likes.userId, input.userId), inArray(likes.targetId, postIds))
        : eq(likes.userId, input.userId),
    ),
    db.delete(postFavorites).where(
      postIds.length > 0
        ? or(eq(postFavorites.userId, input.userId), inArray(postFavorites.targetId, postIds))
        : eq(postFavorites.userId, input.userId),
    ),
    db.update(reports)
      .set({ reporterId: 'deleted-user' })
      .where(eq(reports.reporterId, input.userId)),
    db.update(reports)
      .set({ resolverId: 'deleted-user' })
      .where(eq(reports.resolverId, input.userId)),
    db.update(topicProposals)
      .set({ submitterEmail: null })
      .where(eq(topicProposals.submitterEmail, normalizedEmail)),
    db.update(feedbacks)
      .set({ email: null })
      .where(eq(feedbacks.email, normalizedEmail)),
  ];
  if (postIds.length > 0) {
    cleanup.push(db.delete(postTags).where(inArray(postTags.postId, postIds)));
    cleanup.push(db.delete(postSections).where(inArray(postSections.postId, postIds)));
  }

  await Promise.all(cleanup);

  if (userPosts.some((post) => post.status === 'published')) {
    revalidatePublishedPaths();
  }

  const result = await db
    .delete(users)
    .where(and(eq(users.id, input.userId), eq(users.email, normalizedEmail)));
  if ((result.rowCount ?? 0) === 0) {
    throw new Error('Account deletion lost ownership check');
  }

  const avatarKey = input.avatarUrl ? keyFromUrl(input.avatarUrl, input.userId) : null;
  await Promise.all([
    avatarKey ? deleteAvatar(avatarKey) : Promise.resolve(),
    deleteUserBlogImages(input.userId),
  ]);
}
