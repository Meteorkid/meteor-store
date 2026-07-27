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
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <div className="mb-3 text-4xl">📮</div>
        <h3 className="mb-2 text-lg font-semibold text-white">收到了</h3>
        <p className="text-sm text-gray-400">
          我会一条条看。如果这个话题被写成文章，留了邮箱的话我会告诉你。
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-4 text-sm text-violet-300 transition-colors hover:text-violet-200"
        >
          再提一个
        </button>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
      <h3 className="mb-2 text-lg font-semibold text-white">给{sectionLabel}提个话题</h3>
      <p className="mb-6 text-sm leading-relaxed text-gray-500">
        你提选题，我来写。提议不会公开展示，只进我的收件箱——所以想说什么都可以，不用顾虑别人怎么看。
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="topic-title" className="mb-1.5 block text-sm font-medium text-gray-300">
            话题 <span className="text-red-400">*</span>
          </label>
          <input
            id="topic-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
            placeholder="一句话说清楚你想看什么"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>

        <div>
          <label htmlFor="topic-pitch" className="mb-1.5 block text-sm font-medium text-gray-300">
            为什么值得写 <span className="text-red-400">*</span>
          </label>
          <textarea
            id="topic-pitch"
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
            rows={4}
            maxLength={1000}
            placeholder="你的困惑、你见过的争论，或者你希望被反驳的观点"
            className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
          <p className="mt-1 text-right text-xs text-gray-600">{pitch.length} / 1000</p>
        </div>

        <div>
          <label htmlFor="topic-email" className="mb-1.5 block text-sm font-medium text-gray-300">
            邮箱 <span className="text-gray-500">（可选，被采用时通知你）</span>
          </label>
          <input
            id="topic-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="不留也行，匿名提议一样看"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>

        {status === 'error' && (
          <p className="text-sm text-red-400" role="alert">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full rounded-lg bg-violet-600 py-3 font-medium text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'submitting' ? '提交中…' : '把话题投进去'}
        </button>
      </form>
    </section>
  );
}
