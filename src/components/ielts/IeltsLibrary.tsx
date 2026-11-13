'use client';

import { useMemo, useState } from 'react';
import { Link } from '@/i18n/navigation';
import type { IeltsTask } from '@/lib/ielts/types';
import { categoryLabel, ieltsCopy, topicLabel, type IeltsLocale } from './ielts-text';

/**
 * 对照库列表：按题型和主题筛选，点开进入逐句对照。
 *
 * 筛选在客户端做——一组对照的元数据只有几百字节，六到几十组一次取完
 * 比每次筛选都回服务器便宜，也不会在切换筛选时整页闪一下。
 */

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

  const tasks = useMemo(() => {
    const order: IeltsTask[] = ['task2', 'task1-academic', 'task1-general'];
    return order.filter(value => items.some(item => item.task === value));
  }, [items]);

  const topics = useMemo(() => [...new Set(items.map(item => item.topic))].sort(), [items]);

  const visible = items.filter(item => (task === 'all' || item.task === task) && (topic === 'all' || item.topic === topic));

  const chipClass = (active: boolean) =>
    `min-h-8 shrink-0 rounded-full border px-3 text-xs transition-colors ${
      active ? 'border-violet-400/60 bg-violet-400/15 text-white' : 'border-white/12 text-white/60 hover:text-white/85'
    }`;

  return (
    <div>
      <div className="space-y-3 border-b border-white/10 pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="t-footnote w-12 text-white/40">{copy.filterTask}</span>
          <button type="button" onClick={() => setTask('all')} aria-pressed={task === 'all'} className={chipClass(task === 'all')}>
            {copy.filterAll}
          </button>
          {tasks.map(value => (
            <button key={value} type="button" onClick={() => setTask(value)} aria-pressed={task === value} className={chipClass(task === value)}>
              {copy.taskLabels[value]}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="t-footnote w-12 text-white/40">{copy.filterTopic}</span>
          <button type="button" onClick={() => setTopic('all')} aria-pressed={topic === 'all'} className={chipClass(topic === 'all')}>
            {copy.filterAll}
          </button>
          {topics.map(value => (
            <button key={value} type="button" onClick={() => setTopic(value)} aria-pressed={topic === value} className={chipClass(topic === value)}>
              {topicLabel(locale, value)}
            </button>
          ))}
        </div>
      </div>

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
    </div>
  );
}
