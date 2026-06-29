'use client';

import { useState } from 'react';
import GlowButton from './GlowButton';

export default function NewsletterSection() {
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
        throw new Error(data.error || '订阅失败');
      }

      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : '订阅失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/[0.06] p-10 md:p-14 text-center scroll-animate">
          {/* Background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />

          <div className="relative">
            <div className="text-4xl mb-4">📬</div>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              订阅产品动态
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              获取新版本发布通知、技术分享和使用技巧
            </p>

            {status === 'success' ? (
              <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>订阅成功！感谢你的关注。</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  aria-label="邮箱地址"
                  className="flex-1 px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-foreground placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                />
                <GlowButton type="submit" variant="primary" size="md" disabled={isSubmitting}>
                  {isSubmitting ? '提交中...' : '订阅'}
                </GlowButton>
              </form>
            )}

            {status === 'error' && (
              <p className="text-red-400 text-sm mt-3">{errorMsg}</p>
            )}

            <p className="text-xs text-white/30 mt-4">
              我们尊重你的隐私，不会发送垃圾邮件。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
