'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { usePathname } from 'next/navigation';

export default function AdminNav() {
  const t = useTranslations('AdminNav');
  const locale = useLocale();
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: t('dashboard') },
    { href: '/admin/review', label: t('review') },
    { href: '/admin/posts', label: t('posts') },
    { href: '/admin/comments', label: t('comments') },
    { href: '/admin/reports', label: t('reports') },
    { href: '/admin/feedback', label: t('feedback') },
    { href: '/admin/commerce', label: t('commerce') },
    { href: '/admin/announcements', label: t('announcements') },
    { href: '/admin/invite-codes', label: t('inviteCodes') },
    { href: '/admin/audit-logs', label: t('auditLogs') },
    { href: '/admin/mfa', label: t('mfa') },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === `/${locale}/admin` || pathname === `/${locale}/admin/`;
    }
    return pathname.startsWith(`/${locale}${href}`);
  };

  return (
    <nav className="flex overflow-x-auto flex-wrap gap-2">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`rounded-lg px-4 py-2 text-sm transition-colors ${
            isActive(item.href)
              ? 'bg-white/10 text-white'
              : 'text-white/50 hover:text-white hover:bg-white/5'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
