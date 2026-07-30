'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export interface ReviewItem {
  id: string;
  title: string;
  excerpt: string;
  authorName: string | null;
  sectionLabel: string;
  tags: string[];
  createdAt: string;
  /** 服务端渲染好的正文 HTML，走的是和正式文章相同的 sanitize 管线 */
  html: string;
}

export default function ReviewQueue({ items }: { items: ReviewItem[] }) {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function decide(id: string, approve: boolean) {
    const note = notes[id]?.trim();
    if (!approve && !note) {
      setError('驳回要写明理由，作者会看到');
      return;
    }

    setBusyId(id);
    setError('');
    try {
      const res = await fetch('/api/posts/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: id, approve, note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '操作失败');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败');
    } finally {
      setBusyId(null);
    }
  }

  if (items.length === 0) {
    return <p className="t-body py-16 text-center text-white/60">队列是空的。</p>;
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="t-footnote text-red-400" role="alert">
          {error}
        </p>
      )}

      {items.map((item) => {
        const open = openId === item.id;
        return (
          <article
            key={item.id}
            className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6"
          >
            <div className="t-footnote mb-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-white/60">
              <span>{item.authorName || '匿名'}</span>
              <span aria-hidden className="text-white/20">·</span>
              <span>{item.sectionLabel}</span>
              <span aria-hidden className="text-white/20">·</span>
              <time className="tabular-nums" dateTime={item.createdAt}>
                {item.createdAt.slice(0, 10).replace(/-/g, '.')}
              </time>
            </div>

            <h2 className="t-title-3 mb-2 text-white/90">{item.title}</h2>
            <p className="mb-3 text-[0.9375rem] leading-relaxed text-white/60">{item.excerpt}</p>

            {item.tags.length > 0 && (
              <p className="t-footnote mb-4 text-white/60">
                {item.tags.map((t) => `#${t}`).join('  ')}
              </p>
            )}

            <button
              type="button"
              onClick={() => setOpenId(open ? null : item.id)}
              aria-expanded={open}
              className="t-footnote mb-4 text-white/60 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
            >
              {open ? '收起正文' : '读全文'}
            </button>

            {open && (
              <div
                className="blog-prose prose-invert prose mb-5 max-w-none rounded-xl border border-white/10 bg-black/25 px-5 py-4 prose-headings:text-white prose-p:text-white/70"
                dangerouslySetInnerHTML={{ __html: item.html }}
              />
            )}

            <div className="space-y-3 border-t border-white/[0.07] pt-4">
              <label htmlFor={`note-${item.id}`} className="sr-only">
                审核意见
              </label>
              <input
                id={`note-${item.id}`}
                value={notes[item.id] ?? ''}
                onChange={(e) => setNotes({ ...notes, [item.id]: e.target.value })}
                maxLength={500}
                placeholder="驳回理由（通过时可留空）"
                className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-[0.9375rem] text-white placeholder-white/50 focus:border-violet-500/60 focus:outline-none"
              />
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => decide(item.id, true)}
                  disabled={busyId === item.id}
                  className="rounded-xl bg-emerald-400 px-4 py-2 text-[0.9375rem] font-semibold text-black transition-[transform,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.985] disabled:opacity-40"
                >
                  通过并发布
                </button>
                <button
                  type="button"
                  onClick={() => decide(item.id, false)}
                  disabled={busyId === item.id}
                  className="rounded-xl border border-red-400/30 px-4 py-2 text-[0.9375rem] font-semibold text-red-300 transition-colors duration-200 hover:bg-red-500/10 disabled:opacity-40"
                >
                  驳回
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
