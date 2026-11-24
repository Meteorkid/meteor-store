'use client';

import { dailyChannels } from '@/lib/daily/channels';
import type { DailyEditionEntry } from './state';
import type { DailyCopy } from './text';

type NavItem = {
  id: string;
  index: number;
  label: string;
  status: DailyEditionEntry['status'] | 'calendar';
  isRead: boolean;
};

export default function DailyChannelNav({ entries, showMasters, activeId, onNavigate, locale, copy, overviewLabel, variant }: {
  entries: DailyEditionEntry[];
  showMasters: boolean;
  activeId: string;
  onNavigate: (id: string) => void;
  locale: 'zh' | 'en';
  copy: DailyCopy;
  overviewLabel: string;
  variant: 'desktop' | 'mobile';
}) {
  const masters = dailyChannels.find(channel => channel.id === 'masters')!;
  const items: NavItem[] = [
    ...entries.map((entry, index) => ({
      id: entry.channel.id,
      index,
      label: entry.channel[locale],
      status: entry.status,
      isRead: entry.isRead,
    })),
    ...(showMasters ? [{ id: 'masters', index: entries.length, label: masters[locale], status: 'calendar' as const, isRead: false }] : []),
  ];
  if (items.length === 0) return null;

  if (variant === 'mobile') {
    const overviewActive = activeId === 'daily-overview';
    return <nav aria-label={copy.channelNav} className="-mx-4 mb-5 overflow-x-auto border-y border-white/10 bg-white/[0.02] px-4 py-3 lg:hidden">
      <div className="flex w-max items-center gap-2">
        <a href="#daily-overview" onClick={() => onNavigate('daily-overview')} aria-current={overviewActive ? 'true' : undefined}
          className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 ${overviewActive ? 'border-violet-400/50 bg-violet-400/10 text-white' : 'border-white/10 text-white/60'}`}>
          <span aria-hidden="true">↑</span>{overviewLabel}
        </a>
        {items.map(item => {
          const active = activeId === item.id;
          return <a key={item.id} href={`#${item.id}`} onClick={() => onNavigate(item.id)} aria-current={active ? 'true' : undefined}
            className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 ${active ? 'border-violet-400/50 bg-violet-400/10 text-white' : 'border-white/10 text-white/60'}`}>
            <span className="font-mono text-[11px] text-violet-300/80">{String(item.index + 1).padStart(2, '0')}</span>
            <span>{item.label}</span>
            {item.isRead && <span aria-hidden="true" className="text-emerald-200">✓</span>}
            <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${statusDot(item.status)}`} />
            <span className="sr-only">{statusText(item, copy)}</span>
          </a>;
        })}
      </div>
    </nav>;
  }

  return <aside className="hidden min-w-0 lg:block">
    <nav aria-label={copy.channelNav} className="sticky top-24">
      <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-white/10 pb-2">
        <p className="t-eyebrow text-white/45">{copy.channelNav}</p>
        <span className="t-footnote tabular-nums text-white/35">{items.length}</span>
      </div>
      <a href="#daily-overview" onClick={() => onNavigate('daily-overview')} aria-current={activeId === 'daily-overview' ? 'true' : undefined}
        className={`mb-2 flex min-h-10 items-center gap-2 border-l-2 py-2 pl-3 pr-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 ${activeId === 'daily-overview' ? 'border-violet-400 bg-violet-400/10 text-white' : 'border-transparent text-white/50 hover:bg-white/5 hover:text-white/80'}`}>
        <span aria-hidden="true" className="text-violet-300/70">↑</span>{overviewLabel}
      </a>
      <ul className="space-y-1">
        {items.map(item => {
          const active = activeId === item.id;
          return <li key={item.id}>
            <a href={`#${item.id}`} onClick={() => onNavigate(item.id)} aria-current={active ? 'true' : undefined}
              className={`flex items-center gap-2.5 border-l-2 py-2.5 pl-3 pr-2 text-sm leading-5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 ${active ? 'border-violet-400 bg-violet-400/10 text-white' : 'border-transparent text-white/55 hover:bg-white/5 hover:text-white/80'}`}>
              <span className={`w-5 shrink-0 font-mono text-[11px] ${active ? 'text-violet-200' : 'text-violet-300/60'}`}>{String(item.index + 1).padStart(2, '0')}</span>
              <span className="min-w-0 flex-1">{item.label}</span>
              {item.isRead && <span aria-hidden="true" className="text-emerald-200">✓</span>}
              <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusDot(item.status)}`} />
              <span className="sr-only">{statusText(item, copy)}</span>
            </a>
          </li>;
        })}
      </ul>
    </nav>
  </aside>;
}

function statusDot(status: NavItem['status']) {
  if (status === 'failed') return 'bg-amber-300';
  if (status === 'published') return 'bg-emerald-300/80';
  if (status === 'calendar') return 'bg-violet-300/60';
  return 'bg-white/25';
}

function statusText(item: NavItem, copy: DailyCopy) {
  if (item.status === 'calendar') return copy.overviewYearRound;
  if (item.status === 'published') return item.isRead ? copy.read : copy.statusPublished;
  if (item.status === 'empty') return copy.statusEmpty;
  if (item.status === 'failed') return copy.statusFailed;
  return copy.statusUnpublished;
}
