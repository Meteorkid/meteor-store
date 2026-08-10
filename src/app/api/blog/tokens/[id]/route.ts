import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { assertMatchingOrigin } from '@/lib/csrf';
import { revokePersonalAccessToken } from '@/lib/personal-access-tokens';
import { rateLimit } from '@/lib/rate-limit';

function json(data: unknown, status = 200): NextResponse {
  return NextResponse.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const forbidden = assertMatchingOrigin(request);
  if (forbidden) {
    forbidden.headers.set('Cache-Control', 'no-store');
    return forbidden;
  }

  const session = await getSession();
  if (!session) return json({ error: '请先登录' }, 401);

  const { limited } = await rateLimit(
    `blog-token-revoke:${session.userId}`,
    30,
    60_000,
    { failClosed: true, fallback: 'memory' },
  );
  if (limited) return json({ error: '操作过于频繁，请稍后再试' }, 429);

  const { id: tokenId } = await params;
  try {
    const revoked = await revokePersonalAccessToken({
      tokenId,
      userId: session.userId,
    });
    if (!revoked) return json({ error: '令牌不存在' }, 404);
    return json({ success: true });
  } catch {
    return json({ error: '令牌撤销失败，请稍后重试' }, 500);
  }
}
