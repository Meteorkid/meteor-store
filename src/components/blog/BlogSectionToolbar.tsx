import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getSectionCounts } from '@/data/blog-feed';
import { getSectionsByChannel } from '@/data/blog-sections';
import type { Locale } from '@/i18n/routing';
import ToolbarScroller from './ToolbarScroller';

interface BlogSectionToolbarProps {
  locale: Locale;
  activeSectionId?: string;
  activeStarMap?: boolean;
}

/**
 * 博客分区工具条：线上已经部署的那条胶囊导航。
 *
 * 保留原来的结构：星图入口 → 全部 → 产品 & 技术 / 人文两组分区。
 * 它是页面内容里的一个玻璃工具条，不再另外铺一条全宽导航。
 */
export default async function BlogSectionToolbar({
  locale,
  activeSectionId,
  activeStarMap = false,
}: BlogSectionToolbarProps) {
  const [counts, t] = await Promise.all([
    getSectionCounts(locale),
    getTranslations({ locale, namespace: 'BlogList' }),
  ]);
  const channelGroups = getSectionsByChannel();

  return (
    <div className="blog-toolbar glass relative mb-8 p-2">
      <ToolbarScroller label={t('sectionsAria')}>
        <Link
          href="/blog/stars"
          title={t('starMap')}
          aria-current={activeStarMap ? 'page' : undefined}
          className={`shrink-0 rounded-full px-3 py-2 text-sm font-medium transition-colors duration-200 ${
            activeStarMap ? 'text-white' : 'text-white/50 hover:text-white'
          }`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className="inline-block"
          >
            <path d="M12 2l2.9 6.26 6.6.64-5 4.4 1.5 6.5L12 16.9 5.99 19.8 7.5 13.3l-5-4.4 6.6-.64z" />
          </svg>
          <span className="sr-only">{t('starMap')}</span>
        </Link>
        <Link
          href="/blog"
          aria-current={!activeSectionId && !activeStarMap ? 'page' : undefined}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
            !activeSectionId && !activeStarMap
              ? 'bg-white/[0.12] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]'
              : 'text-white/50 hover:text-white'
          }`}
        >
          {t('all')}
        </Link>

        {channelGroups.map(({ channel, sections }) => (
          <div key={channel.id} className="flex shrink-0 items-center gap-1">
            <span aria-hidden="true" className="mx-2 h-5 w-px bg-white/10" />
            <span className="t-eyebrow mr-1 shrink-0 text-white/60">{channel.label[locale]}</span>
            {sections.map((section) => {
              const active = section.id === activeSectionId;
              const count = counts[section.id] ?? 0;
              return (
                <Link
                  key={section.id}
                  href={`/blog/section/${section.slug}`}
                  title={section.description[locale]}
                  aria-current={active ? 'page' : undefined}
                  style={{ '--tab-accent': section.rgb } as React.CSSProperties}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    active ? 'blog-tab--active' : 'text-white/50 hover:text-white'
                  }`}
                >
                  {section.label[locale]}
                  {count > 0 && (
                    <span className="ml-1.5 text-[11px] font-normal tabular-nums opacity-70">
                      {count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </ToolbarScroller>
    </div>
  );
}
