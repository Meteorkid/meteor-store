'use client';

import { useEffect, useState } from 'react';
import { isLateNight } from '@/lib/motion';

const TYPE_OPTIONS = [
  { value: 'bug', label: 'Bug 反馈' },
  { value: 'feature', label: '功能建议' },
  { value: 'question', label: '使用疑问' },
  { value: 'other', label: '其他' },
];

/** 深夜树洞：0:00–5:00 出现的特殊反馈类型，可以不留邮箱只说心事 */
const NIGHT_OPTION = { value: 'night-whisper', label: '深夜树洞 🌙' };

export default function FeedbackForm() {
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [night, setNight] = useState(false);
  // 提交时的类型快照：成功页要用它区分树洞/普通文案（表单字段提交后会被清空）
  const [submittedWhisper, setSubmittedWhisper] = useState(false);

  // 深夜判定放 effect 里，避免 SSR/客户端时间不一致导致水合警告
  useEffect(() => {
    setNight(isLateNight());
  }, []);

  const options = night ? [...TYPE_OPTIONS, NIGHT_OPTION] : TYPE_OPTIONS;
  const isWhisper = type === 'night-whisper';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!type || !content.trim()) {
      setErrorMsg('请填写反馈类型和内容');
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
        throw new Error(data.error || '提交失败');
      }

      setSubmittedWhisper(type === 'night-whisper');
      setStatus('success');
      setEmail('');
      setType('');
      setContent('');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : '提交失败，请稍后重试');
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">{submittedWhisper ? '🌙' : '✅'}</div>
        <h2 className="text-xl font-semibold text-white mb-2">
          {submittedWhisper ? '说出来就好一些了，对吧' : '感谢你的反馈！'}
        </h2>
        <p className="text-gray-400">
          {submittedWhisper ? '我会看的。今晚好好睡一觉。' : '收到！比收到花呗还款提醒还开心。'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 深夜树洞提示 */}
      {night && (
        <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 px-4 py-3 text-sm text-purple-200/70">
          深夜的话可以只说给我听。想说什么都行，我都会看。不用留邮箱。
        </div>
      )}

      {/* 邮箱 */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
          邮箱 <span className="text-gray-500">（可选，方便我们回复你）</span>
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={isWhisper ? '树洞模式不需要留邮箱' : 'your@email.com'}
          className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        />
      </div>

      {/* 反馈类型 */}
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1.5">
          反馈类型 <span className="text-red-400">*</span>
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        >
          <option value="" disabled className="bg-gray-900">请选择</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-gray-900">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* 内容 */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1.5">
          详细描述 <span className="text-red-400">*</span>
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          placeholder={
            isWhisper
              ? '这里只有你和我。想说什么都可以。'
              : '说点什么吧，夸我也行（尤其欢迎夸我）'
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
          ? '提交中...'
          : type === 'bug'
            ? '提交 bug（对不起对不起）'
            : isWhisper
              ? '轻轻放进树洞'
              : '提交反馈'}
      </button>
    </form>
  );
}
