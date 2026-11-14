'use client';

import { useMemo, useState } from 'react';
import { Link } from '@/i18n/navigation';
import type { IeltsTask } from '@/lib/ielts/types';
import { categoryLabel, ieltsCopy, topicLabel, type IeltsLocale } from './ielts-text';

/**
 * 对照库列表：搜索标题、题干和主题，按题型和主题筛选。
 *
 * 全量摘要参与筛选，卡片分批展示，避免后面的内容搜不到或一次挂载过多卡片。
 */

const PAGE_SIZE = 24;

export interface IeltsLibraryItem {
  slug: string;
  task: IeltsTask;
  category: string;
  topic: string;
  title: string;
  prompt: string;
  lowWords: number;
  highWords: number;
  upgrades: number;
  studied: boolean;
  bookmarked: boolean;
}

interface Props {
  locale: IeltsLocale;
  items: IeltsLibraryItem[];
}

export default function IeltsLibrary({ locale, items }: Props) {
  const copy = ieltsCopy(locale);
  const [task, setTask] = useState<'all' | IeltsTask>('all');
  const [topic, setTopic] = useState<'all' | string>('all');
  const [query, setQuery] = useState('');
  const [shownCount, setShownCount] = useState(PAGE_SIZE);

  const tasks = useMemo(() => {
    const order: IeltsTask[] = ['task2', 'task1-academic', 'task1-general'];
    return order.filter(value => items.some(item => item.task === value));
  }, [items]);

  const topics = useMemo(() => [...new Set(items.map(item => item.topic))].sort(), [items]);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return items.filter(item => {
      if (task !== 'all' && item.task !== task) return false;
      if (topic !== 'all' && item.topic !== topic) return false;
      const text = `${item.title} ${item.prompt} ${item.topic} ${topicLabel(locale, item.topic)}`;
      return !search || text.toLowerCase().includes(search);
    });
  }, [items, task, topic, query, locale]);
  const visible = filtered.slice(0, shownCount);

  const chipClass = (active: boolean) =>
    `min-h-11 min-w-11 shrink-0 rounded-full border px-3 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 ${
      active ? 'border-violet-400/60 bg-violet-400/15 text-white' : 'border-white/12 text-white/60 hover:text-white/85'
    }`;

  return (
    <div>
      <div className="space-y-3 border-b border-white/10 pb-5">
        <label className="block max-w-xl">
          <span className="t-footnote text-white/60">{copy.searchLabel}</span>
          <input
            type="search"
            value={query}
            onChange={event => { setQuery(event.target.value); setShownCount(PAGE_SIZE); }}
            placeholder={copy.searchPlaceholder}
            className="mt-2 min-h-11 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-base text-white placeholder:text-white/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
          />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <span className="t-footnote w-12 text-white/60">{copy.filterTask}</span>
          <button type="button" onClick={() => { setTask('all'); setShownCount(PAGE_SIZE); }} aria-pressed={task === 'all'} className={chipClass(task === 'all')}>
            {copy.filterAll}
          </button>
          {tasks.map(value => (
            <button key={value} type="button" onClick={() => { setTask(value); setShownCount(PAGE_SIZE); }} aria-pressed={task === value} className={chipClass(task === value)}>
              {copy.taskLabels[value]}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="t-footnote w-12 text-white/60">{copy.filterTopic}</span>
          <button type="button" onClick={() => { setTopic('all'); setShownCount(PAGE_SIZE); }} aria-pressed={topic === 'all'} className={chipClass(topic === 'all')}>
            {copy.filterAll}
          </button>
          {topics.map(value => (
            <button key={value} type="button" onClick={() => { setTopic(value); setShownCount(PAGE_SIZE); }} aria-pressed={topic === value} className={chipClass(topic === value)}>
              {topicLabel(locale, value)}
            </button>
          ))}
        </div>
      </div>

      <p role="status" aria-live="polite" className="mt-4 t-footnote text-white/60">
        {copy.searchCount(visible.length, filtered.length)}
      </p>

      {visible.length === 0 ? (
        <p className="mt-8 t-body text-white/60">{items.length === 0 ? copy.emptyLibrary : copy.empty}</p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map(item => (
            <li key={item.slug}>
              <Link
                href={`/study/ielts/${item.slug}`}
                className="glass-card flex h-full flex-col rounded-2xl border border-white/10 p-5 transition-colors hover:border-violet-400/40"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/12 bg-white/5 px-2 py-0.5 text-[11px] text-white/70">{copy.taskLabels[item.task]}</span>
                  <span className="rounded-full border border-white/12 bg-white/5 px-2 py-0.5 text-[11px] text-white/70">{categoryLabel(locale, item.category)}</span>
                  {item.studied && <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[11px] text-emerald-200">{copy.studiedBadge}</span>}
                  {item.bookmarked && <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[11px] text-amber-200">{copy.bookmarkedBadge}</span>}
                </div>
                <h3 className="mt-3 t-title-4 text-white">{item.title}</h3>
                <p className="mt-2 line-clamp-3 t-footnote text-white/55">{item.prompt}</p>
                <div className="mt-auto pt-4">
                  <p className="t-footnote text-white/45">
                    {copy.bandLow} {copy.words(item.lowWords)} · {copy.bandHigh} {copy.words(item.highWords)} · {copy.segments(item.upgrades)}
                  </p>
                  <p className="mt-2 text-sm text-violet-300">{copy.open} →</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {visible.length < filtered.length && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setShownCount(count => count + PAGE_SIZE)}
            className="min-h-11 rounded-full border border-violet-400/40 bg-violet-400/10 px-5 text-sm text-violet-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
          >
            {copy.loadMore(Math.min(PAGE_SIZE, filtered.length - visible.length))}
          </button>
        </div>
      )}
    </div>
  );
}
