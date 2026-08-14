import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { isAdminSession } from '@/lib/admin';
import { logAdminAction } from '@/lib/admin-audit';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import {
  listReports,
  resolveReport,
  ReportError,
  type ReportStatus,
  type ReportTargetType,
} from '@/lib/reports';

function forbidden() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

/**
 * 管理员查看举报列表。
 * 查询参数(均可选):
 *  - status=pending|resolved|dismissed
 *  - targetType=comment|post
 *  - targetId=<id>  (必须配合 targetType 使用,定位到具体目标的举报)
 */
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || !isAdminSession(session)) return forbidden();

  const statusParam = req.nextUrl.searchParams.get('status');
  const targetTypeParam = req.nextUrl.searchParams.get('targetType');
  const targetId = req.nextUrl.searchParams.get('targetId');

  const validStatuses: ReportStatus[] = ['pending', 'resolved', 'dismissed'];
  const validTargetTypes: ReportTargetType[] = ['comment', 'post'];
  const status =
    statusParam && validStatuses.includes(statusParam as ReportStatus)
      ? (statusParam as ReportStatus)
      : undefined;
  const targetType =
    targetTypeParam && validTargetTypes.includes(targetTypeParam as ReportTargetType)
      ? (targetTypeParam as ReportTargetType)
      : undefined;

  // targetId 必须配合 targetType 使用,单独传 targetId 无意义
  const finalTargetId = targetType && targetId ? targetId : undefined;

  const rows = await listReports(status, targetType, finalTargetId);
  return NextResponse.json({ reports: rows });
}

const PatchSchema = z.object({
  reportId: z.string().min(1),
  action: z.enum(['resolve', 'dismiss']),
});

/**
 * 管理员处理举报:采纳(resolve)或驳回(dismiss)。
 * 注意:这里只改举报记录状态,不会自动删除被举报内容——
 * 删除/驳回内容走各自的管理员接口,避免"举报即删"被人当武器。
 */
export async function PATCH(req: NextRequest) {
  const ip = getClientIp(req);
  const { limited } = await rateLimit(`admin-reports:ip:${ip}`, 30, 60_000, {
    fallback: 'memory',
  });
  if (limited) {
    return NextResponse.json({ error: '请求过于频繁' }, { status: 429 });
  }

  const session = await getSession();
  if (!session || !isAdminSession(session)) return forbidden();

  const body = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  try {
    await resolveReport({
      reportId: parsed.data.reportId,
      action: parsed.data.action,
      resolverId: session.userId,
    });
    await logAdminAction(session, {
      action: `report.${parsed.data.action}`,
      targetType: 'report',
      targetId: parsed.data.reportId,
      ip,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof ReportError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }
}
