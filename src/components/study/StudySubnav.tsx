'use client';

import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

const NAV_ITEMS = [
  { key: 'dashboard', href: '/study' },
  { key: 'courses', href: '/study/courses' },
  { key: 'algorithms', href: '/study/algorithms' },
] as const;

const LABELS = {
  zh: { dashboard: '学习工作台', courses: '课程与 GPA', algorithms: '算法训练', aria: '学习工作台导航' },
  en: { dashboard: 'Workbench', courses: 'Courses & GPA', algorithms: 'Algorithm practice', aria: 'Study navigation' },
} as const;

/** 三个学习页之间的切换；只负责高亮与跳转，不参与数据加载。 */
export default function StudySubnav() {
  const pathname = usePathname();
  const locale = useLocale() === 'en' ? 'en' : 'zh';
  const copy = LABELS[locale];

  return (
    <nav aria-label={copy.aria} className="border-b border-white/10">
      <div className="container mx-auto flex gap-1 overflow-x-auto px-4">
        {NAV_ITEMS.map(item => {
          const active = item.href === '/study' ? pathname === '/study' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`inline-flex min-h-11 shrink-0 items-center border-b-2 px-3 text-sm transition-colors ${
                active
                  ? 'border-violet-400 font-semibold text-white'
                  : 'border-transparent text-white/60 hover:border-white/20 hover:text-white/85'
              }`}
            >
              {copy[item.key]}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
