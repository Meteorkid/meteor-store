'use client';

import { useEffect, useRef, useState } from 'react';

type CopyStatus = 'idle' | 'copying' | 'success' | 'error';
type GuideLocale = 'zh' | 'en';
type FetchGuide = (input: string) => Promise<{
  ok: boolean;
  status: number;
  text(): Promise<string>;
}>;

const labels: Record<GuideLocale, Record<CopyStatus, string>> = {
  zh: {
    idle: '复制给 LLM',
    copying: '复制中…',
    success: '已复制',
    error: '复制失败',
  },
  en: {
    idle: 'Copy for LLM',
    copying: 'Copying…',
    success: 'Copied',
    error: 'Copy failed',
  },
};

export function getBlogApiGuideCopyLabel(locale: GuideLocale, status: CopyStatus) {
  return labels[locale][status];
}

export async function copyBlogApiGuide(
  fetchGuide: FetchGuide,
  writeText: (text: string) => Promise<void>,
) {
  const response = await fetchGuide('/api/guide');
  if (!response.ok) {
    throw new Error(`Failed to load blog API guide: ${response.status}`);
  }

  await writeText(await response.text());
}

export default function BlogApiGuideCopyButton({ locale }: { locale: GuideLocale }) {
  const [status, setStatus] = useState<CopyStatus>('idle');
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

  const handleCopy = async () => {
    if (status === 'copying') return;
    if (resetTimer.current) clearTimeout(resetTimer.current);
    setStatus('copying');

    try {
      await copyBlogApiGuide(
        fetch,
        (markdown) => navigator.clipboard.writeText(markdown),
      );
      setStatus('success');
    } catch {
      setStatus('error');
    }

    resetTimer.current = setTimeout(() => setStatus('idle'), 2000);
  };

  const isCopying = status === 'copying';

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={isCopying}
      aria-busy={isCopying}
      aria-live="polite"
      className="glass inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:text-white disabled:cursor-wait disabled:opacity-60"
    >
      {status === 'success' ? (
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="m3 8 3 3 7-7" />
        </svg>
      ) : (
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="5.25" y="5.25" width="7.5" height="7.5" rx="1" />
          <path d="M10.75 5.25v-2a1 1 0 0 0-1-1h-6.5a1 1 0 0 0-1 1v6.5a1 1 0 0 0 1 1h2" />
        </svg>
      )}
      {getBlogApiGuideCopyLabel(locale, status)}
    </button>
  );
}
