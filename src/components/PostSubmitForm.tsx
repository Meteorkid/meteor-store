'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { blogSections } from '@/data/blog-sections';

const inputClass =
  'w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-[0.9375rem] text-white placeholder-white/50 transition-colors focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/40';
const labelClass = 't-footnote mb-2 block font-medium text-white/65';

interface PostSubmitFormProps {
  /** 服务端渲染好的预览 HTML，由父组件在预览时提供 */
  renderPreview: (markdown: string) => Promise<string>;
}

export default function PostSubmitForm({ renderPreview }: PostSubmitFormProps) {
  const router = useRouter();

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
      if (!res.ok) throw new Error(data.error || '提交失败');

      setStatus('done');
      router.push('/blog/my-posts');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : '提交失败');
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
          标题 <span className="font-normal text-white/45">（4–80 字）</span>
        </label>
        <input
          id="post-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={80}
          placeholder="一句话说清楚这篇在讲什么"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="post-excerpt" className={labelClass}>
          摘要 <span className="font-normal text-white/45">（10–200 字，显示在列表里）</span>
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
            分区
          </label>
          <select
            id="post-section"
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
            className={`${inputClass} cursor-pointer`}
          >
            {blogSections.map((s) => (
              <option key={s.id} value={s.id} className="bg-zinc-900">
                {s.label} —— {s.description}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="post-tags" className={labelClass}>
            标签 <span className="font-normal text-white/45">（逗号或空格分隔，最多 8 个）</span>
          </label>
          <input
            id="post-tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="法律, 随笔"
            className={inputClass}
          />
          {tags.length > 0 && (
            <p className="t-footnote mt-2 text-white/60">
              {tags.map((t) => `#${t}`).join('  ')}
            </p>
          )}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-baseline justify-between gap-4">
          <label htmlFor="post-content" className={`${labelClass} mb-0`}>
            正文 <span className="font-normal text-white/45">（Markdown，至少 200 字）</span>
          </label>
          <button
            type="button"
            onClick={togglePreview}
            disabled={contentLength === 0}
            className="t-footnote text-white/60 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white disabled:opacity-40"
          >
            {preview !== null ? '继续编辑' : '预览'}
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
            placeholder={'## 小标题\n\n正文……\n\n支持 Markdown：**加粗**、[链接](https://example.com)、代码块、表格。'}
            className={`${inputClass} resize-y font-mono text-[0.875rem] leading-relaxed`}
          />
        )}

        <p className="t-footnote mt-1.5 text-right tabular-nums text-white/60">
          {contentLength} 字
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
          {status === 'saving' ? '提交中…' : '提交审核'}
        </button>
        <button
          type="button"
          onClick={() => void send(false)}
          disabled={!title.trim() || status === 'saving'}
          className="t-footnote text-white/60 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white disabled:opacity-40"
        >
          先存草稿
        </button>
        <p className="t-footnote text-white/45">提交后由站主审核，通过才会公开。</p>
      </div>
    </form>
  );
}
