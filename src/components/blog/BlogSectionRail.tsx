import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getSectionCounts } from '@/data/blog-feed';
import { getSectionsByChannel } from '@/data/blog-sections';
import type { Locale } from '@/i18n/routing';

interface BlogSectionRailProps {
  locale: Locale;
  activeSectionId?: string;
  activeStarMap?: boolean;
}

const RAIL_ACCENT = '251 113 133';

/**
 * 博客左侧的常驻分区索引。
 *
 * 和顶部胶囊工具条分工不同：胶囊负责快速横向切换，左栏负责在长列表里
 * 一直告诉读者“现在在哪、还有哪些栏目”。它只出现在 xl 及以上，
 * 由 BlogPageShell 放在内容列左侧的留白里，不挤占正文宽度。
 */
export default async function BlogSectionRail({
  locale,
  activeSectionId,
  activeStarMap = false,
}: BlogSectionRailProps) {
  const [counts, t] = await Promise.all([
    getSectionCounts(locale),
    getTranslations({ locale, namespace: 'BlogList' }),
  ]);
  const sections = getSectionsByChannel().flatMap(({ sections: list }) => list);
  const allActive = !activeSectionId && !activeStarMap;

  const rowClass =
    'flex min-h-10 items-center gap-2 rounded-md px-3 text-[13px] font-medium transition-colors duration-200';
  const idleClass = 'text-white/50 hover:bg-white/[0.035] hover:text-white';
  const activeStyle = (rgb: string) => ({
    color: 'rgb(255 255 255)',
    backgroundColor: `rgb(${rgb} / 0.10)`,
    boxShadow: `inset 2px 0 0 rgb(${rgb} / 0.72)`,
  });

  return (
    <div className="select-none">
      <div className="mb-3 flex items-center gap-2 pl-3">
        <span
          aria-hidden="true"
          className="h-1 w-1 rounded-full"
          style={{ backgroundColor: `rgb(${RAIL_ACCENT})` }}
        />
        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/45">
          {t('railTitle')}
        </span>
      </div>

      <nav aria-label={t('railAria')} className="space-y-0.5">
        <Link
          href="/blog"
          aria-current={allActive ? 'page' : undefined}
          className={`${rowClass} ${allActive ? '' : idleClass}`}
          style={allActive ? activeStyle(RAIL_ACCENT) : undefined}
        >
          {t('all')}
        </Link>

        {sections.map((section) => {
          const active = section.id === activeSectionId;
          const count = counts[section.id] ?? 0;

          return (
            <Link
              key={section.id}
              href={`/blog/section/${section.slug}`}
              title={section.description[locale]}
              aria-current={active ? 'page' : undefined}
              className={`${rowClass} ${active ? '' : idleClass}`}
              style={active ? activeStyle(section.rgb) : undefined}
            >
              <span className="min-w-0 truncate">{section.label[locale]}</span>
              {count > 0 && (
                <span
                  className={`ml-auto text-[11px] font-normal tabular-nums ${
                    active ? 'text-white/60' : 'text-white/30'
                  }`}
                >
                  {count}
                </span>
              )}
            </Link>
          );
        })}

        <Link
          href="/blog/stars"
          aria-current={activeStarMap ? 'page' : undefined}
          className={`${rowClass} mt-2 ${activeStarMap ? '' : idleClass}`}
          style={activeStarMap ? activeStyle(RAIL_ACCENT) : undefined}
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className="shrink-0 opacity-70"
          >
            <path d="M12 2l2.9 6.26 6.6.64-5 4.4 1.5 6.5L12 16.9 5.99 19.8 7.5 13.3l-5-4.4 6.6-.64z" />
          </svg>
          {t('starMap')}
        </Link>
      </nav>
    </div>
  );
}
