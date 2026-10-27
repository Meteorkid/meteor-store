import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { isAdminSession } from '@/lib/admin';
import { logAdminAction } from '@/lib/admin-audit';
import { listInviteCodes, revokeInviteCode } from '@/lib/invite';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { assertMatchingOrigin } from '@/lib/csrf';

function forbidden() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function GET() {
  const session = await getSession();
  if (!session || !isAdminSession(session)) return forbidden();

  const codes = await listInviteCodes();
  return NextResponse.json({ codes });
}

export async function POST(req: NextRequest) {
  const originError = assertMatchingOrigin(req);
  if (originError) return originError;
  const ip = getClientIp(req);
  const { limited } = await rateLimit(`admin-invite:ip:${ip}`, 30, 60_000, { fallback: 'memory' });
  if (limited) {
    return NextResponse.json({ error: '请求过于频繁' }, { status: 429 });
  }

  const session = await getSession();
  if (!session || !isAdminSession(session)) return forbidden();

  return NextResponse.json({
    error: '历史邀请码已停止新建，请到账号管理赠送软件激活码。',
    code: 'legacy_invite_creation_retired',
    next: '/admin/users',
  }, { status: 410, headers: { 'Cache-Control': 'no-store' } });
}

export async function PATCH(req: NextRequest) {
  const ip = getClientIp(req);
  const { limited } = await rateLimit(`admin-invite:ip:${ip}`, 30, 60_000, { fallback: 'memory' });
  if (limited) {
    return NextResponse.json({ error: '请求过于频繁' }, { status: 429 });
  }

  const session = await getSession();
  if (!session || !isAdminSession(session)) return forbidden();

  const body = await req.json().catch(() => null);
  const id = typeof body?.id === 'string' ? body.id : '';
  const action = typeof body?.action === 'string' ? body.action : '';

  if (action !== 'revoke' || !id) {
    return NextResponse.json({ error: '参数无效' }, { status: 400 });
  }

  const ok = await revokeInviteCode(id);
  if (!ok) {
    return NextResponse.json({ error: '操作失败，邀请码可能已被撤销' }, { status: 409 });
  }

  await logAdminAction(session, {
    action: 'invite.revoke',
    targetType: 'invite_code',
    targetId: id,
    ip,
  });

  return NextResponse.json({ success: true });
}
