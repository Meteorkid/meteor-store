'use client';

import { useState, type FormEvent } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function StudentVerifyForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || '验证失败，请重试');
        return;
      }

      setStatus('success');
      setMessage(data.message);
    } catch {
      setStatus('error');
      setMessage('网络错误，请稍后重试');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center">
        <span className="mb-4 inline-block text-4xl">✅</span>
        <p className="mb-2 text-lg font-semibold text-emerald-300">验证邮件已发送！</p>
        <p className="text-sm text-gray-400">{message}</p>
        <button
          type="button"
          onClick={() => { setStatus('idle'); setEmail(''); }}
          className="mt-6 text-sm text-violet-300 transition-colors hover:text-violet-200"
        >
          换一个邮箱
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="edu-email" className="mb-2 block text-left text-sm font-medium text-gray-300">
        教育邮箱
      </label>
      <div className="flex gap-3">
        <input
          id="edu-email"
          type="email"
          required
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
          placeholder="you@university.edu.cn"
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-violet-500/50"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="shrink-0 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
        >
          {status === 'loading' ? '验证中...' : '验证'}
        </button>
      </div>
      {status === 'error' && (
        <p className="mt-3 text-left text-sm text-red-400">{message}</p>
      )}
      <p className="mt-4 text-left text-xs text-gray-600">
        支持 .edu、.edu.cn、.ac.uk 等全球教育机构邮箱
      </p>
    </form>
  );
}
