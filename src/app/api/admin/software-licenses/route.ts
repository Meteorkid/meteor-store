import { NextRequest } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { isAdminSession } from '@/lib/admin';
import { logAdminAction } from '@/lib/admin-audit';
import { getClientIp } from '@/lib/rate-limit';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { SOFTWARE_PRODUCT_IDS } from '@/lib/software-licenses/types';
import { grantSoftwareLicenses, listSoftwareDevicesByEmail, listSoftwareLicensesByEmail, revokeSoftwareDevice } from '@/lib/software-licenses/service';
import { parseSoftwareBody, privateJson, softwareError, softwareRequestGuard } from '@/lib/software-licenses/http';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session || !isAdminSession(session)) return privateJson({ error: 'Not found' }, { status: 404 });
  const email = z.string().email().safeParse(request.nextUrl.searchParams.get('email'));
  if (!email.success) return privateJson({ error: '邮箱无效', code: 'invalid_request' }, { status: 400 });
  try {
    const [licenses, devices] = await Promise.all([listSoftwareLicensesByEmail(email.data), listSoftwareDevicesByEmail(email.data)]);
    return privateJson({ userId: session.userId, licenses, devices });
  } catch (error) { return softwareError(error); }
}

export async function POST(request: NextRequest) {
  const denied = await softwareRequestGuard(request, 'admin-gift');
  if (denied) return denied;
  const session = await getSession();
  if (!session || !isAdminSession(session)) return privateJson({ error: 'Not found' }, { status: 404 });
  if (request.headers.get('X-Software-License-User') !== session.userId) return privateJson({ error: '账号已变化，请刷新后重试', code: 'session_changed' }, { status: 409 });
  try {
    const input = await parseSoftwareBody(request, z.object({ email: z.string().trim().email().max(254), recipientUserId: z.string().min(1).max(100).optional(), productIds: z.array(z.enum(SOFTWARE_PRODUCT_IDS)).min(1).max(2),
      kind: z.enum(['monthly', 'annual', 'lifetime']), memo: z.string().trim().max(500).optional(), requestId: z.string().uuid() }));
    if (input.recipientUserId) {
      const [recipient] = await db.select({ id: users.id, email: users.email }).from(users)
        .where(eq(users.id, input.recipientUserId)).limit(1);
      if (!recipient) return privateJson({ error: '目标用户不存在，请刷新用户列表', code: 'recipient_not_found' }, { status: 404 });
      if (recipient.email.trim().toLowerCase() !== input.email.toLowerCase()) {
        return privateJson({ error: '目标用户邮箱已变化，请刷新后重试', code: 'recipient_changed' }, { status: 409 });
      }
    }
    const licenses = await grantSoftwareLicenses({ ...input, createdBy: session.email });
    await logAdminAction(session, { action: 'software-license.gift', targetType: 'software_license', targetId: input.requestId,
      detail: { email: input.email, recipientUserId: input.recipientUserId, productIds: input.productIds, kind: input.kind, memo: input.memo }, ip: getClientIp(request) });
    return privateJson({ licenses }, { status: 201 });
  } catch (error) { return softwareError(error); }
}

export async function PATCH(request: NextRequest) {
  const denied = await softwareRequestGuard(request, 'admin-device');
  if (denied) return denied;
  const session = await getSession();
  if (!session || !isAdminSession(session)) return privateJson({ error: 'Not found' }, { status: 404 });
  if (request.headers.get('X-Software-License-User') !== session.userId) return privateJson({ error: '账号已变化，请刷新后重试', code: 'session_changed' }, { status: 409 });
  try {
    const input = await parseSoftwareBody(request, z.object({ email: z.string().email(), id: z.string().uuid(), action: z.literal('revoke-device') }));
    const revoked = await revokeSoftwareDevice(input.email, input.id);
    if (revoked) await logAdminAction(session, { action: 'software-license.revoke-device', targetType: 'software_device', targetId: input.id, ip: getClientIp(request) });
    return privateJson({ success: revoked }, { status: revoked ? 200 : 404 });
  } catch (error) { return softwareError(error); }
}
