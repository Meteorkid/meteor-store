'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GlowButton from './GlowButton';

export default function NewsletterSection() {
  const t = useTranslations('NewsletterSection');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t('subscribeFailed'));
      }

      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : t('subscribeFailedRetry'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-linear-to-br from-white/[0.05] via-white/[0.02] to-white/[0.01] border-t border-l border-r border-b border-t-white/[0.15] border-l-white/[0.08] border-r-white/[0.05] border-b-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.10),inset_0_-1px_0_rgba(0,0,0,0.15),0_4px_24px_rgba(0,0,0,0.25)] p-10 md:p-14 text-center scroll-animate">
          {/* Background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />

          <div className="relative">
            <div className="text-4xl mb-4">📬</div>

            <h2 className="t-title-2 text-foreground mb-3">
              {t('title')}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              {t('subtitle')}
            </p>

            {status === 'success' ? (
              <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('success')}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('placeholder')}
                  required
                  aria-label={t('emailLabel')}
                  className="flex-1 px-4 py-3 rounded-lg backdrop-blur-md bg-white/[0.04] border-t border-l border-r border-b border-t-white/[0.12] border-l-white/[0.06] border-r-white/[0.05] border-b-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] text-foreground placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-t-primary/40 text-sm transition-all"
                />
                <GlowButton type="submit" variant="primary" size="md" disabled={isSubmitting}>
                  {isSubmitting ? t('submitting') : t('submit')}
                </GlowButton>
              </form>
            )}

            {status === 'error' && (
              <p className="text-red-400 text-sm mt-3">{errorMsg}</p>
            )}

            <p className="text-xs text-white/30 mt-4">
              {t('privacyNote')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
