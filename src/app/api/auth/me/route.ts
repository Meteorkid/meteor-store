import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  const [row] = await db
    .select({
      avatarUrl: users.avatarUrl,
      bio: users.bio,
    })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  return NextResponse.json({
    user: {
      ...session,
      avatarUrl: row?.avatarUrl ?? null,
      bio: row?.bio ?? null,
      isAdmin: isAdminEmail(session.email),
    },
  });
}
