'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { LEARN_PRIMARY, learnPrimaryForPath, learnSecondaryActive, learnSecondaryFor } from '@/lib/learn-nav';

/**
 * 学习与机会的统一栏目条。
 *
 * 一级只放真正不同的目的地：发现、学习工作台、雅思听力、学习方向、
 * 学习计划、申请日历、我的收藏。机会库 / 主题与机构 / 本周属于「发现」
 * 的下一级分类，放在第二行；学习课程、算法、写作、生词本同理归到工作台。
 */
export default function LearnSubnav() {
  const pathname = usePathname();
  const t = useTranslations('PathfinderHub.navigation');
  const primary = learnPrimaryForPath(pathname);
  const secondary = learnSecondaryFor(primary);

  return (
    <nav aria-label={t('ariaLabel')} data-study-subnav className="border-b border-white/10 bg-black/60 backdrop-blur-md">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {LEARN_PRIMARY.map(item => {
            const active = primary === item.key;
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={active ? 'true' : undefined}
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
      </div>

      {secondary.length > 0 && (
        <div className="border-t border-white/[0.06] bg-white/[0.02]">
          <div className="mx-auto w-full max-w-7xl px-4">
            <div role="group" aria-label={t('secondaryAria')} className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {secondary.map(item => {
                const active = learnSecondaryActive(pathname, item.key);
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`inline-flex min-h-11 shrink-0 items-center rounded-full px-3 t-footnote transition-colors ${
                      active
                        ? 'bg-white/10 font-semibold text-white'
                        : 'text-white/55 hover:bg-white/[0.05] hover:text-white/80'
                    }`}
                  >
                    {t(item.key)}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
