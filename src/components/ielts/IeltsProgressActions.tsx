'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { ieltsCopy, type IeltsLocale } from './ielts-text';

/**
 * 「已学 / 收藏」按钮。
 *
 * 状态由服务端渲染传入，点击后按接口回读的真实状态渲染——
 * 不做乐观更新，避免网络失败时按钮亮着、刷新后又灭掉。
 * 未登录时按钮位置给一条登录链接，回跳本页。
 */

interface Props {
  locale: IeltsLocale;
  slug: string;
  userId: string | null;
  initialStudied: boolean;
  initialBookmarked: boolean;
}

export default function IeltsProgressActions({ locale, slug, userId, initialStudied, initialBookmarked }: Props) {
  const copy = ieltsCopy(locale);
  const [studied, setStudied] = useState(initialStudied);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [pending, setPending] = useState<'studied' | 'bookmarked' | null>(null);
  const [error, setError] = useState(false);

  if (!userId) {
    return (
      <p className="t-footnote text-white/55">
        <Link href={{ pathname: '/login', query: { next: `/study/ielts/${slug}` } }} className="text-violet-300 underline decoration-violet-400/40 underline-offset-4 hover:text-violet-200">
          {copy.progressLogin}
        </Link>
      </p>
    );
  }

  const toggle = async (kind: 'studied' | 'bookmarked') => {
    if (pending) return;
    setPending(kind);
    setError(false);
    try {
      const response = await fetch('/api/ielts/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-ielts-user': userId },
        body: JSON.stringify({ slug, kind }),
      });
      if (!response.ok) throw new Error('failed');
      const data = await response.json() as { progress?: { studiedAt: string | null; bookmarkedAt: string | null } };
      setStudied(Boolean(data.progress?.studiedAt));
      setBookmarked(Boolean(data.progress?.bookmarkedAt));
    } catch {
      setError(true);
    } finally {
      setPending(null);
    }
  };

  const buttonClass = (active: boolean) =>
    `inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm transition-colors ${
      active ? 'border-violet-400/60 bg-violet-400/15 text-white' : 'border-white/15 text-white/75 hover:border-white/30 hover:text-white'
    }`;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={() => toggle('studied')} aria-pressed={studied} disabled={pending !== null} className={buttonClass(studied)}>
        <span aria-hidden="true">{studied ? '✓' : '○'}</span>
        {studied ? copy.unmarkStudied : copy.markStudied}
      </button>
      <button type="button" onClick={() => toggle('bookmarked')} aria-pressed={bookmarked} disabled={pending !== null} className={buttonClass(bookmarked)}>
        <span aria-hidden="true">{bookmarked ? '★' : '☆'}</span>
        {bookmarked ? copy.unmarkBookmarked : copy.markBookmarked}
      </button>
      {error && <span className="t-footnote text-amber-300">{copy.progressFailed}</span>}
    </div>
  );
}
