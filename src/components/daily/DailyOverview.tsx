import type { DailyEditionEntry } from './state';
import type { DailyCopy } from './text';
import styles from './DailyOverview.module.css';

export default function DailyOverview({ entries, isToday, showMasters, locale, copy }: {
  entries: DailyEditionEntry[];
  isToday: boolean;
  showMasters: boolean;
  locale: 'zh' | 'en';
  copy: DailyCopy;
}) {
  if (entries.length === 0) return null;
  const published = entries.filter(entry => entry.status === 'published');
  const read = published.filter(entry => entry.isRead).length;
  const title = isToday ? copy.overviewToday : copy.overviewEdition;

  return <nav aria-label={title} className="mb-6 border-b border-white/10 pb-6">
    <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
      <h2 className="t-title-4 text-white">{title}</h2>
      <p className="t-footnote text-white/60">
        {copy.overviewAvailable} {published.length}
        {published.length > 0 && <> · {copy.read} {read}/{published.length}</>}
      </p>
    </div>
    <ul className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
      {entries.map(({ channel, edition, status, isRead }) => {
        const content = status === 'published' ? edition?.content : null;
        const previewTitle = content && content.kind !== 'english' ? content.items[0]?.title : edition?.title;
        const count = content?.kind === 'english' ? copy.overviewLesson
          : content ? `${content.items.length} ${content.items.length === 1 ? copy.overviewItem : copy.overviewItems}` : null;
        return <li key={channel.id} className="min-w-0">
          <a href={`#${channel.id}`} className={`${styles.link} flex h-full min-h-24 flex-col rounded-xl border border-white/10 bg-white/[0.02] p-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300`}>
            <span className="flex items-start justify-between gap-2 text-sm font-semibold text-white">
              <span>{channel[locale]}</span><span aria-hidden="true" className="text-violet-200">↓</span>
            </span>
            <span className={`mt-2 line-clamp-2 t-footnote ${status === 'failed' ? 'text-amber-200' : 'text-white/70'}`}>
              {content ? previewTitle : copy[status]}
            </span>
            {count && <span className="mt-2 flex flex-wrap gap-x-2 t-footnote text-white/60">
              <span>{count}</span><span className={isRead ? 'text-emerald-200' : undefined}>{isRead ? `✓ ${copy.read}` : copy.overviewUnread}</span>
            </span>}
          </a>
        </li>;
      })}
    </ul>
    {showMasters && <a href="#masters" className="mt-3 flex min-h-11 flex-wrap items-center justify-between gap-2 rounded-lg px-1 text-sm text-violet-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300">
      <span>{copy.overviewMasters} <span aria-hidden="true">↓</span></span>
      <span className="t-footnote text-white/60">{copy.overviewYearRound}</span>
    </a>}
  </nav>;
}
