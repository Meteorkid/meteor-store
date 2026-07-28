'use client';

import { useState } from 'react';
import type { BlogSectionId } from '@/data/blog-sections';

interface TopicProposalFormProps {
  sectionId: BlogSectionId;
  sectionLabel: string;
}

/**
 * 半开放话题提议：读者只提交选题，不产生公开内容。
 * 提议进后台由店主审核，采用后由店主撰写成文章。
 */
export default function TopicProposalForm({ sectionId, sectionLabel }: TopicProposalFormProps) {
  const [title, setTitle] = useState('');
  const [pitch, setPitch] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (title.trim().length < 4 || pitch.trim().length < 10) {
      setErrorMsg('标题至少 4 个字，理由至少 10 个字');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/topics/propose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionId,
          title: title.trim(),
          pitch: pitch.trim(),
          email: email.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '提交失败');

      setStatus('success');
      setTitle('');
      setPitch('');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : '提交失败，请稍后重试');
    }
  }

  if (status === 'success') {
    return (
      <div className="glass-card rounded-3xl p-9 text-center md:p-12">
        <div className="mb-4 text-4xl">📮</div>
        <h3 className="blog-title-2 blog-on-glass mb-2">收到了</h3>
        <p className="blog-footnote text-white/50">
          我会一条条看。如果这个话题被写成文章，留了邮箱的话我会告诉你。
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="blog-footnote mt-5 text-white/60 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
        >
          再提一个
        </button>
      </div>
    );
  }

  return (
    <section className="glass-card rounded-3xl p-7 md:p-11">
      <h3 className="blog-title-2 blog-on-glass mb-3">给{sectionLabel}提个话题</h3>
      <p className="blog-footnote mb-8 text-white/45">
        你提选题，我来写。提议不会公开展示，只进我的收件箱——所以想说什么都可以，不用顾虑别人怎么看。
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="topic-title" className="blog-footnote mb-2 block font-medium text-white/65">
            话题 <span className="text-[rgb(var(--accent))]">*</span>
          </label>
          <input
            id="topic-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
            placeholder="一句话说清楚你想看什么"
            className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-[0.9375rem] text-white placeholder-white/25 transition-colors focus:border-[rgb(var(--accent)/0.6)] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--accent)/0.4)]"
          />
        </div>

        <div>
          <label htmlFor="topic-pitch" className="blog-footnote mb-2 block font-medium text-white/65">
            为什么值得写 <span className="text-[rgb(var(--accent))]">*</span>
          </label>
          <textarea
            id="topic-pitch"
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
            rows={4}
            maxLength={1000}
            placeholder="你的困惑、你见过的争论，或者你希望被反驳的观点"
            className="w-full resize-none rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-[0.9375rem] leading-relaxed text-white placeholder-white/25 transition-colors focus:border-[rgb(var(--accent)/0.6)] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--accent)/0.4)]"
          />
          <p className="blog-footnote mt-1.5 text-right tabular-nums text-white/25">{pitch.length} / 1000</p>
        </div>

        <div>
          <label htmlFor="topic-email" className="blog-footnote mb-2 block font-medium text-white/65">
            邮箱 <span className="font-normal text-white/35">（可选，被采用时通知你）</span>
          </label>
          <input
            id="topic-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="不留也行，匿名提议一样看"
            className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-[0.9375rem] text-white placeholder-white/25 transition-colors focus:border-[rgb(var(--accent)/0.6)] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--accent)/0.4)]"
          />
        </div>

        {status === 'error' && (
          <p className="blog-footnote text-red-400" role="alert">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full rounded-xl bg-[rgb(var(--accent))] py-3.5 text-[0.9375rem] font-semibold text-black/85 transition-[transform,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'submitting' ? '提交中…' : '把话题投进去'}
        </button>
      </form>
    </section>
  );
}
