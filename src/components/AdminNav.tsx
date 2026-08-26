'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { usePathname } from 'next/navigation';
import type { AdminBadgeCounts } from '@/lib/admin-stats';

/**
 * 后台侧边导航。
 *
 * 竖排而不是横排：后台已经有 13 个页面，横排要么换行成两三行把正文顶下去，
 * 要么横向滚动把后面几项藏起来——两种都让「这个后台有哪些能力」不可见。
 * 竖排一屏列全，还能按职能分组。
 *
 * **文件名和 href 的字面量写法别改**：`admin-entry.test.ts` 靠正则扫这个文件的源码
 * （`href: '…'`），保证每个 `/admin/*` 目录都在导航里、且导航不指向已删除的页面。
 * 把路径拼成变量或常量表，那条约束会静默失效。
 */

interface NavItem {
  href: string;
  label: string;
  /** 待办条数，>0 时显示徽标 */
  badge?: number;
}

export default function AdminNav({ counts }: { counts?: AdminBadgeCounts }) {
  const t = useTranslations('AdminNav');
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const groups: { title: string; items: NavItem[] }[] = [
    {
      title: t('groupOverview'),
      items: [{ href: '/admin', label: t('dashboard') }],
    },
    {
      title: t('groupContent'),
      items: [
        { href: '/admin/review', label: t('review'), badge: counts?.pendingPosts },
        { href: '/admin/posts', label: t('posts') },
        { href: '/admin/comments', label: t('comments'), badge: counts?.pendingComments },
        { href: '/admin/reports', label: t('reports'), badge: counts?.pendingReports },
      ],
    },
    {
      title: t('groupPeople'),
      items: [
        { href: '/admin/users', label: t('users') },
        { href: '/admin/feedback', label: t('feedback'), badge: counts?.pendingFeedback },
      ],
    },
    {
      title: t('groupCommerce'),
      items: [
        { href: '/admin/commerce', label: t('commerce') },
        { href: '/admin/invite-codes', label: t('inviteCodes') },
      ],
    },
    {
      title: t('groupSite'),
      items: [
        { href: '/admin/announcements', label: t('announcements') },
        { href: '/admin/pathfinder', label: 'Pathfinder' },
      ],
    },
    {
      title: t('groupSecurity'),
      items: [
        { href: '/admin/audit-logs', label: t('auditLogs') },
        { href: '/admin/mfa', label: t('mfa') },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === `/${locale}/admin` || pathname === `/${locale}/admin/`;
    }
    return pathname.startsWith(`/${locale}${href}`);
  };

  const activeLabel =
    groups.flatMap((g) => g.items).find((item) => isActive(item.href))?.label ?? t('dashboard');

  const totalBadge = (counts?.pendingPosts ?? 0) + (counts?.pendingComments ?? 0)
    + (counts?.pendingReports ?? 0) + (counts?.pendingFeedback ?? 0);

  const list = (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="t-eyebrow px-3 text-white/35">{group.title}</p>
          <ul className="mt-2 space-y-0.5">
            {group.items.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                      active
                        ? 'bg-white/10 font-medium text-white'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-xs font-medium tabular-nums text-violet-300">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* 移动端：折叠成一个当前页按钮，展开后仍是竖排列表 */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="glass-card flex w-full items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-white"
        >
          <span className="flex items-center gap-2">
            <span className="text-white/45">{t('menu')}</span>
            <span className="font-medium">{activeLabel}</span>
            {totalBadge > 0 && (
              <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-xs font-medium tabular-nums text-violet-300">
                {totalBadge}
              </span>
            )}
          </span>
          <span aria-hidden className={`transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
        </button>
        {open && (
          <nav aria-label={t('ariaLabel')} className="mt-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
            {list}
          </nav>
        )}
      </div>

      {/* 桌面端：常驻侧栏，长页面滚动时跟随 */}
      <nav
        aria-label={t('ariaLabel')}
        className="hidden w-56 shrink-0 lg:block xl:w-60"
      >
        <div className="sticky top-24">{list}</div>
      </nav>
    </>
  );
}
