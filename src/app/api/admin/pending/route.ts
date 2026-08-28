import { NextResponse } from 'next/server';
import { getAdminBadgeCounts } from '@/lib/admin-stats';
import { isAdminSession } from '@/lib/admin';
import { getSession } from '@/lib/auth';

/**
 * 管理员待办计数，供站内任意页面显示角标。
 *
 * 侧栏那套徽标只在后台布局里算，而后台布局只有进了后台才渲染——人在博客页、
 * 产品页时不会知道有新的待审内容。这个接口让头像上的角标在全站都能亮。
 *
 * **对非管理员返回 404 而不是 403**：与后台页面一致。403 等于告诉对方
 * 「这里确实有个管理接口」。
 */
export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  if (!session || !isAdminSession(session)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const counts = await getAdminBadgeCounts();
  const total = counts.pendingPosts + counts.pendingComments + counts.pendingReports
    + counts.pendingFeedback + counts.pendingPathfinder;

  return NextResponse.json({ counts, total }, {
    // 私有响应：线上是 nginx 反代，反代层对 /api/* 做统一缓存很常见，
    // 缓存住会让不同管理员看到同一份计数
    headers: { 'Cache-Control': 'no-store' },
  });
}
