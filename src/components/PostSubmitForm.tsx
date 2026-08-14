'use client';

import { useState, useRef } from 'react';

/** 本地时区的今天（YYYY-MM-DD），作为新建投稿事件时间的默认值 */
function todayLocalDate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
import { useRouter, Link } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { blogSections } from '@/data/blog-sections';
import type { Locale } from '@/i18n/routing';
import type { UserPost } from '@/lib/posts';

const inputClass =
  'w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-[0.9375rem] text-white placeholder-white/50 transition-colors focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/40';
const labelClass = 't-footnote mb-2 block font-medium text-white/65';

interface PostSubmitFormProps {
  /** 服务端渲染好的预览 HTML，由父组件在预览时提供 */
  renderPreview: (markdown: string) => Promise<string>;
  /** 编辑模式时传入已有文章；不传或 null 为新建 */
  initialPost?: UserPost | null;
}

export default function PostSubmitForm({ renderPreview, initialPost }: PostSubmitFormProps) {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations('BlogSubmitPage');

  const isEdit = !!initialPost;
  const [title, setTitle] = useState(initialPost?.title ?? '');
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? '');
  const [content, setContent] = useState(initialPost?.content ?? '');
  const [sectionId, setSectionId] = useState(initialPost?.sectionId ?? (blogSections[0].id as string));
  const [extraSectionIds, setExtraSectionIds] = useState<string[]>(
    initialPost?.sections?.filter((s) => s !== initialPost.sectionId) ?? [],
  );
  const [tagInput, setTagInput] = useState(initialPost?.tags.join(', ') ?? '');
  const [eventDate, setEventDate] = useState(initialPost?.eventDate ?? todayLocalDate());
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      // 编辑模式走 PATCH /api/posts/[id]，新建走 POST /api/posts
      const url = isEdit ? `/api/posts/${initialPost!.id}` : '/api/posts';
      const method = isEdit ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          excerpt: excerpt.trim(),
          content: content.trim(),
          sectionId,
          sections: [sectionId, ...extraSectionIds],
          tags,
          eventDate: eventDate.trim() || null,
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

  async function handleImageUpload(file: File) {
    setImageUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/blog/upload-image', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('imageUploadFailed'));

      // 在光标位置插入 Markdown 图片语法
      const url = data.url as string;
      const alt = file.name.replace(/\.[^.]+$/, '');
      const markdown = `![${alt}](${url})`;
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newContent = content.slice(0, start) + markdown + '\n' + content.slice(end);
        setContent(newContent);
        // 恢复光标到插入内容之后
        requestAnimationFrame(() => {
          textarea.focus();
          const pos = start + markdown.length + 1;
          textarea.setSelectionRange(pos, pos);
        });
      } else {
        setContent((prev) => prev + '\n' + markdown + '\n');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('imageUploadFailed'));
    } finally {
      setImageUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
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
            {t('sectionPrimaryLabel')}
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
          <p className="t-footnote mt-1.5 text-white/45">{t('sectionLabel')}</p>
        </div>

        <div>
          <span className={labelClass}>
            {t('sectionsLabel')} <span className="font-normal text-white/45">（{t('sectionsHint')}）</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {blogSections
              .filter((s) => s.id !== sectionId)
              .map((s) => {
                const checked = extraSectionIds.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() =>
                      setExtraSectionIds((prev) =>
                        checked ? prev.filter((id) => id !== s.id) : [...prev, s.id],
                      )
                    }
                    aria-pressed={checked}
                    className={`rounded-lg border px-3 py-1.5 text-[0.8125rem] transition-colors ${
                      checked
                        ? 'border-violet-500/50 bg-violet-500/15 text-violet-100'
                        : 'border-white/10 bg-black/25 text-white/60 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    {s.label[locale]}
                  </button>
                );
              })}
          </div>
        </div>

        <div className="sm:col-span-2" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
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
        <label htmlFor="post-event-date" className={labelClass}>
          {t('eventDateLabel')} <span className="font-normal text-white/45">（{t('eventDateHint')}）</span>
        </label>
        <input
          id="post-event-date"
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className={`${inputClass} cursor-pointer`}
        />
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
          <div className="relative">
            <textarea
              ref={textareaRef}
              id="post-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={18}
              maxLength={50_000}
              placeholder={t('contentPlaceholder')}
              className={`${inputClass} resize-y font-mono text-[0.875rem] leading-relaxed`}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={imageUploading}
              className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/40 px-2.5 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm transition-colors hover:border-violet-500/40 hover:text-violet-200 disabled:opacity-50"
              aria-label={t('uploadImage')}
              title={t('uploadImageHint')}
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              {imageUploading ? t('uploading') : t('uploadImage')}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/webp,image/jpeg,image/png,image/gif"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleImageUpload(file);
              }}
              className="hidden"
            />
          </div>
        )}

        <p className="t-footnote mt-1.5 text-right tabular-nums text-white/60">
          {t('charCount', { count: contentLength })}
        </p>
      </div>

      {isEdit && initialPost?.status === 'published' && (
        <p className="t-footnote rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-3 py-2 text-amber-200/90">
          {t('publishedEditWarning')}
        </p>
      )}

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

      {/* UGC 条款提示:提交即视为同意 EULA 第 8 节 */}
      <p className="t-footnote mt-3 text-white/40">
        {t.rich('ugcConsent', {
          eula: (chunks) => (
            <Link href="/eula" className="text-white/60 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white">
              {chunks}
            </Link>
          ),
        })}
      </p>
    </form>
  );
}
