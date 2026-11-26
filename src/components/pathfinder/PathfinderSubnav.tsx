'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

const NAV_ITEMS = [
  { key: 'discover', href: '/pathfinder', exact: true },
  { key: 'opportunities', href: '/pathfinder/opportunities' },
  { key: 'directions', href: '/pathfinder/directions/ai' },
  { key: 'plan', href: '/pathfinder/plan' },
  { key: 'topics', href: '/pathfinder/topics' },
  { key: 'weekly', href: '/pathfinder/weekly' },
  { key: 'saved', href: '/pathfinder/saved' },
] as const;

function isActive(pathname: string, href: string, exact = false) {
  if (exact) return pathname === href;
  if (href === '/pathfinder/opportunities' && pathname.startsWith('/pathfinder/items/')) return true;
  if (href.includes('/directions/')) return pathname.startsWith('/pathfinder/directions/');
  // 机构页与主题页是同一个「按维度浏览」入口，两边都要点亮
  if (href === '/pathfinder/topics') return pathname.startsWith('/pathfinder/topics') || pathname.startsWith('/pathfinder/organizations');
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Pathfinder 的栏目条。
 *
 * 原先 xl 以上是一条 10rem 左栏，阅读时永久占掉内容宽度；窄屏又折叠成 details，
 * 二级入口在手机上是「先展开再点」的两步。现在统一成 Header 下的一条横向栏目条：
 * 桌面一行排开，手机横向滚动，所有入口始终可见、可点。
 */
export default function PathfinderSubnav() {
  const pathname = usePathname();
  const t = useTranslations('PathfinderHub.navigation');

  return (
    <nav aria-label={t('ariaLabel')} className="border-b border-white/10 bg-black/60 backdrop-blur-md">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="relative">
          <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link
            href="/pathfinder"
            className="mr-1 inline-flex min-h-12 shrink-0 items-center gap-2 px-2.5 t-eyebrow text-white/55 transition-colors hover:text-white/85"
          >
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_10px_var(--site-accent)]" />
            Pathfinder
          </Link>
          <span aria-hidden="true" className="mx-1 h-5 w-px shrink-0 bg-white/10" />
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href, 'exact' in item && item.exact);
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`relative inline-flex min-h-12 shrink-0 items-center px-3.5 text-sm transition-colors duration-200 after:absolute after:inset-x-3 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-violet-300 after:transition-transform after:duration-200 ${
                  active
                    ? 'font-semibold text-white after:scale-x-100'
                    : 'text-white/55 hover:text-white/85'
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
          </div>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black via-black/50 to-transparent sm:hidden"
          />
        </div>
      </div>
    </nav>
  );
}
