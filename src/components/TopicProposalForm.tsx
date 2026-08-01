'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('TopicProposal');
  const [title, setTitle] = useState('');
  const [pitch, setPitch] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (title.trim().length < 4 || pitch.trim().length < 10) {
      setErrorMsg(t('validationError'));
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
      if (!res.ok) throw new Error(data.error || t('submitFailed'));

      setStatus('success');
      setTitle('');
      setPitch('');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : t('submitFailedRetry'));
    }
  }

  if (status === 'success') {
    return (
      <div className="glass-card rounded-3xl p-9 text-center md:p-12">
        <div className="mb-4 text-4xl">📮</div>
        <h2 className="t-title-2 t-on-glass mb-2">{t('successTitle')}</h2>
        <p className="t-footnote text-white/50">
          {t('successDesc')}
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="t-footnote mt-5 text-white/60 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
        >
          {t('submitAnother')}
        </button>
      </div>
    );
  }

  return (
    <section className="glass-card rounded-3xl p-7 md:p-11">
      <h2 className="t-title-2 t-on-glass mb-3">{t('formTitle', { sectionLabel })}</h2>
      <p className="t-footnote mb-8 text-white/60">
        {t('formDesc')}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="topic-title" className="t-footnote mb-2 block font-medium text-white/65">
            {t('titleLabel')} <span className="text-[rgb(var(--blog-accent))]">*</span>
          </label>
          <input
            id="topic-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
            placeholder={t('titlePlaceholder')}
            className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-[0.9375rem] text-white placeholder-white/50 transition-colors focus:border-[rgb(var(--blog-accent)/0.6)] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--blog-accent)/0.4)]"
          />
        </div>

        <div>
          <label htmlFor="topic-pitch" className="t-footnote mb-2 block font-medium text-white/65">
            {t('pitchLabel')} <span className="text-[rgb(var(--blog-accent))]">*</span>
          </label>
          <textarea
            id="topic-pitch"
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
            rows={4}
            maxLength={1000}
            placeholder={t('pitchPlaceholder')}
            className="w-full resize-none rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-[0.9375rem] leading-relaxed text-white placeholder-white/50 transition-colors focus:border-[rgb(var(--blog-accent)/0.6)] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--blog-accent)/0.4)]"
          />
          <p className="t-footnote mt-1.5 text-right tabular-nums text-white/60">{pitch.length} / 1000</p>
        </div>

        <div>
          <label htmlFor="topic-email" className="t-footnote mb-2 block font-medium text-white/65">
            {t('emailLabel')} <span className="font-normal text-white/60">{t('emailHint')}</span>
          </label>
          <input
            id="topic-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('emailPlaceholder')}
            className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-[0.9375rem] text-white placeholder-white/50 transition-colors focus:border-[rgb(var(--blog-accent)/0.6)] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--blog-accent)/0.4)]"
          />
        </div>

        {status === 'error' && (
          <p className="t-footnote text-red-400" role="alert">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full rounded-xl bg-[rgb(var(--blog-accent))] py-3.5 text-[0.9375rem] font-semibold text-black/85 transition-[transform,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'submitting' ? t('submitting') : t('submit')}
        </button>
      </form>
    </section>
  );
}
