import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getAdminEmails } from '@/lib/admin';
import { getAdminBadgeCounts } from '@/lib/admin-stats';
import { sendAdminPendingDigest } from '@/lib/email';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

// 涉及邮件 IO，显式延长函数超时时间
export const maxDuration = 30;

/**
 * 管理员待办摘要。
 * 用法：POST /api/cron/admin-digest
 * Header: Authorization: Bearer <PATHFINDER_CRON_SECRET>
 *
 * 站内角标只在人打开网站时才看得到；这封信补的是「完全离开站点」的情况。
 *
 * **有待办才发，没有就不打扰**——一个每天准时到达、内容永远是「0 项待处理」
 * 的提醒，很快就会被规则过滤掉，真有事的那天也一起被过滤了。
 *
 * 去重靠调用频率本身：按天调一次就一天最多一封，不需要额外的去重表。
 *
 * 与其它 Pathfinder 维护任务共用 PATHFINDER_CRON_SECRET：都是同一台调度器上的
 * 后台任务，再拆一个密钥只会多一个要轮换的东西。
 */
export async function POST(request: NextRequest) {
  // 常数时间比较，防时序侧信道
  const authHeader = request.headers.get('authorization') || '';
  const secret = process.env.PATHFINDER_CRON_SECRET;
  const expected = `Bearer ${secret}`;
  const provided = Buffer.from(authHeader);
  const wanted = Buffer.from(expected);
  if (!secret || provided.length !== wanted.length || !crypto.timingSafeEqual(provided, wanted)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  // 发信有成本，Redis 异常时 fail-closed
  const { limited } = await rateLimit(`cron-admin-digest:${getClientIp(request)}`, 6, 60_000, {
    failClosed: true,
  });
  if (limited) return NextResponse.json({ error: '请求过于频繁' }, { status: 429 });

  const recipients = getAdminEmails();
  if (recipients.length === 0) {
    return NextResponse.json({ sent: false, reason: 'ADMIN_EMAILS 未配置' });
  }

  const counts = await getAdminBadgeCounts();
  const items = [
    { label: '待审文章', count: counts.pendingPosts, href: '/zh/admin/review' },
    { label: '待审评论', count: counts.pendingComments, href: '/zh/admin/comments' },
    { label: '待处理举报', count: counts.pendingReports, href: '/zh/admin/reports' },
    { label: '待处理反馈', count: counts.pendingFeedback, href: '/zh/admin/feedback' },
    { label: 'Pathfinder 待办', count: counts.pendingPathfinder, href: '/zh/admin/pathfinder' },
  ].filter((item) => item.count > 0);

  const total = items.reduce((sum, item) => sum + item.count, 0);
  if (total === 0) return NextResponse.json({ sent: false, total: 0 });

  await sendAdminPendingDigest({ to: recipients, items, total });
  return NextResponse.json({ sent: true, total, recipients: recipients.length });
}
