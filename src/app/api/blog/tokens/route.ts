import { compare } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { assertMatchingOrigin } from '@/lib/csrf';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import {
  BLOG_API_SCOPES,
  createPersonalAccessToken,
  listPersonalAccessTokens,
  PersonalAccessTokenError,
} from '@/lib/personal-access-tokens';
import { rateLimit } from '@/lib/rate-limit';

const CreateTokenSchema = z.object({
  name: z.string().trim().min(1, '令牌名称不能为空').max(50, '令牌名称不要超过 50 个字'),
  scopes: z.array(z.enum(BLOG_API_SCOPES)).min(1, '至少选择一项权限').max(4),
  expiresInDays: z.union([z.literal(30), z.literal(90), z.literal(365)]).default(90),
  currentPassword: z.string().min(1, '请输入当前密码').max(200),
}).strict();

function json(data: unknown, status = 200): NextResponse {
  return NextResponse.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function GET() {
  const session = await getSession();
  if (!session) return json({ error: '请先登录' }, 401);

  try {
    const tokens = await listPersonalAccessTokens(
      session.userId,
      session.tokenVersion ?? 0,
    );
    return json({ tokens });
  } catch {
    return json({ error: '令牌列表暂时不可用' }, 500);
  }
}

export async function POST(request: NextRequest) {
  const forbidden = assertMatchingOrigin(request);
  if (forbidden) {
    forbidden.headers.set('Cache-Control', 'no-store');
    return forbidden;
  }

  const session = await getSession();
  if (!session) return json({ error: '请先登录' }, 401);

  const { limited } = await rateLimit(
    `blog-token-create:${session.userId}`,
    5,
    15 * 60_000,
    { failClosed: true, fallback: 'memory' },
  );
  if (limited) return json({ error: '创建尝试过于频繁，请稍后再试' }, 429);

  const parsed = CreateTokenSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return json({ error: parsed.error.issues[0].message }, 400);
  }

  try {
    const [user] = await db
      .select({
        passwordHash: users.passwordHash,
        tokenVersion: users.tokenVersion,
        emailVerified: users.emailVerified,
      })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);
    if (!user?.emailVerified) return json({ error: '请重新登录' }, 401);
    if (!(await compare(parsed.data.currentPassword, user.passwordHash))) {
      return json({ error: '当前密码不正确' }, 401);
    }

    const result = await createPersonalAccessToken({
      userId: session.userId,
      name: parsed.data.name,
      scopes: parsed.data.scopes,
      expiresInDays: parsed.data.expiresInDays,
      tokenVersion: user.tokenVersion,
    });
    return json(result, 201);
  } catch (error) {
    if (error instanceof PersonalAccessTokenError) {
      if (error.code === 'account_changed') {
        return json({ error: '账户状态已变化，请重新登录后再试' }, 409);
      }
      return json(
        { error: error.message },
        error.code === 'active_token_limit' ? 409 : 400,
      );
    }
    return json({ error: '令牌创建失败，请稍后重试' }, 500);
  }
}
