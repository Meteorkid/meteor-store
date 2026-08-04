import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isAdminSession } from '@/lib/admin';
import { listCommerceOperations, setLicenseStatus } from '@/lib/admin-commerce';
import { getSession } from '@/lib/auth';
import { fulfillOrder } from '@/lib/order-fulfillment';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

const ActionSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('retry-delivery'),
    orderId: z.string().uuid(),
  }),
  z.object({
    action: z.literal('set-license-status'),
    licenseId: z.string().min(1).max(100),
    status: z.enum(['active', 'revoked']),
  }),
]);

function forbidden() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function GET() {
  const session = await getSession();
  if (!session || !isAdminSession(session)) return forbidden();
  return NextResponse.json(await listCommerceOperations());
}

export async function PATCH(req: NextRequest) {
  const ip = getClientIp(req);
  const { limited } = await rateLimit(`admin-commerce:ip:${ip}`, 30, 60_000, {
    fallback: 'memory',
  });
  if (limited) {
    return NextResponse.json({ error: '请求过于频繁' }, { status: 429 });
  }

  const session = await getSession();
  if (!session || !isAdminSession(session)) return forbidden();

  const parsed = ActionSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: '参数无效' }, { status: 400 });
  }

  if (parsed.data.action === 'retry-delivery') {
    const result = await fulfillOrder(parsed.data.orderId);
    if (result.status === 'skipped') {
      return NextResponse.json({ error: '订单当前不可交付或已被其他任务处理' }, { status: 409 });
    }
    if (result.status === 'failed') {
      return NextResponse.json({ error: '交付仍然失败，请检查邮件配置和日志' }, { status: 502 });
    }
    return NextResponse.json({ success: true, status: result.status });
  }

  const updated = await setLicenseStatus(parsed.data.licenseId, parsed.data.status);
  if (!updated) {
    return NextResponse.json({ error: '授权状态未变化或记录不存在' }, { status: 409 });
  }
  return NextResponse.json({ success: true });
}
