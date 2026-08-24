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

export default function PathfinderSubnav() {
  const pathname = usePathname();
  const t = useTranslations('PathfinderHub.navigation');
  const activeItem = NAV_ITEMS.find((item) => isActive(pathname, item.href, 'exact' in item && item.exact))
    ?? NAV_ITEMS[0];

  return (
    <>
      <aside className="hidden xl:block">
        <div className="sticky top-24 py-12">
          <Link
            href="/pathfinder"
            className="flex items-center gap-2 t-eyebrow text-white/60 transition-colors hover:text-white/80"
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.7)]"
            />
            Pathfinder
          </Link>
          <nav aria-label={t('ariaLabel')} className="mt-5 space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href, 'exact' in item && item.exact);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex min-h-10 items-center rounded-r-lg border-l-2 px-3 py-2 text-sm transition-colors duration-200 ${
                    active
                      ? 'border-violet-400 bg-violet-400/[0.08] font-semibold text-white'
                      : 'border-transparent text-white/60 hover:border-white/20 hover:bg-white/[0.03] hover:text-white/80'
                  }`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <div className="px-4 pt-4 xl:hidden">
        <details key={pathname} className="group">
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm transition-colors hover:bg-white/[0.055] [&::-webkit-details-marker]:hidden">
            <span className="t-eyebrow text-violet-300">Pathfinder</span>
            <span className="h-4 w-px bg-white/15" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate font-medium text-white">{t(activeItem.key)}</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="h-4 w-4 shrink-0 text-white/60 transition-transform duration-200 group-open:rotate-180 motion-reduce:transform-none motion-reduce:transition-none"
            >
              <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </summary>
          <nav
            aria-label={t('ariaLabel')}
            className="mt-2 grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-black/80 p-1.5 shadow-2xl shadow-black/30 sm:grid-cols-4"
          >
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href, 'exact' in item && item.exact);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-lg px-3 py-2.5 text-center text-sm transition-colors duration-200 ${
                    active
                      ? 'bg-violet-400/[0.12] font-semibold text-white'
                      : 'text-white/60 hover:bg-white/[0.05] hover:text-white/80'
                  }`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>
        </details>
      </div>
    </>
  );
}
