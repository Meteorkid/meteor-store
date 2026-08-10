'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useIsLateNight } from '@/lib/motion';

const TYPE_VALUES = ['bug', 'feature', 'question', 'other'] as const;
const NIGHT_VALUE = 'night-whisper';

interface FeedbackFormProps {
  prefillContent?: string;
  initialType?: '' | 'question';
}

/** 深夜树洞：0:00–5:00 出现的特殊反馈类型，可以不留邮箱只说心事 */
export default function FeedbackForm({ initialType = '', prefillContent = '' }: FeedbackFormProps) {
  const t = useTranslations('FeedbackPage');
  const [email, setEmail] = useState('');
  const [type, setType] = useState<string>(initialType);
  const [content, setContent] = useState(prefillContent);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  // 深夜判定走 useSyncExternalStore，SSR 一律返回 false 避免水合警告
  const night = useIsLateNight();
  // 提交时的类型快照：成功页要用它区分树洞/普通文案（表单字段提交后会被清空）
  const [submittedWhisper, setSubmittedWhisper] = useState(false);

  const typeLabels: Record<string, string> = {
    bug: t('typeBug'),
    feature: t('typeFeature'),
    question: t('typeQuestion'),
    other: t('typeOther'),
    [NIGHT_VALUE]: t('typeNightWhisper'),
  };

  const options = night ? [...TYPE_VALUES, NIGHT_VALUE] : [...TYPE_VALUES];
  const isWhisper = type === NIGHT_VALUE;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!type || !content.trim()) {
      setErrorMsg(t('errorRequired'));
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email || undefined, type, content: content.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t('errorSubmit'));
      }

      setSubmittedWhisper(type === NIGHT_VALUE);
      setStatus('success');
      setEmail('');
      setType('');
      setContent('');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : t('errorRetry'));
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">{submittedWhisper ? '🌙' : '✅'}</div>
        <h2 className="text-xl font-semibold text-white mb-2">
          {submittedWhisper ? t('successWhisperTitle') : t('successTitle')}
        </h2>
        <p className="text-gray-400">
          {submittedWhisper ? t('successWhisperDesc') : t('successDesc')}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 深夜树洞提示 */}
      {night && (
        <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 px-4 py-3 text-sm text-purple-200/70">
          {t('nightHint')}
        </div>
      )}

      {/* 邮箱 */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
          {t('emailLabel')} <span className="text-gray-500">{t('emailOptional')}</span>
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={isWhisper ? t('emailPlaceholderWhisper') : 'your@email.com'}
          className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        />
      </div>

      {/* 反馈类型 */}
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1.5">
          {t('typeLabel')} <span className="text-red-400">*</span>
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        >
          <option value="" disabled className="bg-gray-900">{t('selectPrompt')}</option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-gray-900">
              {typeLabels[opt]}
            </option>
          ))}
        </select>
      </div>

      {/* 内容 */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1.5">
          {t('contentLabel')} <span className="text-red-400">*</span>
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          placeholder={
            isWhisper
              ? t('contentPlaceholderWhisper')
              : t('contentPlaceholder')
          }
          className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
        />
      </div>

      {/* 错误提示 */}
      {status === 'error' && (
        <p className="text-sm text-red-400" role="alert">{errorMsg}</p>
      )}

      {/* 提交按钮 */}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {status === 'submitting'
          ? t('submitLoading')
          : type === 'bug'
            ? t('submitBug')
            : isWhisper
              ? t('submitWhisper')
              : t('submit')}
      </button>
    </form>
  );
}
