import { and, desc, eq } from 'drizzle-orm';
import { db } from './db';
import { feedbacks } from './db/schema';

export async function listFeedback() {
  return db
    .select()
    .from(feedbacks)
    .orderBy(desc(feedbacks.createdAt))
    .limit(100);
}

export async function resolveFeedback(
  id: string,
  status: 'resolved' | 'dismissed',
  resolverId: string,
): Promise<boolean> {
  const result = await db
    .update(feedbacks)
    .set({
      status,
      resolverId,
      resolvedAt: new Date().toISOString(),
    })
    .where(and(eq(feedbacks.id, id), eq(feedbacks.status, 'pending')));
  return (result.rowCount ?? 0) > 0;
}
