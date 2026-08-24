'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

const NAV_ITEMS = [
  { key: 'discover', href: '/pathfinder', exact: true },
  { key: 'opportunities', href: '/pathfinder/opportunities' },
  { key: 'directions', href: '/pathfinder/directions/ai' },
  { key: 'plan', href: '/pathfinder/plan' },
] as const;

function isActive(pathname: string, href: string, exact = false) {
  if (exact) return pathname === href;
  if (href.includes('/directions/')) return pathname.startsWith('/pathfinder/directions/');
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function PathfinderSubnav() {
  const pathname = usePathname();
  const t = useTranslations('PathfinderHub.navigation');

  return (
    <div className="glass sticky top-16 z-40 border-x-0 border-t-0">
      <div className="container mx-auto flex h-12 items-center gap-3 px-4 sm:h-14">
        <Link
          href="/pathfinder"
          className="mr-1 shrink-0 text-sm font-semibold tracking-tight text-white sm:mr-3"
        >
          Meteor <span className="text-violet-300">Pathfinder</span>
        </Link>
        <nav
          aria-label={t('ariaLabel')}
          className="no-scrollbar flex min-w-0 flex-1 items-stretch gap-1 overflow-x-auto"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href, 'exact' in item && item.exact);
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`flex shrink-0 items-center rounded-lg px-3 text-sm transition-colors duration-200 sm:px-4 ${
                  active
                    ? 'bg-white/[0.09] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
