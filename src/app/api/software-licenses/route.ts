import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { listSoftwareDevicesByEmail, listSoftwareLicensesByEmail, revokeSoftwareDevice } from '@/lib/software-licenses/service';
import { parseSoftwareBody, privateJson, softwareError, softwareRequestGuard } from '@/lib/software-licenses/http';

export async function GET() {
  const session = await getSession();
  if (!session || !session.emailVerified) return privateJson({ error: '请登录并验证邮箱', code: 'unauthorized' }, { status: 401 });
  try {
    const [licenses, devices] = await Promise.all([listSoftwareLicensesByEmail(session.email), listSoftwareDevicesByEmail(session.email)]);
    return privateJson({ userId: session.userId, licenses, devices });
  } catch (error) { return softwareError(error); }
}

export async function PATCH(request: NextRequest) {
  const denied = await softwareRequestGuard(request, 'manage-device');
  if (denied) return denied;
  const session = await getSession();
  if (!session || !session.emailVerified) return privateJson({ error: '请登录并验证邮箱', code: 'unauthorized' }, { status: 401 });
  if (request.headers.get('X-Software-License-User') !== session.userId) return privateJson({ error: '账号已变化，请刷新后重试', code: 'session_changed' }, { status: 409 });
  try {
    const { id } = await parseSoftwareBody(request, z.object({ id: z.string().uuid(), action: z.literal('revoke-device') }));
    const revoked = await revokeSoftwareDevice(session.email, id);
    return privateJson({ success: revoked }, { status: revoked ? 200 : 404 });
  } catch (error) { return softwareError(error); }
}
