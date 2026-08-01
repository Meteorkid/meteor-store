'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { blogSections } from '@/data/blog-sections';
import type { Locale } from '@/i18n/routing';

const inputClass =
  'w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-[0.9375rem] text-white placeholder-white/50 transition-colors focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/40';
const labelClass = 't-footnote mb-2 block font-medium text-white/65';

interface PostSubmitFormProps {
  /** 服务端渲染好的预览 HTML，由父组件在预览时提供 */
  renderPreview: (markdown: string) => Promise<string>;
}

export default function PostSubmitForm({ renderPreview }: PostSubmitFormProps) {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations('BlogSubmitPage');

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [sectionId, setSectionId] = useState(blogSections[0].id as string);
  const [tagInput, setTagInput] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  const tags = tagInput
    .split(/[,，\s]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 8);

  const contentLength = content.trim().length;
  const canSubmit =
    title.trim().length >= 4 && excerpt.trim().length >= 10 && contentLength >= 200;

  async function send(submit: boolean) {
    setStatus('saving');
    setError('');

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          excerpt: excerpt.trim(),
          content: content.trim(),
          sectionId,
          tags,
          submit,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('submitFailed'));

      setStatus('done');
      router.push('/blog/my-posts');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : t('submitFailed'));
    }
  }

  async function togglePreview() {
    if (preview !== null) {
      setPreview(null);
      return;
    }
    setPreview(await renderPreview(content));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void send(true);
      }}
      className="space-y-6"
    >
      <div>
        <label htmlFor="post-title" className={labelClass}>
          {t('titleLabel')} <span className="font-normal text-white/45">（{t('titleHint')}）</span>
        </label>
        <input
          id="post-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={80}
          placeholder={t('titlePlaceholder')}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="post-excerpt" className={labelClass}>
          {t('excerptLabel')} <span className="font-normal text-white/45">（{t('excerptHint')}）</span>
        </label>
        <textarea
          id="post-excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          maxLength={200}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="post-section" className={labelClass}>
            {t('sectionLabel')}
          </label>
          <select
            id="post-section"
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
            className={`${inputClass} cursor-pointer`}
          >
            {blogSections.map((s) => (
              <option key={s.id} value={s.id} className="bg-zinc-900">
                {s.label[locale]} —— {s.description[locale]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="post-tags" className={labelClass}>
            {t('tagsLabel')} <span className="font-normal text-white/45">（{t('tagsHint')}）</span>
          </label>
          <input
            id="post-tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder={t('tagsPlaceholder')}
            className={inputClass}
          />
          {tags.length > 0 && (
            <p className="t-footnote mt-2 text-white/60">
              {tags.map((tag) => `#${tag}`).join('  ')}
            </p>
          )}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-baseline justify-between gap-4">
          <label htmlFor="post-content" className={`${labelClass} mb-0`}>
            {t('contentLabel')} <span className="font-normal text-white/45">（{t('contentHint')}）</span>
          </label>
          <button
            type="button"
            onClick={togglePreview}
            disabled={contentLength === 0}
            className="t-footnote text-white/60 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white disabled:opacity-40"
          >
            {preview !== null ? t('previewEdit') : t('preview')}
          </button>
        </div>

        {preview !== null ? (
          <div
            className="blog-prose prose-invert prose min-h-[24rem] max-w-none rounded-xl border border-white/10 bg-black/25 px-5 py-4 prose-headings:text-white prose-p:text-white/70"
            dangerouslySetInnerHTML={{ __html: preview }}
          />
        ) : (
          <textarea
            id="post-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={18}
            maxLength={50_000}
            placeholder={t('contentPlaceholder')}
            className={`${inputClass} resize-y font-mono text-[0.875rem] leading-relaxed`}
          />
        )}

        <p className="t-footnote mt-1.5 text-right tabular-nums text-white/60">
          {t('charCount', { count: contentLength })}
        </p>
      </div>

      {status === 'error' && (
        <p className="t-footnote text-red-400" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4 border-t border-white/[0.07] pt-6">
        <button
          type="submit"
          disabled={!canSubmit || status === 'saving'}
          className="rounded-xl bg-white px-5 py-2.5 text-[0.9375rem] font-semibold text-black transition-[transform,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status === 'saving' ? t('submitting') : t('submit')}
        </button>
        <button
          type="button"
          onClick={() => void send(false)}
          disabled={!title.trim() || status === 'saving'}
          className="t-footnote text-white/60 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white disabled:opacity-40"
        >
          {t('saveDraft')}
        </button>
        <p className="t-footnote text-white/45">{t('reviewHint')}</p>
      </div>
    </form>
  );
}
